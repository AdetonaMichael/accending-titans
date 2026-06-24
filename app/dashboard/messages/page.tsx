'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { Send } from 'lucide-react';

export default function MessagesPage() {
  return (
    <ProtectedPageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-2">Direct messaging with community members</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
          <Send className="mx-auto mb-4 text-[#C9A84C]" size={48} />
          <p className="text-gray-400 text-lg">No messages yet</p>
          <p className="text-gray-500 text-sm mt-2">Start connecting with other members in the community</p>
        </div>
      </div>
    </ProtectedPageWrapper>
  );
}
