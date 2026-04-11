import { motion } from 'motion/react';
import { Heart, Award, Users, Clock, ChefHat, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './ImageWithFallback';

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish is prepared with care, following traditional family recipes that have been perfected over generations.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'We source only the finest, freshest ingredients from trusted local suppliers to ensure authentic taste.',
  },
  {
    icon: Users,
    title: 'Community Focused',
    description: 'Supporting home-based entrepreneurs and bringing communities together through the love of good food.',
  },
  {
    icon: Clock,
    title: 'Always Fresh',
    description: 'We prepare our meals fresh daily and deliver them hot to your doorstep, ensuring maximum freshness.',
  },
];

const timeline = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Erum started cooking for friends and family, receiving overwhelmingly positive feedback.',
  },
  {
    year: '2022',
    title: 'Going Professional',
    description: 'Launched Erum\'s Kitchette officially, serving 50+ customers in the first month.',
  },
  {
    year: '2024',
    title: 'Rapid Growth',
    description: 'Expanded to multiple areas in Lahore, serving 500+ happy customers weekly.',
  },
  {
    year: '2026',
    title: 'Today',
    description: 'A trusted name in homemade food with 1000+ regular customers and growing every day.',
  },
];

const team = [
  {
    name: 'Erum Ahmed',
    role: 'Head Chef & Founder',
    bio: '15 years of culinary experience, specializing in traditional Pakistani cuisine',
    image: '👩‍🍳',
  },
  {
    name: 'Farhan Sheikh',
    role: 'Operations Manager',
    bio: 'Ensures quality control and timely delivery of every order',
    image: '👨‍💼',
  },
  {
    name: 'Nida Rahman',
    role: 'Pastry Chef',
    bio: 'Expert in traditional Pakistani sweets and desserts',
    image: '👩‍🍳',
  },
];

const achievements = [
  { number: '1000+', label: 'Happy Customers', icon: Users },
  { number: '10,000+', label: 'Orders Delivered', icon: ChefHat },
  { number: '4.9/5', label: 'Average Rating', icon: Award },
  { number: '8+', label: 'Delivery Areas', icon: Target },
];

export function About() {
  return (
    <div className="min-h-screen py-16 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/30 dark:from-gray-900/30 dark:via-gray-950 dark:to-gray-900/30 -z-10"></div>
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-10 w-96 h-96 bg-orange-200 dark:bg-orange-900/30 rounded-full blur-3xl -z-10"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl shadow-2xl">
              <ChefHat className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
              Story
            </span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Erum's Kitchette was born from a simple idea: everyone deserves access to wholesome, 
            delicious home-cooked meals, even when life gets busy. We bridge the gap between 
            home-based culinary talent and food lovers who crave authentic, homestyle Pakistani cooking.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-24 rounded-3xl overflow-hidden shadow-2xl relative group"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1609248419815-e9ba18851962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwa2l0Y2hlbiUyMGNvb2tpbmd8ZW58MXx8fHwxNzcyOTE4OTcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Our kitchen"
            className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Where Magic Happens ✨</h3>
            <p className="text-lg">Our certified kitchen where every meal is prepared with love and care</p>
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 relative"
        >
          <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              To empower home-based food entrepreneurs while providing our community with access to 
              authentic, nutritious, and delicious home-cooked Pakistani meals. We believe in preserving 
              culinary traditions while embracing modern convenience.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From a passion project to a thriving business
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-200 via-red-200 to-orange-200 dark:from-orange-900 dark:via-red-900 dark:to-orange-900"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl transition-all bg-white dark:bg-gray-800">
                      <CardContent className="p-6">
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                          {item.year}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden md:block relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-4 border-white dark:border-gray-950 shadow-lg"
                    ></motion.div>
                  </div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-2xl transition-all h-full bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-8 text-center">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <value.icon className="w-10 h-10 text-orange-600 dark:text-orange-500" />
                    </motion.div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <Card className="border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl transition-all text-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-8">
                    <stat.icon className="w-12 h-12 text-orange-600 dark:text-orange-500 mx-auto mb-4" />
                    <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 font-semibold">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Meet Our{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The passionate people behind your favorite homemade meals
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-2xl transition-all overflow-hidden bg-white dark:bg-gray-800">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 p-12 text-center">
                    <div className="text-7xl mb-4">{member.image}</div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-orange-600 dark:text-orange-500 font-semibold mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hygiene & Safety */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 border-2 border-orange-100 dark:border-orange-900/50 shadow-xl"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Hygiene & Food Safety
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
              We take food safety seriously. Our kitchen is regularly inspected and certified 
              by local health authorities. We follow strict hygiene protocols, use food-grade 
              packaging, and maintain cold chain integrity for all our products. Your health 
              and satisfaction are our top priorities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-700 px-6 py-3 rounded-full shadow-md border-2 border-orange-200 dark:border-orange-900"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">✓ FSSAI Certified</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-700 px-6 py-3 rounded-full shadow-md border-2 border-orange-200 dark:border-orange-900"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">✓ ISO 22000 Compliant</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-700 px-6 py-3 rounded-full shadow-md border-2 border-orange-200 dark:border-orange-900"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">✓ Regular Health Inspections</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
