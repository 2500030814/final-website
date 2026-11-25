const state = {
  user: null,
  city: localStorage.getItem('cravebite_city') || 'Bengaluru',
  categories: [],
  restaurants: [],
  menu: [],
  recommendations: [],
  mealSlot: '',
  coupons: [],
  cart: loadStoredCart(),
  appliedCouponCode: localStorage.getItem('cravebite_coupon') || '',
  quote: null,
  activeCategory: 'All',
  activeRestaurant: 'All',
  vegOnly: false,
  searchQuery: '',
  sortBy: 'recommended',
  pendingCheckoutAfterLogin: false
};

const el = {
  citySelect: document.getElementById('citySelect'),
  searchInput: document.getElementById('searchInput'),
  openCouponsBtn: document.getElementById('openCouponsBtn'),
  couponBadge: document.getElementById('couponBadge'),
  openCartBtn: document.getElementById('openCartBtn'),
  navCartCount: document.getElementById('navCartCount'),
  navCartLabel: document.getElementById('navCartLabel'),

  authLoggedOut: document.getElementById('authLoggedOut'),
  authLoggedIn: document.getElementById('authLoggedIn'),
  openLoginBtn: document.getElementById('openLoginBtn'),
  openSignupBtn: document.getElementById('openSignupBtn'),
  openOrdersBtn: document.getElementById('openOrdersBtn'),
  userAvatar: document.getElementById('userAvatar'),
  userName: document.getElementById('userName'),
  logoutBtn: document.getElementById('logoutBtn'),

  heroCouponList: document.getElementById('heroCouponList'),
  recSubheading: document.getElementById('recSubheading'),
  recommendationsGrid: document.getElementById('recommendationsGrid'),
  restaurantsHeading: document.getElementById('restaurantsHeading'),
  restaurantCards: document.getElementById('restaurantCards'),
  clearRestaurantBtn: document.getElementById('clearRestaurantBtn'),
  categoryPills: document.getElementById('categoryPills'),
  vegOnlyToggle: document.getElementById('vegOnlyToggle'),
  sortSelect: document.getElementById('sortSelect'),
  menuHeading: document.getElementById('menuHeading'),
  menuCount: document.getElementById('menuCount'),
  menuGrid: document.getElementById('menuGrid'),
  emptyMenuState: document.getElementById('emptyMenuState'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  cartBackdrop: document.getElementById('cartBackdrop'),
  cartDrawer: document.getElementById('cartDrawer'),
  closeCartBtn: document.getElementById('closeCartBtn'),
  browseMenuBtn: document.getElementById('browseMenuBtn'),
  cartEmpty: document.getElementById('cartEmpty'),
  cartBody: document.getElementById('cartBody'),
  cartItemsList: document.getElementById('cartItemsList'),

  drawerCouponsToggle: document.getElementById('drawerCouponsToggle'),
  couponInput: document.getElementById('couponInput'),
  applyCouponBtn: document.getElementById('applyCouponBtn'),
  couponFeedback: document.getElementById('couponFeedback'),
  appliedCouponChip: document.getElementById('appliedCouponChip'),
  appliedCouponCode: document.getElementById('appliedCouponCode'),
  appliedCouponSavings: document.getElementById('appliedCouponSavings'),
  removeCouponBtn: document.getElementById('removeCouponBtn'),

  billSubtotal: document.getElementById('billSubtotal'),
  billDelivery: document.getElementById('billDelivery'),
  billPackaging: document.getElementById('billPackaging'),
  billDiscountRow: document.getElementById('billDiscountRow'),
  billDiscountCode: document.getElementById('billDiscountCode'),
  billDiscount: document.getElementById('billDiscount'),
  billGst: document.getElementById('billGst'),
  billTotal: document.getElementById('billTotal'),
  billSavingsBanner: document.getElementById('billSavingsBanner'),

  checkoutForm: document.getElementById('checkoutForm'),
  deliveryAddressInput: document.getElementById('deliveryAddressInput'),
  paymentMethodSelect: document.getElementById('paymentMethodSelect'),
  checkoutError: document.getElementById('checkoutError'),
  placeOrderBtn: document.getElementById('placeOrderBtn'),

  authModalBackdrop: document.getElementById('authModalBackdrop'),
  closeAuthModalBtn: document.getElementById('closeAuthModalBtn'),
  loginTabBtn: document.getElementById('loginTabBtn'),
  signupTabBtn: document.getElementById('signupTabBtn'),
  loginForm: document.getElementById('loginForm'),
  loginEmail: document.getElementById('loginEmail'),
  loginPassword: document.getElementById('loginPassword'),
  loginError: document.getElementById('loginError'),
  fillDemoBtn: document.getElementById('fillDemoBtn'),
  signupForm: document.getElementById('signupForm'),
  signupName: document.getElementById('signupName'),
  signupEmail: document.getElementById('signupEmail'),
  signupPhone: document.getElementById('signupPhone'),
  signupPassword: document.getElementById('signupPassword'),
  signupError: document.getElementById('signupError'),

  couponsModalBackdrop: document.getElementById('couponsModalBackdrop'),
  closeCouponsModalBtn: document.getElementById('closeCouponsModalBtn'),
  couponsModalList: document.getElementById('couponsModalList'),

  ordersModalBackdrop: document.getElementById('ordersModalBackdrop'),
  closeOrdersModalBtn: document.getElementById('closeOrdersModalBtn'),
  ordersModalList: document.getElementById('ordersModalList'),

  orderSuccessBackdrop: document.getElementById('orderSuccessBackdrop'),
  closeOrderSuccessBtn: document.getElementById('closeOrderSuccessBtn'),
  orderSuccessBody: document.getElementById('orderSuccessBody'),

  toastContainer: document.getElementById('toastContainer')
};

function formatInr(amount, decimals = 2) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(Number(amount) || 0);
}

function formatInrShort(amount) {
  const num = Number(amount) || 0;
  return Number.isInteger(num) ? formatInr(num, 0) : formatInr(num, 2);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function loadStoredCart() {
  try {
    const raw = localStorage.getItem('cravebite_cart');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem('cravebite_cart', JSON.stringify(state.cart));
  if (state.appliedCouponCode) {
    localStorage.setItem('cravebite_coupon', state.appliedCouponCode);
  } else {
    localStorage.removeItem('cravebite_coupon');
  }
}

async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  el.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function renderDishVisual(item) {
  if (item.imageUrl) {
    return `
      <div class="dish-visual">
        <img
          class="dish-photo"
          src="${escapeHtml(item.imageUrl)}"
          alt="${escapeHtml(item.name)}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');"
        />
        <div class="hidden" style="width:100%; height:100%; display:grid; place-items:center;">
          ${renderDishSvgMarkup(item.iconType, item.accent)}
        </div>
      </div>
    `;
  }
  return renderDishSvg(item.iconType, item.accent);
}

function renderDishSvgMarkup(iconType, accent) {
  const safeAccent = escapeHtml(accent || '#E85D04');
  const motifs = {
    biryani: `<ellipse cx="60" cy="70" rx="34" ry="18" fill="${safeAccent}"/><ellipse cx="60" cy="60" rx="32" ry="14" fill="#FDE68A"/><circle cx="48" cy="58" r="3" fill="#B45309"/><circle cx="62" cy="54" r="3" fill="#DC2626"/><circle cx="72" cy="61" r="3" fill="#15803D"/>`,
    curry: `<path d="M26 62c0 18 15 28 34 28s34-10 34-28H26z" fill="#374151"/><ellipse cx="60" cy="62" rx="32" ry="11" fill="${safeAccent}"/><circle cx="52" cy="61" r="4" fill="#FDE68A"/><circle cx="68" cy="63" r="4" fill="#FFFBEB"/>`,
    thali: `<circle cx="60" cy="60" r="35" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/><circle cx="44" cy="48" r="10" fill="${safeAccent}"/><circle cx="74" cy="48" r="10" fill="#F59E0B"/><circle cx="60" cy="72" r="12" fill="#FEF3C7"/>`,
    dosa: `<path d="M22 76 L92 38 L98 54 L34 86 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2"/><circle cx="38" cy="44" r="9" fill="#FFFBEB" stroke="#D1D5DB"/><circle cx="58" cy="40" r="8" fill="${safeAccent}"/>`,
    idli: `<ellipse cx="60" cy="68" rx="34" ry="16" fill="#E5E7EB"/><ellipse cx="46" cy="58" rx="13" ry="9" fill="#FFFFFF" stroke="#E5E7EB"/><ellipse cx="74" cy="58" rx="13" ry="9" fill="#FFFFFF" stroke="#E5E7EB"/><circle cx="60" cy="71" r="8" fill="${safeAccent}"/>`,
    chaat: `<path d="M28 58c0 17 14 28 32 28s32-11 32-28H28z" fill="#FDE68A"/><ellipse cx="60" cy="58" rx="30" ry="11" fill="${safeAccent}"/><circle cx="48" cy="56" r="3.5" fill="#15803D"/><circle cx="66" cy="59" r="3.5" fill="#FFFBEB"/><circle cx="57" cy="53" r="3" fill="#B91C1C"/>`,
    pizza: `<path d="M60 24 L94 86 Q60 96 26 86 Z" fill="#FBBF24" stroke="#B45309" stroke-width="2"/><path d="M26 86 Q60 96 94 86" fill="none" stroke="#92400E" stroke-width="6" stroke-linecap="round"/><circle cx="55" cy="56" r="5" fill="${safeAccent}"/><circle cx="70" cy="72" r="5" fill="${safeAccent}"/><circle cx="46" cy="74" r="4" fill="#15803D"/>`,
    burger: `<path d="M30 56c0-16 13-26 30-26s30 10 30 26H30z" fill="#F59E0B"/><rect x="26" y="57" width="68" height="7" rx="3" fill="#16A34A"/><rect x="27" y="65" width="66" height="9" rx="4" fill="#7C2D12"/><path d="M30 75h60v8c0 5-5 9-10 9H40c-5 0-10-4-10-9v-8z" fill="#FBBF24"/>`,
    dessert: `<ellipse cx="60" cy="70" rx="32" ry="15" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2"/><circle cx="49" cy="62" r="11" fill="#FEF3C7" stroke="#F59E0B"/><circle cx="71" cy="62" r="11" fill="#FEF3C7" stroke="#F59E0B"/><circle cx="49" cy="58" r="2.5" fill="#15803D"/><circle cx="71" cy="58" r="2.5" fill="#15803D"/>`,
    chai: `<path d="M36 42h36l-5 40H41l-5-40z" fill="#B45309"/><ellipse cx="54" cy="42" rx="18" ry="5" fill="#D97706"/><path d="M72 48h8c5 0 8 3 8 8s-3 8-8 8h-9" fill="none" stroke="#92400E" stroke-width="4"/><path d="M46 32c0-5 5-5 5-10M58 32c0-5 5-5 5-10" stroke="#9CA3AF" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  };
  return `<svg viewBox="0 0 120 110" width="128" height="118" aria-hidden="true">${motifs[iconType] || motifs.curry}</svg>`;
}

function renderDishSvg(iconType, accent) {
  const safeAccent = escapeHtml(accent || '#E85D04');
  const bg = `${safeAccent}18`;
  return `
    <div class="dish-visual" style="background: linear-gradient(135deg, ${bg}, #FFF8F0);">
      ${renderDishSvgMarkup(iconType, accent)}
    </div>
  `;
}

function getCartQuantity(itemId) {
  const entry = state.cart.find((c) => c.id === itemId);
  return entry ? entry.quantity : 0;
}

function updateCartItem(itemId, delta) {
  const existing = state.cart.find((c) => c.id === itemId);
  if (!existing && delta > 0) {
    state.cart.push({ id: itemId, quantity: delta });
  } else if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      state.cart = state.cart.filter((c) => c.id !== itemId);
    }
  }
  saveCart();
  renderMenu();
  renderRecommendations();
  refreshQuoteAndCart();
  refreshRecommendations();
}

function renderAuthUI() {
  if (state.user) {
    el.authLoggedOut.classList.add('hidden');
    el.authLoggedIn.classList.remove('hidden');
    const initial = (state.user.name || 'U').trim().charAt(0).toUpperCase();
    el.userAvatar.textContent = initial;
    el.userName.textContent = state.user.name;
  } else {
    el.authLoggedIn.classList.add('hidden');
    el.authLoggedOut.classList.remove('hidden');
  }
  updateCheckoutButtonLabel();
}

function renderHeroCoupons() {
  const featured = state.coupons.slice(0, 4);
  el.heroCouponList.innerHTML = featured
    .map(
      (c) => `
      <div class="hero-coupon-item">
        <div>
          <span class="hero-coupon-code">${escapeHtml(c.code)}</span>
          <span style="font-weight:700; font-size:0.85rem; margin-left:6px;">${escapeHtml(c.title)}</span>
          <div class="hero-coupon-desc">${escapeHtml(c.description)}</div>
        </div>
        <button class="btn btn-primary btn-mini" type="button" data-apply-coupon="${escapeHtml(c.code)}">
          ${state.appliedCouponCode === c.code ? 'Applied' : 'Apply'}
        </button>
      </div>
    `
    )
    .join('');

  el.couponBadge.textContent = String(state.coupons.length);
}

function renderCouponsModal() {
  const subtotal = state.quote?.itemSubtotalInr || 0;
  el.couponsModalList.innerHTML = state.coupons
    .map((c) => {
      const isApplied = state.appliedCouponCode === c.code;
      const meetsMin = subtotal >= c.minOrderInr;
      const hint =
        subtotal === 0
          ? `Min order ${formatInrShort(c.minOrderInr)}`
          : meetsMin
            ? 'Eligible for your current cart!'
            : `Add ${formatInrShort(c.minOrderInr - subtotal)} more to unlock`;

      return `
        <div class="coupon-card">
          <div>
            <div>
              <span class="hero-coupon-code">${escapeHtml(c.code)}</span>
              <span class="coupon-badge">${escapeHtml(c.badge)}</span>
            </div>
            <h3>${escapeHtml(c.title)}</h3>
            <p>${escapeHtml(c.description)}</p>
            <p style="margin-top:4px; font-weight:600; color:${meetsMin ? 'var(--green)' : 'var(--primary)'};">
              ${escapeHtml(hint)}
            </p>
          </div>
          <button
            class="btn ${isApplied ? 'btn-outline' : 'btn-primary'}"
            type="button"
            data-modal-apply-coupon="${escapeHtml(c.code)}"
          >
            ${isApplied ? 'Applied ✓' : 'Apply Code'}
          </button>
        </div>
      `;
    })
    .join('');
}

function renderRecommendations() {
  if (!el.recommendationsGrid) return;
  if (el.recSubheading) {
    el.recSubheading.textContent = state.mealSlot
      ? `Automatic ${state.mealSlot.toLowerCase()} picks in ${state.city} based on nearby favorites & your cart`
      : `Automatic picks in ${state.city}`;
  }

  if (state.recommendations.length === 0) {
    el.recommendationsGrid.innerHTML =
      '<p class="muted-text" style="margin:0;">All top picks are already in your cart!</p>';
    return;
  }

  el.recommendationsGrid.innerHTML = state.recommendations
    .map((item) => {
      const qty = getCartQuantity(item.id);
      return `
        <article class="rec-card">
          <div class="rec-thumb-wrap">
            <img
              class="rec-thumb"
              src="${escapeHtml(item.imageUrl)}"
              alt="${escapeHtml(item.name)}"
              loading="lazy"
            />
            <span class="rec-reason-badge">${escapeHtml(item.reason)}</span>
          </div>
          <div class="rec-body">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
              <button
                type="button"
                class="restaurant-name-btn"
                data-select-restaurant="${escapeHtml(item.restaurant)}"
              >${escapeHtml(item.restaurant)}</button>
              <span class="fssai-mark ${item.isVeg ? '' : 'nonveg'}"></span>
            </div>
            <h3 class="rec-title">${escapeHtml(item.name)}</h3>
            <div class="rec-meta">📍 ${item.distanceKm} km away • 🕒 ${escapeHtml(item.prepTime)}</div>
            <div class="rec-footer">
              <strong>${formatInrShort(item.priceInr)}</strong>
              ${
                qty === 0
                  ? `<button class="btn btn-outline btn-mini" type="button" data-add-item="${escapeHtml(item.id)}">ADD +</button>`
                  : `<div class="qty-stepper">
                      <button type="button" data-dec-item="${escapeHtml(item.id)}" aria-label="Decrease quantity">−</button>
                      <span>${qty}</span>
                      <button type="button" data-inc-item="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
                    </div>`
              }
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

async function refreshRecommendations() {
  try {
    const cartIds = state.cart.map((c) => c.id).join(',');
    const params = new URLSearchParams({
      city: state.city,
      vegOnly: String(state.vegOnly),
      cartIds,
      hour: String(new Date().getHours())
    });
    const res = await api(`/api/recommendations?${params.toString()}`);
    state.recommendations = res.recommendations || [];
    state.mealSlot = res.mealSlot || '';
    renderRecommendations();
  } catch {
    // Non-blocking: keep existing recommendations if refresh fails
  }
}

function renderRestaurants() {
  if (!el.restaurantCards) return;

  if (el.restaurantsHeading) {
    el.restaurantsHeading.textContent = `Nearby Restaurants in ${state.city}`;
  }

  const isAll = state.activeRestaurant === 'All';
  el.clearRestaurantBtn.classList.toggle('hidden', isAll);

  const allCard = `
    <button
      type="button"
      class="restaurant-card ${isAll ? 'active' : ''}"
      data-select-restaurant="All"
    >
      <div class="restaurant-thumb restaurant-thumb-all" aria-hidden="true">🍽️</div>
      <div class="restaurant-card-info">
        <span class="restaurant-card-title">All Nearby Kitchens</span>
        <span class="restaurant-card-meta">${state.menu.length} dishes • ${state.restaurants.length} in ${escapeHtml(state.city)}</span>
      </div>
    </button>
  `;

  const cards = state.restaurants
    .map((r) => {
      const isActive = state.activeRestaurant === r.name;
      return `
        <button
          type="button"
          class="restaurant-card ${isActive ? 'active' : ''}"
          data-select-restaurant="${escapeHtml(r.name)}"
        >
          <img
            class="restaurant-thumb"
            src="${escapeHtml(r.coverImageUrl)}"
            alt="${escapeHtml(r.name)}"
            loading="lazy"
          />
          <div class="restaurant-card-info">
            <span class="restaurant-card-title">${escapeHtml(r.name)}</span>
            <span class="restaurant-card-meta">📍 ${r.distanceKm} km • ${escapeHtml(r.area)}</span>
            <span class="restaurant-card-meta">★ ${r.rating.toFixed(1)} • ${r.dishCount} item${r.dishCount === 1 ? '' : 's'} • ${escapeHtml(r.prepTime)}</span>
          </div>
        </button>
      `;
    })
    .join('');

  el.restaurantCards.innerHTML = allCard + cards;
}

function selectRestaurant(restaurantName) {
  const next = restaurantName || 'All';
  state.activeRestaurant = state.activeRestaurant === next && next !== 'All' ? 'All' : next;
  if (state.activeRestaurant !== 'All') {
    state.activeCategory = 'All';
    renderCategories();
  }
  renderRestaurants();
  renderMenu();
}

function renderCategories() {
  el.categoryPills.innerHTML = state.categories
    .map(
      (cat) => `
      <button
        type="button"
        class="cat-pill ${state.activeCategory === cat ? 'active' : ''}"
        data-category="${escapeHtml(cat)}"
      >
        ${escapeHtml(cat)}
      </button>
    `
    )
    .join('');
}

function getFilteredMenu() {
  const q = state.searchQuery.trim().toLowerCase();
  let items = state.menu.filter((item) => {
    if (state.activeRestaurant !== 'All' && item.restaurant !== state.activeRestaurant) {
      return false;
    }
    if (state.activeCategory !== 'All' && item.category !== state.activeCategory) {
      return false;
    }
    if (state.vegOnly && !item.isVeg) {
      return false;
    }
    if (q) {
      const hay = `${item.name} ${item.restaurant} ${item.category} ${item.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (state.sortBy === 'price-asc') {
    items = [...items].sort((a, b) => a.priceInr - b.priceInr);
  } else if (state.sortBy === 'price-desc') {
    items = [...items].sort((a, b) => b.priceInr - a.priceInr);
  } else if (state.sortBy === 'rating-desc') {
    items = [...items].sort((a, b) => b.rating - a.rating);
  }
  return items;
}

function renderMenu() {
  const items = getFilteredMenu();
  if (state.activeRestaurant !== 'All') {
    el.menuHeading.textContent =
      state.activeCategory === 'All'
        ? `${state.activeRestaurant} — Menu`
        : `${state.activeRestaurant} • ${state.activeCategory}`;
  } else {
    el.menuHeading.textContent =
      state.activeCategory === 'All' ? 'All Popular Dishes' : state.activeCategory;
  }
  el.menuCount.textContent = `${items.length} dish${items.length === 1 ? '' : 'es'} available`;

  if (items.length === 0) {
    el.menuGrid.innerHTML = '';
    el.emptyMenuState.classList.remove('hidden');
    return;
  }

  el.emptyMenuState.classList.add('hidden');
  el.menuGrid.innerHTML = items
    .map((item) => {
      const qty = getCartQuantity(item.id);
      return `
        <article class="dish-card">
          <div style="position:relative;">
            ${renderDishVisual(item)}
            <div class="dish-badges">
              <span>${item.bestseller ? '<span class="bestseller-tag">★ Bestseller</span>' : ''}</span>
              <span class="rating-pill">★ ${item.rating.toFixed(1)}</span>
            </div>
          </div>
          <div class="dish-body">
            <div class="dish-meta-top">
              <button
                type="button"
                class="restaurant-name-btn"
                data-select-restaurant="${escapeHtml(item.restaurant)}"
                title="View all dishes from ${escapeHtml(item.restaurant)}"
              >${escapeHtml(item.restaurant)}</button>
              <span
                class="fssai-mark ${item.isVeg ? '' : 'nonveg'}"
                title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"
                aria-label="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"
              ></span>
            </div>
            <h3 class="dish-title">${escapeHtml(item.name)}</h3>
            <p class="dish-desc">${escapeHtml(item.description)}</p>
            <div class="dish-footer">
              <div>
                <span class="dish-price">${formatInrShort(item.priceInr)}</span>
                <span class="dish-time">📍 ${item.distanceKm ?? 1.5} km • 🕒 ${escapeHtml(item.prepTime)}</span>
              </div>
              ${
                qty === 0
                  ? `<button class="btn btn-outline" type="button" data-add-item="${escapeHtml(item.id)}">ADD +</button>`
                  : `<div class="qty-stepper">
                      <button type="button" data-dec-item="${escapeHtml(item.id)}" aria-label="Decrease quantity">−</button>
                      <span>${qty}</span>
                      <button type="button" data-inc-item="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
                    </div>`
              }
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

async function refreshQuoteAndCart() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  el.navCartCount.textContent = String(totalCount);

  if (state.cart.length === 0) {
    state.quote = null;
    el.navCartLabel.textContent = 'Cart';
    el.cartEmpty.classList.remove('hidden');
    el.cartBody.classList.add('hidden');
    renderCouponsModal();
    return;
  }

  el.cartEmpty.classList.add('hidden');
  el.cartBody.classList.remove('hidden');

  try {
    const quote = await api('/api/quote', {
      method: 'POST',
      body: JSON.stringify({
        items: state.cart,
        couponCode: state.appliedCouponCode
      })
    });
    state.quote = quote;
    renderCartQuote(quote);
  } catch (err) {
    showToast(err.message);
  }
}

function renderCartQuote(quote) {
  el.navCartLabel.textContent = formatInrShort(quote.grandTotalInr);

  el.cartItemsList.innerHTML = quote.items
    .map(
      (line) => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">
            <span class="fssai-mark ${line.isVeg ? '' : 'nonveg'}"></span>
            <span>${escapeHtml(line.name)}</span>
          </div>
          <div class="cart-item-unit">
            ${escapeHtml(line.restaurant)} • ${formatInrShort(line.unitPriceInr)} each
          </div>
        </div>
        <div class="qty-stepper">
          <button type="button" data-dec-item="${escapeHtml(line.id)}">−</button>
          <span>${line.quantity}</span>
          <button type="button" data-inc-item="${escapeHtml(line.id)}">+</button>
        </div>
        <div class="cart-item-total">${formatInr(line.lineTotalInr)}</div>
      </div>
    `
    )
    .join('');

  el.billSubtotal.textContent = formatInr(quote.itemSubtotalInr);
  el.billDelivery.innerHTML =
    quote.deliveryFeeInr === 0
      ? '<span style="color:var(--green); font-weight:700;">FREE</span>'
      : formatInr(quote.deliveryFeeInr);
  el.billPackaging.textContent = formatInr(quote.packagingFeeInr);
  el.billGst.textContent = formatInr(quote.gstInr);
  el.billTotal.textContent = formatInr(quote.grandTotalInr);

  const totalCouponSaved = quote.couponDiscountInr + quote.deliveryDiscountInr;
  if (quote.appliedCoupon && totalCouponSaved > 0) {
    el.appliedCouponChip.classList.remove('hidden');
    el.appliedCouponCode.textContent = quote.appliedCoupon.code;
    el.appliedCouponSavings.textContent = `Saved ${formatInr(totalCouponSaved)}`;
    el.couponInput.value = quote.appliedCoupon.code;
  } else {
    el.appliedCouponChip.classList.add('hidden');
  }

  if (quote.couponDiscountInr > 0 && quote.appliedCoupon) {
    el.billDiscountRow.classList.remove('hidden');
    el.billDiscountCode.textContent = quote.appliedCoupon.code;
    el.billDiscount.textContent = `-${formatInr(quote.couponDiscountInr)}`;
  } else {
    el.billDiscountRow.classList.add('hidden');
  }

  if (quote.couponError) {
    el.couponFeedback.textContent = quote.couponError;
    el.couponFeedback.className = 'coupon-feedback error';
    el.couponFeedback.classList.remove('hidden');
  } else if (quote.appliedCoupon) {
    el.couponFeedback.classList.add('hidden');
  } else {
    el.couponFeedback.classList.add('hidden');
  }

  if (quote.totalSavingsInr > 0) {
    el.billSavingsBanner.textContent = `🎉 You are saving ${formatInr(quote.totalSavingsInr)} on this order!`;
    el.billSavingsBanner.classList.remove('hidden');
  } else {
    el.billSavingsBanner.classList.add('hidden');
  }

  updateCheckoutButtonLabel();
  renderHeroCoupons();
  renderCouponsModal();
}

function updateCheckoutButtonLabel() {
  const total = state.quote ? formatInr(state.quote.grandTotalInr) : '';
  if (!state.user) {
    el.placeOrderBtn.textContent = total
      ? `Log In to Place Order • ${total}`
      : 'Log In to Place Order';
  } else {
    el.placeOrderBtn.textContent = total ? `Place Order • ${total}` : 'Place Order';
  }
}

async function applyCouponCode(code) {
  const cleanCode = String(code || '').trim().toUpperCase();
  if (!cleanCode) {
    showToast('Please enter a coupon code.');
    return;
  }
  state.appliedCouponCode = cleanCode;
  el.couponInput.value = cleanCode;
  saveCart();

  if (state.cart.length === 0) {
    renderHeroCoupons();
    renderCouponsModal();
    showToast(`Coupon ${cleanCode} saved! Add dishes to see your discount.`);
    return;
  }

  await refreshQuoteAndCart();
  if (state.quote?.appliedCoupon && !state.quote?.couponError) {
    const saved = state.quote.couponDiscountInr + state.quote.deliveryDiscountInr;
    showToast(`Coupon ${cleanCode} applied! You saved ${formatInr(saved)}.`);
  } else if (state.quote?.couponError) {
    showToast(state.quote.couponError);
  }
}

function removeCoupon() {
  state.appliedCouponCode = '';
  el.couponInput.value = '';
  saveCart();
  refreshQuoteAndCart();
  renderHeroCoupons();
  showToast('Coupon removed.');
}

// Drawer & Modals
function openCartDrawer() {
  el.cartBackdrop.classList.remove('hidden');
  el.cartDrawer.classList.remove('hidden');
  refreshQuoteAndCart();
}

function closeCartDrawer() {
  el.cartBackdrop.classList.add('hidden');
  el.cartDrawer.classList.add('hidden');
}

function openAuthModal(tab = 'login') {
  el.loginError.classList.add('hidden');
  el.signupError.classList.add('hidden');
  switchAuthTab(tab);
  el.authModalBackdrop.classList.remove('hidden');
}

function closeAuthModal() {
  el.authModalBackdrop.classList.add('hidden');
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  el.loginTabBtn.classList.toggle('active', isLogin);
  el.signupTabBtn.classList.toggle('active', !isLogin);
  el.loginForm.classList.toggle('hidden', !isLogin);
  el.signupForm.classList.toggle('hidden', isLogin);
}

function openCouponsModal() {
  renderCouponsModal();
  el.couponsModalBackdrop.classList.remove('hidden');
}

function closeCouponsModal() {
  el.couponsModalBackdrop.classList.add('hidden');
}

async function openOrdersModal() {
  if (!state.user) {
    openAuthModal('login');
    return;
  }
  el.ordersModalList.innerHTML = '<p class="muted-text">Loading your orders...</p>';
  el.ordersModalBackdrop.classList.remove('hidden');

  try {
    const { orders } = await api('/api/orders');
    if (!orders.length) {
      el.ordersModalList.innerHTML = '<p class="muted-text">You have not placed any orders yet.</p>';
      return;
    }

    el.ordersModalList.innerHTML = orders
      .map((order) => {
        const itemSummary = order.items
          .map((i) => `${i.quantity} × ${escapeHtml(i.name)}`)
          .join(', ');
        const dateStr = new Date(order.createdAt).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        return `
          <div class="order-card">
            <div class="order-card-top">
              <div>
                <strong>${escapeHtml(order.id)}</strong>
                <span class="muted-text" style="margin-left:8px;">${escapeHtml(dateStr)}</span>
              </div>
              <span class="order-status">${escapeHtml(order.status)}</span>
            </div>
            <div class="order-items-text">${itemSummary}</div>
            <div class="muted-text">
              📍 ${escapeHtml(order.deliveryAddress)} (${escapeHtml(order.city)}) • 💳 ${escapeHtml(order.paymentMethod)}
              ${order.couponCode ? ` • 🏷️ ${escapeHtml(order.couponCode)}` : ''}
            </div>
            <div class="order-card-bottom">
              <strong style="font-size:1rem;">Paid: ${formatInr(order.grandTotalInr)}</strong>
              <button class="btn btn-outline btn-mini" type="button" data-reorder-id="${escapeHtml(order.id)}">
                Reorder Items
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    // Wire reorder buttons
    for (const btn of el.ordersModalList.querySelectorAll('[data-reorder-id]')) {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-reorder-id');
        const found = orders.find((o) => o.id === orderId);
        if (!found) return;
        state.cart = found.items.map((i) => ({ id: i.id, quantity: i.quantity }));
        saveCart();
        renderMenu();
        closeOrdersModal();
        openCartDrawer();
        showToast(`Loaded items from ${orderId} into your cart.`);
      });
    }
  } catch (err) {
    el.ordersModalList.innerHTML = `<div class="form-error">${escapeHtml(err.message)}</div>`;
  }
}

function closeOrdersModal() {
  el.ordersModalBackdrop.classList.add('hidden');
}

function showOrderSuccessModal(order) {
  const totalSaved = (order.couponDiscountInr || 0) + (order.deliveryDiscountInr || 0);
  el.orderSuccessBody.innerHTML = `
    <div class="success-box">
      <div style="font-size:1.1rem; font-weight:800;">Order ${escapeHtml(order.id)} Confirmed</div>
      <div>Estimated delivery in <strong>25–30 mins</strong> to ${escapeHtml(order.city)}</div>
    </div>
    <div class="bill-card">
      <div class="bill-row"><span>Customer</span><strong>${escapeHtml(order.customerName)}</strong></div>
      <div class="bill-row"><span>Payment</span><span>${escapeHtml(order.paymentMethod)}</span></div>
      ${order.couponCode ? `<div class="bill-row discount"><span>Coupon (${escapeHtml(order.couponCode)})</span><span>-${formatInr(totalSaved)}</span></div>` : ''}
      <div class="bill-divider"></div>
      <div class="bill-row total"><span>Total Paid (INR)</span><span>${formatInr(order.grandTotalInr)}</span></div>
    </div>
    <p class="muted-text" style="margin:0;">Delivering to: ${escapeHtml(order.deliveryAddress)}</p>
    <button id="viewOrdersFromSuccessBtn" class="btn btn-primary btn-full" type="button">Track in My Orders</button>
  `;

  el.orderSuccessBackdrop.classList.remove('hidden');
  document
    .getElementById('viewOrdersFromSuccessBtn')
    .addEventListener('click', () => {
      el.orderSuccessBackdrop.classList.add('hidden');
      openOrdersModal();
    });
}

// Event Wiring
function setupEventListeners() {
  el.citySelect.addEventListener('change', async (e) => {
    await loadCityMenu(e.target.value);
    showToast(`Switched delivery city to ${state.city}`);
  });

  el.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderMenu();
  });

  el.vegOnlyToggle.addEventListener('change', (e) => {
    state.vegOnly = e.target.checked;
    renderMenu();
    refreshRecommendations();
  });

  el.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderMenu();
  });

  el.resetFiltersBtn.addEventListener('click', () => {
    state.activeCategory = 'All';
    state.activeRestaurant = 'All';
    state.vegOnly = false;
    state.searchQuery = '';
    state.sortBy = 'recommended';
    el.searchInput.value = '';
    el.vegOnlyToggle.checked = false;
    el.sortSelect.value = 'recommended';
    renderRestaurants();
    renderCategories();
    renderMenu();
  });

  el.clearRestaurantBtn.addEventListener('click', () => {
    selectRestaurant('All');
  });

  el.categoryPills.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-category]');
    if (!btn) return;
    state.activeCategory = btn.getAttribute('data-category');
    renderCategories();
    renderMenu();
  });

  document.addEventListener('click', (e) => {
    const restBtn = e.target.closest('[data-select-restaurant]');
    if (restBtn) {
      selectRestaurant(restBtn.getAttribute('data-select-restaurant'));
      return;
    }
    const addBtn = e.target.closest('[data-add-item]');
    if (addBtn) {
      updateCartItem(addBtn.getAttribute('data-add-item'), 1);
      return;
    }
    const incBtn = e.target.closest('[data-inc-item]');
    if (incBtn) {
      updateCartItem(incBtn.getAttribute('data-inc-item'), 1);
      return;
    }
    const decBtn = e.target.closest('[data-dec-item]');
    if (decBtn) {
      updateCartItem(decBtn.getAttribute('data-dec-item'), -1);
      return;
    }
    const heroCouponBtn = e.target.closest('[data-apply-coupon]');
    if (heroCouponBtn) {
      applyCouponCode(heroCouponBtn.getAttribute('data-apply-coupon'));
      return;
    }
    const modalCouponBtn = e.target.closest('[data-modal-apply-coupon]');
    if (modalCouponBtn) {
      applyCouponCode(modalCouponBtn.getAttribute('data-modal-apply-coupon'));
      closeCouponsModal();
      openCartDrawer();
    }
  });

  el.openCartBtn.addEventListener('click', openCartDrawer);
  el.closeCartBtn.addEventListener('click', closeCartDrawer);
  el.cartBackdrop.addEventListener('click', closeCartDrawer);
  el.browseMenuBtn.addEventListener('click', closeCartDrawer);

  el.applyCouponBtn.addEventListener('click', () => {
    applyCouponCode(el.couponInput.value);
  });
  el.removeCouponBtn.addEventListener('click', removeCoupon);
  el.drawerCouponsToggle.addEventListener('click', openCouponsModal);

  el.openCouponsBtn.addEventListener('click', openCouponsModal);
  el.closeCouponsModalBtn.addEventListener('click', closeCouponsModal);
  el.couponsModalBackdrop.addEventListener('click', (e) => {
    if (e.target === el.couponsModalBackdrop) closeCouponsModal();
  });

  el.openLoginBtn.addEventListener('click', () => openAuthModal('login'));
  el.openSignupBtn.addEventListener('click', () => openAuthModal('signup'));
  el.closeAuthModalBtn.addEventListener('click', closeAuthModal);
  el.authModalBackdrop.addEventListener('click', (e) => {
    if (e.target === el.authModalBackdrop) closeAuthModal();
  });
  el.loginTabBtn.addEventListener('click', () => switchAuthTab('login'));
  el.signupTabBtn.addEventListener('click', () => switchAuthTab('signup'));

  el.fillDemoBtn.addEventListener('click', () => {
    el.loginEmail.value = 'demo@cravebite.in';
    el.loginPassword.value = 'Demo@123';
  });

  el.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    el.loginError.classList.add('hidden');
    try {
      const { user } = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: el.loginEmail.value,
          password: el.loginPassword.value
        })
      });
      state.user = user;
      renderAuthUI();
      closeAuthModal();
      refreshRecommendations();
      showToast(`Welcome back, ${user.name}!`);
      if (state.pendingCheckoutAfterLogin) {
        state.pendingCheckoutAfterLogin = false;
        openCartDrawer();
      }
    } catch (err) {
      el.loginError.textContent = err.message;
      el.loginError.classList.remove('hidden');
    }
  });

  el.signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    el.signupError.classList.add('hidden');
    try {
      const { user } = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: el.signupName.value,
          email: el.signupEmail.value,
          phone: el.signupPhone.value,
          password: el.signupPassword.value
        })
      });
      state.user = user;
      renderAuthUI();
      closeAuthModal();
      refreshRecommendations();
      showToast(`Account created! Welcome, ${user.name}.`);
      if (state.pendingCheckoutAfterLogin) {
        state.pendingCheckoutAfterLogin = false;
        openCartDrawer();
      }
    } catch (err) {
      el.signupError.textContent = err.message;
      el.signupError.classList.remove('hidden');
    }
  });

  el.logoutBtn.addEventListener('click', async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
      state.user = null;
      renderAuthUI();
      closeOrdersModal();
      refreshRecommendations();
      showToast('You have been logged out.');
    } catch (err) {
      showToast(err.message);
    }
  });

  el.openOrdersBtn.addEventListener('click', openOrdersModal);
  el.closeOrdersModalBtn.addEventListener('click', closeOrdersModal);
  el.ordersModalBackdrop.addEventListener('click', (e) => {
    if (e.target === el.ordersModalBackdrop) closeOrdersModal();
  });

  el.closeOrderSuccessBtn.addEventListener('click', () => {
    el.orderSuccessBackdrop.classList.add('hidden');
  });
  el.orderSuccessBackdrop.addEventListener('click', (e) => {
    if (e.target === el.orderSuccessBackdrop) {
      el.orderSuccessBackdrop.classList.add('hidden');
    }
  });

  el.checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    el.checkoutError.classList.add('hidden');

    if (!state.user) {
      state.pendingCheckoutAfterLogin = true;
      closeCartDrawer();
      openAuthModal('login');
      showToast('Please log in to place your order.');
      return;
    }

    if (state.quote?.couponError) {
      el.checkoutError.textContent = `${state.quote.couponError} Remove or change the coupon to continue.`;
      el.checkoutError.classList.remove('hidden');
      return;
    }

    el.placeOrderBtn.disabled = true;
    try {
      const { order } = await api('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: state.cart,
          couponCode: state.appliedCouponCode,
          deliveryAddress: el.deliveryAddressInput.value,
          city: el.citySelect.value,
          paymentMethod: el.paymentMethodSelect.value
        })
      });

      state.cart = [];
      state.appliedCouponCode = '';
      el.couponInput.value = '';
      saveCart();
      renderMenu();
      await Promise.all([refreshQuoteAndCart(), refreshRecommendations()]);
      closeCartDrawer();
      showOrderSuccessModal(order);
    } catch (err) {
      el.checkoutError.textContent = err.message;
      el.checkoutError.classList.remove('hidden');
    } finally {
      el.placeOrderBtn.disabled = false;
    }
  });
}

async function loadCityMenu(city) {
  state.city = city || 'Bengaluru';
  localStorage.setItem('cravebite_city', state.city);
  el.citySelect.value = state.city;
  state.activeRestaurant = 'All';

  const params = new URLSearchParams({
    city: state.city,
    vegOnly: String(state.vegOnly),
    cartIds: state.cart.map((c) => c.id).join(','),
    hour: String(new Date().getHours())
  });

  const [menuRes, recRes] = await Promise.all([
    api(`/api/menu?city=${encodeURIComponent(state.city)}`),
    api(`/api/recommendations?${params.toString()}`)
  ]);

  state.categories = menuRes.categories;
  state.restaurants = menuRes.restaurants || [];
  state.menu = menuRes.items;
  state.recommendations = recRes.recommendations || [];
  state.mealSlot = recRes.mealSlot || '';

  renderRecommendations();
  renderRestaurants();
  renderCategories();
  renderMenu();
}

async function init() {
  setupEventListeners();
  try {
    el.citySelect.value = state.city;
    const [couponsRes, meRes] = await Promise.all([
      api('/api/coupons'),
      api('/api/auth/me')
    ]);

    state.coupons = couponsRes.coupons;
    state.user = meRes.user;

    renderAuthUI();
    renderHeroCoupons();
    await loadCityMenu(state.city);
    await refreshQuoteAndCart();
  } catch (err) {
    showToast(`Failed to load CraveBite: ${err.message}`);
  }
}

init();
