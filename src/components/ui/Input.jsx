import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    type = 'text',
    prefix,
    suffix,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    onRightIconClick,
    onClear,
    className = '',
    inputClassName = '',
    disabled = false,
    value,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            <LeftIcon className="w-5 h-5" />
          </div>
        )}
        {prefix && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500 font-semibold text-sm">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          type={effectiveType}
          disabled={disabled}
          value={value}
          className={`w-full bg-slate-50 border transition-all duration-150 rounded-2xl text-slate-900 text-sm font-medium placeholder:text-slate-400 py-3.5 px-4 min-h-[48px] focus:outline-none focus:bg-white
            ${LeftIcon ? 'pl-11' : ''}
            ${prefix ? 'pl-16' : ''}
            ${RightIcon || isPassword || onClear ? 'pr-11' : ''}
            ${error 
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/30' 
              : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            }
            ${disabled ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        <div className="absolute right-3.5 flex items-center gap-1.5 text-slate-400">
          {onClear && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:text-slate-600 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          {RightIcon && !isPassword && (
            <button
              type="button"
              onClick={onRightIconClick}
              disabled={!onRightIconClick}
              className={`p-1 ${onRightIconClick ? 'hover:text-slate-600 cursor-pointer' : 'pointer-events-none'}`}
            >
              <RightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});
