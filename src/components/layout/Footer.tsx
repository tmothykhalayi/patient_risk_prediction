import { Link } from 'react-router-dom'
import {
  CarIcon,
  FacebookIcon,
  TwitterIcon,
  MailIcon,
} from 'lucide-react'
export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">AutoHub</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your trusted partner for convenient and affordable car rentals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/vehicles"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Vehicles
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-lg">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-100 p-3 rounded-lg text-slate-600 hover:text-white hover:bg-blue-600 transition-all duration-200">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-100 p-3 rounded-lg text-slate-600 hover:text-white hover:bg-blue-600 transition-all duration-200">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-100 p-3 rounded-lg text-slate-600 hover:text-white hover:bg-blue-600 transition-all duration-200">
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-600">
            © 2025 <span className="text-slate-900 font-semibold">AutoHub</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-slate-600 hover:text-blue-600 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
