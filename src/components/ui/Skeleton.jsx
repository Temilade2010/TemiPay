import React from 'react';

export function Skeleton({ className = '', variant = 'rect' }) {
  const variants = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variants[variant] || ''} ${className}`}
    />
  );
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 px-2 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-11 h-11" />
        <div className="space-y-1.5">
          <Skeleton variant="text" className="w-28" />
          <Skeleton variant="text" className="w-20 h-3" />
        </div>
      </div>
      <div className="space-y-1.5 text-right">
        <Skeleton variant="text" className="w-16 ml-auto" />
        <Skeleton variant="text" className="w-10 h-3 ml-auto" />
      </div>
    </div>
  );
}
