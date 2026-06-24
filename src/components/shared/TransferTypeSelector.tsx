/**
 * TransferTypeSelector Component
 * Allows user to choose between Accending Titans and Bank transfer
 */

'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Send, Building2 } from 'lucide-react';

interface TransferTypeSelectorProps {
  onSelect: (type: 'Accending Titans' | 'bank') => void;
  disabled?: boolean;
}

export const TransferTypeSelector = ({ onSelect, disabled = false }: TransferTypeSelectorProps) => {
  const [selected, setSelected] = useState<'Accending Titans' | 'bank' | null>(null);

  const handleSelect = (type: 'Accending Titans' | 'bank') => {
    setSelected(type);
    onSelect(type);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Choose Transfer Type</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Accending Titans Transfer Card */}
        <Card
          className={`cursor-pointer transition-all ${
            selected === 'Accending Titans'
              ? 'border-[#d71927] bg-white/5'
              : 'hover:border-white/20'
          }`}
          onClick={() => !disabled && handleSelect('Accending Titans')}
        >
          <div className="flex flex-col items-center gap-3 py-6">
            <Send className={`w-8 h-8 ${selected === 'Accending Titans' ? 'text-[#d71927]' : 'text-white/60'}`} />
            <h4 className="font-semibold text-white">Accending Titans User</h4>
            <p className="text-xs text-white/60 text-center">Transfer to another Accending Titans user</p>
          </div>
        </Card>

        {/* Bank Transfer Card */}
        <Card
          className={`cursor-pointer transition-all ${
            selected === 'bank'
              ? 'border-[#d71927] bg-white/5'
              : 'hover:border-white/20'
          }`}
          onClick={() => !disabled && handleSelect('bank')}
        >
          <div className="flex flex-col items-center gap-3 py-6">
            <Building2 className={`w-8 h-8 ${selected === 'bank' ? 'text-[#d71927]' : 'text-white/60'}`} />
            <h4 className="font-semibold text-white">Bank Account</h4>
            <p className="text-xs text-white/60 text-center">Transfer to any bank account</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
