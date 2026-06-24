'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import { LandingTopbar } from '@/components/LandingTopbar';
import { Footer } from '@/components/shared/Footer';

export default function PrivacyPage() {
  return (
    <>
      <LandingTopbar />
      <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/10 via-transparent to-[#C9A84C]/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-gray-50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8">
          <div className="max-w-3xl">
           

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
              Privacy
              <span className="block text-[#C9A84C] mt-2">Policy</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed max-w-2xl">
              We're committed to protecting your privacy and being transparent about how we handle your data. Read our comprehensive privacy policy.
            </p>

            <p className="text-sm text-gray-600">Last updated: June 23, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-5 py-20 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {[
              {
                number: 1,
                title: 'Introduction',
                content: 'We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our community platform.',
              },
              {
                number: 2,
                title: 'Information We Collect',
                content: 'We collect personal information (name, email, phone), profile data, business information, communication data, and device/usage information to provide and improve our services.',
              },
              {
                number: 3,
                title: 'How We Use Your Information',
                content: 'We use your information to verify accounts, provide networking services, send updates, improve the platform, and ensure community safety and compliance with regulations.',
              },
              {
                number: 4,
                title: 'Data Security',
                content: 'We implement industry-standard security measures including encryption, secure servers, two-factor authentication, and regular security audits to protect your data.',
              },
              {
                number: 5,
                title: 'Data Sharing',
                content: 'We do not sell your data. We only share information with service providers, compliance authorities, and business partners when necessary with your consent.',
              },
              {
                number: 6,
                title: 'Your Rights',
                content: 'You have the right to access, correct, delete, or export your personal data. You can also opt-out of marketing communications at any time.',
              },
              {
                number: 7,
                title: 'Cookies & Tracking',
                content: 'We use cookies to enhance your experience, remember preferences, and improve platform functionality. You can control cookies through your browser settings.',
              },
              {
                number: 8,
                title: 'Data Retention',
                content: 'We retain account information for the duration of your membership plus reasonable periods for legal compliance. Transaction records are kept according to regulatory requirements.',
              },
              {
                number: 9,
                title: 'Children\'s Privacy',
                content: 'Our platform is not intended for users under 18 years old. We do not knowingly collect data from minors and will delete any such data immediately.',
              },
              {
                number: 10,
                title: 'Policy Updates',
                content: 'We may update this Privacy Policy. Significant changes will be communicated via email or platform notification. Your continued use constitutes acceptance.',
              },
            ].map((section) => (
              <div key={section.number} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C9A84C] font-bold text-sm">{section.number}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-100 bg-white px-5 py-16 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#C9A84C]" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Your Data is Safe</h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            We take your privacy seriously and implement industry-leading security measures to protect your information. Your trust is our priority.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A84C] text-white font-semibold rounded-xl hover:bg-[#B8962E] transition-all shadow-lg shadow-[#C9A84C]/30"
            >
              Join Our Community <ArrowRight size={20} />
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#C9A84C] text-[#C9A84C] font-semibold rounded-xl hover:bg-[#C9A84C]/5 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
    </>
  );
}
