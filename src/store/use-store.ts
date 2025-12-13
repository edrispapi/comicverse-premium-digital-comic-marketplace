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
  // User-specific data
  cart: CartItem[];
  wishlist: Comic[];
  addToCart: (comic: Comic) => void;
  removeFromCart: (comicId: string) => void;
  updateQuantity: (comicId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (comic: Comic) => void;
  isInWishlist: (comicId: string) => boolean;
}
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      userId: null,
      setUserId: (userId) => set({ userId }),
      logout: () => set({ userId: null, cart: [], wishlist: [] }), // Clear user data on logout
      // UI state
      isCartOpen: false,
      isWishlistOpen: false,
      isAuthSheetOpen: false,
      searchTerm: '',
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleWishlistSheet: () => set((state) => ({ isWishlistOpen: !state.isWishlistOpen })),
      toggleAuthSheet: () => set((state) => ({ isAuthSheetOpen: !state.isAuthSheetOpen })),
      setSearchTerm: (term) => set({ searchTerm: term }),
      // User-specific data
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
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (comic) =>
        set((state) => {
          const isInWishlist = state.wishlist.some((item) => item.id === comic.id);
          if (isInWishlist) {
            return { wishlist: state.wishlist.filter((item) => item.id !== comic.id) };
          } else {
            return { wishlist: [...state.wishlist, comic] };
          }
        }),
      isInWishlist: (comicId) => {
        return get().wishlist.some((item) => item.id === comicId);
      },
    }),
    {
      name: 'comicverse-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user-specific data and the user ID
      partialize: (state) => ({
        userId: state.userId,
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);