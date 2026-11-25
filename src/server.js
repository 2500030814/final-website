import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CATEGORIES,
  CITIES,
  getMenuForCity,
  getRecommendedItems
} from './catalog.js';
import { COUPONS, calculateOrderQuote } from './coupons.js';
import {
  SESSION_COOKIE_NAME,
  buildClearSessionCookie,
  buildSessionCookie,
  generateSessionToken,
  hashPassword,
  parseCookies,
  sanitizeUser,
  verifyPassword
} from './auth.js';
import { DataStore } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(body);
}

function readJsonBody(req, maxBytes = 1024 * 64) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(JSON.parse(text));
      } catch {
        reject(Object.assign(new Error('Invalid JSON request body'), { statusCode: 400 }));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function serveStaticFile(reqPath, publicDir, res) {
  const safePath = reqPath === '/' ? '/index.html' : reqPath;
  const resolvedPublic = path.resolve(publicDir);
  const targetPath = path.resolve(resolvedPublic, `.${safePath}`);

  if (!targetPath.startsWith(resolvedPublic)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  let fileToServe = targetPath;
  if (!fs.existsSync(fileToServe) || fs.statSync(fileToServe).isDirectory()) {
    // Fallback to index.html for unknown non-API paths
    fileToServe = path.join(resolvedPublic, 'index.html');
    if (!fs.existsSync(fileToServe)) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
  }

  const ext = path.extname(fileToServe).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const content = fs.readFileSync(fileToServe);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(content);
}

export function createAppServer(options = {}) {
  const dbPath = options.dbPath || path.join(ROOT_DIR, 'data', 'db.json');
  const publicDir = options.publicDir || path.join(ROOT_DIR, 'public');
  const store = new DataStore(dbPath);

  function getAuthContext(req) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[SESSION_COOKIE_NAME];
    if (!token) return { token: null, user: null };
    const session = store.getSession(token);
    if (!session) return { token: null, user: null };
    const user = store.findUserById(session.userId);
    if (!user) return { token: null, user: null };
    return { token, user };
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname;
      const method = (req.method || 'GET').toUpperCase();

      // API Routes
      if (pathname.startsWith('/api/')) {
        if (method === 'GET' && pathname === '/api/health') {
          sendJson(res, 200, { ok: true, service: 'CraveBite', currency: 'INR' });
          return;
        }

        if (method === 'GET' && pathname === '/api/menu') {
          const city = url.searchParams.get('city') || 'Bengaluru';
          const cityMenu = getMenuForCity(city);
          sendJson(res, 200, {
            currency: 'INR',
            currencySymbol: '₹',
            city: cityMenu.city,
            cities: CITIES,
            categories: CATEGORIES,
            restaurants: cityMenu.restaurants,
            items: cityMenu.items
          });
          return;
        }

        if (method === 'GET' && pathname === '/api/recommendations') {
          const { user } = getAuthContext(req);
          const city = url.searchParams.get('city') || 'Bengaluru';
          const vegOnly = url.searchParams.get('vegOnly') === 'true';
          const cartIds = (url.searchParams.get('cartIds') || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          const rawHour = url.searchParams.get('hour');
          const hour =
            rawHour !== null && !Number.isNaN(Number(rawHour))
              ? Number(rawHour)
              : new Date().getHours();

          const pastOrderItemIds = user
            ? store
                .getOrdersForUser(user.id)
                .flatMap((o) => (Array.isArray(o.items) ? o.items.map((i) => i.id) : []))
            : [];

          const result = getRecommendedItems({
            city,
            vegOnly,
            cartIds,
            pastOrderItemIds,
            hour
          });
          sendJson(res, 200, result);
          return;
        }

        if (method === 'GET' && pathname === '/api/coupons') {
          sendJson(res, 200, { coupons: COUPONS });
          return;
        }

        if (method === 'POST' && pathname === '/api/quote') {
          const body = await readJsonBody(req);
          const result = calculateOrderQuote(body.items, body.couponCode);
          if (!result.ok) {
            sendJson(res, result.status, { error: result.error });
            return;
          }
          sendJson(res, 200, result.quote);
          return;
        }

        if (method === 'GET' && pathname === '/api/auth/me') {
          const { user } = getAuthContext(req);
          sendJson(res, 200, { user: sanitizeUser(user) });
          return;
        }

        if (method === 'POST' && pathname === '/api/auth/register') {
          const body = await readJsonBody(req);
          const name = typeof body.name === 'string' ? body.name.trim() : '';
          const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
          const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
          const password = typeof body.password === 'string' ? body.password : '';

          if (name.length < 2) {
            sendJson(res, 400, { error: 'Please enter your full name (at least 2 characters).' });
            return;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            sendJson(res, 400, { error: 'Please enter a valid email address.' });
            return;
          }
          if (password.length < 6) {
            sendJson(res, 400, { error: 'Password must be at least 6 characters long.' });
            return;
          }
          if (store.findUserByEmail(email)) {
            sendJson(res, 409, { error: 'An account with this email already exists. Please log in.' });
            return;
          }

          const user = store.createUser({
            name,
            email,
            phone,
            passwordHash: hashPassword(password)
          });
          const token = generateSessionToken();
          store.createSession(user.id, token);

          sendJson(
            res,
            201,
            { user: sanitizeUser(user) },
            { 'Set-Cookie': buildSessionCookie(token) }
          );
          return;
        }

        if (method === 'POST' && pathname === '/api/auth/login') {
          const body = await readJsonBody(req);
          const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
          const password = typeof body.password === 'string' ? body.password : '';

          if (!email || !password) {
            sendJson(res, 400, { error: 'Email and password are required.' });
            return;
          }

          const user = store.findUserByEmail(email);
          if (!user || !verifyPassword(password, user.passwordHash)) {
            sendJson(res, 401, { error: 'Invalid email or password.' });
            return;
          }

          const token = generateSessionToken();
          store.createSession(user.id, token);

          sendJson(
            res,
            200,
            { user: sanitizeUser(user) },
            { 'Set-Cookie': buildSessionCookie(token) }
          );
          return;
        }

        if (method === 'POST' && pathname === '/api/auth/logout') {
          const cookies = parseCookies(req.headers.cookie);
          const token = cookies[SESSION_COOKIE_NAME];
          if (token) {
            store.deleteSession(token);
          }
          sendJson(
            res,
            200,
            { ok: true, message: 'Logged out successfully.' },
            { 'Set-Cookie': buildClearSessionCookie() }
          );
          return;
        }

        if (method === 'GET' && pathname === '/api/orders') {
          const { user } = getAuthContext(req);
          if (!user) {
            sendJson(res, 401, { error: 'Please log in to view your orders.' });
            return;
          }
          const orders = store.getOrdersForUser(user.id);
          sendJson(res, 200, { orders });
          return;
        }

        if (method === 'POST' && pathname === '/api/orders') {
          const { user } = getAuthContext(req);
          if (!user) {
            sendJson(res, 401, { error: 'Please log in to place your order.' });
            return;
          }

          const body = await readJsonBody(req);
          const deliveryAddress =
            typeof body.deliveryAddress === 'string' ? body.deliveryAddress.trim() : '';
          const city = typeof body.city === 'string' ? body.city.trim() : 'Bengaluru';
          const paymentMethod =
            typeof body.paymentMethod === 'string' ? body.paymentMethod.trim() : 'UPI';
          const requestedCoupon =
            typeof body.couponCode === 'string' ? body.couponCode.trim() : '';

          if (deliveryAddress.length < 8) {
            sendJson(res, 400, {
              error: 'Please provide a complete delivery address (at least 8 characters).'
            });
            return;
          }

          const allowedPayments = ['UPI', 'Cash on Delivery', 'Credit / Debit Card'];
          if (!allowedPayments.includes(paymentMethod)) {
            sendJson(res, 400, { error: 'Invalid payment method selected.' });
            return;
          }

          const quoteResult = calculateOrderQuote(body.items, requestedCoupon);
          if (!quoteResult.ok) {
            sendJson(res, quoteResult.status, { error: quoteResult.error });
            return;
          }

          const { quote } = quoteResult;
          if (requestedCoupon && quote.couponError) {
            sendJson(res, 400, { error: quote.couponError });
            return;
          }

          const order = store.createOrder({
            userId: user.id,
            customerName: user.name,
            deliveryAddress,
            city,
            paymentMethod,
            currency: 'INR',
            items: quote.items,
            itemSubtotalInr: quote.itemSubtotalInr,
            deliveryFeeInr: quote.deliveryFeeInr,
            packagingFeeInr: quote.packagingFeeInr,
            couponCode: quote.couponCode,
            couponDiscountInr: quote.couponDiscountInr,
            deliveryDiscountInr: quote.deliveryDiscountInr,
            gstInr: quote.gstInr,
            grandTotalInr: quote.grandTotalInr
          });

          sendJson(res, 201, { order });
          return;
        }

        sendJson(res, 404, { error: 'API route not found.' });
        return;
      }

      if (method !== 'GET' && method !== 'HEAD') {
        sendJson(res, 405, { error: 'Method not allowed.' });
        return;
      }

      serveStaticFile(pathname, publicDir, res);
    } catch (err) {
      const status = err?.statusCode || 500;
      const message = status >= 500 ? 'Internal server error.' : err.message;
      if (status >= 500) {
        console.error(err);
      }
      sendJson(res, status, { error: message });
    }
  });

  return server;
}

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isMainModule) {
  const port = Number(process.env.PORT) || 3000;
  const server = createAppServer();
  server.listen(port, () => {
    console.log(`CraveBite Node.js server running at http://localhost:${port}`);
  });
}
