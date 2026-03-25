import { motion } from 'motion/react';
import { MapPin, Clock, DollarSign, Truck, CheckCircle, Phone } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const deliveryZones = [
  { area: 'DHA Lahore', time: '30-40 min', fee: 'Free above Rs. 500' },
  { area: 'Gulberg', time: '35-45 min', fee: 'Free above Rs. 500' },
  { area: 'Johar Town', time: '40-50 min', fee: 'Free above Rs. 500' },
  { area: 'Model Town', time: '40-50 min', fee: 'Free above Rs. 500' },
  { area: 'Bahria Town', time: '45-55 min', fee: 'Free above Rs. 500' },
  { area: 'Cantt', time: '35-45 min', fee: 'Free above Rs. 500' },
  { area: 'Wapda Town', time: '45-55 min', fee: 'Free above Rs. 500' },
  { area: 'Garden Town', time: '30-40 min', fee: 'Free above Rs. 500' },
];

const deliverySteps = [
  {
    icon: CheckCircle,
    title: 'Order Confirmed',
    description: 'You receive an SMS confirmation with your order details',
  },
  {
    icon: Truck,
    title: 'Food Preparation',
    description: 'Our chefs start preparing your fresh meal with love',
  },
  {
    icon: MapPin,
    title: 'Out for Delivery',
    description: 'Your order is packed and on its way to you',
  },
  {
    icon: CheckCircle,
    title: 'Delivered',
    description: 'Enjoy your delicious homemade meal!',
  },
];

export function DeliveryInfo() {
  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
              <Truck className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Delivery{' '}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Information
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fast, reliable delivery of fresh homemade meals to your doorstep
          </p>
        </motion.div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all h-full">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Quick Delivery</h3>
                <p className="text-gray-600 text-lg">30-60 minutes delivery time</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
          >
            <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all h-full">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Free Delivery</h3>
                <p className="text-gray-600 text-lg">On orders above Rs. 500</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8 }}
          >
            <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all h-full">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Wide Coverage</h3>
                <p className="text-gray-600 text-lg">Serving 8+ areas in Lahore</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Delivery Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            How Delivery Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {deliverySteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="border-2 border-orange-100 hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                    >
                      <step.icon className="w-8 h-8 text-orange-600" />
                      <div className="absolute -top-2 -right-2 bg-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </motion.div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                {index < deliverySteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-orange-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Zones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Delivery Areas & Timings
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryZones.map((zone, index) => (
              <motion.div
                key={zone.area}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <h3 className="font-bold text-lg text-gray-900">{zone.area}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>{zone.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span>{zone.fee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Fee Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Delivery Charges
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
                    <p className="text-gray-600">Orders above Rs. 500</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">Rs. 80</div>
                    <p className="text-gray-600">Orders below Rs. 500</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white"
        >
          <Phone className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Need Help with Your Delivery?</h3>
          <p className="text-lg mb-6 text-white/90">
            Contact our delivery support team for any queries or issues
          </p>
          <a
            href="tel:+923211234567"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            Call: +92 321 1234567
          </a>
        </motion.div>
      </div>
    </div>
  );
}