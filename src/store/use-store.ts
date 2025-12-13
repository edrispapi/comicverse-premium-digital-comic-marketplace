import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Comic, User, Notification, UserStats } from '@shared/types';
import { useShallow } from 'zustand/react/shallow';
interface CartItem extends Comic {
  quantity: number;
}
interface AppState {
  // User state
  userId: string | null;
  authToken: string | null;
  rememberMe: boolean;
  setUserId: (userId: string) => void;
  setAuthToken: (token: string | null) => void;
  setRememberMe: (remember: boolean) => void;
  clearAuth: () => void;
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
  // Checkout state
  promoCode: string;
  discountPercent: number;
  shippingOption: 'standard' | 'express';
  shippingCost: number;
  setPromoCode: (code: string) => void;
  applyPromoCode: () => boolean;
  setShippingOption: (option: 'standard' | 'express') => void;
  // Audio Player State
  audioQueue: Comic[];
  currentAudioId: string | null;
  playAudio: (comic: Comic) => void;
  playNext: () => void;
  playPrev: () => void;
  clearAudioQueue: () => void;
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
const PROMO_CODES: { [key: string]: number } = {
  COMICVERSE10: 0.10, // 10% off
  CLOUDFLARE20: 0.20, // 20% off
};
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      userId: null,
      authToken: null,
      rememberMe: false,
      setUserId: (userId) => set({ userId }),
      setAuthToken: (token) => set({ authToken: token }),
      setRememberMe: (remember) => set({ rememberMe: remember }),
      clearAuth: () => set({ userId: null, authToken: null }),
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
      // Audio Player State
      audioQueue: [],
      currentAudioId: null,
      playAudio: (comic) => set((state) => {
        const queue = state.audioQueue;
        const isAlreadyInQueue = queue.some(item => item.id === comic.id);
        const newQueue = isAlreadyInQueue ? queue : [...queue, comic];
        return { audioQueue: newQueue, currentAudioId: comic.id };
      }),
      playNext: () => set((state) => {
        const { audioQueue, currentAudioId } = state;
        if (audioQueue.length === 0) return {};
        const currentIndex = audioQueue.findIndex(item => item.id === currentAudioId);
        const nextIndex = (currentIndex + 1) % audioQueue.length;
        return { currentAudioId: audioQueue[nextIndex].id };
      }),
      playPrev: () => set((state) => {
        const { audioQueue, currentAudioId } = state;
        if (audioQueue.length === 0) return {};
        const currentIndex = audioQueue.findIndex(item => item.id === currentAudioId);
        const prevIndex = (currentIndex - 1 + audioQueue.length) % audioQueue.length;
        return { currentAudioId: audioQueue[prevIndex].id };
      }),
      clearAudioQueue: () => set({ audioQueue: [], currentAudioId: null }),
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
        // This is a mock implementation. In a real app, this would be based on user data.
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
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        shippingOption: state.shippingOption,
        shippingCost: state.shippingCost,
        audioQueue: state.audioQueue,
        currentAudioId: state.currentAudioId,
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        stats: state.stats,
      }),
    }
  )
);
// Selectors
export const useCartTotals = () => {
  const cart = useAppStore(state => state.cart);
  const shippingCost = useAppStore(state => state.shippingCost);
  const discountPercent = useAppStore(state => state.discountPercent);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * discountPercent;
  const tax = (subtotal - discount) * 0.08; // Tax calculated on discounted price
  const total = subtotal - discount + tax + shippingCost;
  return { subtotal, discount, tax, total, shippingCost };
};
export const useCart = () => useAppStore(useShallow(state => state.cart));
export const useWishlist = () => useAppStore(useShallow(state => state.wishlist));
export const useAudioQueue = () => {
  const queue = useAppStore(state => state.audioQueue);
  const currentId = useAppStore(state => state.currentAudioId);
  const playAudio = useAppStore(state => state.playAudio);
  const playNext = useAppStore(state => state.playNext);
  const playPrev = useAppStore(state => state.playPrev);
  return { queue, currentId, playAudio, playNext, playPrev };
};
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