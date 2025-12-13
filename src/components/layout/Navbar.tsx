import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Search, ShoppingCart, Heart, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/use-store';
import { CartSheet } from '@/components/cart/CartSheet';
import { WishlistSheet } from '@/components/WishlistSheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/queries';
import { toast } from 'sonner';
function AuthSheet() {
  const { mutate: login, isPending } = useAuth();
  const setUserId = useAppStore(s => s.setUserId);
  const toggleAuthSheet = useAppStore(s => s.toggleAuthSheet);
  const [name, setName] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a name.');
      return;
    }
    login({ name }, {
      onSuccess: (data) => {
        setUserId(data.user.id);
        toast.success(`Welcome, ${data.user.name}!`);
        toggleAuthSheet();
      },
      onError: (error) => {
        toast.error(`Login failed: ${error.message}`);
      }
    });
  };
  return (
    <form onSubmit={handleLogin} className="p-6 space-y-4">
      <Input
        placeholder="Enter your name to login/register"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
        className="bg-neutral-800"
      />
      <Button type="submit" className="w-full btn-accent" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login / Register'}
      </Button>
    </form>
  );
}
export function Navbar() {
  const cart = useAppStore(s => s.cart);
  const wishlist = useAppStore(s => s.wishlist);
  const toggleCart = useAppStore(s => s.toggleCart);
  const toggleWishlistSheet = useAppStore(s => s.toggleWishlistSheet);
  const searchTerm = useAppStore(s => s.searchTerm);
  const setSearchTerm = useAppStore(s => s.setSearchTerm);
  const userId = useAppStore(s => s.userId);
  const logout = useAppStore(s => s.logout);
  const isAuthSheetOpen = useAppStore(s => s.isAuthSheetOpen);
  const toggleAuthSheet = useAppStore(s => s.toggleAuthSheet);
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
                <Button onClick={logout} variant="ghost" size="icon" className="text-neutral-300 hover:text-white">
                  <User className="h-6 w-6" />
                </Button>
              ) : (
                <Button onClick={toggleAuthSheet} variant="ghost" className="hidden md:inline-flex">Login</Button>
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
                      {!userId && <Button onClick={toggleAuthSheet} className="w-full mt-4">Login</Button>}
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
      <Sheet open={isAuthSheetOpen} onOpenChange={toggleAuthSheet}>
        <SheetContent className="bg-comic-card border-l-white/10 text-white">
          <SheetHeader><SheetTitle>Login or Register</SheetTitle></SheetHeader>
          <AuthSheet />
        </SheetContent>
      </Sheet>
    </>
  );
}