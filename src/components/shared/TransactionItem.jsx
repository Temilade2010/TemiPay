import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  PiggyBank, 
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';

export function TransactionItem({ transaction, onClick }) {
  const isPositive = Number(transaction.amount) > 0;

  // Determine icon & color based on transaction category/type
  const getCategoryDetails = () => {
    switch (transaction.category) {
      case 'Money In':
      case 'Top-up':
        return { icon: ArrowDownLeft, bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'Transfer':
      case 'Money Out':
        return { icon: ArrowUpRight, bg: 'bg-slate-100', text: 'text-slate-700' };
      case 'Airtime':
        return { icon: Smartphone, bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'Data':
        return { icon: Wifi, bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'Electricity':
        return { icon: Zap, bg: 'bg-yellow-50', text: 'text-yellow-600' };
      case 'Cable TV':
        return { icon: Tv, bg: 'bg-purple-50', text: 'text-purple-600' };
      case 'Savings':
        return { icon: PiggyBank, bg: 'bg-teal-50', text: 'text-teal-600' };
      default:
        return { icon: ShoppingBag, bg: 'bg-brand-50', text: 'text-brand-600' };
    }
  };

  const { icon: Icon, bg, text } = getCategoryDetails();

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3.5 hover:bg-slate-50/80 active:bg-slate-100/70 rounded-2xl transition-colors cursor-pointer select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-11 h-11 rounded-2xl ${bg} ${text} flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="min-w-0 pr-2">
          <p className="text-sm font-bold text-slate-800 truncate leading-snug">
            {transaction.title || transaction.narration || 'Transaction'}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p
          className={`text-sm font-black tracking-tight ${
            isPositive ? 'text-brand-600' : 'text-slate-900'
          }`}
        >
          {isPositive ? '+' : ''}
          {formatNaira(Math.abs(transaction.amount))}
        </p>
        <span
          className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider mt-0.5 ${
            transaction.status === 'SUCCESS'
              ? 'text-emerald-700 bg-emerald-50'
              : transaction.status === 'PENDING'
              ? 'text-amber-700 bg-amber-50'
              : 'text-rose-700 bg-rose-50'
          }`}
        >
          {transaction.status || 'SUCCESS'}
        </span>
      </div>
    </div>
  );
}
