'use client';

import { useEffect, useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from 'lucide-react';

import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { PageSkeleton } from '@/components/shared/SkeletonLoader';
import { walletService } from '@/services/wallet.service';
import { formatDate } from '@/utils/format.utils';

interface WalletTransaction {
  id: number;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  status: string;
  created_at: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balRes, txRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(1, 20),
      ]);

      if (balRes.success && balRes.data) {
        setBalance((balRes.data as any).balance ?? 0);
      }

      if (txRes.success && txRes.data) {
        const txData = Array.isArray(txRes.data)
          ? txRes.data
          : (txRes.data as any).data ?? [];
        setTransactions(txData);
      }
    } catch (err) {
      console.error('Error fetching wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'referral_bonus' || type === 'birthday_reward' || type === 'credit')
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    if (type === 'withdrawal' || type === 'subscription_payment' || type === 'debit')
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === 'referral_bonus' || type === 'birthday_reward' || type === 'credit') return 'text-green-600';
    if (type === 'withdrawal' || type === 'subscription_payment' || type === 'debit') return 'text-red-500';
    return 'text-amber-500';
  };

  const formatAmount = (amount: number, type: string) => {
    const isCredit = ['referral_bonus', 'birthday_reward', 'credit'].includes(type);
    const prefix = isCredit ? '+' : '-';
    return `${prefix}₦${Math.abs(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Balance Card */}
      <Card className="rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-[#C9A84C]/5 to-[#FDFAF3] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
            <p className="mt-2 text-4xl font-extrabold text-gray-900">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A84C]/10">
            <Wallet className="h-7 w-7 text-[#C9A84C]" />
          </div>
        </div>
      </Card>

      {/* Transactions */}
      <Card className="rounded-2xl border border-[#e5e7eb] bg-white p-0 shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {tx.description || tx.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getTransactionColor(tx.type)}`}>
                    {formatAmount(tx.amount, tx.type)}
                  </p>
                  <Badge
                    variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}
                    size="sm"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
