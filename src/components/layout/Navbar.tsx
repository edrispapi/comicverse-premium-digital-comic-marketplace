import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Search, ShoppingCart, Heart, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore, useCart, useWishlist } from '@/store/use-store';
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
export function Navbar() {
  const cart = useCart();
  const wishlist = useWishlist();
  const toggleCart = useAppStore(s => s.toggleCart);
  const toggleWishlistSheet = useAppStore(s => s.toggleWishlistSheet);
  const searchTerm = useAppStore(s => s.searchTerm);
  const setSearchTerm = useAppStore(s => s.setSearchTerm);
  const userId = useAppStore(s => s.userId);
  const clearAuth = useAppStore(s => s.clearAuth);
  const toggleAuth = useAppStore(s => s.toggleAuth);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:text-comic-accent ${isActive ? 'text-comic-accent' : 'text-neutral-300'}`;
  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-white">
                <BookOpen className="h-8 w-8 text-comic-accent" />
                <span className="text-2xl font-bold">ComicVerse</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                <NavLink to="/catalog" className={navLinkClass}>Catalog</NavLink>
                <NavLink to="/genres" className={navLinkClass}>Genres</NavLink>
                <NavLink to="/authors" className={navLinkClass}>Authors</NavLink>
              </nav>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search comics..."
                  className="pl-10 w-32 sm:w-48 lg:w-64 bg-neutral-800/50 border-neutral-700 focus:bg-neutral-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={toggleWishlistSheet} variant="ghost" size="icon" className="relative text-neutral-300 hover:text-white">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
              <Button onClick={toggleCart} variant="ghost" size="icon" className="relative text-neutral-300 hover:text-white">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
              {userId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${userId}`} alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-comic-card border-white/10 text-white" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Account</p>
                        <p className="text-xs leading-none text-muted-foreground">Welcome back!</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/profile"><User className="mr-2 h-4 w-4" /><span>Profile</span></Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={clearAuth} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => toggleAuth(true)} variant="ghost" className="hidden md:inline-flex">Login</Button>
              )}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon"><Menu /></Button>
                  </SheetTrigger>
                  <SheetContent className="bg-comic-card border-l-white/10 text-white">
                    <nav className="flex flex-col space-y-4 pt-8 text-lg">
                      <NavLink to="/" className={navLinkClass}>Home</NavLink>
                      <NavLink to="/catalog" className={navLinkClass}>Catalog</NavLink>
                      <NavLink to="/genres" className={navLinkClass}>Genres</NavLink>
                      <NavLink to="/authors" className={navLinkClass}>Authors</NavLink>
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
    </>
  );
}