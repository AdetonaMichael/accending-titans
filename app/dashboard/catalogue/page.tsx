'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { Store, Plus } from 'lucide-react';

export default function CataloguePage() {
  return (
    <ProtectedPageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Business Catalogue</h1>
            <p className="text-gray-400 mt-2">Showcase and manage your products and services</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-gray-900 font-semibold rounded-lg hover:bg-[#B8962E] transition-all">
            <Plus size={20} />
            Add Item
          </button>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
          <Store className="mx-auto mb-4 text-[#C9A84C]" size={48} />
          <p className="text-gray-400 text-lg">Your catalogue is empty</p>
          <p className="text-gray-500 text-sm mt-2">Start by adding your first product or service</p>
        </div>
      </div>
    </ProtectedPageWrapper>
  );
}
