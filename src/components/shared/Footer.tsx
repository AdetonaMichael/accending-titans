'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-5 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Ascending Titans</h3>
              <p className="text-sm text-gray-600">Connect, Showcase, and Grow</p>
            </div>
            <div className="flex gap-3">
              <a href="https://facebook.com" className="text-gray-400 hover:text-[#C9A84C] transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-[#C9A84C] transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-[#C9A84C] transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-[#C9A84C] transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Features</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Business Catalogue
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Community Networking
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Direct Messaging
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Advertising Platform
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Job Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Community</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Join Now
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <a href="mailto:support@ascendingtitans.com" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  support@ascendingtitans.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <a href="tel:+2347000000000" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                  +234 (0) 700 000 0000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <p className="text-sm text-gray-600">
                © {currentYear} Ascending Titans Community. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6 justify-end">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                Terms of Service
              </Link>
              <Link href="/support" className="text-sm text-gray-600 hover:text-[#C9A84C] transition">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
