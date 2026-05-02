import { motion } from 'motion/react';
import { FileText, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const sections = [
  {
    title: 'Acceptance of Terms',
    icon: FileText,
    content: `By accessing and using Erum's Kitchette website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
  },
  {
    title: 'Use of Service',
    icon: Shield,
    content: `Our service is available only to individuals who can form legally binding contracts under applicable law. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.`,
  },
  {
    title: 'Ordering and Pricing',
    icon: AlertCircle,
    content: `All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order placed through the website. Prices are subject to change without notice. All prices displayed on the website are in Pakistani Rupees (PKR).`,
  },
];

const termsContent = [
  {
    heading: 'Order Cancellation',
    points: [
      'Orders can be cancelled within 5 minutes of placement without any charges',
      'After 5 minutes, cancellation charges may apply depending on the preparation status',
      'Orders cannot be cancelled once they are out for delivery',
      'Refunds for cancelled orders will be processed within 5-7 business days',
    ],
  },
  {
    heading: 'Delivery Terms',
    points: [
      'Delivery times are estimates and may vary based on traffic and weather conditions',
      'We are not liable for delays caused by circumstances beyond our control',
      'You must be available at the delivery address to receive your order',
      'Failed delivery attempts due to incorrect address or unavailability may result in cancellation',
    ],
  },
  {
    heading: 'Payment Terms',
    points: [
      'Payment can be made via online payment methods or cash on delivery',
      'All online transactions are processed through secure payment gateways',
      'We do not store your card details on our servers',
      'Failed payment transactions will result in automatic order cancellation',
    ],
  },
  {
    heading: 'Quality Guarantee',
    points: [
      'We guarantee fresh, high-quality food prepared under hygienic conditions',
      'If you\'re not satisfied with your order, contact us within 30 minutes of delivery',
      'We reserve the right to inspect returned items before issuing refunds',
      'Refunds are issued as per our refund policy outlined separately',
    ],
  },
  {
    heading: 'User Responsibilities',
    points: [
      'You are responsible for maintaining the confidentiality of your account',
      'You agree not to misuse our services or engage in fraudulent activities',
      'You agree to provide accurate delivery information and contact details',
      'You are responsible for reviewing your order before confirming',
    ],
  },
  {
    heading: 'Intellectual Property',
    points: [
      'All content on this website is the property of Erum\'s Kitchette',
      'You may not reproduce, distribute, or create derivative works without permission',
      'Product images are for representation purposes only',
      'Trademarks and logos are protected under applicable laws',
    ],
  },
  {
    heading: 'Limitation of Liability',
    points: [
      'We are not liable for any indirect, incidental, or consequential damages',
      'Our liability is limited to the amount paid for the specific order',
      'We are not responsible for allergic reactions; please check ingredients before ordering',
      'Force majeure events are beyond our control and liability',
    ],
  },
  {
    heading: 'Modifications to Terms',
    points: [
      'We reserve the right to modify these terms at any time',
      'Changes will be effective immediately upon posting on the website',
      'Continued use of our services constitutes acceptance of modified terms',
      'We recommend reviewing these terms periodically',
    ],
  },
];

export function Terms() {
  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Terms &{' '}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Conditions
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: March 14, 2026</p>
        </motion.div>

        {/* Key Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all h-full">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <section.icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{section.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Terms */}
        <div className="space-y-8">
          {termsContent.map((section, index) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-2 border-orange-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b-2 border-orange-100">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                    {section.heading}
                  </h2>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {section.points.map((point, pIndex) => (
                      <motion.li
                        key={pIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: pIndex * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
          <p className="text-lg mb-6 text-white/90">
            If you have any questions regarding these terms and conditions, please contact us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@erumskitchette.pk"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Email: legal@erumskitchette.pk
            </a>
            <a
              href="tel:+923211234567"
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border-2 border-white"
            >
              Call: +92 321 1234567
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
