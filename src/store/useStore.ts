import { create } from 'zustand';
import { Card } from '@/lib/types';

interface CartItem {
  id: string;
  card: Card;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  expiresAt: string | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (cardId: string) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

interface UIState {
  isCartOpen: boolean;
  toggleCart: () => void;
  notification: { message: string; type: 'success' | 'error' } | null;
  showNotification: (message: string, type: 'success' | 'error') => void;
  clearNotification: () => void;
}

interface StoreState extends CartState, UIState {}

export const useStore = create<StoreState>((set, get) => ({
  // Cart state
  items: [],
  total: 0,
  expiresAt: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      set({
        items: data.items || [],
        total: data.total || 0,
        expiresAt: data.expiresAt || null,
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (cardId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });

      if (!res.ok) {
        const error = await res.json();
        get().showNotification(error.error || 'Failed to add to cart', 'error');
        return false;
      }

      const data = await res.json();
      set({
        items: data.items || [],
        total: data.total || 0,
        expiresAt: data.expiresAt || null,
      });
      get().showNotification('Card added to cart!', 'success');
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      get().showNotification('Failed to add to cart', 'error');
      return false;
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove from cart');
      }

      const data = await res.json();
      set({
        items: data.items || [],
        total: data.total || 0,
        expiresAt: data.expiresAt || null,
      });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      get().showNotification('Failed to remove from cart', 'error');
    }
  },

  clearCart: () => {
    set({ items: [], total: 0, expiresAt: null });
  },

  // UI state
  isCartOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  notification: null,
  showNotification: (message: string, type: 'success' | 'error') => {
    set({ notification: { message, type } });
    setTimeout(() => {
      set({ notification: null });
    }, 3000);
  },
  clearNotification: () => set({ notification: null }),
}));
