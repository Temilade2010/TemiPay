import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Header({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  variant = 'white', // 'white' | 'brand' | 'transparent'
  className = '',
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const variants = {
    white: 'bg-white text-slate-800 border-b border-slate-100',
    brand: 'bg-brand-600 text-white shadow-sm',
    transparent: 'bg-transparent text-slate-800',
  };

  return (
    <header
      className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between min-h-[52px] select-none transition-colors ${variants[variant] || variants.white} ${className}`}
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className={`p-2 -ml-2 rounded-full transition-colors active:scale-95 ${
              variant === 'brand' 
                ? 'hover:bg-brand-700 text-white' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          {title && <h1 className="text-base font-bold tracking-tight leading-tight">{title}</h1>}
          {subtitle && <p className="text-[11px] opacity-75">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {rightAction}
      </div>
    </header>
  );
}
