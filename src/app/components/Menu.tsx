import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Plus, Heart, ShoppingBag, Sparkles, TrendingUp, Award, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'sonner';
import { ImageWithFallback } from './ImageWithFallback';
import { EmptyState } from './LoadingSpinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Link } from 'react-router';
import { Leaf } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isVeg: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSpecial?: boolean;
  story?: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Lahori Chicken Biryani',
    description: 'Aromatic basmati rice layered with tender chicken, traditional Lahori spices, and saffron',
    price: 850,
    image: 'https://images.unsplash.com/photo-1652545296882-cf7f118c4df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYmlyeWFuaSUyMHBsYXRlJTIwcGFraXN0YW5pfGVufDF8fHx8MTc3MzUxMjYyMHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.9,
    isVeg: false,
    isBestSeller: true,
    isNew: true,
    story: 'A classic Lahori recipe passed down through generations, featuring perfectly balanced spices and tender meat.',
  },
  {
    id: '2',
    name: 'Mutton Nihari',
    description: 'Slow-cooked mutton stew with aromatic spices, served with naan',
    price: 950,
    image: 'https://images.unsplash.com/photo-1586981114766-708f09a71e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXR0b24lMjBuaWhhcmklMjBwYWtpc3RhbmklMjBzdGV3fGVufDF8fHx8MTc3MzUxMzg4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.9,
    isVeg: false,
    isBestSeller: true,
    story: 'Traditional overnight slow-cooked nihari, a breakfast favorite in Lahore\'s old city.',
  },
  {
    id: '3',
    name: 'Chicken Karahi',
    description: 'Wok-tossed chicken with tomatoes, green chilies, and fresh ginger',
    price: 800,
    image: 'https://images.unsplash.com/photo-1603496987351-f84a3ba5ec85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc3MzUxMjYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.8,
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: '4',
    name: 'Chapli Kebab (4 pcs)',
    description: 'Spicy minced meat patties from Peshawar, pan-fried to perfection',
    price: 650,
    image: 'https://images.unsplash.com/photo-1697155836215-425794e792cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFwbGklMjBrZWJhYiUyMHBsYXRlfGVufDF8fHx8MTc3MzUxMjYyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.8,
    isVeg: false,
    isSpecial: true,
  },
  {
    id: '5',
    name: 'Seekh Kebab (6 pcs)',
    description: 'Grilled minced meat skewers with traditional Pakistani spices',
    price: 700,
    image: 'https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGtlYmFiJTIwZ3JpbGxlZHxlbnwxfHx8fDE3NzM1MTI2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.7,
    isVeg: false,
  },
  {
    id: '6',
    name: 'Chicken Tikka Masala',
    description: 'Grilled chicken in a rich, creamy tomato-based gravy with aromatic spices',
    price: 750,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwdGlra2ElMjBtYXNhbGF8ZW58MXx8fHwxNzczNDEzMDE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.7,
    isVeg: false,
  },
  {
    id: '7',
    name: 'Butter Chicken',
    description: 'Tender chicken in creamy butter tomato sauce with kashmiri spices',
    price: 780,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjaGlja2VuJTIwY3Vycnl8ZW58MXx8fHwxNzczNTA1NzMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.8,
    isVeg: false,
  },
  {
    id: '8',
    name: 'Palak Paneer',
    description: 'Cottage cheese in creamy spinach gravy with traditional spices',
    price: 600,
    image: 'https://images.unsplash.com/photo-1767114915936-745dd372f1d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhayUyMHBhbmVlciUyMGluZGlhbnxlbnwxfHx8fDE3NzM1MTI2MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.6,
    isVeg: true,
  },
  {
    id: '9',
    name: 'Chicken Korma',
    description: 'Mild, creamy chicken curry with yogurt, almonds and aromatic spices',
    price: 720,
    image: 'https://images.unsplash.com/photo-1748012199673-d990c72aaa57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwa29ybWElMjBjdXJyeSUyMGNyZWFteSUyMHdoaXRlfGVufDF8fHx8MTc3MzUxMzg4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.7,
    isVeg: false,
  },
  {
    id: '10',
    name: 'Aloo Keema',
    description: 'Spiced minced meat with potatoes, a homestyle Pakistani favorite',
    price: 550,
    image: 'https://images.unsplash.com/photo-1597387216134-81e3c0e69b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9vJTIwa2VlbWElMjBtaW5jZWQlMjBtZWF0JTIwcG90YXRvJTIwY3Vycnl8ZW58MXx8fHwxNzczNTEzODc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.6,
    isVeg: false,
  },
  {
    id: '11',
    name: 'Mixed Vegetable Curry',
    description: 'Fresh seasonal vegetables in a flavorful spiced gravy',
    price: 450,
    image: 'https://images.unsplash.com/photo-1586981114766-708f09a71e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhlZCUyMHZlZ2V0YWJsZSUyMGN1cnJ5fGVufDF8fHx8MTc3MzUxMjYzMHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.5,
    isVeg: true,
  },
  {
    id: '12',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked with butter and aromatic spices',
    price: 500,
    image: 'https://images.unsplash.com/photo-1767114915989-c6ab3c8fc42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjBsZW50aWwlMjBjdXJyeXxlbnwxfHx8fDE3NzM1MTI2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.7,
    isVeg: true,
  },
  {
    id: '13',
    name: 'Chicken Pulao',
    description: 'Fragrant rice cooked with chicken, whole spices and herbs',
    price: 700,
    image: 'https://images.unsplash.com/photo-1716801551616-c458ec2a9b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcHVsYW8lMjByaWNlJTIwcGlsYWYlMjBhcm9tYXRpY3xlbnwxfHx8fDE3NzM1MTM4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.6,
    isVeg: false,
  },
  {
    id: '14',
    name: 'Chicken Fried Rice',
    description: 'Wok-tossed rice with vegetables and tender chicken pieces',
    price: 550,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwZnJpZWQlMjByaWNlfGVufDF8fHx8MTc3MzUxMjYzMHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Main Course',
    rating: 4.5,
    isVeg: false,
  },
  {
    id: '15',
    name: 'Samosa (6 pcs)',
    description: 'Crispy pastry filled with spiced potatoes and peas, served with chutney',
    price: 300,
    image: 'https://images.unsplash.com/photo-1591465619339-60fce055bc82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1vc2ElMjBjaHV0bmV5fGVufDF8fHx8MTc3MzUxMjYyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.9,
    isVeg: true,
    isBestSeller: true,
  },
  {
    id: '16',
    name: 'Vegetable Pakora',
    description: 'Mixed vegetable fritters in spiced gram flour batter, crispy fried',
    price: 250,
    image: 'https://images.unsplash.com/photo-1666190091191-0cd0c5c8c5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtvcmElMjBmcml0dGVyc3xlbnwxfHx8fDE3NzM1MTI2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.7,
    isVeg: true,
  },
  {
    id: '17',
    name: 'Spring Rolls (6 pcs)',
    description: 'Crispy rolls filled with vegetables and chicken, served with sauce',
    price: 400,
    image: 'https://images.unsplash.com/photo-1610505127058-2ed68ad7d21e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMGZyaWVkfGVufDF8fHx8MTc3MzUxMjYyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.6,
    isVeg: false,
  },
  {
    id: '18',
    name: 'Spicy Chicken Wings (8 pcs)',
    description: 'Marinated chicken wings with hot spices, perfectly fried',
    price: 550,
    image: 'https://images.unsplash.com/photo-1619221881739-40de2afeaa7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwd2luZ3MlMjBzcGljeXxlbnwxfHx8fDE3NzM1MTI2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.8,
    isVeg: false,
    isNew: true,
  },
  {
    id: '19',
    name: 'Aloo Tikki Chaat',
    description: 'Crispy potato patties topped with yogurt, chutneys, and spices',
    price: 350,
    image: 'https://images.unsplash.com/photo-1599307767316-776533bb941c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9vJTIwdGlra2klMjBjaGFhdHxlbnwxfHx8fDE3NzM1MTI2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.7,
    isVeg: true,
  },
  {
    id: '20',
    name: 'Shami Kebab (4 pcs)',
    description: 'Soft minced meat and lentil patties with aromatic spices',
    price: 450,
    image: 'https://images.unsplash.com/photo-1528669826296-dbd6f641707d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWF0JTIwcGF0dGllcyUyMGZyaWVkfGVufDF8fHx8MTc3MzUxMjYzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    rating: 4.8,
    isVeg: false,
  },
  {
    id: '21',
    name: 'Gulab Jamun (4 pcs)',
    description: 'Soft, spongy milk dumplings soaked in rose-flavored sugar syrup',
    price: 280,
    image: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWxhYiUyMGphbXVuJTIwZGVzc2VydHxlbnwxfHx8fDE3NzM0MzMzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    rating: 4.9,
    isVeg: true,
    isBestSeller: true,
  },
  {
    id: '22',
    name: 'Kheer (Rice Pudding)',
    description: 'Creamy rice pudding with cardamom, nuts and saffron',
    price: 250,
    image: 'https://images.unsplash.com/photo-1606728099646-68d5a0a4d423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcHVkZGluZyUyMGJvd2x8ZW58MXx8fHwxNzczNDIyNjgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    rating: 4.7,
    isVeg: true,
  },
  {
    id: '23',
    name: 'Rasgulla (4 pcs)',
    description: 'Soft cottage cheese balls in light sugar syrup',
    price: 300,
    image: 'https://images.unsplash.com/photo-1758910536889-43ce7b3199fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXNndWxsYSUyMHN3ZWV0JTIwZGVzc2VydHxlbnwxfHx8fDE3NzM1MTI2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    rating: 4.6,
    isVeg: true,
  },
  {
    id: '24',
    name: 'Jalebi',
    description: 'Crispy orange spirals soaked in warm sugar syrup',
    price: 220,
    image: 'https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWxlYmklMjBvcmFuZ2UlMjBzd2VldHxlbnwxfHx8fDE3NzM1MTI2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    rating: 4.8,
    isVeg: true,
  },
  {
    id: '25',
    name: 'Gajar Ka Halwa',
    description: 'Traditional carrot pudding with milk, ghee, nuts and cardamom',
    price: 320,
    image: 'https://images.unsplash.com/photo-1610432589024-5f02f76549cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWphciUyMGhhbHdhJTIwY2Fycm90fGVufDF8fHx8MTc3MzUxMjYyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    rating: 4.8,
    isVeg: true,
    isSpecial: true,
  },
  {
    id: '26',
    name: 'Sheer Khurma',
    description: 'Sweet vermicelli pudding with milk, dates and dry fruits',
    price: 350,
    image: 'https://images.unsplash.com/photo-1736752346246-61f4daedfde0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJtaWNlbGxpJTIwc3dlZXQlMjBwdWRkaW5nJTIwaW5kaWFufGVufDF8fHx8MTc3MzUxMzg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Desserts',
    rating: 4.7,
    isVeg: true,
  },
  {
    id: '27',
    name: 'Frozen Paratha Pack (10 pcs)',
    description: 'Ready-to-cook layered flatbreads, perfect for quick meals',
    price: 400,
    image: 'https://images.unsplash.com/photo-1759302307381-bdccf7b35e5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhdGhhJTIwZmxhdGJyZWFkfGVufDF8fHx8MTc3MzUxMjYyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Frozen Meals',
    rating: 4.6,
    isVeg: true,
  },
  {
    id: '28',
    name: 'Frozen Naan Pack (8 pcs)',
    description: 'Traditional tandoori naan, ready to heat and serve',
    price: 350,
    image: 'https://images.unsplash.com/photo-1697155406014-04dc649b0953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWFuJTIwYnJlYWR8ZW58MXx8fHwxNzczNTEyNjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Frozen Meals',
    rating: 4.5,
    isVeg: true,
  },
  {
    id: '29',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink blended with sweet mango pulp',
    price: 180,
    image: 'https://images.unsplash.com/photo-1655074084308-901ea6b88fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGxhc3NpJTIwZHJpbmt8ZW58MXx8fHwxNzczNDg1MDMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Beverages',
    rating: 4.8,
    isVeg: true,
    isNew: true,
  },
];

const categories = ['All', 'Main Course', 'Snacks', 'Desserts', 'Frozen Meals', 'Beverages'];

// Product Card Component
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (e: React.MouseEvent, product: Product) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

function ProductCard({ product, onAddToCart, onQuickView, onToggleFavorite, isFavorite }: ProductCardProps) {
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(product.id);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-2xl transition-all group cursor-pointer bg-white dark:bg-gray-800 h-full">
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.isVeg && (
            <div className="absolute top-4 left-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
              <Leaf className="w-4 h-4" />
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-500 p-2 rounded-full shadow-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-orange-600 dark:fill-orange-500' : ''}`} />
          </motion.button>
          {(product.isNew || product.isSpecial) && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {product.isNew ? 'New' : 'Special'}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-bold text-orange-600 dark:text-orange-500">
              Rs. {product.price}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
            <Button
              onClick={(e) => onQuickView(e, product)}
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function Menu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 3);
  const dailySpecials = products.filter(p => p.isSpecial || p.isNew).slice(0, 3);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 bg-clip-text text-transparent mb-4"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Explore our delicious selection of 29 homemade dishes, prepared fresh daily with love
          </motion.p>
        </motion.div>

        {/* Search & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500 dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <Button
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white whitespace-nowrap shadow-lg transition-all duration-300'
                      : 'whitespace-nowrap border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200'
                  }
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Today's Specials - Always show when "All" is selected */}
        {selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Today's Specials
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {dailySpecials.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="overflow-hidden border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-orange-600 dark:text-orange-500">
                              Rs. {product.price}
                            </span>
                            <Badge className="bg-orange-600 text-white">
                              Special
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Customer Favorites - Always show when "All" is selected */}
        {selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Customer Favorites
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {bestSellers.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link to={`/product/${product.id}`}>
                    <Card className="overflow-hidden border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl transition-all group cursor-pointer bg-white dark:bg-gray-800">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          Best Seller
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-orange-600 dark:text-orange-500">
                            Rs. {product.price}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid - Only show when a specific category is selected */}
        {selectedCategory !== 'All' && (
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No dishes found"
                description="Try adjusting your search or filter criteria"
                action={
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={isFavorite(product.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Quick View Dialog */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quickViewProduct.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Quick view of {quickViewProduct.name} - {quickViewProduct.category}
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {quickViewProduct.isVeg && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                      <Leaf className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400">
                      {quickViewProduct.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {quickViewProduct.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {quickViewProduct.description}
                  </p>
                  {quickViewProduct.story && (
                    <div className="mb-4 p-3 bg-orange-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{quickViewProduct.story}"
                      </p>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-6">
                    Rs. {quickViewProduct.price}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <Button
                      onClick={() => {
                        handleAddToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link to={`/product/${quickViewProduct.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                      >
                        Full Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
