import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Comic, User, Notification, UserStats, Award } from '@shared/types';
import { useShallow } from 'zustand/react/shallow';
import { v4 as uuidv4 } from 'uuid';
interface CartItem extends Comic {
  quantity: number;
}
interface AppState {
  // User state
  userId: string | null;
  authToken: string | null;
  rememberMe: boolean;
  pts: number;
  awards: Award[];
  setUserId: (userId: string) => void;
  setAuthToken: (token: string | null) => void;
  setRememberMe: (remember: boolean) => void;
  clearAuth: () => void;
  updatePts: (delta: number) => void;
  earnAward: (type: Award['type']) => void;
  // UI state
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isAuthOpen: boolean;
  searchTerm: string;
  toggleCart: () => void;
  toggleWishlistSheet: () => void;
  toggleAuth: (isOpen?: boolean) => void;
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
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  // User Stats & Library
  stats: UserStats;
  reading: Comic[];
  completed: Comic[];
  setStats: (stats: UserStats) => void;
  updateLibrary: (allComics: Comic[]) => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      userId: null,
      authToken: null,
      rememberMe: false,
      pts: 0,
      awards: [],
      setUserId: (userId) => set({ userId }),
      setAuthToken: (token) => set({ authToken: token }),
      setRememberMe: (remember) => set({ rememberMe: remember }),
      clearAuth: () => set({ userId: null, authToken: null, pts: 0, awards: [] }),
      updatePts: (delta) => set((state) => ({ pts: state.pts + delta })),
      earnAward: (type) => set((state) => ({
        awards: [...state.awards, { id: uuidv4(), type, earnedAt: new Date().toISOString() }],
      })),
      // UI state
      isCartOpen: false,
      isWishlistOpen: false,
      isAuthOpen: false,
      searchTerm: '',
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleWishlistSheet: () => set((state) => ({ isWishlistOpen: !state.isWishlistOpen })),
      toggleAuth: (isOpen) => set((state) => ({ isAuthOpen: isOpen !== undefined ? isOpen : !state.isAuthOpen })),
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
      isInWishlist: (comicId) => get().wishlist.some((item) => item.id === comicId),
      // Notifications
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) => set({ notifications, unreadCount: notifications.filter(n => !n.read).length }),
      markAsRead: (id) => set(state => {
        const newNotifications = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
        return { notifications: newNotifications, unreadCount: newNotifications.filter(n => !n.read).length };
      }),
      // User Stats & Library
      stats: { reads: 0, hours: 0, spent: 0 },
      reading: [],
      completed: [],
      setStats: (stats) => set({ stats }),
      updateLibrary: (allComics) => set(state => {
        if (!allComics || !Array.isArray(allComics)) {
          return { reading: [], completed: [] };
        }
        const reading = allComics
          .filter(c => (c.chapters || []).some(ch => ch?.progress > 0 && ch?.progress < 100))
          .slice(0, 5);
        const completed = allComics
          .filter(c => (c.chapters || []).every(ch => ch?.progress === 100))
          .slice(0, 5);
        return { reading, completed };
      }),
    }),
    {
      name: 'comicverse-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        authToken: state.authToken,
        rememberMe: state.rememberMe,
        cart: state.cart,
        wishlist: state.wishlist,
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        stats: state.stats,
        pts: state.pts,
        awards: state.awards,
      }),
    }
  )
);
// Selectors
export const useCart = () => useAppStore(useShallow(state => state.cart));
export const useWishlist = () => useAppStore(useShallow(state => state.wishlist));
export const useNotifications = () => {
  const notifications = useAppStore(state => state.notifications);
  const unreadCount = useAppStore(state => state.unreadCount);
  const setNotifications = useAppStore(state => state.setNotifications);
  const markAsRead = useAppStore(state => state.markAsRead);
  return { notifications, unreadCount, setNotifications, markAsRead };
};
export const useLibraryShelves = () => {
  const reading = useAppStore(state => state.reading);
  const completed = useAppStore(state => state.completed);
  const wishlist = useAppStore(state => state.wishlist);
  const updateLibrary = useAppStore(state => state.updateLibrary);
  return { reading, completed, wishlist, updateLibrary };
};