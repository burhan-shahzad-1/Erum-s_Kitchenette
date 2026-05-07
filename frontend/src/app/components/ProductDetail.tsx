import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Star, ShoppingCart, Heart, Clock, Users, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './ImageWithFallback';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { foodApi, reviewsApi } from '../lib/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80';

const CATEGORY_LABELS: Record<string, string> = {
  main: 'Main Course',
  snack: 'Snacks',
  dessert: 'Desserts',
  beverage: 'Beverages',
  appetizer: 'Appetizers',
  other: 'Other',
};

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string | null;
  rating: number;
  comment?: string;
  createdAt: string;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    Promise.all([
      foodApi.getOne(id),
      reviewsApi.getByFoodItem(id),
    ])
      .then(([foodRes, reviewsRes]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setProduct(foodRes.data.data as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setReviews((reviewsRes.data.data as any[]) ?? []);
      })
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.imageUrl || FALLBACK_IMAGE,
        category: CATEGORY_LABELS[product.category] ?? product.category,
      });
    }
    toast.success(`${quantity} × ${product.title} added to cart!`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmittingReview(true);
    try {
      await reviewsApi.create(id, { rating: reviewRating, comment: reviewComment || undefined });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      // Refresh reviews
      const res = await reviewsApi.getByFoodItem(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setReviews((res.data.data as any[]) ?? []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Could not submit review.';
      toast.error(msg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Product not found</h1>
          <Link to="/menu">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 text-white">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/menu')} className="gap-2 hover:bg-orange-50 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <Card className="overflow-hidden border-2 border-orange-100 dark:border-orange-900/50">
              <div className="relative aspect-square">
                <ImageWithFallback
                  src={product.imageUrl || FALLBACK_IMAGE}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="border-orange-100 dark:border-orange-900/50 dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Prep Time</p>
                  <p className="font-semibold text-sm dark:text-gray-100">30-45 min</p>
                </CardContent>
              </Card>
              <Card className="border-orange-100 dark:border-orange-900/50 dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Serves</p>
                  <p className="font-semibold text-sm dark:text-gray-100">1-2 people</p>
                </CardContent>
              </Card>
              <Card className="border-orange-100 dark:border-orange-900/50 dark:bg-gray-800">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="font-semibold text-sm dark:text-gray-100">
                    {reviews.length ? avgRating.toFixed(1) : '—'}/5
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                {CATEGORY_LABELS[product.category] ?? product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{product.title}</h1>

            {/* Rating summary */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {reviews.length ? avgRating.toFixed(1) : 'No reviews yet'}
              </span>
              {reviews.length > 0 && (
                <span className="text-gray-500 dark:text-gray-400">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              )}
            </div>

            <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-6">
              Rs. {product.price}
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-orange-300 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-bold text-lg dark:text-gray-100"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center dark:text-gray-100">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 border-orange-300 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-bold text-lg dark:text-gray-100"
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
                Add to Cart — Rs. {product.price * quantity}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => toggleFavorite(product.id)}
                className="border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-orange-600 text-orange-600' : 'dark:text-gray-100'}`} />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-2 border-orange-100 dark:border-orange-900/50">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 px-8 py-6 border-b-2 border-orange-100 dark:border-orange-900/50">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                Customer Reviews
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} from our customers
              </p>
            </div>

            <CardContent className="p-8">
              {/* Submit a Review */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="mb-10 p-6 bg-orange-50 dark:bg-gray-800/50 rounded-xl border border-orange-200 dark:border-orange-900/50">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">Write a Review</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= (hoverRating || reviewRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{reviewRating} / 5</span>
                  </div>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this dish..."
                    rows={3}
                    className="mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    {isSubmittingReview ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-900/50 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    <Link to="/login" className="text-orange-600 dark:text-orange-500 font-medium hover:underline">Sign in</Link>
                    {' '}to leave a review
                  </p>
                </div>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                            {(review.userName ?? 'G')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {review.userName ?? 'Guest'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-PK', {
                                day: 'numeric', month: 'long', year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-13">
                          {review.comment}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
