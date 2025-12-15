import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Book, Users, Activity, Bell, MessageCircle, Search, LayoutDashboard, CreditCard, Star, Settings, Home, List, Mic, Bookmark, User, Sparkles, ShoppingCart, Heart, LogIn, X, ChevronsUpDown, Check
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useComics, useAuthors, useUserNotifications } from '@/lib/queries';
import { useAppStore, useLibraryShelves, useNotifications } from '@/store/use-store';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: comicsData, isLoading: comicsLoading } = useComics();
  const { data: authors, isLoading: authorsLoading } = useAuthors();
  const reading = useLibraryShelves(state => state.reading);
  const completed = useLibraryShelves(state => state.completed);
  const wishlist = useLibraryShelves(state => state.wishlist);
  const notifications = useNotifications(state => state.notifications);
  const unreadCount = useNotifications(state => state.unreadCount);
  const { data: notificationsData } = useUserNotifications();
  const setNotifications = useAppStore(s => s.setNotifications);
  const toggleCart = useAppStore(s => s.toggleCart);
  const toggleWishlistSheet = useAppStore(s => s.toggleWishlistSheet);
  const toggleAuth = useAppStore(s => s.toggleAuth);
  const toggleTour = useAppStore(s => s.toggleTour);
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);
    }
  }, [notificationsData, setNotifications]);
  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };
  const recentItems = useMemo(() => {
    const all = [...reading, ...completed, ...wishlist];
    const uniqueIds = new Set();
    return all.filter(item => {
      if (!uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    }).slice(0, 5);
  }, [reading, completed, wishlist]);
  const pageLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Catalog', icon: List, path: '/catalog' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Audiobooks', icon: Mic, path: '/audiobooks' },
    { name: 'Library', icon: Bookmark, path: '/library' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Plans', icon: CreditCard, path: '/plans' },
  ];
  const actions = [
    { name: 'View Cart', icon: ShoppingCart, action: () => toggleCart() },
    { name: 'View Wishlist', icon: Heart, action: () => toggleWishlistSheet() },
    { name: 'Login / Sign Up', icon: LogIn, action: () => toggleAuth(true) },
    { name: 'Start Tour', icon: Sparkles, action: () => toggleTour(true) },
  ];
  const shortcuts = [
    { keys: '↑↓', desc: 'Navigate' },
    { keys: '↵', desc: 'Select' },
    { keys: 'Esc', desc: 'Close' },
  ];
  const content = (
    <>
      <Command
        className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        shouldFilter={false} // We handle filtering manually
      >
        <CommandInput placeholder="Search comics, authors, or jump to..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <CommandGroup heading={<span className="group-heading-neon">Search Comics</span>}>
              {comicsLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full my-1" />) :
                (Array.isArray(comicsData) ? comicsData : []).slice(0, 5).map(comic => (
                  <motion.div key={comic.id} variants={itemVariants}>
                    <CommandItem onSelect={() => runCommand(() => navigate(`/comic/${comic.id}`))} className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400">
                      <Avatar className="h-9 w-9 mr-3"><AvatarImage src={comic.coverUrl} /><AvatarFallback>{comic.title.charAt(0)}</AvatarFallback></Avatar>
                      <span>{comic.title}</span>
                    </CommandItem>
                  </motion.div>
                ))}
            </CommandGroup>
            <CommandGroup heading={<span className="group-heading-neon">Search Authors</span>}>
              {authorsLoading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full my-1" />) :
                (Array.isArray(authors) ? authors : []).slice(0, 3).map(author => (
                  <motion.div key={author.id} variants={itemVariants}>
                    <CommandItem onSelect={() => runCommand(() => navigate(`/authors/${author.id}`))} className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400">
                      <Avatar className="h-9 w-9 mr-3"><AvatarImage src={author.avatarUrl} /><AvatarFallback>{author.name.charAt(0)}</AvatarFallback></Avatar>
                      <span>{author.name}</span>
                    </CommandItem>
                  </motion.div>
                ))}
            </CommandGroup>
            <CommandGroup heading={<span className="group-heading-neon">Jump To</span>}>
              {pageLinks.map(link => (
                <motion.div key={link.path} variants={itemVariants}>
                  <CommandItem onSelect={() => runCommand(() => navigate(link.path))} className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400">
                    <link.icon className="mr-3 h-5 w-5" />
                    <span>{link.name}</span>
                  </CommandItem>
                </motion.div>
              ))}
            </CommandGroup>
            <CommandGroup heading={<span className="group-heading-neon">Recent</span>}>
              {recentItems.map(item => (
                <motion.div key={item.id} variants={itemVariants}>
                  <CommandItem onSelect={() => runCommand(() => navigate(`/comic/${item.id}`))} className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400">
                    <Avatar className="h-9 w-9 mr-3"><AvatarImage src={item.coverUrl} /><AvatarFallback>{item.title.charAt(0)}</AvatarFallback></Avatar>
                    <span>{item.title}</span>
                  </CommandItem>
                </motion.div>
              ))}
            </CommandGroup>
            <CommandGroup heading={<span className="group-heading-neon">Notifications</span>}>
              {notifications.slice(0, 2).map(notif => (
                <motion.div key={notif.id} variants={itemVariants}>
                  <CommandItem onSelect={() => runCommand(() => {})} className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400">
                    <Bell className="mr-3 h-5 w-5" />
                    <span>{notif.title}</span>
                    {!notif.read && <Badge variant="destructive" className="ml-auto">New</Badge>}
                  </CommandItem>
                </motion.div>
              ))}
            </CommandGroup>
            <CommandGroup heading={<span className="group-heading-neon">Actions</span>}>
              {actions.map(action => (
                <motion.div key={action.name} variants={itemVariants}>
                  <CommandItem onSelect={() => runCommand(action.action)} className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400">
                    <action.icon className="mr-3 h-5 w-5" />
                    <span>{action.name}</span>
                  </CommandItem>
                </motion.div>
              ))}
            </CommandGroup>
          </motion.div>
        </CommandList>
        <div className="p-2 border-t border-white/10 flex items-center justify-end gap-4 text-xs text-neutral-400">
          {shortcuts.map(sc => (
            <div key={sc.desc} className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 text-xs font-semibold text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-md">{sc.keys}</kbd>
              <span>{sc.desc}</span>
            </div>
          ))}
        </div>
      </Command>
    </>
  );
  const Wrapper = isMobile ? Sheet : Dialog;
  const Content = isMobile ? SheetContent : DialogContent;
  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <Content
        {...(isMobile ? { side: "bottom" } : {})}
        className={cn(
          "p-0 overflow-hidden glass-dark backdrop-blur-xl shadow-red-glow border-white/10",
          isMobile ? "h-[80vh] border-none" : "sm:max-w-2xl"
        )}
        aria-labelledby="cmd-title"
        aria-describedby="cmd-desc"
      >
        <DialogTitle id="cmd-title" className="sr-only">Command Palette</DialogTitle>
        <DialogDescription id="cmd-desc" className="sr-only">Search for comics, authors, or jump to different pages and actions.</DialogDescription>
        {content}
      </Content>
    </Wrapper>
  );
}