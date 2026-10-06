import React from 'react';

export function ServiceTile({
  icon: Icon,
  label,
  badge,
  badgeColor = 'bg-rose-500 text-white',
  bgColor = 'bg-brand-50 text-brand-700',
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-150 active:scale-95 hover:bg-slate-50 group relative select-none w-full"
    >
      {badge && (
        <span className={`absolute -top-1.5 right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white uppercase shadow-sm z-10 animate-bounce ${badgeColor}`}>
          {badge}
        </span>
      )}
      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center shadow-sm group-hover:shadow transition-shadow mb-1.5 border border-slate-100/60`}>
        <Icon className="w-6 h-6 stroke-[2]" />
      </div>
      <span className="text-xs font-semibold text-slate-700 text-center tracking-tight truncate w-full group-hover:text-brand-600 transition-colors">
        {label}
      </span>
    </button>
  );
}
