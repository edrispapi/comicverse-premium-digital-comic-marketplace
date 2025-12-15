import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Search, ShoppingCart, Heart, Menu, User, LogOut, BookOpenCheck, Bell, BellRing, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore, useCart, useWishlist, useNotifications, useToggleTour } from '@/store/use-store';
import { CartSheet } from '@/components/cart/CartSheet';
import { WishlistSheet } from '@/components/WishlistSheet';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useNewAudiobooks, useComics, useUserNotifications } from '@/lib/queries';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
export function Navbar() {
  const cart = useCart();
  const wishlist = useWishlist();
  const toggleCart = useAppStore(s => s.toggleCart);
  const toggleWishlistSheet = useAppStore(s => s.toggleWishlistSheet);
  const userId = useAppStore(s => s.userId);
  const clearAuth = useAppStore(s => s.clearAuth);
  const toggleAuth = useAppStore(s => s.toggleAuth);
  const toggleTour = useToggleTour();
  const { data: newAudiobooks } = useNewAudiobooks();
  const { data: comicsData } = useComics();
  const { data: notificationsData } = useUserNotifications();
  const { notifications, unreadCount, setNotifications, markAsRead } = useNotifications();
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData);
    }
  }, [notificationsData, setNotifications]);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const newAudiobooksCount = newAudiobooks?.length || 0;
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative transition-colors hover:text-red-400 ${isActive ? 'text-red-500' : 'text-neutral-300'} after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-red-400 after:scale-x-0 after:origin-left after:transition-transform ${isActive ? 'after:scale-x-100' : 'group-hover:after:scale-x-100'}`;
  const navLinks = (
    <>
      <NavLink to="/" className={navLinkClass} end>Home</NavLink>
      <NavLink to="/catalog" className={navLinkClass}>Catalog</NavLink>
      <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
      <NavLink to="/audiobooks" className={navLinkClass + " flex items-center"}>
        Audiobooks
        {newAudiobooksCount > 0 && (
          <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-xs leading-none bg-red-500/20 text-red-400 border-red-500/30">
            {newAudiobooksCount}
          </Badge>
        )}
      </NavLink>
      <NavLink to="/plans" className={navLinkClass}>Plans</NavLink>
    </>
  );
  const handleNotificationClick = (id: string, title: string) => {
    markAsRead(id);
    toast.info(title, { description: 'Check out the latest updates!' });
  };
  const runCommand = (command: () => unknown) => {
    setOpenSearch(false);
    command();
  };
  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-white">
                <BookOpen className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold">ComicVerse</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                {navLinks}
              </nav>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="outline" onClick={() => setOpenSearch(true)} className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-white bg-neutral-800/50 border-neutral-700">
                <Search className="h-4 w-4" /> Search...
              </Button>
              <Button variant="outline" onClick={() => toggleTour(true)} className="hidden sm:flex items-center gap-2 text-red-400 border-red-500/50 hover:text-white hover:bg-red-500/20 bg-red-500/10">
                <Sparkles className="h-4 w-4" /> Get Started
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpenSearch(true)} className="sm:hidden"><Search /></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-neutral-300 hover:text-white">
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white shadow-red-glow animate-pulse">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-comic-card border-red-500/20 text-white" align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-red-500/20" />
                  {notifications.length > 0 ? notifications.slice(0, 4).map(n => (
                    <DropdownMenuItem key={n.id} onSelect={() => handleNotificationClick(n.id, n.title)} className="flex items-start gap-2 cursor-pointer">
                      {!n.read && <BellRing className="h-4 w-4 mt-1 text-red-400" />}
                      <div className={n.read ? 'ml-6' : ''}>
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.date), { addSuffix: true })}</p>
                      </div>
                    </DropdownMenuItem>
                  )) : <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild variant="ghost" size="icon" className="text-neutral-300 hover:text-white"><Link to="/library"><BookOpenCheck className="h-6 w-6" /></Link></Button>
              <Button onClick={toggleWishlistSheet} variant="ghost" size="icon" className="relative text-neutral-300 hover:text-white">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white shadow-red-glow">{wishlistCount}</Badge>}
              </Button>
              <Button onClick={toggleCart} variant="ghost" size="icon" className="relative text-neutral-300 hover:text-white">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white shadow-red-glow">{cartItemCount}</Badge>}
              </Button>
              {userId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" className="relative h-8 w-8 rounded-full"><Avatar className="h-8 w-8"><AvatarImage src={`https://i.pravatar.cc/150?u=${userId}`} alt="User" /><AvatarFallback>U</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-comic-card border-red-500/20 text-white" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">My Account</p><p className="text-xs leading-none text-muted-foreground">Welcome back!</p></div></DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-red-500/20" />
                    <DropdownMenuItem asChild className="cursor-pointer"><Link to="/profile"><User className="mr-2 h-4 w-4" /><span>Profile</span></Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={clearAuth} className="cursor-pointer"><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => toggleAuth(true)} variant="ghost" className="hidden md:inline-flex">Login</Button>
              )}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu /></Button></SheetTrigger>
                  <SheetContent className="bg-comic-card border-l-red-500/20 text-white w-full border-none overflow-y-auto flex flex-col max-w-none p-0">
                    <nav className="min-h-0 flex-1 flex flex-col space-y-6 p-8 pt-20 overflow-y-auto items-start text-lg">{navLinks}
                      {!userId && <Button onClick={() => toggleAuth(true)} className="w-full mt-4">Login</Button>}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      <CartSheet />
      <WishlistSheet />
      <AuthDialog />
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {(comicsData ?? []).slice(0, 3).map(comic => (
              <CommandItem key={comic.id} onSelect={() => runCommand(() => navigate(`/comic/${comic.id}`))}>
                <img src={comic.coverUrl} alt={comic.title} className="w-8 h-12 object-cover mr-4 rounded" />
                {comic.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}