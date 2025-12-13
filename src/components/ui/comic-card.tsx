import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import type { Comic } from '@shared/types';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-store';
import { cn } from '@/lib/utils';
interface ComicCardProps {
  comic: Comic;
}
export function ComicCard({ comic }: ComicCardProps) {
  const addToCart = useAppStore(s => s.addToCart);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const isInWishlist = useAppStore(s => s.isInWishlist(comic.id));
  const handleInteraction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  return (
    <Link to={`/comic/${comic.id}`} className="block group">
      <motion.div
        className="bg-comic-card rounded-lg overflow-hidden border border-white/10 transition-all duration-300 relative"
        whileHover={{ y: -8, boxShadow: '0 10px 20px rgba(255, 165, 0, 0.1)' }}
      >
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full h-9 w-9 bg-black/50 hover:bg-black/70"
            onClick={(e) => handleInteraction(e, () => toggleWishlist(comic))}
          >
            <Heart className={cn("w-5 h-5 text-white", isInWishlist && "fill-red-500 text-red-500")} />
          </Button>
        </div>
        <div className="aspect-[2/3] overflow-hidden">
          <motion.img
            src={comic.coverUrl}
            alt={comic.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg truncate text-white group-hover:text-comic-accent transition-colors">{comic.title}</h3>
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-current" />
              <span>{comic.rating.toFixed(1)}</span>
            </div>
            <span className="font-semibold text-white">${comic.price.toFixed(2)}</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            className="btn-accent rounded-full h-10 w-10"
            onClick={(e) => handleInteraction(e, () => addToCart(comic))}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}