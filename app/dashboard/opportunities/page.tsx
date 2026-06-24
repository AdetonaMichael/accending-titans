'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { Briefcase } from 'lucide-react';

export default function OpportunitiesPage() {
  return (
    <ProtectedPageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Opportunities</h1>
          <p className="text-gray-400 mt-2">Jobs, partnerships, and business opportunities</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
          <Briefcase className="mx-auto mb-4 text-[#C9A84C]" size={48} />
          <p className="text-gray-400 text-lg">No opportunities available yet</p>
          <p className="text-gray-500 text-sm mt-2">Check back soon for new job openings and partnership opportunities</p>
        </div>
      </div>
    </ProtectedPageWrapper>
  );
}
