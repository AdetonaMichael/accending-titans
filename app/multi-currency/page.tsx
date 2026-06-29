'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { LandingTopbar } from '@/components/LandingTopbar';
import { Footer } from '@/components/shared/Footer';

export default function MultiCurrencyPage() {
  return (
    <>
      <LandingTopbar />
      <main className="min-h-screen bg-white text-gray-900">
        {/* Coming Soon Section */}
        <section className="relative px-5 py-32 lg:px-8 bg-gradient-to-br from-[#C9A84C]/10 via-transparent to-[#C9A84C]/5 border-b border-gray-100 flex items-center min-h-screen">
          <div className="max-w-6xl mx-auto text-center w-full">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A84C]/20 mb-8">
              <Sparkles className="text-[#C9A84C]" size={32} />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              Coming Soon
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              We're building new features for Acceding Titans. Stay tuned for exciting updates that will help you grow your business and expand your network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A84C] text-white font-semibold rounded-xl hover:bg-[#B8962E] transition-all shadow-lg shadow-[#C9A84C]/30"
              >
                Back to Dashboard <ArrowRight size={20} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#C9A84C] text-[#C9A84C] font-semibold rounded-xl hover:bg-[#C9A84C]/5 transition-all"
              >
                Explore Community
              </Link>
            </div>

            <div className="mt-16 p-8 rounded-2xl border border-gray-200 bg-gray-50">
              <p className="text-gray-600 text-lg">
                In the meantime, check out our growing community features, business catalogues, and networking opportunities on the main platform.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

