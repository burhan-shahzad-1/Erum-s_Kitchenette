import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Leaf, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { useState } from 'react';

// Product data (same as Menu)
const products = [
  {
    id: '1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken, traditional spices, and saffron',
    longDescription: 'Our signature Chicken Biryani is a masterpiece of Pakistani cuisine. Made with premium basmati rice, succulent chicken pieces marinated in yogurt and spices, and layered with fried onions, fresh mint, and saffron. Each grain of rice is perfectly cooked, infused with aromatic spices like cardamom, cinnamon, and bay leaves. Served with cooling raita and spicy mirchi ka salan.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc3MjkxODk3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.8,
    reviewCount: 156,
    isVeg: false,
    isNew: true,
    prepTime: '45-50 min',
    serves: '2-3 people',
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Onions', 'Tomatoes', 'Ginger-Garlic', 'Spices', 'Saffron', 'Mint', 'Ghee'],
  },
  {
    id: '2',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese in a rich, creamy tomato-based gravy',
    longDescription: 'Soft cubes of paneer (cottage cheese) marinated in spices and grilled to perfection, then simmered in a rich, creamy tomato-based gravy. This vegetarian delight is flavored with aromatic spices, fresh cream, and a hint of butter. Perfect with naan or rice.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1707448829764-9474458021ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJpY2V8ZW58MXx8fHwxNzcyOTE4OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.7,
    reviewCount: 134,
    isVeg: true,
    prepTime: '35-40 min',
    serves: '2 people',
    ingredients: ['Paneer', 'Tomatoes', 'Onions', 'Cream', 'Butter', 'Spices', 'Ginger-Garlic', 'Kasuri Methi'],
  },
  {
    id: '3',
    name: 'Samosa (6 pcs)',
    description: 'Crispy pastry filled with spiced potatoes and peas, served with chutney',
    longDescription: 'Golden, crispy samosas filled with a delicious mixture of spiced potatoes, peas, and aromatic herbs. Each samosa is carefully hand-folded and deep-fried to perfection. Served with tangy tamarind chutney and spicy green chutney. A perfect tea-time snack!',
    price: 350,
    image: 'https://images.unsplash.com/photo-1697155836252-d7f969108b5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1vc2ElMjBzbmFjayUyMGluZGlhbnxlbnwxfHx8fDE3NzI4MTg5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.9,
    reviewCount: 203,
    isVeg: true,
    isNew: true,
    prepTime: '20-25 min',
    serves: '2-3 people',
    ingredients: ['Potatoes', 'Peas', 'Flour', 'Spices', 'Coriander', 'Cumin', 'Garam Masala'],
  },
  {
    id: '4',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked with butter and aromatic spices',
    longDescription: 'A rich and creamy North Indian delicacy made with black lentils and kidney beans, slow-cooked overnight with butter, cream, and aromatic spices. This indulgent dish gets its velvety texture from hours of patient cooking. Best enjoyed with naan or jeera rice.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1625874740599-4ba5ba56610e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGZvb2QlMjBwbGF0ZSUyMGZyZXNofGVufDF8fHx8MTc3MjkxODk3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.6,
    reviewCount: 98,
    isVeg: true,
    prepTime: '60-70 min',
    serves: '2-3 people',
    ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream', 'Tomatoes', 'Ginger-Garlic', 'Spices'],
  },
  {
    id: '5',
    name: 'Gulab Jamun (4 pcs)',
    description: 'Soft, spongy milk dumplings soaked in rose-flavored sugar syrup',
    longDescription: 'Traditional Pakistani dessert made from milk solids, shaped into soft balls, deep-fried until golden, and soaked in fragrant sugar syrup infused with cardamom and rose water. These melt-in-your-mouth dumplings are the perfect ending to any meal.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1730461202383-0333c5e3bee8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0cyUyMGhvbWVtYWRlJTIwc3dlZXR8ZW58MXx8fHwxNzcyOTE4OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    rating: 4.8,
    reviewCount: 167,
    isVeg: true,
    prepTime: '25-30 min',
    serves: '2-4 people',
    ingredients: ['Milk Powder', 'Flour', 'Sugar', 'Rose Water', 'Cardamom', 'Ghee'],
  },
  {
    id: '6',
    name: 'Frozen Paratha Pack (10 pcs)',
    description: 'Ready-to-cook layered flatbreads, perfect for quick meals',
    longDescription: 'Authentic homemade parathas, perfectly layered and ready to cook. Just heat on a tawa for 2-3 minutes and enjoy fresh, hot parathas anytime. Perfect for busy mornings or quick meals. Made with whole wheat flour and ghee for that traditional taste and flaky texture.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1749062878896-232c096ad158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBtZWFsJTIwcHJlcGFyYXRpb258ZW58MXx8fHwxNzcyOTE4OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Frozen Meals',
    rating: 4.5,
    reviewCount: 89,
    isVeg: true,
    prepTime: '2-3 min',
    serves: '5 people',
    ingredients: ['Whole Wheat Flour', 'Ghee', 'Salt', 'Water'],
  },
  {
    id: '7',
    name: 'Mix Veg Curry',
    description: 'Fresh seasonal vegetables in a flavorful spiced gravy',
    longDescription: 'A wholesome curry made with fresh seasonal vegetables including carrots, beans, peas, cauliflower, and potatoes, cooked in a flavorful tomato and onion-based gravy with aromatic spices. Healthy, delicious, and packed with nutrition.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1625874740599-4ba5ba56610e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGZvb2QlMjBwbGF0ZSUyMGZyZXNofGVufDF8fHx8MTc3MjkxODk3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.4,
    reviewCount: 76,
    isVeg: true,
    prepTime: '30-35 min',
    serves: '2 people',
    ingredients: ['Mixed Vegetables', 'Tomatoes', 'Onions', 'Spices', 'Ginger-Garlic', 'Fresh Coriander'],
  },
  {
    id: '8',
    name: 'Aloo Tikki Chaat',
    description: 'Crispy potato patties topped with yogurt, chutneys, and spices',
    longDescription: 'Crispy, golden potato patties (tikkis) topped with creamy yogurt, tangy tamarind chutney, spicy green chutney, and a sprinkle of chaat masala. Garnished with fresh coriander, pomegranate seeds, and crispy sev. A burst of flavors in every bite!',
    price: 400,
    image: 'https://images.unsplash.com/photo-1723110565328-9dbeef603d19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc25hY2tzJTIwdmFyaWV0eXxlbnwxfHx8fDE3NzI5MTg5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.7,
    reviewCount: 142,
    isVeg: true,
    prepTime: '25-30 min',
    serves: '1-2 people',
    ingredients: ['Potatoes', 'Yogurt', 'Tamarind Chutney', 'Green Chutney', 'Spices', 'Sev', 'Pomegranate'],
  },
];

// Reviews data for each product
const reviewsData: Record<string, Array<{
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}>> = {
  '1': [
    { id: '1-1', userName: 'Fatima Ahmed', rating: 5, date: 'March 10, 2026', comment: 'Best biryani I\'ve had in Lahore! The chicken was so tender and the rice perfectly cooked. Will definitely order again!', verified: true },
    { id: '1-2', userName: 'Ahmed Hassan', rating: 5, date: 'March 8, 2026', comment: 'Absolutely delicious! Reminds me of my grandmother\'s biryani. The portions are generous too.', verified: true },
    { id: '1-3', userName: 'Sara Khan', rating: 4, date: 'March 5, 2026', comment: 'Really good biryani, though I prefer it a bit more spicy. But the quality is top-notch!', verified: true },
  ],
  '2': [
    { id: '2-1', userName: 'Zainab Ali', rating: 5, date: 'March 12, 2026', comment: 'As a vegetarian, this is my go-to dish! The paneer is so soft and the gravy is creamy perfection.', verified: true },
    { id: '2-2', userName: 'Hamza Sheikh', rating: 4, date: 'March 9, 2026', comment: 'Very good! My wife loved it. The portion size could be a bit larger though.', verified: true },
    { id: '2-3', userName: 'Ayesha Siddiqui', rating: 5, date: 'March 6, 2026', comment: 'Delicious! The spices are perfectly balanced. Highly recommend!', verified: true },
  ],
  '3': [
    { id: '3-1', userName: 'Usman Tariq', rating: 5, date: 'March 13, 2026', comment: 'Best samosas ever! Crispy outside, perfectly spiced filling. The chutneys are amazing!', verified: true },
    { id: '3-2', userName: 'Hina Rashid', rating: 5, date: 'March 11, 2026', comment: 'These samosas are exactly like my mom makes! Love them!', verified: true },
    { id: '3-3', userName: 'Farhan Iqbal', rating: 5, date: 'March 8, 2026', comment: 'Perfect tea-time snack. Ordered twice already this week!', verified: true },
    { id: '3-4', userName: 'Mariam Noor', rating: 4, date: 'March 4, 2026', comment: 'Really tasty! Would be perfect if they were a bit larger.', verified: true },
  ],
  '4': [
    { id: '4-1', userName: 'Ali Raza', rating: 5, date: 'March 10, 2026', comment: 'The dal is so creamy and rich! You can taste the hours of slow cooking. Absolutely worth it!', verified: true },
    { id: '4-2', userName: 'Sana Malik', rating: 4, date: 'March 7, 2026', comment: 'Very good dal makhani. Tastes authentic. Pairs well with naan.', verified: true },
    { id: '4-3', userName: 'Kashif Ahmed', rating: 5, date: 'March 3, 2026', comment: 'Best dal makhani in Karachi! The texture is perfect and it\'s not too heavy.', verified: true },
  ],
  '5': [
    { id: '5-1', userName: 'Rabia Khan', rating: 5, date: 'March 12, 2026', comment: 'These gulab jamuns literally melt in your mouth! Perfect sweetness level.', verified: true },
    { id: '5-2', userName: 'Imran Sadiq', rating: 5, date: 'March 9, 2026', comment: 'Ordered for a party and everyone loved them! Fresh and delicious!', verified: true },
    { id: '5-3', userName: 'Nida Hassan', rating: 5, date: 'March 6, 2026', comment: 'Best gulab jamun I\'ve had! Not too sweet, just perfect.', verified: true },
    { id: '5-4', userName: 'Talha Baig', rating: 4, date: 'March 2, 2026', comment: 'Very good! Wish there were more pieces in the pack though.', verified: true },
  ],
  '6': [
    { id: '6-1', userName: 'Sadaf Aziz', rating: 5, date: 'March 11, 2026', comment: 'These parathas are a lifesaver for busy mornings! Taste just like homemade!', verified: true },
    { id: '6-2', userName: 'Nabeel Shah', rating: 4, date: 'March 8, 2026', comment: 'Good quality frozen parathas. Very convenient and tasty.', verified: true },
    { id: '6-3', userName: 'Laiba Awan', rating: 5, date: 'March 4, 2026', comment: 'Perfect for quick breakfast! My kids love them.', verified: true },
  ],
  '7': [
    { id: '7-1', userName: 'Zunair Ali', rating: 4, date: 'March 10, 2026', comment: 'Healthy and delicious! All vegetables are fresh and well-cooked.', verified: true },
    { id: '7-2', userName: 'Amna Siddiqui', rating: 5, date: 'March 7, 2026', comment: 'Love this curry! It\'s my go-to healthy meal option.', verified: true },
    { id: '7-3', userName: 'Shehryar Khan', rating: 4, date: 'March 3, 2026', comment: 'Good vegetable curry. Tastes homemade and fresh.', verified: true },
  ],
  '8': [
    { id: '8-1', userName: 'Aliza Tariq', rating: 5, date: 'March 13, 2026', comment: 'Amazing aloo tikki chaat! All the flavors come together perfectly!', verified: true },
    { id: '8-2', userName: 'Danish Mirza', rating: 5, date: 'March 10, 2026', comment: 'This is street food done right! Hygienic and delicious!', verified: true },
    { id: '8-3', userName: 'Mahnoor Sheikh', rating: 4, date: 'March 6, 2026', comment: 'Really tasty! The tikkis are crispy and the chutneys are perfect.', verified: true },
    { id: '8-4', userName: 'Saad Rauf', rating: 5, date: 'March 2, 2026', comment: 'Best chaat I\'ve had! Worth every rupee.', verified: true },
  ],
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);
  const reviews = reviewsData[id || ''] || [];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/menu">
            <Button>Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/menu')}
            className="gap-2 hover:bg-orange-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <Card className="overflow-hidden border-2 border-orange-100">
              <div className="relative aspect-square">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    NEW
                  </div>
                )}
                {product.isVeg && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <Leaf className="w-6 h-6" />
                  </div>
                )}
              </div>
            </Card>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="border-orange-100">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Prep Time</p>
                  <p className="font-semibold text-sm">{product.prepTime}</p>
                </CardContent>
              </Card>
              <Card className="border-orange-100">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Serves</p>
                  <p className="font-semibold text-sm">{product.serves}</p>
                </CardContent>
              </Card>
              <Card className="border-orange-100">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="font-semibold text-sm">{product.rating}/5</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
              <span className="text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-orange-600">Rs. {product.price}</div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients?.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors font-bold text-lg"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-xl shadow-orange-200 text-lg py-6"
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                Add to Cart - Rs. {product.price * quantity}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-300 hover:bg-orange-50"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-300 hover:bg-orange-50"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-orange-100">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b-2 border-orange-100">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                Customer Reviews
              </h2>
              <p className="text-gray-600 mt-2">
                {product.reviewCount} verified reviews from our customers
              </p>
            </div>

            <CardContent className="p-8">
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {review.userName}
                              {review.verified && (
                                <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-13">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}