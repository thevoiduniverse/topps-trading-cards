'use client';

import { useStore } from '@/store/useStore';
import TradingCard from './TradingCard';
import { Card, PARALLEL_LABELS } from '@/lib/types';

export default function CartSidebar() {
  const { items, total, isCartOpen, toggleCart, removeFromCart, expiresAt } = useStore();

  if (!isCartOpen) return null;

  const timeRemaining = expiresAt ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000 / 60)) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="cart-overlay"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="cart-panel">
        {/* Header */}
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>
            {items.length > 0 && timeRemaining > 0 && (
              <p className="text-sm text-muted mt-1">
                Reserved for {timeRemaining} minutes
              </p>
            )}
          </div>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="empty-state-title">Cart is Empty</h3>
              <p className="empty-state-text">Add some cards to get started</p>
              <button
                onClick={toggleCart}
                className="text-lime hover:underline font-medium"
              >
                Browse cards
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24">
                      {item.card.frontImageUrl ? (
                        <img
                          src={item.card.frontImageUrl}
                          alt={item.card.playerName}
                          className="w-full aspect-[3/4] object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full aspect-[3/4] bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-muted" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.card.playerName}</h3>
                      <p className="text-sm text-muted">
                        {item.card.year} {item.card.setName}
                      </p>
                      {item.card.parallelType !== 'BASE' && (
                        <p className="text-xs text-lime">
                          {PARALLEL_LABELS[item.card.parallelType] || item.card.parallelType}
                        </p>
                      )}
                      <p className="text-lg font-bold text-lime mt-2">
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">
                ${total.toLocaleString()}
              </span>
            </div>
            <button className="btn btn-primary w-full text-lg py-4">
              Checkout
            </button>
            <p className="text-xs text-center text-muted mt-4">
              Stripe integration coming soon
            </p>
          </div>
        )}
      </div>
    </>
  );
}
