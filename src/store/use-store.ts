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
  searchTerm: string;
  addToCart: (comic: Comic) => void;
  removeFromCart: (comicId: string) => void;
  updateQuantity: (comicId: string, quantity: number) => void;
  toggleCart: () => void;
  toggleWishlist: (comic: Comic) => void;
  isInWishlist: (comicId: string) => boolean;
  setSearchTerm: (term: string) => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      searchTerm: '',
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
        const state = get();
        return state.wishlist.some((item) => item.id === comicId);
      },
      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    {
      name: 'comicverse-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);