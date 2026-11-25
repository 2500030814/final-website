import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { createAppServer } from '../src/server.js';

function startTestServer() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cravebite-test-'));
  const dbPath = path.join(tempDir, 'db.json');
  const server = createAppServer({ dbPath });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${addr.port}`,
        close: () =>
          new Promise((done) => {
            server.close(() => {
              fs.rmSync(tempDir, { recursive: true, force: true });
              done();
            });
          })
      });
    });
  });
}

function extractSessionCookie(res) {
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) return '';
  return setCookie.split(';')[0];
}

test('CraveBite API: INR menu, coupons, auth login/logout, and orders', async (t) => {
  const app = await startTestServer();
  t.after(() => app.close());

  // 1. Menu & Coupons in INR
  const menuRes = await fetch(`${app.baseUrl}/api/menu`);
  assert.equal(menuRes.status, 200);
  const menuData = await menuRes.json();
  assert.equal(menuData.currency, 'INR');
  assert.equal(menuData.currencySymbol, '₹');
  assert.ok(menuData.items.length >= 10);
  assert.ok(Array.isArray(menuData.restaurants) && menuData.restaurants.length >= 6);
  assert.ok(menuData.restaurants.every((r) => r.name && r.dishCount >= 1 && r.coverImageUrl));

  // Verify city-specific restaurant names & nearby distance sorting
  const mumbaiRes = await fetch(`${app.baseUrl}/api/menu?city=Mumbai`);
  const mumbaiData = await mumbaiRes.json();
  const delhiRes = await fetch(`${app.baseUrl}/api/menu?city=${encodeURIComponent('Delhi NCR')}`);
  const delhiData = await delhiRes.json();
  assert.notEqual(mumbaiData.restaurants[0].name, delhiData.restaurants[0].name);
  for (let i = 1; i < mumbaiData.restaurants.length; i++) {
    assert.ok(mumbaiData.restaurants[i].distanceKm >= mumbaiData.restaurants[i - 1].distanceKm);
  }

  // Verify automatic food recommendations respect vegOnly, city, and meal time
  const recRes = await fetch(
    `${app.baseUrl}/api/recommendations?city=Hyderabad&vegOnly=true&hour=9`
  );
  assert.equal(recRes.status, 200);
  const recData = await recRes.json();
  assert.equal(recData.city, 'Hyderabad');
  assert.equal(recData.mealSlot, 'Breakfast');
  assert.equal(recData.recommendations.length, 4);
  assert.ok(recData.recommendations.every((r) => r.isVeg && r.reason && r.restaurant));

  const couponsRes = await fetch(`${app.baseUrl}/api/coupons`);
  assert.equal(couponsRes.status, 200);
  const couponsData = await couponsRes.json();
  const codes = couponsData.coupons.map((c) => c.code);
  assert.ok(codes.includes('WELCOME50'));
  assert.ok(codes.includes('FEAST20'));
  assert.ok(codes.includes('FREEDEL'));

  // 2. Quote calculation & coupon rules
  // Biryani (329) + Butter Chicken (379) = 708 subtotal
  // FEAST20 = 20% of 708 = 141.6 (under 150 cap)
  const quoteRes = await fetch(`${app.baseUrl}/api/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { id: 'hyd-chicken-biryani', quantity: 1 },
        { id: 'butter-chicken-combo', quantity: 1 }
      ],
      couponCode: 'FEAST20'
    })
  });
  assert.equal(quoteRes.status, 200);
  const quote = await quoteRes.json();
  assert.equal(quote.currency, 'INR');
  assert.equal(quote.itemSubtotalInr, 708);
  assert.equal(quote.couponCode, 'FEAST20');
  assert.equal(quote.couponDiscountInr, 141.6);
  assert.equal(quote.couponError, null);
  assert.equal(quote.deliveryFeeInr, 40);
  assert.equal(quote.packagingFeeInr, 15);
  // (708 - 141.6) * 0.05 = 28.32
  assert.equal(quote.gstInr, 28.32);
  // 566.4 + 40 + 15 + 28.32 = 649.72
  assert.equal(quote.grandTotalInr, 649.72);

  // Coupon below minimum order threshold
  const minFailRes = await fetch(`${app.baseUrl}/api/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: 'kesar-rasmalai', quantity: 1 }], // ₹129
      couponCode: 'WELCOME50' // requires ₹199
    })
  });
  const minFailQuote = await minFailRes.json();
  assert.equal(minFailQuote.couponDiscountInr, 0);
  assert.match(minFailQuote.couponError, /Add ₹70 more/);

  // 3. Unauthenticated order should be rejected with 401
  const unauthOrderRes = await fetch(`${app.baseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: 'hyd-chicken-biryani', quantity: 1 }],
      deliveryAddress: '12 MG Road, Bengaluru',
      city: 'Bengaluru',
      paymentMethod: 'UPI'
    })
  });
  assert.equal(unauthOrderRes.status, 401);

  // 4. Register -> /api/auth/me -> Logout -> /api/auth/me
  const regRes = await fetch(`${app.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Nair',
      email: 'priya@example.com',
      phone: '+91 98111 22233',
      password: 'Password123'
    })
  });
  assert.equal(regRes.status, 201);
  const regCookie = extractSessionCookie(regRes);
  assert.ok(regCookie.startsWith('cravebite_sid='));

  const meRes = await fetch(`${app.baseUrl}/api/auth/me`, {
    headers: { Cookie: regCookie }
  });
  const meData = await meRes.json();
  assert.equal(meData.user.email, 'priya@example.com');

  // Log out
  const logoutRes = await fetch(`${app.baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: regCookie }
  });
  assert.equal(logoutRes.status, 200);
  const clearedCookie = extractSessionCookie(logoutRes);
  assert.equal(clearedCookie, 'cravebite_sid=');

  // Old session token must no longer authenticate after logout
  const meAfterLogoutRes = await fetch(`${app.baseUrl}/api/auth/me`, {
    headers: { Cookie: regCookie }
  });
  const meAfterLogout = await meAfterLogoutRes.json();
  assert.equal(meAfterLogout.user, null);

  // 5. Log back in with wrong password fails, right password succeeds
  const badLogin = await fetch(`${app.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'priya@example.com', password: 'wrong' })
  });
  assert.equal(badLogin.status, 401);

  const loginRes = await fetch(`${app.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'priya@example.com', password: 'Password123' })
  });
  assert.equal(loginRes.status, 200);
  const activeCookie = extractSessionCookie(loginRes);

  // 6. Place order with FREEDEL coupon while logged in
  const orderRes = await fetch(`${app.baseUrl}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: activeCookie
    },
    body: JSON.stringify({
      items: [{ id: 'ghee-masala-dosa', quantity: 2 }], // 2 * 169 = 338
      couponCode: 'FREEDEL',
      deliveryAddress: '45 Koramangala 4th Block, Bengaluru',
      city: 'Bengaluru',
      paymentMethod: 'UPI'
    })
  });
  assert.equal(orderRes.status, 201);
  const { order } = await orderRes.json();
  assert.equal(order.currency, 'INR');
  assert.equal(order.couponCode, 'FREEDEL');
  assert.equal(order.deliveryFeeInr, 0);
  assert.equal(order.deliveryDiscountInr, 40);
  assert.equal(order.itemSubtotalInr, 338);
  // 338 + 0 + 15 + (338 * 0.05 = 16.9) = 369.9
  assert.equal(order.grandTotalInr, 369.9);

  // 7. Order history only shows this user's order (not demo user's seeded order)
  const ordersRes = await fetch(`${app.baseUrl}/api/orders`, {
    headers: { Cookie: activeCookie }
  });
  assert.equal(ordersRes.status, 200);
  const { orders } = await ordersRes.json();
  assert.equal(orders.length, 1);
  assert.equal(orders[0].id, order.id);

  // 8. Invalid coupon on checkout returns 400
  const badCouponOrderRes = await fetch(`${app.baseUrl}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: activeCookie
    },
    body: JSON.stringify({
      items: [{ id: 'ghee-masala-dosa', quantity: 1 }],
      couponCode: 'INVALID999',
      deliveryAddress: '45 Koramangala 4th Block, Bengaluru',
      city: 'Bengaluru',
      paymentMethod: 'UPI'
    })
  });
  assert.equal(badCouponOrderRes.status, 400);

  // 9. Demo account login works and sees seeded order
  const demoLoginRes = await fetch(`${app.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@cravebite.in', password: 'Demo@123' })
  });
  assert.equal(demoLoginRes.status, 200);
  const demoCookie = extractSessionCookie(demoLoginRes);
  const demoOrdersRes = await fetch(`${app.baseUrl}/api/orders`, {
    headers: { Cookie: demoCookie }
  });
  const demoOrdersData = await demoOrdersRes.json();
  assert.ok(demoOrdersData.orders.length >= 1);

  // 10. Static assets and all dish food images serve cleanly
  for (const assetPath of ['/', '/styles.css', '/app.js']) {
    const assetRes = await fetch(`${app.baseUrl}${assetPath}`);
    assert.equal(assetRes.status, 200);
  }

  for (const item of menuData.items) {
    assert.ok(item.imageUrl, `Missing imageUrl for ${item.id}`);
    const imgRes = await fetch(`${app.baseUrl}${item.imageUrl}`);
    assert.equal(imgRes.status, 200, `Failed to serve image for ${item.id}`);
    assert.equal(imgRes.headers.get('content-type'), 'image/jpeg');
    const bytes = new Uint8Array(await imgRes.arrayBuffer());
    assert.ok(bytes.length > 10000, `Image too small for ${item.id}`);
  }
});
