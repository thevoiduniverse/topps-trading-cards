'use client';

import { useStore } from '@/store/useStore';
import PlayerCard from './PlayerCard';
import { Card } from '@/lib/types';

export default function CartSidebar() {
  const { items, total, isCartOpen, toggleCart, removeFromCart, expiresAt } = useStore();

  if (!isCartOpen) return null;

  const timeRemaining = expiresAt ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000 / 60)) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--nxg-bg-secondary)] border-l border-[var(--nxg-border)] z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--nxg-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Your Cart
            </h2>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-[var(--nxg-bg-tertiary)] rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--nxg-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {items.length > 0 && timeRemaining > 0 && (
            <p className="text-sm text-[var(--nxg-text-muted)] mt-2">
              Reserved for {timeRemaining} minutes
            </p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-[var(--nxg-text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-[var(--nxg-text-muted)] mb-4">Your cart is empty</p>
              <button
                onClick={toggleCart}
                className="text-[var(--nxg-lime)] hover:underline font-medium"
              >
                Browse cards
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-4 flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <PlayerCard card={item.card as Card} size="sm" showStats={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.card.playerName}</h3>
                    <p className="text-sm text-[var(--nxg-text-secondary)]">
                      {item.card.team} • {item.card.overall} OVR
                    </p>
                    <p className="text-lg font-bold text-[var(--nxg-lime)] mt-3">
                      ${item.card.price.toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--nxg-border)] bg-[var(--nxg-bg-tertiary)]">
            <div className="flex items-center justify-between mb-5">
              <span className="text-lg text-[var(--nxg-text-secondary)]">Total</span>
              <span className="text-2xl font-bold text-[var(--nxg-lime)]">
                ${total.toLocaleString()}
              </span>
            </div>
            <button className="nxg-btn w-full text-center text-lg py-4">
              Checkout
            </button>
            <p className="text-xs text-center text-[var(--nxg-text-muted)] mt-4">
              Stripe integration coming soon
            </p>
          </div>
        )}
      </div>
    </>
  );
}
