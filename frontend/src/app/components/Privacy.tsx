import { motion } from 'motion/react';
import { Lock, Eye, Shield, Database, UserCheck, Bell } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const highlights = [
  {
    icon: Lock,
    title: 'Data Security',
    description: 'Your data is encrypted and stored securely using industry-standard protocols',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'We are transparent about what data we collect and how we use it',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your privacy is our priority. We never sell your personal information',
  },
];

const privacySections = [
  {
    heading: 'Information We Collect',
    icon: Database,
    content: [
      {
        subtitle: 'Personal Information',
        points: [
          'Name, email address, and phone number when you create an account',
          'Delivery addresses and contact information for order fulfillment',
          'Payment information (processed securely through third-party payment gateways)',
          'Order history and preferences to improve your experience',
        ],
      },
      {
        subtitle: 'Automatically Collected Information',
        points: [
          'IP address and device information for security purposes',
          'Browser type and operating system for website optimization',
          'Cookies and similar technologies to enhance user experience',
          'Usage data and analytics to improve our services',
        ],
      },
    ],
  },
  {
    heading: 'How We Use Your Information',
    icon: UserCheck,
    content: [
      {
        subtitle: 'Service Delivery',
        points: [
          'To process and deliver your orders efficiently',
          'To communicate order status and delivery updates',
          'To provide customer support and respond to inquiries',
          'To send order confirmations and receipts',
        ],
      },
      {
        subtitle: 'Service Improvement',
        points: [
          'To personalize your experience and recommendations',
          'To analyze usage patterns and improve our platform',
          'To develop new features and services',
          'To conduct research and analytics',
        ],
      },
      {
        subtitle: 'Marketing (With Your Consent)',
        points: [
          'To send promotional offers and special deals',
          'To inform you about new menu items and services',
          'To conduct surveys and gather feedback',
          'You can opt-out of marketing communications anytime',
        ],
      },
    ],
  },
  {
    heading: 'Information Sharing',
    icon: Bell,
    content: [
      {
        subtitle: 'We Share Your Information With',
        points: [
          'Delivery partners to fulfill your orders',
          'Payment processors to complete transactions securely',
          'Service providers who assist in operating our platform',
          'Law enforcement when required by law',
        ],
      },
      {
        subtitle: 'We Never',
        points: [
          'Sell your personal information to third parties',
          'Share your data for third-party marketing without consent',
          'Provide access to your data to unauthorized parties',
          'Use your information for purposes not disclosed in this policy',
        ],
      },
    ],
  },
  {
    heading: 'Data Security',
    icon: Shield,
    content: [
      {
        subtitle: 'Security Measures',
        points: [
          'SSL encryption for all data transmission',
          'Secure servers with regular security audits',
          'Restricted access to personal information',
          'Regular security updates and monitoring',
        ],
      },
      {
        subtitle: 'Your Responsibilities',
        points: [
          'Keep your account password confidential',
          'Use a strong, unique password for your account',
          'Log out after using shared devices',
          'Report any suspicious activity immediately',
        ],
      },
    ],
  },
  {
    heading: 'Your Rights',
    icon: UserCheck,
    content: [
      {
        subtitle: 'You Have the Right To',
        points: [
          'Access and review your personal information',
          'Update or correct your information',
          'Delete your account and associated data',
          'Opt-out of marketing communications',
          'Withdraw consent for data processing',
          'Request a copy of your data',
        ],
      },
      {
        subtitle: 'Exercising Your Rights',
        points: [
          'Contact us at privacy@erumskitchette.pk',
          'Use the account settings to manage preferences',
          'We will respond to requests within 30 days',
          'Some data may be retained as required by law',
        ],
      },
    ],
  },
  {
    heading: 'Cookies and Tracking',
    icon: Eye,
    content: [
      {
        subtitle: 'Types of Cookies We Use',
        points: [
          'Essential cookies for website functionality',
          'Performance cookies to analyze website usage',
          'Functional cookies to remember your preferences',
          'Marketing cookies (with your consent)',
        ],
      },
      {
        subtitle: 'Managing Cookies',
        points: [
          'You can control cookies through browser settings',
          'Disabling cookies may affect website functionality',
          'We respect "Do Not Track" browser settings',
          'Third-party cookies are governed by their own policies',
        ],
      },
    ],
  },
  {
    heading: 'Children\'s Privacy',
    icon: Shield,
    content: [
      {
        subtitle: 'Protection of Minors',
        points: [
          'Our services are not intended for children under 13',
          'We do not knowingly collect data from children',
          'Parents can request deletion of child\'s data',
          'We comply with applicable child protection laws',
        ],
      },
    ],
  },
  {
    heading: 'Changes to Privacy Policy',
    icon: Bell,
    content: [
      {
        subtitle: 'Policy Updates',
        points: [
          'We may update this policy periodically',
          'Changes will be posted on this page with updated date',
          'Significant changes will be communicated via email',
          'Continued use implies acceptance of changes',
        ],
      },
    ],
  },
];

export function Privacy() {
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
              <Lock className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Privacy{' '}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we protect and use your information
          </p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: March 14, 2026</p>
        </motion.div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all h-full">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
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
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg">
                      <section.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    {section.heading}
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {section.content.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                          {subsection.subtitle}
                        </h3>
                        <ul className="space-y-2 ml-4">
                          {subsection.points.map((point, pIndex) => (
                            <motion.li
                              key={pIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: pIndex * 0.03 }}
                              className="flex items-start gap-3"
                            >
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                              <span className="text-gray-700 leading-relaxed text-sm">{point}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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
          <Lock className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Privacy Questions or Concerns?</h3>
          <p className="text-lg mb-6 text-white/90">
            If you have questions about our privacy practices or want to exercise your rights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@erumskitchette.pk"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Email: privacy@erumskitchette.pk
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
