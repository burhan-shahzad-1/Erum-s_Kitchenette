import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ChefHat } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold">Erum's Kitchette</span>
            </div>
            <p className="text-gray-400 text-sm">
              Bringing the warmth of home-cooked meals to your doorstep. Quality, taste, and love in every bite.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 hover:bg-orange-600 p-2 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-orange-600 p-2 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-orange-600 p-2 rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-400 hover:text-orange-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Delivery Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-orange-500 transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Johar Town, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>+92 321 1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>info@erumskitchette.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Erum's Kitchette. All rights reserved. Made with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
}