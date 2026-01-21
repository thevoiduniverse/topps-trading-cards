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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--fut-bg-panel)] border-l border-[var(--fut-border)] z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--fut-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}>
              YOUR CART
            </h2>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-[var(--fut-bg-card)] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {items.length > 0 && timeRemaining > 0 && (
            <p className="text-sm text-[var(--fut-text-secondary)] mt-2">
              Reserved for {timeRemaining} minutes
            </p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-[var(--fut-text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-[var(--fut-text-muted)]">Your cart is empty</p>
              <button
                onClick={toggleCart}
                className="mt-4 text-[var(--fut-gold)] hover:underline"
              >
                Browse cards
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="fut-card p-4 flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <PlayerCard card={item.card as Card} size="sm" showStats={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{item.card.playerName}</h3>
                    <p className="text-sm text-[var(--fut-text-secondary)]">
                      {item.card.team} • {item.card.overall} OVR
                    </p>
                    <p className="text-lg font-bold text-[var(--fut-gold)] mt-2">
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
          <div className="p-6 border-t border-[var(--fut-border)] bg-[var(--fut-bg-card)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-[var(--fut-text-secondary)]">Total</span>
              <span className="text-2xl font-bold text-[var(--fut-gold)]">
                ${total.toLocaleString()}
              </span>
            </div>
            <button className="fut-btn w-full text-center">
              Checkout
            </button>
            <p className="text-xs text-center text-[var(--fut-text-muted)] mt-3">
              Stripe integration coming soon
            </p>
          </div>
        )}
      </div>
    </>
  );
}
