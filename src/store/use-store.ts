import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Comic } from '@shared/types';
interface CartItem extends Comic {
  quantity: number;
}
interface AppState {
  // User state
  userId: string | null;
  setUserId: (userId: string) => void;
  logout: () => void;
  // UI state
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isAuthSheetOpen: boolean;
  searchTerm: string;
  toggleCart: () => void;
  toggleWishlistSheet: () => void;
  toggleAuthSheet: () => void;
  setSearchTerm: (term: string) => void;
  // Cart & Wishlist
  cart: CartItem[];
  wishlist: Comic[];
  addToCart: (comic: Comic) => void;
  removeFromCart: (comicId: string) => void;
  updateQuantity: (comicId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (comic: Comic) => void;
  isInWishlist: (comicId: string) => boolean;
  // Checkout state
  promoCode: string;
  discountPercent: number;
  shippingOption: 'standard' | 'express';
  shippingCost: number;
  setPromoCode: (code: string) => void;
  applyPromoCode: () => boolean;
  setShippingOption: (option: 'standard' | 'express') => void;
}
const PROMO_CODES: { [key: string]: number } = {
  COMICVERSE10: 0.10, // 10% off
  CLOUDFLARE20: 0.20, // 20% off
};
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      userId: null,
      setUserId: (userId) => set({ userId }),
      logout: () => set({ userId: null, cart: [], wishlist: [] }),
      // UI state
      isCartOpen: false,
      isWishlistOpen: false,
      isAuthSheetOpen: false,
      searchTerm: '',
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleWishlistSheet: () => set((state) => ({ isWishlistOpen: !state.isWishlistOpen })),
      toggleAuthSheet: () => set((state) => ({ isAuthSheetOpen: !state.isAuthSheetOpen })),
      setSearchTerm: (term) => set({ searchTerm: term }),
      // Cart & Wishlist
      cart: [],
      wishlist: [],
      addToCart: (comic) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === comic.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === comic.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...comic, quantity: 1 }] };
        }),
      removeFromCart: (comicId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== comicId),
        })),
      updateQuantity: (comicId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === comicId ? { ...item, quantity: Math.max(0, quantity) } : item
          ).filter(item => item.quantity > 0),
        })),
      clearCart: () => set({ cart: [], promoCode: '', discountPercent: 0 }),
      toggleWishlist: (comic) =>
        set((state) => {
          const isInWishlist = state.wishlist.some((item) => item.id === comic.id);
          if (isInWishlist) {
            return { wishlist: state.wishlist.filter((item) => item.id !== comic.id) };
          } else {
            return { wishlist: [...state.wishlist, comic] };
          }
        }),
      isInWishlist: (comicId) => get().wishlist.some((item) => item.id === comicId),
      // Checkout state
      promoCode: '',
      discountPercent: 0,
      shippingOption: 'standard',
      shippingCost: 5.00,
      setPromoCode: (code) => set({ promoCode: code }),
      applyPromoCode: () => {
        const code = get().promoCode.toUpperCase();
        if (PROMO_CODES[code]) {
          set({ discountPercent: PROMO_CODES[code] });
          return true;
        }
        set({ discountPercent: 0 });
        return false;
      },
      setShippingOption: (option) => {
        if (option === 'standard') {
          set({ shippingOption: 'standard', shippingCost: 5.00 });
        } else if (option === 'express') {
          set({ shippingOption: 'express', shippingCost: 15.00 });
        }
      },
    }),
    {
      name: 'comicverse-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        cart: state.cart,
        wishlist: state.wishlist,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        shippingOption: state.shippingOption,
        shippingCost: state.shippingCost,
      }),
    }
  )
);
// Selectors for derived state to prevent unnecessary re-renders
export const useCartTotals = () => {
  const { cart, shippingCost, discountPercent } = useAppStore(state => ({
    cart: state.cart,
    shippingCost: state.shippingCost,
    discountPercent: state.discountPercent,
  }));
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * discountPercent;
  const tax = (subtotal - discount) * 0.08; // Tax calculated on discounted price
  const total = subtotal - discount + tax + shippingCost;
  return { subtotal, discount, tax, total, shippingCost };
};