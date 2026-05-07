/**
 * Kitchenette Database Seed Script
 * Run from the backend folder: npx ts-node seed.ts
 *
 * Creates:
 *  - 1 owner / admin account
 *  - 5 sample customer accounts
 *  - ~45 Pakistani food items (+ a few continental)
 *  - 15 sample orders with varied statuses
 *  - Sample reviews
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

import { UserModel } from './src/infrastructure/adapters/db/models/UserModel';
import { FoodItemModel } from './src/infrastructure/adapters/db/models/FoodItemModel';
import { OrderModel } from './src/infrastructure/adapters/db/models/OrderModel';
import { ReviewModel } from './src/infrastructure/adapters/db/models/ReviewModel';
import { CartModel } from './src/infrastructure/adapters/db/models/CartModel';
import { DeliveryAreaModel } from './src/infrastructure/adapters/db/models/DeliveryAreaModel';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env');
  process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const hash = (pw: string) => bcrypt.hash(pw, 10);

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: readonly T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Users ───────────────────────────────────────────────────────────────────

const ownerData = {
  name: 'Kitchenette Admin',
  email: 'admin@kitchenette.com',
  password: 'Admin@1234',
  role: 'owner' as const,
  phone: '0300-1234567',
  address: 'Kitchenette HQ, Gulberg III, Lahore',
};

const customersData = [
  {
    name: 'Ahmed Raza',
    email: 'ahmed.raza@gmail.com',
    password: 'Customer@1234',
    role: 'customer' as const,
    phone: '0311-2345678',
    address: 'House 12, Street 5, DHA Phase 5, Lahore',
  },
  {
    name: 'Sara Khan',
    email: 'sara.khan@gmail.com',
    password: 'Customer@1234',
    role: 'customer' as const,
    phone: '0321-3456789',
    address: 'Flat 3B, Gulshan-e-Iqbal, Karachi',
  },
  {
    name: 'Bilal Mahmood',
    email: 'bilal.mahmood@yahoo.com',
    password: 'Customer@1234',
    role: 'customer' as const,
    phone: '0333-4567890',
    address: 'Plot 45, F-7/2, Islamabad',
  },
  {
    name: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@outlook.com',
    password: 'Customer@1234',
    role: 'customer' as const,
    phone: '0345-5678901',
    address: 'House 8, Model Town, Lahore',
  },
  {
    name: 'Usman Tariq',
    email: 'usman.tariq@gmail.com',
    password: 'Customer@1234',
    role: 'customer' as const,
    phone: '0312-6789012',
    address: 'Apartment 201, Clifton Block 4, Karachi',
  },
];

// ─── Food Items ──────────────────────────────────────────────────────────────
// categories allowed by schema: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'snack' | 'other'

type FoodCategory = 'appetizer' | 'main' | 'dessert' | 'beverage' | 'snack' | 'other';

interface FoodSeed {
  title: string;
  description: string;
  price: number;
  category: FoodCategory;
  imageUrl: string;
  isAvailable: boolean;
}

const foodItems: FoodSeed[] = [
  // ── Biryani (main) ──────────────────────────────────────────────────────
  {
    title: 'Chicken Biryani',
    description: 'Fragrant basmati rice layered with tender chicken, whole spices, fried onions, and fresh mint. A Kitchenette classic.',
    price: 350,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Mutton Biryani',
    description: 'Slow-cooked mutton on the bone, dum-cooked with aged basmati and aromatic whole spices. Rich and deeply flavourful.',
    price: 550,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Beef Biryani',
    description: 'Tender beef pieces marinated in yogurt and spices, layered with saffron-infused basmati rice.',
    price: 450,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Prawn Biryani',
    description: 'Juicy prawns tossed in a spiced masala and layered with delicate basmati rice. A coastal Pakistani favourite.',
    price: 650,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Vegetable Biryani',
    description: 'A hearty medley of seasonal vegetables cooked with fragrant basmati, whole spices, and caramelised onions.',
    price: 280,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
    isAvailable: true,
  },

  // ── Karahi & Curries (main) ─────────────────────────────────────────────
  {
    title: 'Chicken Karahi',
    description: 'Wok-cooked chicken in a rich tomato-ginger base with green chillies and fresh coriander. Serves 2.',
    price: 900,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Mutton Karahi',
    description: 'Bone-in mutton pieces slow-cooked in a spiced tomato and onion gravy in a traditional iron wok. Serves 2.',
    price: 1400,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Beef Karahi',
    description: 'Tender beef in a dry-style karahi with roasted spices, crushed black pepper, and ginger julienne.',
    price: 1100,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Chicken Handi',
    description: 'Creamy yogurt-based chicken curry slow-cooked in a clay pot with aromatic spices and butter.',
    price: 700,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Palak Gosht',
    description: 'Slow-braised mutton in a vibrant spinach and tomato curry. Rustic, earthy, and deeply satisfying.',
    price: 600,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Aloo Gosht',
    description: 'A homestyle stew of mutton and potatoes simmered low and slow in an onion-tomato masala.',
    price: 500,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Dal Makhani',
    description: 'Black lentils and kidney beans simmered overnight with butter, cream, and smoky whole spices.',
    price: 320,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500&q=80',
    isAvailable: true,
  },

  // ── BBQ & Grills (appetizer) ────────────────────────────────────────────
  {
    title: 'Chicken Tikka',
    description: 'Bone-in chicken pieces marinated in spiced yogurt, chargrilled over coal for a smoky finish. Served with naan and chutney.',
    price: 650,
    category: 'appetizer',
    imageUrl: 'https://images.unsplash.com/photo-1529042355636-0d6e9e41ba21?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Seekh Kebab',
    description: 'Minced beef blended with herbs and spices, shaped onto skewers and grilled over open flame. 6 pieces per portion.',
    price: 550,
    category: 'appetizer',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Boti Kebab',
    description: 'Cubed beef marinated in raw papaya and spices, grilled until juicy and tender. A Lahori BBQ staple.',
    price: 700,
    category: 'appetizer',
    imageUrl: 'https://images.unsplash.com/photo-1529042355636-0d6e9e41ba21?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Reshmi Kebab',
    description: 'Silky smooth chicken mince kebabs with cream, cashew paste, and cardamom. Melt-in-the-mouth texture.',
    price: 620,
    category: 'appetizer',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Malai Boti',
    description: 'Boneless chicken cubes marinated in a creamy cashew-yogurt mix, grilled to perfection. 8 pieces per portion.',
    price: 720,
    category: 'appetizer',
    imageUrl: 'https://images.unsplash.com/photo-1529042355636-0d6e9e41ba21?w=500&q=80',
    isAvailable: true,
  },

  // ── Nihari & Haleem (main) ──────────────────────────────────────────────
  {
    title: 'Beef Nihari',
    description: 'Slow-simmered beef shank in a deeply spiced broth, topped with fried onions, ginger, and lemon. A Mughal-era delicacy.',
    price: 450,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Mutton Haleem',
    description: 'Slow-cooked mutton and lentils pounded to a thick, silky consistency. Garnished with fried onions, green chilli, and lemon.',
    price: 420,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Chicken Haleem',
    description: 'A lighter take on the classic — slow-cooked chicken and lentil porridge, spiced and garnished traditionally.',
    price: 360,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Paya (Trotters)',
    description: 'Traditional lamb trotters slow-cooked overnight in a rich bone broth with whole spices. Best enjoyed with naan.',
    price: 520,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
    isAvailable: true,
  },

  // ── Rice Dishes (main) ──────────────────────────────────────────────────
  {
    title: 'Yakhni Pulao',
    description: 'Fragrant basmati rice cooked in a rich chicken bone broth with whole spices. Simple, aromatic, and comforting.',
    price: 420,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Matar Pulao',
    description: 'Basmati rice cooked with tender green peas, whole spices, and caramelised onions.',
    price: 280,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Kabuli Pulao',
    description: 'An Afghan-inspired pulao with slow-cooked lamb, sweet raisins, and matchstick carrots over tender basmati.',
    price: 520,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Zeera Rice',
    description: 'Simple yet flavourful cumin-tempered basmati rice. The perfect accompaniment to any curry.',
    price: 220,
    category: 'main',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
    isAvailable: true,
  },

  // ── Snacks & Starters (snack) ───────────────────────────────────────────
  {
    title: 'Aloo Samosa',
    description: 'Golden, crispy pastry filled with spiced potato and peas. Served with tamarind and mint chutney. 3 pieces.',
    price: 120,
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Chicken Spring Rolls',
    description: 'Crispy rolls filled with shredded spiced chicken and vegetables. Served with sweet chilli sauce. 4 pieces.',
    price: 180,
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Dahi Puri',
    description: 'Crispy hollow puris filled with spiced potato, chickpeas, yogurt, tamarind chutney, and sev. 6 pieces.',
    price: 160,
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Papri Chaat',
    description: 'Tangy, sweet, and spicy chaat with papri, chickpeas, potato, yogurt, and chutneys. A street food favourite.',
    price: 200,
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Mix Pakora',
    description: 'Assorted vegetable fritters — onion, spinach, potato, and chilli — deep-fried in a spiced gram flour batter.',
    price: 150,
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Gol Gappay',
    description: 'Classic hollow puris served with tamarind water, spiced chickpeas, and potato filling. 8 puris per portion.',
    price: 120,
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
    isAvailable: true,
  },

  // ── Desserts & Sweets (dessert) ─────────────────────────────────────────
  {
    title: 'Gulab Jamun',
    description: 'Soft, spongy milk-solid dumplings soaked in rose-scented sugar syrup. Served warm. 4 pieces.',
    price: 160,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Kheer',
    description: 'Traditional Pakistani rice pudding slow-cooked with full-fat milk, sugar, cardamom, and topped with pistachios.',
    price: 190,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Gajar Halwa',
    description: 'Slow-cooked carrot pudding with ghee, full cream milk, sugar, and cardamom. Garnished with khoya and nuts.',
    price: 220,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Sheer Khurma',
    description: 'A festive vermicelli pudding made with milk, dates, dry fruits, and rose water. Creamy and indulgent.',
    price: 240,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Zarda',
    description: 'Sweet saffron rice cooked with sugar, ghee, nuts, and raisins. A celebratory Pakistani classic.',
    price: 200,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Firni',
    description: 'Chilled ground rice pudding set in earthen bowls, flavoured with cardamom and topped with crushed pistachios.',
    price: 170,
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    isAvailable: true,
  },

  // ── Drinks (beverage) ───────────────────────────────────────────────────
  {
    title: 'Sweet Lassi',
    description: 'Thick, creamy blended yogurt sweetened with sugar and a hint of cardamom. Topped with malai.',
    price: 130,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Salted Lassi',
    description: 'Refreshing blended yogurt with rock salt, cumin, and fresh mint. The classic Pakistani cooler.',
    price: 110,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Rooh Afza Sharbat',
    description: 'The iconic rose-flavoured syrup diluted in cold water with fresh lemon. A Pakistani summer essential.',
    price: 90,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Kashmiri Chai',
    description: 'Pink salted tea brewed with special Kashmiri leaves, topped with cream and crushed pistachios.',
    price: 160,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Mango Shake',
    description: 'Fresh Sindhri mango blended with chilled full-fat milk and a touch of sugar. Thick and luscious.',
    price: 190,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Lemon Soda',
    description: 'Fresh lemon juice with sparkling water, mint, rock salt, and black pepper. Light and zingy.',
    price: 90,
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
    isAvailable: true,
  },

  // ── Continental / Other cuisines (other) ────────────────────────────────
  {
    title: 'Grilled Chicken Burger',
    description: 'Juicy grilled chicken fillet with crispy lettuce, tomato, pickles, and garlic mayo in a toasted brioche bun.',
    price: 380,
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Club Sandwich',
    description: 'Triple-decker toasted sandwich with chicken, egg, cheese, lettuce, and tomato. Served with fries.',
    price: 320,
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Creamy Chicken Pasta',
    description: 'Penne pasta in a creamy white sauce with grilled chicken strips, mushrooms, and herbs.',
    price: 420,
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80',
    isAvailable: true,
  },
  {
    title: 'Loaded French Fries',
    description: 'Crispy golden fries topped with spiced beef mince, melted cheese, jalapeños, and garlic sauce.',
    price: 280,
    category: 'other',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80',
    isAvailable: true,
  },
];

// ─── Review comments pool ─────────────────────────────────────────────────────

const reviewComments: Record<number, string[]> = {
  5: [
    'Absolutely delicious! Reminded me of my mom\'s cooking. Will definitely order again.',
    'Best biryani I\'ve had from a delivery app. Authentic flavours, generous portion.',
    'Outstanding! The spice level was perfect and it arrived hot. 10/10.',
    'Incredible taste and great packaging. Highly recommended!',
    'This is genuinely restaurant-quality food. Blown away.',
  ],
  4: [
    'Really good, the flavours were spot on. Just a tiny bit less spicy than I\'d like.',
    'Tasty and well-portioned. Delivery was prompt too.',
    'Great food overall. Would have been 5 stars but arrived a bit cold.',
    'Very satisfying meal. Will order again.',
    'Good quality and authentic taste. Happy with the experience.',
  ],
  3: [
    'Decent food but nothing extraordinary. Good for the price.',
    'Average taste. Expected more flavour given the reviews.',
    'OK but the portion was a bit small.',
    'It was alright. Not bad, not amazing.',
  ],
};

// ─── Main seed function ───────────────────────────────────────────────────────

async function seed() {
  console.log('🌱  Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI!);
  console.log('✅  Connected.\n');

  // ── Clear existing data ──────────────────────────────────────────────────
  console.log('🗑️   Clearing existing data...');
  await Promise.all([
    UserModel.deleteMany({}),
    FoodItemModel.deleteMany({}),
    OrderModel.deleteMany({}),
    ReviewModel.deleteMany({}),
    CartModel.deleteMany({}),
  ]);
  console.log('✅  Collections cleared.\n');

  // ── Create owner ────────────────────────────────────────────────────────
  console.log('👤  Creating owner account...');
  const ownerPassword = await hash(ownerData.password);
  const owner = await UserModel.create({ ...ownerData, password: ownerPassword });
  console.log(`    ✅  Owner: ${owner.email}  |  password: ${ownerData.password}`);

  // ── Create customers ─────────────────────────────────────────────────────
  console.log('\n👥  Creating customer accounts...');
  const customers = await Promise.all(
    customersData.map(async (c) => {
      const pw = await hash(c.password);
      const user = await UserModel.create({ ...c, password: pw });
      console.log(`    ✅  ${user.email}  |  password: ${c.password}`);
      return user;
    }),
  );

  // ── Create food items ────────────────────────────────────────────────────
  console.log('\n🍽️   Creating food items...');
  const createdFoodItems = await Promise.all(
    foodItems.map((item) =>
      FoodItemModel.create({ ...item, ownerId: owner._id.toString() }),
    ),
  );
  console.log(`    ✅  ${createdFoodItems.length} food items created.`);

  // ── Create orders ────────────────────────────────────────────────────────
  console.log('\n📦  Creating sample orders...');

  const orderStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] as Array<'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'>;
  const paymentStatuses = ['pending', 'paid', 'failed'] as Array<'pending' | 'paid' | 'failed'>;

  const sampleOrders = [];

  for (let i = 0; i < 15; i++) {
    const customer = pickRandom(customers);
    const itemCount = randomInt(1, 4);
    const selectedItems = pickMany(createdFoodItems, itemCount);

    const orderItems = selectedItems.map((fi) => ({
      foodItemId: fi._id.toString(),
      title: fi.title,
      price: fi.price,
      quantity: randomInt(1, 3),
    }));

    const totalAmount = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const status = pickRandom(orderStatuses);
    const paymentStatus: 'pending' | 'paid' | 'failed' =
      status === 'delivered' ? 'paid' :
      status === 'cancelled' ? pickRandom(['pending', 'failed'] as Array<'pending' | 'failed'>) :
      'pending';

    const order = await OrderModel.create({
      userId: customer._id.toString(),
      items: orderItems,
      totalAmount,
      status,
      paymentStatus,
      deliveryAddress: customer.address ?? 'Lahore, Pakistan',
      notes: i % 3 === 0 ? 'Please ring the bell twice.' : undefined,
    });

    sampleOrders.push(order);
  }

  console.log(`    ✅  ${sampleOrders.length} orders created.`);

  // ── Create reviews ────────────────────────────────────────────────────────
  console.log('\n⭐  Creating sample reviews...');

  const reviewedPairs = new Set<string>();
  let reviewCount = 0;

  // Each customer reviews 4-6 random food items
  for (const customer of customers) {
    const itemsToReview = pickMany(createdFoodItems, randomInt(4, 6));

    for (const foodItem of itemsToReview) {
      const pairKey = `${customer._id}-${foodItem._id}`;
      if (reviewedPairs.has(pairKey)) continue;
      reviewedPairs.add(pairKey);

      const rating = pickRandom([5, 5, 5, 4, 4, 3]) as 3 | 4 | 5;
      const comment = pickRandom(reviewComments[rating]);

      await ReviewModel.create({
        userId: customer._id.toString(),
        foodItemId: foodItem._id.toString(),
        rating,
        comment,
      });

      reviewCount++;
    }
  }

  console.log(`    ✅  ${reviewCount} reviews created.`);

  // ── Delivery Areas ────────────────────────────────────────────────────────
  console.log('\n⏳  Seeding delivery areas…');
  await DeliveryAreaModel.deleteMany({});
  await DeliveryAreaModel.insertMany([
    { name: 'Johar Town',   minOrder: 500, deliveryCharge: 100, isActive: true },
    { name: 'DHA Phase 5',  minOrder: 700, deliveryCharge: 150, isActive: true },
    { name: 'Gulberg',      minOrder: 600, deliveryCharge: 120, isActive: true },
    { name: 'Model Town',   minOrder: 500, deliveryCharge: 100, isActive: true },
    { name: 'Bahria Town',  minOrder: 800, deliveryCharge: 200, isActive: false },
  ]);
  console.log('    ✅  Delivery areas created.');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────');
  console.log('🎉  Seed complete!');
  console.log('─────────────────────────────────────────────');
  console.log(`  Users      : ${1 + customers.length} (1 owner + ${customers.length} customers)`);
  console.log(`  Food items : ${createdFoodItems.length}`);
  console.log(`  Orders     : ${sampleOrders.length}`);
  console.log(`  Reviews    : ${reviewCount}`);
  console.log('─────────────────────────────────────────────');
  console.log('\n📋  Login credentials:');
  console.log(`  Owner    → ${ownerData.email}  /  ${ownerData.password}`);
  console.log(`  Customer → ${customersData[0].email}  /  ${customersData[0].password}`);
  console.log('─────────────────────────────────────────────\n');

  await mongoose.disconnect();
  console.log('👋  Disconnected from MongoDB. All done!');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
