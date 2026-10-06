import React from 'react';
import { formatNaira } from '../../utils/formatters';

const DEFAULT_CHIPS = [1000, 2000, 5000, 10000, 20000, 50000];

export function AmountInput({
  value,
  onChange,
  chips = DEFAULT_CHIPS,
  availableBalance,
  error,
  label = 'Enter Amount',
  min = 50,
  max = 5000000,
  className = ''
}) {
  const handleChipClick = (amount) => {
    onChange(amount.toString());
  };

  const handleMaxClick = () => {
    if (availableBalance !== undefined) {
      onChange(Math.floor(availableBalance).toString());
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {availableBalance !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Bal: {formatNaira(availableBalance, { showDecimals: false })}</span>
            <button
              type="button"
              onClick={handleMaxClick}
              className="text-brand-600 font-bold hover:underline ml-1"
            >
              MAX
            </button>
          </div>
        )}
      </div>

      {/* Hero Display Input */}
      <div className={`relative flex items-center bg-slate-50 border rounded-2xl px-4 py-3 transition-all ${
        error ? 'border-rose-400 bg-rose-50/20 ring-2 ring-rose-500/10' : 'border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:bg-white'
      }`}>
        <span className="text-2xl font-black text-brand-600 mr-2 select-none">₦</span>
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-2xl font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-300"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg bg-slate-200/60"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}

      {/* Quick Chips */}
      {chips && chips.length > 0 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
          {chips.map((chip) => {
            const isSelected = String(chip) === String(value);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'
                }`}
              >
                ₦{chip.toLocaleString()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
