import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Comic, User, Notification, UserStats, Award } from '@shared/types';
import { useShallow } from 'zustand/react/shallow';
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';
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
  // Audio Player
  audioQueue: Comic[];
  currentAudioId: string | null;
  playAudio: (comic: Comic, prepend?: boolean) => void;
  playNext: () => void;
  playPrev: () => void;
  clearQueue: () => void;
  // Checkout
  promoCode: string;
  shippingOption: 'standard' | 'express';
  setPromoCode: (code: string) => void;
  applyPromoCode: () => boolean;
  setShippingOption: (option: 'standard' | 'express') => void;
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
      // Audio Player
      audioQueue: [],
      currentAudioId: null,
      playAudio: (comic, prepend = false) => set(state => {
        const newQueue = [...state.audioQueue.filter(c => c.id !== comic.id)];
        if (prepend) newQueue.unshift(comic);
        else newQueue.push(comic);
        return { audioQueue: newQueue, currentAudioId: comic.id };
      }),
      playNext: () => set(state => {
        const currentIndex = state.audioQueue.findIndex(c => c.id === state.currentAudioId);
        if (currentIndex === -1 || currentIndex === state.audioQueue.length - 1) return {};
        const nextAudio = state.audioQueue[currentIndex + 1];
        return { currentAudioId: nextAudio.id };
      }),
      playPrev: () => set(state => {
        const currentIndex = state.audioQueue.findIndex(c => c.id === state.currentAudioId);
        if (currentIndex <= 0) return {};
        const prevAudio = state.audioQueue[currentIndex - 1];
        return { currentAudioId: prevAudio.id };
      }),
      clearQueue: () => set({ audioQueue: [], currentAudioId: null }),
      // Checkout
      promoCode: '',
      shippingOption: 'standard',
      setPromoCode: (code) => set({ promoCode: code }),
      applyPromoCode: () => {
        if (get().promoCode.toUpperCase() === 'SAVE20') return true;
        return false;
      },
      setShippingOption: (option) => set({ shippingOption: option }),
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
        audioQueue: state.audioQueue,
        currentAudioId: state.currentAudioId,
        promoCode: state.promoCode,
        shippingOption: state.shippingOption,
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
export const useAudioQueue = () => useAppStore(useShallow(state => state.audioQueue));
export const useCurrentAudio = () => {
  const id = useAppStore(state => state.currentAudioId);
  const audioQueue = useAppStore(state => state.audioQueue);
  const comic = useMemo(() => audioQueue.find(c => c.id === id), [id, audioQueue]);
  return useMemo(() => ({ id, comic }), [id, comic]);
};
export const useAudioControls = () => {
  const playAudio = useAppStore(state => state.playAudio);
  const playNext = useAppStore(state => state.playNext);
  const playPrev = useAppStore(state => state.playPrev);
  const clearQueue = useAppStore(state => state.clearQueue);
  return useMemo(
    () => ({ playAudio, playNext, playPrev, clearQueue }),
    [playAudio, playNext, playPrev, clearQueue]
  );
};
export const useCheckoutState = () => {
  const promoCode = useAppStore(state => state.promoCode);
  const shippingOption = useAppStore(state => state.shippingOption);
  const setPromoCode = useAppStore(state => state.setPromoCode);
  const applyPromoCode = useAppStore(state => state.applyPromoCode);
  const setShippingOption = useAppStore(state => state.setShippingOption);
  return useMemo(() => ({
    promoCode,
    shippingOption,
    setPromoCode,
    applyPromoCode,
    setShippingOption,
  }), [promoCode, shippingOption, setPromoCode, applyPromoCode, setShippingOption]);
};
export const useCartTotals = () => {
  const cart = useAppStore(state => state.cart);
  const shippingOption = useAppStore(state => state.shippingOption);
  const promoCode = useAppStore(state => state.promoCode);
  return useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = shippingOption === 'express' ? 15 : 5;
    const tax = subtotal * 0.08;
    const discount = promoCode.toUpperCase() === 'SAVE20' ? subtotal * 0.2 : 0;
    const total = subtotal + shippingCost + tax - discount;
    return { subtotal, shippingCost, tax, discount, total };
  }, [cart, shippingOption, promoCode]);
};