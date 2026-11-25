import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { hashPassword, SESSION_TTL_SECONDS } from './auth.js';

function createSeedData() {
  const now = new Date().toISOString();
  const demoUserId = 'usr_demo_001';
  return {
    users: [
      {
        id: demoUserId,
        name: 'Aarav Sharma',
        email: 'demo@cravebite.in',
        phone: '+91 98765 43210',
        passwordHash: hashPassword('Demo@123'),
        createdAt: now
      }
    ],
    sessions: [],
    orders: [
      {
        id: 'ORD-104821',
        userId: demoUserId,
        customerName: 'Aarav Sharma',
        deliveryAddress: 'Flat 402, Indiranagar 100ft Road, Bengaluru 560038',
        city: 'Bengaluru',
        paymentMethod: 'UPI',
        status: 'Delivered',
        currency: 'INR',
        items: [
          {
            id: 'hyd-chicken-biryani',
            name: 'Hyderabadi Chicken Dum Biryani',
            restaurant: 'Nizami Handi',
            isVeg: false,
            unitPriceInr: 329,
            quantity: 1,
            lineTotalInr: 329
          },
          {
            id: 'kesar-rasmalai',
            name: 'Kesar Pistachio Rasmalai (2 Pcs)',
            restaurant: 'Mithai Mahal',
            isVeg: true,
            unitPriceInr: 129,
            quantity: 1,
            lineTotalInr: 129
          }
        ],
        itemSubtotalInr: 458,
        deliveryFeeInr: 40,
        packagingFeeInr: 15,
        couponCode: 'FEAST20',
        couponDiscountInr: 91.6,
        deliveryDiscountInr: 0,
        gstInr: 18.32,
        grandTotalInr: 439.72,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };
}

export class DataStore {
  constructor(dbFilePath) {
    this.dbFilePath = dbFilePath;
    this.data = this.#load();
  }

  #load() {
    const dir = path.dirname(this.dbFilePath);
    fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.dbFilePath)) {
      const seed = createSeedData();
      this.#writeToDisk(seed);
      return seed;
    }
    try {
      const raw = fs.readFileSync(this.dbFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : []
      };
    } catch {
      const seed = createSeedData();
      this.#writeToDisk(seed);
      return seed;
    }
  }

  #writeToDisk(payload = this.data) {
    const tmpPath = `${this.dbFilePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2), 'utf8');
    fs.renameSync(tmpPath, this.dbFilePath);
  }

  findUserByEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    return this.data.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  findUserById(userId) {
    return this.data.users.find((u) => u.id === userId) || null;
  }

  createUser({ name, email, phone, passwordHash }) {
    const user = {
      id: `usr_${crypto.randomBytes(6).toString('hex')}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      passwordHash,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    this.#writeToDisk();
    return user;
  }

  createSession(userId, token) {
    const now = Date.now();
    // Clean expired sessions opportunistically
    this.data.sessions = this.data.sessions.filter((s) => s.expiresAt > now);
    const session = {
      token,
      userId,
      createdAt: now,
      expiresAt: now + SESSION_TTL_SECONDS * 1000
    };
    this.data.sessions.push(session);
    this.#writeToDisk();
    return session;
  }

  getSession(token) {
    if (!token) return null;
    const now = Date.now();
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return null;
    if (session.expiresAt <= now) {
      this.deleteSession(token);
      return null;
    }
    return session;
  }

  deleteSession(token) {
    if (!token) return;
    const before = this.data.sessions.length;
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    if (this.data.sessions.length !== before) {
      this.#writeToDisk();
    }
  }

  createOrder(orderInput) {
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const order = {
      id: `ORD-${orderNumber}`,
      status: 'Preparing',
      createdAt: new Date().toISOString(),
      ...orderInput
    };
    this.data.orders.unshift(order);
    this.#writeToDisk();
    return order;
  }

  getOrdersForUser(userId) {
    return this.data.orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
