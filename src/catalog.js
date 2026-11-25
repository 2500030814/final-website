export const CATEGORIES = [
  'All',
  'Biryani & Mughlai',
  'North Indian',
  'South Indian',
  'Street Food & Chaat',
  'Pizzas & Burgers',
  'Desserts & Chai'
];

export const MENU_ITEMS = [
  {
    id: 'hyd-chicken-biryani',
    name: 'Hyderabadi Chicken Dum Biryani',
    restaurant: 'Nizami Handi',
    category: 'Biryani & Mughlai',
    priceInr: 329,
    rating: 4.8,
    prepTime: '28 mins',
    isVeg: false,
    bestseller: true,
    spiceLevel: 'Medium',
    accent: '#E85D04',
    iconType: 'biryani',
    imageUrl: '/images/hyd-chicken-biryani.jpg',
    description: 'Long-grain basmati rice slow-cooked on dum with saffron, caramelized onions, mint, and tender spiced chicken. Served with mirchi ka salan & raita.'
  },
  {
    id: 'lucknowi-paneer-biryani',
    name: 'Awadhi Subz & Paneer Biryani',
    restaurant: 'Nizami Handi',
    category: 'Biryani & Mughlai',
    priceInr: 289,
    rating: 4.6,
    prepTime: '25 mins',
    isVeg: true,
    bestseller: false,
    spiceLevel: 'Mild',
    accent: '#D97706',
    iconType: 'biryani',
    imageUrl: '/images/lucknowi-paneer-biryani.jpg',
    description: 'Fragrant Awadhi saffron rice layered with char-grilled malai paneer cubes, rose water, and roasted cashews.'
  },
  {
    id: 'butter-chicken-combo',
    name: 'Old Delhi Butter Chicken & 2 Garlic Naan',
    restaurant: 'Tandoor Tales',
    category: 'North Indian',
    priceInr: 379,
    rating: 4.9,
    prepTime: '30 mins',
    isVeg: false,
    bestseller: true,
    spiceLevel: 'Mild',
    accent: '#DC2626',
    iconType: 'curry',
    imageUrl: '/images/butter-chicken-combo.jpg',
    description: 'Charcoal-roasted chicken tikka simmered in velvety tomato-fenugreek makhani gravy with two crisp buttered garlic naans.'
  },
  {
    id: 'dal-makhani-thali',
    name: 'Royal Dal Makhani & Paneer Lababdar Thali',
    restaurant: 'Tandoor Tales',
    category: 'North Indian',
    priceInr: 349,
    rating: 4.7,
    prepTime: '26 mins',
    isVeg: true,
    bestseller: true,
    spiceLevel: 'Medium',
    accent: '#B45309',
    iconType: 'thali',
    imageUrl: '/images/dal-makhani-thali.jpg',
    description: '24-hour slow-simmered black urad dal, creamy paneer lababdar, jeera pulao, 2 tandoori rotis, boondi raita, and gulab jamun.'
  },
  {
    id: 'chole-bhature',
    name: 'Amritsari Chole Bhature (2 Pcs)',
    restaurant: 'Pind Junction',
    category: 'North Indian',
    priceInr: 189,
    rating: 4.7,
    prepTime: '20 mins',
    isVeg: true,
    bestseller: false,
    spiceLevel: 'Spicy',
    accent: '#EA580C',
    iconType: 'curry',
    imageUrl: '/images/chole-bhature.jpg',
    description: 'Fluffy golden bhaturas paired with tangy spiced pindi chole, pickled onions, and green chilli chutney.'
  },
  {
    id: 'ghee-masala-dosa',
    name: 'Mysore Ghee Roast Masala Dosa',
    restaurant: 'Udupi Sagar',
    category: 'South Indian',
    priceInr: 169,
    rating: 4.8,
    prepTime: '18 mins',
    isVeg: true,
    bestseller: true,
    spiceLevel: 'Medium',
    accent: '#CA8A04',
    iconType: 'dosa',
    imageUrl: '/images/ghee-masala-dosa.jpg',
    description: 'Crisp golden fermented crepe brushed with pure cow ghee and red garlic chutney, stuffed with spiced potato masala. Served with 3 chutneys & sambar.'
  },
  {
    id: 'idli-vada-platter',
    name: 'Podi Idli & Medu Vada Combo',
    restaurant: 'Udupi Sagar',
    category: 'South Indian',
    priceInr: 149,
    rating: 4.6,
    prepTime: '15 mins',
    isVeg: true,
    bestseller: false,
    spiceLevel: 'Mild',
    accent: '#0D9488',
    iconType: 'idli',
    imageUrl: '/images/idli-vada-platter.jpg',
    description: 'Steamed pillowy idlis tossed in roasted gunpowder podi & ghee alongside two crispy urad dal medu vadas.'
  },
  {
    id: 'chemeen-pepper-roast',
    name: 'Malabar Pepper Chicken & Parotta',
    restaurant: 'Coastal Spice',
    category: 'South Indian',
    priceInr: 319,
    rating: 4.7,
    prepTime: '27 mins',
    isVeg: false,
    bestseller: false,
    spiceLevel: 'Spicy',
    accent: '#9A3412',
    iconType: 'curry',
    imageUrl: '/images/chemeen-pepper-roast.jpg',
    description: 'Cracked Tellicherry black pepper & curry leaf chicken roast paired with 2 flaky layered Malabar parottas.'
  },
  {
    id: 'mumbai-pav-bhaji',
    name: 'Mumbai Butter Pav Bhaji',
    restaurant: 'Chowpatty Express',
    category: 'Street Food & Chaat',
    priceInr: 159,
    rating: 4.7,
    prepTime: '18 mins',
    isVeg: true,
    bestseller: true,
    spiceLevel: 'Medium',
    accent: '#E11D48',
    iconType: 'chaat',
    imageUrl: '/images/mumbai-pav-bhaji.jpg',
    description: 'Tawa-mashed spiced vegetable bhaji topped with a generous dollop of Amul butter, served with 2 toasted laadi pavs and chopped onions.'
  },
  {
    id: 'dilli-papdi-chaat',
    name: 'Dilli Raj Kachori & Papdi Chaat',
    restaurant: 'Chowpatty Express',
    category: 'Street Food & Chaat',
    priceInr: 139,
    rating: 4.5,
    prepTime: '15 mins',
    isVeg: true,
    bestseller: false,
    spiceLevel: 'Medium',
    accent: '#F59E0B',
    iconType: 'chaat',
    imageUrl: '/images/dilli-papdi-chaat.jpg',
    description: 'Crispy wheat shells filled with chilled sweetened dahi, tangy tamarind-date chutney, mint chutney, pomegranate, and nylon sev.'
  },
  {
    id: 'tandoori-paneer-pizza',
    name: 'Smoked Tandoori Paneer Pizza (10")',
    restaurant: 'Oven & Crust',
    category: 'Pizzas & Burgers',
    priceInr: 399,
    rating: 4.6,
    prepTime: '25 mins',
    isVeg: true,
    bestseller: true,
    spiceLevel: 'Medium',
    accent: '#EF4444',
    iconType: 'pizza',
    imageUrl: '/images/tandoori-paneer-pizza.jpg',
    description: 'Hand-stretched sourdough crust topped with makhani sauce, charred tandoori paneer, red paprika, onions, and molten mozzarella.'
  },
  {
    id: 'crispy-chicken-burger',
    name: 'Peri-Peri Crispy Chicken Burger & Fries',
    restaurant: 'Oven & Crust',
    category: 'Pizzas & Burgers',
    priceInr: 259,
    rating: 4.5,
    prepTime: '22 mins',
    isVeg: false,
    bestseller: false,
    spiceLevel: 'Spicy',
    accent: '#EA580C',
    iconType: 'burger',
    imageUrl: '/images/crispy-chicken-burger.jpg',
    description: 'Buttermilk-fried chicken thigh glazed in peri-peri spice, pickled jalapenos, cheddar cheese, and salted masala fries.'
  },
  {
    id: 'kesar-rasmalai',
    name: 'Kesar Pistachio Rasmalai (2 Pcs)',
    restaurant: 'Mithai Mahal',
    category: 'Desserts & Chai',
    priceInr: 129,
    rating: 4.9,
    prepTime: '12 mins',
    isVeg: true,
    bestseller: true,
    spiceLevel: 'Sweet',
    accent: '#F59E0B',
    iconType: 'dessert',
    imageUrl: '/images/kesar-rasmalai.jpg',
    description: 'Soft chhena patties soaked in chilled saffron-cardamom reduced milk, garnished with slivers of Iranian pistachios.'
  },
  {
    id: 'masala-chai-samosa',
    name: 'Kulhad Masala Chai & 2 Punjabi Samosas',
    restaurant: 'Mithai Mahal',
    category: 'Desserts & Chai',
    priceInr: 119,
    rating: 4.8,
    prepTime: '14 mins',
    isVeg: true,
    bestseller: false,
    spiceLevel: 'Mild',
    accent: '#92400E',
    iconType: 'chai',
    imageUrl: '/images/masala-chai-samosa.jpg',
    description: 'Ginger-cardamom brewed Assam kadak chai (250ml flask) paired with two flaky potato-pea samosas and tamarind chutney.'
  }
];

export const MENU_BY_ID = new Map(MENU_ITEMS.map((item) => [item.id, item]));

export const CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'];

export const CITY_RESTAURANTS = {
  Bengaluru: {
    'Nizami Handi': { name: 'Koramangala Nizami Handi', area: 'Koramangala 4th Block', distanceKm: 1.4, prepTime: '24 mins' },
    'Tandoor Tales': { name: 'Indiranagar Tandoor Tales', area: '100ft Rd, Indiranagar', distanceKm: 2.1, prepTime: '26 mins' },
    'Pind Junction': { name: 'Jayanagar Pind Dhaba', area: 'Jayanagar 3rd Block', distanceKm: 3.5, prepTime: '28 mins' },
    'Udupi Sagar': { name: 'Malleswaram Udupi Sagar', area: 'Sampige Road', distanceKm: 0.9, prepTime: '16 mins' },
    'Coastal Spice': { name: 'HSR Coastal Curry House', area: 'HSR Sector 2', distanceKm: 2.8, prepTime: '25 mins' },
    'Chowpatty Express': { name: 'VV Puram Chaat Street', area: 'VV Puram Food St', distanceKm: 1.9, prepTime: '19 mins' },
    'Oven & Crust': { name: 'Church Street Oven & Crust', area: 'Church Street', distanceKm: 2.3, prepTime: '24 mins' },
    'Mithai Mahal': { name: 'Basavanagudi Mithai Mahal', area: 'Gandhi Bazaar', distanceKm: 1.5, prepTime: '15 mins' }
  },
  Mumbai: {
    'Nizami Handi': { name: 'Bandra Biryani Darbar', area: 'Pali Hill, Bandra West', distanceKm: 1.2, prepTime: '23 mins' },
    'Tandoor Tales': { name: 'Colaba Butter & Naan', area: 'Colaba Causeway', distanceKm: 2.6, prepTime: '27 mins' },
    'Pind Junction': { name: 'Andheri Amritsari Kitchen', area: 'Lokhandwala, Andheri W', distanceKm: 3.1, prepTime: '28 mins' },
    'Udupi Sagar': { name: 'Matunga Dakshin Express', area: "King's Circle, Matunga", distanceKm: 1.5, prepTime: '17 mins' },
    'Coastal Spice': { name: 'Lower Parel Malabar Spice', area: 'Kamala Mills', distanceKm: 2.4, prepTime: '25 mins' },
    'Chowpatty Express': { name: 'Juhu Chowpatty Chaat', area: 'Juhu Tara Road', distanceKm: 0.8, prepTime: '16 mins' },
    'Oven & Crust': { name: 'Powai Woodfire & Grill', area: 'Hiranandani, Powai', distanceKm: 3.4, prepTime: '26 mins' },
    'Mithai Mahal': { name: 'Dadar Kesar & Chai', area: 'Shivaji Park, Dadar', distanceKm: 1.8, prepTime: '14 mins' }
  },
  'Delhi NCR': {
    'Nizami Handi': { name: 'Jama Masjid Shahi Biryani', area: 'Old Delhi', distanceKm: 2.2, prepTime: '25 mins' },
    'Tandoor Tales': { name: 'CP Makhani & Tandoor Co.', area: 'Connaught Place', distanceKm: 1.3, prepTime: '22 mins' },
    'Pind Junction': { name: 'Karol Bagh Chole Junction', area: 'Ajmal Khan Rd', distanceKm: 1.7, prepTime: '19 mins' },
    'Udupi Sagar': { name: 'South Ex Dakshin Café', area: 'South Extension II', distanceKm: 2.9, prepTime: '22 mins' },
    'Coastal Spice': { name: 'Hauz Khas Pepper Kitchen', area: 'Hauz Khas Village', distanceKm: 3.2, prepTime: '27 mins' },
    'Chowpatty Express': { name: 'Chandni Chowk Chaat Bhandar', area: 'Chandni Chowk', distanceKm: 1.0, prepTime: '17 mins' },
    'Oven & Crust': { name: 'CyberHub Crust & Burgers', area: 'DLF CyberHub', distanceKm: 3.8, prepTime: '28 mins' },
    'Mithai Mahal': { name: 'Khan Market Halwai & Chai', area: 'Khan Market', distanceKm: 1.4, prepTime: '14 mins' }
  },
  Hyderabad: {
    'Nizami Handi': { name: 'Charminar Shahi Handi', area: 'Laad Bazaar, Charminar', distanceKm: 1.0, prepTime: '21 mins' },
    'Tandoor Tales': { name: 'Banjara Hills Kebab House', area: 'Road No. 12, Banjara Hills', distanceKm: 2.3, prepTime: '26 mins' },
    'Pind Junction': { name: 'Begumpet Punjabi Rasoi', area: 'Begumpet Main Rd', distanceKm: 3.1, prepTime: '27 mins' },
    'Udupi Sagar': { name: 'Jubilee Hills Tiffins', area: 'Road No. 36, Jubilee Hills', distanceKm: 1.6, prepTime: '17 mins' },
    'Coastal Spice': { name: 'Gachibowli Spice Coast', area: 'Financial District', distanceKm: 2.9, prepTime: '26 mins' },
    'Chowpatty Express': { name: 'Abids Street Chaat', area: 'Abids Circle', distanceKm: 1.8, prepTime: '18 mins' },
    'Oven & Crust': { name: 'HITEC City Dough & Grill', area: 'Madhapur, HITEC City', distanceKm: 2.5, prepTime: '24 mins' },
    'Mithai Mahal': { name: 'Madhapur Irani Chai & Sweets', area: 'Ayyappa Society', distanceKm: 1.2, prepTime: '14 mins' }
  },
  Pune: {
    'Nizami Handi': { name: 'Koregaon Park Dum Kitchen', area: 'Lane 7, Koregaon Park', distanceKm: 1.3, prepTime: '23 mins' },
    'Tandoor Tales': { name: 'FC Road Tandoor House', area: 'Fergusson College Rd', distanceKm: 1.9, prepTime: '24 mins' },
    'Pind Junction': { name: 'Camp Punjabi Zaika', area: 'MG Road, Camp', distanceKm: 2.4, prepTime: '22 mins' },
    'Udupi Sagar': { name: 'Deccan Vaishali Tiffins', area: 'Deccan Gymkhana', distanceKm: 1.1, prepTime: '16 mins' },
    'Coastal Spice': { name: 'Viman Nagar Coastal Grill', area: 'Phoenix Rd, Viman Nagar', distanceKm: 3.2, prepTime: '27 mins' },
    'Chowpatty Express': { name: 'Kothrud Chaat Corner', area: 'Paud Road, Kothrud', distanceKm: 2.1, prepTime: '19 mins' },
    'Oven & Crust': { name: 'Baner Stone-Oven & Burgers', area: 'Baner High Street', distanceKm: 2.8, prepTime: '25 mins' },
    'Mithai Mahal': { name: 'Sadashiv Peth Chitale Chai', area: 'Tilak Road', distanceKm: 1.5, prepTime: '14 mins' }
  }
};

export function normalizeCity(city) {
  return CITIES.includes(city) ? city : 'Bengaluru';
}

export function getMenuForCity(city = 'Bengaluru') {
  const safeCity = normalizeCity(city);
  const cityMap = CITY_RESTAURANTS[safeCity];

  const items = MENU_ITEMS.map((item) => {
    const localRest = cityMap[item.restaurant];
    return {
      ...item,
      baseRestaurant: item.restaurant,
      restaurant: localRest ? localRest.name : item.restaurant,
      restaurantArea: localRest ? localRest.area : safeCity,
      distanceKm: localRest ? localRest.distanceKm : 2.0,
      prepTime: localRest ? localRest.prepTime : item.prepTime
    };
  });

  const restaurants = Array.from(
    items.reduce((map, item) => {
      const existing = map.get(item.restaurant);
      if (!existing) {
        map.set(item.restaurant, {
          name: item.restaurant,
          area: item.restaurantArea,
          distanceKm: item.distanceKm,
          categories: new Set([item.category]),
          ratingSum: item.rating,
          dishCount: 1,
          prepTime: item.prepTime,
          coverImageUrl: item.imageUrl
        });
      } else {
        existing.categories.add(item.category);
        existing.ratingSum += item.rating;
        existing.dishCount += 1;
      }
      return map;
    }, new Map()).values()
  )
    .map((r) => ({
      name: r.name,
      area: r.area,
      distanceKm: r.distanceKm,
      cuisine: Array.from(r.categories).join(' • '),
      rating: Math.round((r.ratingSum / r.dishCount) * 10) / 10,
      dishCount: r.dishCount,
      prepTime: r.prepTime,
      coverImageUrl: r.coverImageUrl
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return { city: safeCity, items, restaurants };
}

export const RESTAURANTS = getMenuForCity('Bengaluru').restaurants;

export function getRecommendedItems({
  city = 'Bengaluru',
  vegOnly = false,
  cartIds = [],
  pastOrderItemIds = [],
  hour = new Date().getHours()
} = {}) {
  const { city: safeCity, items } = getMenuForCity(city);
  const cartSet = new Set(cartIds);
  const historySet = new Set(pastOrderItemIds);

  const cartItems = items.filter((item) => cartSet.has(item.id));
  const cartHasMain = cartItems.some(
    (item) =>
      item.category === 'Biryani & Mughlai' ||
      item.category === 'North Indian' ||
      item.category === 'South Indian' ||
      item.category === 'Pizzas & Burgers'
  );
  const cartHasDessertOrChai = cartItems.some((item) => item.category === 'Desserts & Chai');

  let mealSlot = 'Dinner';
  let preferredCategories = ['Biryani & Mughlai', 'North Indian', 'Pizzas & Burgers'];
  if (hour >= 5 && hour < 11) {
    mealSlot = 'Breakfast';
    preferredCategories = ['South Indian', 'Desserts & Chai'];
  } else if (hour >= 11 && hour < 16) {
    mealSlot = 'Lunch';
    preferredCategories = ['Biryani & Mughlai', 'North Indian', 'South Indian'];
  } else if (hour >= 16 && hour < 19) {
    mealSlot = 'Evening';
    preferredCategories = ['Street Food & Chaat', 'Desserts & Chai'];
  }

  const scored = items
    .filter((item) => (!vegOnly || item.isVeg) && !cartSet.has(item.id))
    .map((item) => {
      let score = item.rating * 10 + (item.bestseller ? 8 : 0) + Math.max(0, 4 - item.distanceKm) * 2;
      let reason = `Popular near you (${item.distanceKm} km)`;

      if (cartHasMain && !cartHasDessertOrChai && item.category === 'Desserts & Chai') {
        score += 22;
        reason = 'Pairs well with your cart';
      } else if (historySet.has(item.id)) {
        score += 18;
        reason = 'Order again favorite';
      } else if (preferredCategories.includes(item.category)) {
        score += 14;
        reason = `${mealSlot} pick in ${safeCity}`;
      } else if (item.distanceKm <= 1.5) {
        score += 10;
        reason = `Quick nearby delivery (${item.distanceKm} km)`;
      }

      return { ...item, reason, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 4)
    .map(({ _score, ...rest }) => rest);

  return {
    city: safeCity,
    mealSlot,
    recommendations: scored
  };
}
