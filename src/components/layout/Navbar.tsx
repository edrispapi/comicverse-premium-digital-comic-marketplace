import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/use-store';
export function Navbar() {
  const cart = useAppStore(s => s.cart);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:text-comic-accent ${isActive ? 'text-comic-accent' : 'text-neutral-300'}`;
  return (
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
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search comics..."
                className="pl-10 w-48 lg:w-64 bg-neutral-800/50 border-neutral-700 focus:bg-neutral-800"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative text-neutral-300 hover:text-white">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Open cart</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-300 hover:text-white">
              <User className="h-6 w-6" />
              <span className="sr-only">User profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}