import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import type { Comic } from '@shared/types';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/use-store';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
interface AudiobookCardProps {
  comic: Comic;
}
export function AudiobookCard({ comic }: AudiobookCardProps) {
  const addToCart = useAppStore(s => s.addToCart);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const isInWishlist = useAppStore(s => s.isInWishlist(comic.id));
  const playAudio = useAppStore(s => s.playAudio);
  const playNext = useAppStore(s => s.playNext);
  const playPrev = useAppStore(s => s.playPrev);
  const currentAudioId = useAppStore(s => s.currentAudioId);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  useEffect(() => {
    setIsPlaying(currentAudioId === comic.id);
  }, [currentAudioId, comic.id]);
  const handleInteraction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playAudio(comic);
  };
  return (
    <Link to={`/audiobooks/${comic.id}`} className="block group">
      <motion.div
        className="bg-comic-card rounded-lg overflow-hidden border border-white/10 transition-all duration-300 relative"
        whileHover={{ y: -8, boxShadow: '0 10px 20px rgba(255, 165, 0, 0.1)', rotateY: 2, scale: 1.02 }}
      >
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full h-9 w-9 bg-black/50 hover:bg-black/70"
            onClick={(e) => handleInteraction(e, () => toggleWishlist(comic))}
          >
            <Heart className={cn("w-5 h-5 text-white", isInWishlist && "fill-red-500 text-red-500")} />
          </Button>
        </div>
        <div className="aspect-[2/3] overflow-hidden relative">
          <motion.img
            src={comic.coverUrl}
            alt={comic.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {comic.duration && (
            <Badge className="absolute bottom-2 left-2 z-10 bg-black/70 backdrop-blur-sm">{comic.duration}</Badge>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <Button size="icon" variant="ghost" className="h-16 w-16 text-white bg-black/50 rounded-full backdrop-blur-sm" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
          </div>
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
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
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