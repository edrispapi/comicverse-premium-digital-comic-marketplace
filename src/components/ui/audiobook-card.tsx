import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Play, ChevronRight } from 'lucide-react';
import type { Comic } from '@shared/types';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-store';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
interface AudiobookCardProps {
  comic: Comic;
  authorName?: string;
}
export function AudiobookCard({ comic, authorName }: AudiobookCardProps) {
  const addToCart = useAppStore(s => s.addToCart);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const isInWishlist = useAppStore(s => s.isInWishlist(comic.id));
  const playAudio = useAppStore(s => s.playAudio);
  const handleInteraction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  return (
    <motion.div
      className="glass-dark rounded-lg overflow-hidden flex flex-col sm:flex-row h-full transition-all duration-300 hover:shadow-red-glow/[0.3]"
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="w-full sm:w-2/5 relative group/cover">
        <Link to={`/audiobooks/${comic.id}`} className="block aspect-video sm:aspect-[2/3] overflow-hidden">
          <motion.img
            src={comic.coverUrl}
            alt={comic.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/cover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300" />
        <Button
          size="icon"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white bg-red-500/80 hover:bg-red-600 rounded-full backdrop-blur-sm shadow-red-glow animate-pulse-glow opacity-0 group-hover/cover:opacity-100 transition-opacity"
          onClick={(e) => handleInteraction(e, () => playAudio(comic))}
        >
          <Play className="w-8 h-8" />
        </Button>
      </div>
      <div className="w-full sm:w-3/5 p-4 sm:p-6 flex flex-col">
        <div className="flex-1">
          <Link to={`/audiobooks/${comic.id}`}>
            <h3 className="font-bold text-xl text-white group-hover:text-red-400 transition-colors line-clamp-2">{comic.title}</h3>
          </Link>
          {authorName && (
            <p className="text-sm text-neutral-400 mt-1">
              By <Link to={`/authors/${comic.authorIds[0]}`} className="hover:text-red-400 transition-colors">{authorName}</Link>
            </p>
          )}
          <Collapsible className="mt-3">
            <p className="text-sm text-neutral-300 line-clamp-2">
              {comic.description}
            </p>
            <CollapsibleContent>
              <p className="text-sm text-neutral-300 mt-2">{comic.description}</p>
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="p-0 h-auto text-red-400 text-sm mt-1">
                Read More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1 text-red-400">
              <Star className="w-4 h-4 fill-current" />
              <span>{comic.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-xl text-white">${comic.price.toFixed(2)}</span>
              {comic.duration && (
                <Badge className="bg-red-500/70 backdrop-blur-sm text-white">{comic.duration}</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-10 w-10 bg-black/50 hover:bg-red-500/70"
              onClick={(e) => handleInteraction(e, () => toggleWishlist(comic))}
            >
              <Heart className={cn("w-5 h-5 text-white", isInWishlist && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              size="icon"
              className="btn-accent rounded-full h-10 w-10"
              onClick={(e) => handleInteraction(e, () => addToCart(comic))}
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}