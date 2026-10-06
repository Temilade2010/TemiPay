import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  className = '',
  maxHeight = 'max-h-[90vh]',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sheet Content container */}
      <div
        className={`relative w-full max-w-[440px] bg-white rounded-t-[28px] shadow-sheet z-10 flex flex-col overflow-hidden animate-slide-up ${maxHeight} ${className}`}
      >
        {/* Grab Handle */}
        <div className="w-full flex justify-center pt-3 pb-2 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-2 border-b border-slate-100">
            {title ? (
              <h3 className="text-base font-bold text-slate-800">{title}</h3>
            ) : <div />}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
