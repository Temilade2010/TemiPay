import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, Gift, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function BottomNav() {
  const user = useAppStore((state) => state.user);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/cards', label: 'Cards', icon: CreditCard },
    { to: '/rewards', label: 'Rewards', icon: Gift, badge: 'Win' },
    { to: '/profile', label: 'Me', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 py-1.5 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl relative transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white uppercase animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
