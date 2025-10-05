import Link from 'next/link'
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Hotel <span className="text-blue-400">Ritam</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Experience luxury and comfort at Hotel Ritam, where modern elegance meets traditional hospitality.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-300 hover:text-blue-400 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-300 hover:text-blue-400 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-300 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-gray-300 hover:text-white">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/amenities" className="text-gray-300 hover:text-white">
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="/dining" className="text-gray-300 hover:text-white">
                  Dining
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Room Service</li>
              <li className="text-gray-300">Concierge</li>
              <li className="text-gray-300">Spa & Wellness</li>
              <li className="text-gray-300">Business Center</li>
              <li className="text-gray-300">Valet Parking</li>
              <li className="text-gray-300">Airport Shuttle</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300">
                  123 Luxury Avenue<br />
                  Downtown City, State 12345
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">info@hotelritam.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Hotel Ritam. All rights reserved. | 
            <Link href="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-white ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
