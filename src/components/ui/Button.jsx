import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px]';

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/25 focus:ring-brand-500',
    secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200/60 focus:ring-brand-400',
    outline: 'bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-brand-400',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20 focus:ring-rose-400',
    accent: 'bg-gradient-to-r from-brand-500 to-teal-600 text-white shadow-float focus:ring-teal-400',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 rounded-xl min-h-[38px]',
    md: 'text-sm px-5 py-3 rounded-2xl min-h-[46px]',
    lg: 'text-base px-6 py-3.5 rounded-2xl min-h-[52px]',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${width} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
          {children}
        </span>
      )}
    </button>
  );
}
