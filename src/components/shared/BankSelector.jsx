import React, { useState, useMemo } from 'react';
import { Search, Building2, Check } from 'lucide-react';
import { NIGERIAN_BANKS } from '../../data/banks';
import { BottomSheet } from '../ui/BottomSheet';

export function BankSelector({ isOpen, onClose, selectedBank, onSelectBank }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return NIGERIAN_BANKS;
    const q = searchQuery.toLowerCase();
    return NIGERIAN_BANKS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.code.includes(q)
    );
  }, [searchQuery]);

  const popularBanks = useMemo(() => {
    return NIGERIAN_BANKS.filter((b) => b.popular);
  }, []);

  const handleSelect = (bank) => {
    onSelectBank(bank);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Destination Bank">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bank name or 3-digit code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            autoFocus
          />
        </div>

        {/* Popular Banks section if search query is empty */}
        {!searchQuery && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Popular Banks
            </p>
            <div className="grid grid-cols-4 gap-2">
              {popularBanks.slice(0, 8).map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => handleSelect(bank)}
                  className={`flex flex-col items-center p-2 rounded-2xl border text-center transition-all active:scale-95 ${
                    selectedBank?.id === bank.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-extrabold mb-1 shadow-sm"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 leading-tight line-clamp-1">
                    {bank.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Full Bank List */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            All Banks ({filteredBanks.length})
          </p>
          <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
            {filteredBanks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No bank found matching "{searchQuery}"
              </div>
            ) : (
              filteredBanks.map((bank) => {
                const isSelected = selectedBank?.id === bank.id;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleSelect(bank)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-50/80 text-brand-800 font-bold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: bank.color }}
                      >
                        {bank.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{bank.name}</p>
                        <p className="text-[11px] text-slate-400">{bank.type} Bank • Code: {bank.code}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-brand-600 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
