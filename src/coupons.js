import { MENU_BY_ID } from './catalog.js';

export const DELIVERY_FEE_INR = 40;
export const FREE_DELIVERY_THRESHOLD_INR = 799;
export const PACKAGING_FEE_INR = 15;
export const GST_RATE = 0.05;

export const COUPONS = [
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Get ₹40 delivery fee waived on orders above ₹149',
    type: 'free_delivery',
    value: 40,
    minOrderInr: 149,
    maxDiscountInr: 40,
    badge: 'POPULAR'
  },
  {
    code: 'WELCOME50',
    title: 'Flat ₹50 OFF',
    description: 'Save flat ₹50 on your order above ₹199',
    type: 'flat',
    value: 50,
    minOrderInr: 199,
    maxDiscountInr: 50,
    badge: 'NEW USER'
  },
  {
    code: 'FEAST20',
    title: '20% OFF up to ₹150',
    description: 'Enjoy 20% discount up to ₹150 on orders of ₹399 or more',
    type: 'percent',
    value: 20,
    minOrderInr: 399,
    maxDiscountInr: 150,
    badge: 'BEST VALUE'
  },
  {
    code: 'BIRYANI100',
    title: 'Flat ₹100 OFF',
    description: 'Mega savings of ₹100 on orders above ₹599',
    type: 'flat',
    value: 100,
    minOrderInr: 599,
    maxDiscountInr: 100,
    badge: 'FEAST'
  },
  {
    code: 'WEEKEND25',
    title: '25% OFF up to ₹200',
    description: '25% off up to ₹200 on party orders of ₹699 or more',
    type: 'percent',
    value: 25,
    minOrderInr: 699,
    maxDiscountInr: 200,
    badge: 'PARTY DEAL'
  }
];

export const COUPON_BY_CODE = new Map(COUPONS.map((c) => [c.code, c]));

export function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
}

function roundTwo(num) {
  return Math.round(num * 100) / 100;
}

/**
 * Authoritatively computes order line items and INR totals on the server.
 * Never trusts client-supplied prices or discounts.
 */
export function calculateOrderQuote(rawItems, rawCouponCode = '') {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, status: 400, error: 'Your cart is empty.' };
  }

  const normalizedLines = [];
  let itemSubtotalInr = 0;

  for (const entry of rawItems) {
    const itemId = typeof entry?.id === 'string' ? entry.id.trim() : '';
    const quantity = Number(entry?.quantity);
    if (!itemId || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return {
        ok: false,
        status: 400,
        error: 'Each cart item must have a valid id and quantity between 1 and 50.'
      };
    }

    const catalogItem = MENU_BY_ID.get(itemId);
    if (!catalogItem) {
      return { ok: false, status: 400, error: `Unknown menu item: ${itemId}` };
    }

    const lineTotalInr = roundTwo(catalogItem.priceInr * quantity);
    itemSubtotalInr = roundTwo(itemSubtotalInr + lineTotalInr);

    normalizedLines.push({
      id: catalogItem.id,
      name: catalogItem.name,
      restaurant: catalogItem.restaurant,
      isVeg: catalogItem.isVeg,
      unitPriceInr: catalogItem.priceInr,
      quantity,
      lineTotalInr
    });
  }

  let deliveryFeeInr =
    itemSubtotalInr >= FREE_DELIVERY_THRESHOLD_INR ? 0 : DELIVERY_FEE_INR;
  const packagingFeeInr = PACKAGING_FEE_INR;

  const couponCode = typeof rawCouponCode === 'string' ? rawCouponCode.trim().toUpperCase() : '';
  let appliedCoupon = null;
  let couponDiscountInr = 0;
  let deliveryDiscountInr = 0;
  let couponError = null;

  if (couponCode) {
    const coupon = COUPON_BY_CODE.get(couponCode);
    if (!coupon) {
      couponError = `Coupon "${couponCode}" is invalid.`;
    } else if (itemSubtotalInr < coupon.minOrderInr) {
      const shortfall = roundTwo(coupon.minOrderInr - itemSubtotalInr);
      couponError = `Add ₹${shortfall} more to apply ${coupon.code} (minimum order ₹${coupon.minOrderInr}).`;
    } else {
      appliedCoupon = {
        code: coupon.code,
        title: coupon.title,
        type: coupon.type
      };

      if (coupon.type === 'free_delivery') {
        deliveryDiscountInr = deliveryFeeInr;
        deliveryFeeInr = 0;
      } else if (coupon.type === 'flat') {
        couponDiscountInr = Math.min(coupon.value, itemSubtotalInr);
      } else if (coupon.type === 'percent') {
        const rawDiscount = (itemSubtotalInr * coupon.value) / 100;
        couponDiscountInr = roundTwo(Math.min(rawDiscount, coupon.maxDiscountInr, itemSubtotalInr));
      }
    }
  }

  const discountedFoodSubtotalInr = roundTwo(Math.max(0, itemSubtotalInr - couponDiscountInr));
  const gstInr = roundTwo(discountedFoodSubtotalInr * GST_RATE);
  const grandTotalInr = roundTwo(
    discountedFoodSubtotalInr + deliveryFeeInr + packagingFeeInr + gstInr
  );
  const totalSavingsInr = roundTwo(
    couponDiscountInr +
      deliveryDiscountInr +
      (itemSubtotalInr >= FREE_DELIVERY_THRESHOLD_INR ? DELIVERY_FEE_INR : 0)
  );

  return {
    ok: true,
    quote: {
      currency: 'INR',
      currencySymbol: '₹',
      items: normalizedLines,
      itemSubtotalInr,
      deliveryFeeInr,
      packagingFeeInr,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      appliedCoupon,
      couponDiscountInr,
      deliveryDiscountInr,
      gstInr,
      grandTotalInr,
      totalSavingsInr,
      couponError
    }
  };
}
