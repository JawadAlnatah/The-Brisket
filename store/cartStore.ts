import { create } from 'zustand';

export type Category = 'Main Dishes' | 'Salads' | 'Appetizers' | 'Sauces' | 'Soft Drinks';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  stock: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  decreaseItem: (itemId: string) => void;
}

/**
 * ── Global Shopping Cart State (Zustand) ──
 * This store manages the user's shopping cart across the entire application.
 * 
 * ============================================================================
 * EXPLANATION OF SESSIONS (As required by CIS 311 Rubric Task 5):
 * ============================================================================
 * In traditional web development (like PHP), "Sessions" are used to remember 
 * what a user put in their cart as they navigate from page to page. Without a 
 * session, the website would forget the cart contents every time a link is clicked.
 * 
 * In this modern React/Next.js application, Zustand acts as our "Session". 
 * It holds the cart items in the browser's active memory (client-side state).
 * - When a user clicks "Add to Cart", the item is saved into this session memory.
 * - Because it's stored in active memory, it is extremely fast and doesn't require 
 *   constantly reading/writing to the database.
 * - Just like a shopping cart in a real store, this session memory only lasts 
 *   as long as the user is actively browsing. If they close the browser tab, 
 *   the session is destroyed and the cart is emptied.
 * ============================================================================
 */
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        if (existingItem.quantity >= item.stock) {
          return state; // Prevent adding more than available stock
        }
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      if (item.stock < 1) return state;
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
  totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
  decreaseItem: (itemId) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return {
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          ),
        };
      }
      // If quantity is 1, remove it? Be careful with user intent. Usually - at 1 removes it or disables. 
      // Let's remove it if it goes below 1, or just do nothing? 
      // Standard behavior: if 1, remove.
      if (existingItem && existingItem.quantity === 1) {
        return {
          items: state.items.filter((i) => i.id !== itemId)
        };
      }
      return {};
    });
  },
}));
