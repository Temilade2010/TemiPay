import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Download } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { TransactionItem } from '../components/shared/TransactionItem';
import { ReceiptModal } from '../components/shared/ReceiptModal';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppStore } from '../store/useAppStore';

export function TransactionHistory() {
  const navigate = useNavigate();
  const transactions = useAppStore((state) => state.transactions);
  const showToast = useAppStore((state) => state.showToast);

  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'IN' | 'OUT' | 'BILLS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Tab filter
      if (filterTab === 'IN' && tx.amount < 0) return false;
      if (filterTab === 'OUT' && (tx.amount >= 0 || tx.category === 'Airtime' || tx.category === 'Data' || tx.category === 'Electricity')) return false;
      if (filterTab === 'BILLS' && !['Airtime', 'Data', 'Electricity', 'Cable TV', 'Betting'].includes(tx.category)) return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title?.toLowerCase().includes(q);
        const matchesRef = tx.reference?.toLowerCase().includes(q);
        const matchesRecipient = tx.recipient?.toLowerCase().includes(q);
        return matchesTitle || matchesRef || matchesRecipient;
      }

      return true;
    });
  }, [transactions, filterTab, searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-12">
      <Header
        title="Transaction History"
        subtitle="Receipts & Statement"
        showBack={true}
        onBack={() => navigate(-1)}
        rightAction={
          <button
            type="button"
            onClick={() => showToast('Statement exported to PDF', 'success')}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title="Download Statement"
          >
            <Download className="w-5 h-5" />
          </button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, reference or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'IN', label: 'Money In (+)' },
            { id: 'OUT', label: 'Transfers' },
            { id: 'BILLS', label: 'Bills & Airtime' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              className={`flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition-all border ${
                filterTab === tab.id
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-soft">
          {filteredTransactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="No transaction matched your filter or search query."
              actionLabel="Clear Filters"
              onAction={() => {
                setFilterTab('ALL');
                setSearchQuery('');
              }}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onClick={() => setSelectedTx(tx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
}
