import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useState } from 'react';

const faqCategories = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our menu, add items to your cart, and proceed to checkout. You can pay online or choose cash on delivery.',
      },
      {
        q: 'What is the minimum order value?',
        a: 'The minimum order value is Rs. 500. Orders above Rs. 500 get free delivery!',
      },
      {
        q: 'Can I modify my order after placing it?',
        a: 'Yes, you can modify your order within 5 minutes of placing it. Please contact us immediately at +92 321 1234567.',
      },
      {
        q: 'Do you accept bulk orders?',
        a: 'Yes! We accept bulk orders for parties, events, and corporate functions. Please contact us 24 hours in advance.',
      },
    ],
  },
  {
    category: 'Delivery',
    questions: [
      {
        q: 'Which areas do you deliver to?',
        a: 'We currently deliver to Johar Town, DHA, Gulberg, Model Town, Garden Town, and surrounding areas in Lahore. Check our Delivery Information page for full details.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Deliveries typically take 30-45 minutes. During peak hours, it may take up to 60 minutes.',
      },
      {
        q: 'Is delivery free?',
        a: 'Yes! Delivery is free for orders above Rs. 500. For orders below Rs. 500, a delivery fee of Rs. 80 applies.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes, once your order is confirmed, you\'ll receive updates via SMS and can track your order in real-time.',
      },
    ],
  },
  {
    category: 'Food & Quality',
    questions: [
      {
        q: 'Are your meals freshly prepared?',
        a: 'Absolutely! All our meals are prepared fresh daily using the finest ingredients. We do not use any preservatives.',
      },
      {
        q: 'Do you offer vegetarian options?',
        a: 'Yes, we have a wide variety of vegetarian dishes. Look for the "Veg" tag on our menu items.',
      },
      {
        q: 'How do you ensure food safety?',
        a: 'We follow strict hygiene protocols, are FSSAI certified, and our kitchen undergoes regular health inspections.',
      },
      {
        q: 'Can I customize my order?',
        a: 'Yes! You can add special instructions during checkout. We\'ll do our best to accommodate your preferences.',
      },
    ],
  },
  {
    category: 'Payment & Refunds',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept online payments (credit/debit cards, JazzCash, EasyPaisa) and cash on delivery.',
      },
      {
        q: 'Is online payment secure?',
        a: 'Yes, all online transactions are processed through secure payment gateways with SSL encryption.',
      },
      {
        q: 'What is your refund policy?',
        a: 'If you\'re not satisfied with your order, please contact us within 30 minutes of delivery. We\'ll refund or replace your order.',
      },
      {
        q: 'Do you offer discounts?',
        a: 'Yes! We regularly offer discounts and promotional codes. Follow us on social media to stay updated.',
      },
    ],
  },
];

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="text-6xl">🤔</div>
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ordering, delivery, and our services
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const id = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === id;

                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.1 + qIndex * 0.05 }}
                    >
                      <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 overflow-hidden">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleQuestion(id)}
                            className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-orange-50/50 transition-colors"
                          >
                            <span className="font-semibold text-lg text-gray-900">
                              {faq.q}
                            </span>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex-shrink-0"
                            >
                              {isOpen ? (
                                <Minus className="w-6 h-6 text-orange-600" />
                              ) : (
                                <Plus className="w-6 h-6 text-orange-600" />
                              )}
                            </motion.div>
                          </button>

                          <motion.div
                            initial={false}
                            animate={{
                              height: isOpen ? 'auto' : 0,
                              opacity: isOpen ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-gray-700 leading-relaxed bg-gradient-to-b from-orange-50/30 to-white">
                              {faq.a}
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-lg mb-6 text-white/90">
            Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+923211234567"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Call: +92 321 1234567
            </a>
            <a
              href="mailto:info@erumskitchette.pk"
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border-2 border-white"
            >
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}