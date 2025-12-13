import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Comic } from '@/lib/comic-data';
interface CartItem extends Comic {
  quantity: number;
}
interface AppState {
  cart: CartItem[];
  wishlist: Comic[];
  isCartOpen: boolean;
  addToCart: (comic: Comic) => void;
  removeFromCart: (comicId: string) => void;
  updateQuantity: (comicId: string, quantity: number) => void;
  toggleCart: () => void;
  addToWishlist: (comic: Comic) => void;
  removeFromWishlist: (comicId: string) => void;
  isInWishlist: (comicId: string) => boolean;
}
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
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
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addToWishlist: (comic) =>
        set((state) => {
          if (state.wishlist.some((item) => item.id === comic.id)) {
            return state; // Already in wishlist
          }
          return { wishlist: [...state.wishlist, comic] };
        }),
      removeFromWishlist: (comicId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== comicId),
        })),
      isInWishlist: (comicId) => {
        const state = get();
        return state.wishlist.some((item) => item.id === comicId);
      },
    }),
    {
      name: 'comicverse-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);