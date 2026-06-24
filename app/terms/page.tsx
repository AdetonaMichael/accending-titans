'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LandingTopbar } from '@/components/LandingTopbar';
import { Footer } from '@/components/shared/Footer';

export default function TermsPage() {
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
              Terms of
              <span className="block text-[#C9A84C] mt-2">Service</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed max-w-2xl">
              Please read these terms carefully before using our community platform. By accessing our services, you agree to be bound by these terms.
            </p>

            <p className="text-sm text-gray-600">Last updated: June 23, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-5 py-20 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {/* Section 1 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using our community platform (website, mobile app, and services), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. This platform is designed for entrepreneurs, business owners, and professionals seeking to network and grow their businesses.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">User Eligibility</h2>
                  <ul className="space-y-3">
                    {[
                      'You must be at least 18 years old to use our platform',
                      'You must provide accurate and complete information during registration',
                      'You are responsible for maintaining the confidentiality of your account credentials',
                      'You must not use the platform for any illegal or unauthorized purpose',
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <CheckCircle2 size={20} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Services</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our platform provides comprehensive business networking services including:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Business catalogue listings and product/service showcasing',
                      'Direct member-to-member messaging and networking',
                      'Community networking and collaboration opportunities',
                      'Birthday rewards and member recognition programs',
                      'Advertising platform for business promotion',
                      'Job and gig opportunities marketplace',
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <span className="text-[#C9A84C] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Conduct</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    As a community member, you agree to:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Conduct yourself professionally and respectfully in all interactions',
                      'Not engage in harassment, discrimination, or inappropriate behavior',
                      'Provide genuine and accurate information in your profile and listings',
                      'Not attempt to scam, defraud, or mislead other members',
                      'Respect intellectual property rights and confidentiality',
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <CheckCircle2 size={20} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Membership Fees</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our platform offers three membership tiers with corresponding monthly fees:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Regular: ₦2,000/month - Basic access and networking features',
                      'VIP: ₦3,500/month - Enhanced visibility and priority support',
                      'VVIP: ₦5,000/month - Premium features including video ads and custom profiles',
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <span className="text-[#C9A84C] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">Fees are subject to change with 14 days' notice.</p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">6</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In case of disputes between members or with our platform:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Contact our support team within 30 days of the incident',
                      'Provide detailed documentation and evidence',
                      'Cooperate fully with our investigation process',
                      'Accept our determination after thorough review',
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <CheckCircle2 size={20} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">7</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Suspension</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to suspend or terminate accounts if:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Terms of Service violations occur',
                      'Fraudulent or suspicious activity is detected',
                      'Illegal activities are suspected',
                      'Professional conduct standards are violated',
                      'False or misleading information is provided',
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <span className="text-[#C9A84C] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">8</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To the maximum extent permitted by law, we shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the platform, including loss of data or business interruption. Users interact with each other at their own risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">9</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting. Your continued use of the platform constitutes acceptance of modified terms. We will notify users of significant changes via email or platform notification.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 hover:border-[#C9A84C]/30 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A84C] font-bold text-sm">10</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms of Service are governed by and construed in accordance with the laws of Nigeria and the African Union, without regard to its conflict of law provisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-100 bg-white px-5 py-16 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            If you have any questions about these Terms of Service, please don't hesitate to reach out to our support team. We're here to help clarify any concerns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A84C] text-white font-semibold rounded-xl hover:bg-[#B8962E] transition-all shadow-lg shadow-[#C9A84C]/30"
            >
              Create Account <ArrowRight size={20} />
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
