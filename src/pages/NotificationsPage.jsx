import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ArrowDownLeft, ArrowUpRight, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppStore } from '../store/useAppStore';
import { formatDate } from '../utils/formatters';

export function NotificationsPage() {
  const navigate = useNavigate();
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useAppStore((state) => state.markAllNotificationsRead);
  const showToast = useAppStore((state) => state.showToast);

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'UNREAD') return n.unread;
    return true;
  });

  const handleMarkAll = () => {
    markAllNotificationsRead();
    showToast('All notifications marked as read', 'info');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'CREDIT':
        return { icon: ArrowDownLeft, bg: 'bg-emerald-50 text-emerald-600' };
      case 'DEBIT':
        return { icon: ArrowUpRight, bg: 'bg-slate-100 text-slate-700' };
      case 'SAVINGS':
        return { icon: Sparkles, bg: 'bg-amber-50 text-amber-600' };
      case 'SECURITY':
        return { icon: ShieldAlert, bg: 'bg-rose-50 text-rose-600' };
      default:
        return { icon: Bell, bg: 'bg-brand-50 text-brand-600' };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-12">
      <Header
        title="Notifications"
        subtitle="Alerts & System Updates"
        showBack={true}
        onBack={() => navigate(-1)}
        rightAction={
          notifications.some((n) => n.unread) && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark Read</span>
            </button>
          )
        }
      />

      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all ${
              filter === 'ALL'
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            All Notifications
          </button>

          <button
            type="button"
            onClick={() => setFilter('UNREAD')}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all ${
              filter === 'UNREAD'
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Unread ({notifications.filter((n) => n.unread).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft">
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="You are all caught up on transaction and security alerts."
              />
            </div>
          ) : (
            filteredNotifs.map((item) => {
              const { icon: Icon, bg } = getNotifIcon(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer relative shadow-sm ${
                    item.unread
                      ? 'bg-white border-brand-200 shadow-soft'
                      : 'bg-slate-50/80 border-slate-200/80 opacity-80'
                  }`}
                >
                  {item.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 absolute top-4 right-4" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div className="flex-1 pr-4">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {item.body}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-2">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
