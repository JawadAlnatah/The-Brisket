import { MenuItem } from '@/store/cartStore';

export const CATEGORIES = ['Main Dishes', 'Salads', 'Appetizers', 'Sauces', 'Soft Drinks'] as const;

export const MENU_ITEMS: MenuItem[] = [
    // Main Dishes
    { id: 'm1', name: 'Smoked Lamb Ribs', price: 45.00, category: 'Main Dishes', image: '/images/menu/smoked-lamb-ribs.png', description: 'Tender, fall-off-the-bone smoked lamb ribs glazed with our signature BBQ sauce.', stock: 0 },
    { id: 'm2', name: 'Smoked Brisket', price: 28.00, category: 'Main Dishes', image: '/images/menu/smoked-brisket.png', description: 'Our famous 18-hour low and slow smoked brisket, sliced to order.', stock: 0 },
    { id: 'm3', name: 'Smoked Lamb Neck', price: 32.00, category: 'Main Dishes', image: '/images/menu/smoked-lamb-neck.png', description: 'Rich, flavorful smoked lamb neck, perfect for meat lovers.', stock: 0 },
    { id: 'm4', name: 'Smoked Lamb Shoulder', price: 35.00, category: 'Main Dishes', image: '/images/menu/smoked-lamb-shoulder.png', description: 'Pulled smoked lamb shoulder, incredibly juicy and savory.', stock: 0 },
    { id: 'm5', name: 'Smoked Lamb Shank', price: 38.00, category: 'Main Dishes', image: '/images/menu/smoked-lamb-shank.png', description: 'Slow-smoked lamb shank, tender meat with a deep smoky flavor.', stock: 0 },

    // Salads
    { id: 's1', name: 'Cucumber with Yogurt', price: 8.00, category: 'Salads', image: '/images/menu/cucumber-yogurt.png', description: 'Refreshing cucumber and yogurt salad with a hint of mint.', stock: 0 },
    { id: 's2', name: 'Tabbouleh', price: 10.00, category: 'Salads', image: '/images/menu/tabbouleh.png', description: 'Traditional parsley salad with tomatoes, mint, onion, and bulgur.', stock: 0 },

    // Appetizers
    { id: 'a1', name: 'Mashed Potatoes', price: 7.00, category: 'Appetizers', image: '/images/menu/mashed-potatoes.png', description: 'Creamy, buttery mashed potatoes, the perfect side.', stock: 0 },
    { id: 'a2', name: 'Moutabal', price: 9.00, category: 'Appetizers', image: '/images/menu/moutabal.png', description: 'Smoky roasted eggplant dip with tahini and lemon.', stock: 0 },
    { id: 'a3', name: 'Hummus', price: 8.00, category: 'Appetizers', image: '/images/menu/hummus.png', description: 'Smooth and creamy chickpea hummus topped with olive oil.', stock: 0 },

    // Sauces
    { id: 'sc1', name: 'Barbecue Sauce', price: 2.00, category: 'Sauces', image: '/images/menu/bbq-sauce.png', description: 'Our signature smoky and tangy BBQ sauce.', stock: 0 },
    { id: 'sc2', name: 'Creamy Mushroom Sauce', price: 3.00, category: 'Sauces', image: '/images/menu/mushroom-sauce.png', description: 'Rich and creamy mushroom sauce.', stock: 0 },
    { id: 'sc3', name: 'Honey', price: 1.50, category: 'Sauces', image: '/images/menu/honey.png', description: 'Pure, sweet natural honey.', stock: 0 },
    { id: 'sc4', name: 'Pomegranate Molasses', price: 2.00, category: 'Sauces', image: '/images/menu/pomegranate-molasses.png', description: 'Tangy and sweet pomegranate molasses.', stock: 0 },
    { id: 'sc5', name: 'Tahini', price: 1.50, category: 'Sauces', image: '/images/menu/tahini.png', description: 'Classic creamy sesame tahini sauce.', stock: 0 },
    { id: 'sc6', name: 'Green Pepper with Lemon', price: 1.50, category: 'Sauces', image: '/images/menu/green-pepper-lemon.png', description: 'Zesty green pepper sauce with a kick of lemon.', stock: 0 },
    { id: 'sc7', name: 'Hot Sauce', price: 1.50, category: 'Sauces', image: '/images/menu/hot-sauce.png', description: 'Spicy chili sauce for those who like heat.', stock: 0 },
    { id: 'sc8', name: 'Chimichurri Sauce', price: 2.50, category: 'Sauces', image: '/images/menu/chimichurri.png', description: 'Herby and garlicky chimichurri sauce.', stock: 0 },

    // Soft Drinks
    { id: 'd1', name: 'Cola', price: 3.00, category: 'Soft Drinks', image: '/images/menu/cola.png', description: 'Classic refreshing slightly fizzy cola.', stock: 0 },
    { id: 'd2', name: 'Lemon', price: 4.00, category: 'Soft Drinks', image: '/images/menu/lemon-drink.png', description: 'Freshly squeezed lemon juice.', stock: 0 },
    { id: 'd3', name: 'Citrus', price: 4.50, category: 'Soft Drinks', image: '/images/menu/citrus-drink.png', description: 'Refreshing mix of citrus fruits.', stock: 0 },
    { id: 'd4', name: 'Orange', price: 4.50, category: 'Soft Drinks', image: '/images/menu/orange-juice.png', description: 'Freshly squeezed orange juice.', stock: 0 },
    { id: 'd5', name: 'Water', price: 2.00, category: 'Soft Drinks', image: '/images/menu/water.png', description: 'Pure refreshing mineral water.', stock: 0 },
];
