'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';

export default function MyProfilePage() {
  return (
    <ProtectedPageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-2">Manage your profile information and business details</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-lg">Profile management coming soon</p>
        </div>
      </div>
    </ProtectedPageWrapper>
  );
}
