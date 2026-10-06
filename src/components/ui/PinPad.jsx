import React, { useState } from 'react';
import { Delete, Fingerprint } from 'lucide-react';

export function PinPad({
  length = 4,
  onComplete,
  error = '',
  title = 'Enter Transaction PIN',
  subtitle = 'Authorize payment with your 4-digit security PIN',
  allowBiometrics = true,
  onBiometricClick,
}) {
  const [pin, setPin] = useState('');

  const handleDigit = (digit) => {
    if (pin.length < length) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === length) {
        setTimeout(() => {
          onComplete(newPin);
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full flex flex-col items-center">
      {title && <h3 className="text-lg font-bold text-slate-800 text-center">{title}</h3>}
      {subtitle && <p className="text-xs text-slate-500 text-center mt-1 mb-6 max-w-xs">{subtitle}</p>}

      {/* PIN dots display */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {Array.from({ length }).map((_, idx) => {
          const filled = idx < pin.length;
          return (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                error
                  ? 'bg-rose-500 ring-4 ring-rose-100 scale-105'
                  : filled
                  ? 'bg-brand-500 scale-125 shadow-md shadow-brand-500/30'
                  : 'bg-slate-200 border border-slate-300'
              }`}
            />
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-semibold text-rose-500 mb-4 animate-shake">
          {error}
        </p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {digits.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num)}
            className="h-14 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-xl font-bold text-slate-800 flex items-center justify-center active:bg-slate-100 active:scale-95 transition-all select-none hover:border-brand-200"
          >
            {num}
          </button>
        ))}

        {/* Bottom row: Biometric / empty, 0, Backspace */}
        <div className="flex items-center justify-center">
          {allowBiometrics && onBiometricClick ? (
            <button
              type="button"
              onClick={onBiometricClick}
              className="h-14 w-full rounded-2xl text-brand-600 flex items-center justify-center active:bg-brand-50 hover:bg-brand-50/50 transition-all"
              title="Use Biometrics"
            >
              <Fingerprint className="w-6 h-6" />
            </button>
          ) : (
            <div className="h-14" />
          )}
        </div>

        <button
          type="button"
          onClick={() => handleDigit(0)}
          className="h-14 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-xl font-bold text-slate-800 flex items-center justify-center active:bg-slate-100 active:scale-95 transition-all select-none hover:border-brand-200"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="h-14 rounded-2xl text-slate-600 flex items-center justify-center active:bg-slate-100 active:scale-95 transition-all hover:text-slate-900"
          aria-label="Delete last digit"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
