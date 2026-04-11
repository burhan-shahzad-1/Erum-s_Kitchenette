import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Star, Clock, ShieldCheck, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './ImageWithFallback';

const features = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish is prepared with care and traditional Pakistani recipes passed down through generations.',
  },
  {
    icon: ShieldCheck,
    title: 'Hygiene Guaranteed',
    description: 'We maintain the highest standards of cleanliness and food safety in our home kitchen.',
  },
  {
    icon: Clock,
    title: 'Quick Delivery',
    description: 'Fresh, hot meals delivered to your doorstep within 45 minutes of ordering.',
  },
  {
    icon: Star,
    title: 'Quality Ingredients',
    description: 'We use only the freshest, locally-sourced ingredients for authentic homemade taste.',
  },
];

const categories = [
  {
    name: 'Frozen Meals',
    description: 'Ready-to-heat homestyle meals',
    image: 'https://images.unsplash.com/photo-1749062878896-232c096ad158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBtZWFsJTIwcHJlcGFyYXRpb258ZW58MXx8fHwxNzcyOTE4OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Snacks',
    description: 'Crispy & delicious treats',
    image: 'https://images.unsplash.com/photo-1697155836252-d7f969108b5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1vc2ElMjBzbmFjayUyMGluZGlhbnxlbnwxfHx8fDE3NzI4MTg5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Main Course',
    description: 'Authentic homemade curries',
    image: 'https://images.unsplash.com/photo-1707448829764-9474458021ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJpY2V8ZW58MXx8fHwxNzcyOTE4OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Desserts',
    description: 'Sweet homemade delights',
    image: 'https://images.unsplash.com/photo-1730461202383-0333c5e3bee8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0cyUyMGhvbWV0YWRlJTIwc3dlZXR8ZW58MXx8fHwxNzcyOTE4OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const testimonials = [
  {
    name: 'Ayesha Khan',
    role: 'Software Engineer',
    rating: 5,
    comment: 'The best homemade food service in Lahore! Tastes exactly like my mother\'s cooking. Highly recommended!',
  },
  {
    name: 'Hassan Ali',
    role: 'University Student',
    rating: 5,
    comment: 'Perfect for hostel life. Healthy, affordable, and absolutely delicious. Erum Baji, you\'re amazing!',
  },
  {
    name: 'Fatima Siddiqui',
    role: 'Marketing Manager',
    rating: 5,
    comment: 'Finally, I can enjoy homestyle meals even with my busy schedule. The quality is outstanding!',
  },
];

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZWZlZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-20 h-20 bg-orange-300/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-32 h-32 bg-red-300/20 rounded-full blur-2xl"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-medium mb-6 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Fresh & Homemade Daily
              </motion.span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-6">
                <span className="block mb-2">Welcome to</span>
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  Erum's Kitchette
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Experience the authentic taste of Pakistani home-cooked meals made with love and the finest ingredients. 
                Perfect for professionals, students, and families who crave healthy, delicious food.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/menu">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-xl shadow-orange-200 text-lg px-8">
                      Order Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/about">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-orange-600 text-orange-600 hover:bg-orange-50 text-lg px-8">
                      Learn More
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '1000+', label: 'Happy Customers', icon: '😊' },
                  { value: '25+', label: 'Menu Items', icon: '🍽️' },
                  { value: '4.9', label: 'Rating', icon: '⭐' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-100 dark:border-orange-900"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span>{stat.icon}</span>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1625874740599-4ba5ba56610e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGZvb2QlMjBwbGF0ZSUyMGZyZXNofGVufDF8fHx8MTc3MjkxODk3MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Fresh homemade food"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </motion.div>
              
              {/* Floating Badge - Quick Delivery */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="absolute -bottom-6 -left-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl p-5 border-2 border-orange-200"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white p-3 rounded-xl shadow-lg">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Fast Delivery</div>
                    <div className="text-sm text-gray-600">Within 45 mins</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge - Fresh Today */}
              <motion.div
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: 'spring' }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-2xl p-4 border-2 border-white"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <div className="font-bold text-lg">Fresh Today!</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium mb-4"
            >
              <TrendingUp className="w-4 h-4" />
              Why Choose Us
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              What Makes Us{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Special
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We bring the comfort of home-cooked meals with professional service standards
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-2xl transition-all duration-300 h-full bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-8 text-center">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <feature.icon className="w-10 h-10 text-orange-600 dark:text-orange-500" />
                    </motion.div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 relative overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Explore Our{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Delicious Menu
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From traditional Pakistani favorites to innovative dishes, we have something for everyone
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ y: -12, scale: 1.03 }}
              >
                <Link to="/menu">
                  <Card className="overflow-hidden border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="absolute bottom-0 left-0 right-0 p-6 text-white"
                      >
                        <h3 className="font-bold text-2xl mb-2 drop-shadow-lg">{category.name}</h3>
                        <p className="text-sm text-white/90 drop-shadow-lg">{category.description}</p>
                      </motion.div>
                      
                      {/* Overlay icon on hover */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 bg-white text-orange-600 p-3 rounded-full shadow-lg"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/menu">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-xl shadow-orange-200 text-lg px-10">
                  View Full Menu
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/20 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              What Our{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our happy customers across Pakistan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-2xl transition-all duration-300 h-full bg-gradient-to-br from-white to-orange-50/20 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + i * 0.1 }}
                        >
                          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">"{testimonial.comment}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">{testimonial.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-white mx-auto" />
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Ready to Taste Home?
            </h2>
            <p className="text-2xl text-white/95 mb-10 max-w-2xl mx-auto drop-shadow-lg">
              Order now and experience the authentic flavors of Pakistani homemade food, delivered fresh to your door.
            </p>
            <Link to="/menu">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 shadow-2xl text-lg px-12 py-7">
                  <span className="font-bold">Start Ordering</span>
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}