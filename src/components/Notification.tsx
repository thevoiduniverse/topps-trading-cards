'use client';

import { useStore } from '@/store/useStore';

export default function Notification() {
  const { notification, clearNotification } = useStore();

  if (!notification) return null;

  const bgColor = notification.type === 'success'
    ? 'bg-[var(--nxg-lime)]/10 border-[var(--nxg-lime)]/30'
    : 'bg-red-500/10 border-red-500/30';

  const iconColor = notification.type === 'success'
    ? 'text-[var(--nxg-lime)]'
    : 'text-red-400';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`${bgColor} border rounded-2xl px-6 py-4 shadow-xl backdrop-blur-xl flex items-center gap-4`}>
        {notification.type === 'success' ? (
          <svg className={`w-6 h-6 ${iconColor} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className={`w-6 h-6 ${iconColor} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="text-white font-medium">{notification.message}</span>
        <button
          onClick={clearNotification}
          className="ml-2 text-[var(--nxg-text-muted)] hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
