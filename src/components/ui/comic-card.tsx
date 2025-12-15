import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, StarHalf } from "lucide-react";
import type { Comic } from "@shared/types";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-store";
import { cn } from "@/lib/utils";
import { useAuthor } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
interface ComicCardProps {
  comic: Comic;
}
/* RatingStars component – unchanged */
function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 text-red-400 fill-red-400"
        />
      ))}
      {halfStar && (
        <StarHalf key="half" className="w-4 h-4 text-red-400 fill-red-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-red-400/60"
        />
      ))}
    </div>
  );
}
/* Memoized ComicCard component */
export const ComicCard = memo(function ComicCard({ comic }: ComicCardProps) {
  // Zustand selectors – stable, minimal re-renders
  const addToCart = useAppStore((s) => s.addToCart);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const wishlist = useAppStore((s) => s.wishlist);
  const isInWishlist = wishlist?.some((item) => item.id === comic.id);
  // Author data (first author)
  const { data: firstAuthor } = useAuthor(comic.authorIds?.[0]);
  // Prevent default navigation when clicking interactive buttons
  const handleInteraction = (
    e: React.MouseEvent,
    action: () => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };
  const ratingAvg = comic.ratings?.avg ?? comic.rating ?? 0;
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link to={`/comic/${comic.id}`} className="block group">
          <motion.div
            className="bg-comic-card rounded-lg overflow-hidden border border-white/10 transition-all duration-300 relative"
            whileHover={{
              y: -8,
              scale: 1.02,
              boxShadow: "0 10px 20px rgba(239, 68, 68, 0.2)",
            }}
            style={{ perspective: "1000px" }}
          >
            {/* Wishlist button – top‑right */}
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-9 w-9 bg-black/50 hover:bg-red-500/70"
                onClick={(e) =>
                  handleInteraction(e, () => toggleWishlist(comic))
                }
              >
                <Heart
                  className={cn(
                    "w-5 h-5 text-white",
                    isInWishlist && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
            </div>
            {/* Comic cover */}
            <div className="aspect-[2/3] overflow-hidden relative">
              <motion.img
                src={comic.coverUrl}
                alt={comic.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              {comic.bannerText && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-2 text-white text-xs font-bold animate-text-glow-pulse z-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <p className="line-clamp-2">{comic.bannerText}</p>
                </motion.div>
              )}
            </div>
            {/* Info section */}
            <div className="p-3 md:p-4">
              <h3 className="font-bold text-base md:text-lg truncate text-white group-hover:text-red-400 transition-colors">
                {comic.title}
              </h3>
              {firstAuthor && (
                <div className="mt-1 text-xs md:text-sm text-neutral-400 truncate">
                  <span className="hover:text-red-400 transition-colors">
                    {firstAuthor?.name || "Unknown"}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <RatingStars rating={ratingAvg} />
                  <span className="text-xs text-neutral-400">
                    ({comic.ratings?.votes || 0})
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-neutral-800 text-neutral-300"
                >
                  {(comic.chapters?.length || 0)} Chs
                </Badge>
              </div>
              <div className="mt-2 text-red-400 font-bold text-base md:text-lg">
                ${comic.price.toFixed(2)}
              </div>
            </div>
            {/* Add‑to‑cart button – bottom‑right */}
            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                className="btn-accent rounded-full h-10 w-10"
                onClick={(e) =>
                  handleInteraction(e, () => addToCart(comic))
                }
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </Link>
      </HoverCardTrigger>
      {/* Hover preview card */}
      <HoverCardContent
        className="w-80 glass-dark border-white/10 text-white p-0"
        side="right"
        align="start"
      >
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-lg">{comic.title}</h3>
          <p className="text-sm text-neutral-300 line-clamp-4">
            {comic.description}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <RatingStars rating={ratingAvg} />
              <span className="font-bold text-red-400">
                ${comic.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 bg-black/50 hover:bg-red-500/70"
                onClick={(e) =>
                  handleInteraction(e, () => toggleWishlist(comic))
                }
              >
                <Heart
                  className={cn(
                    "w-4 h-4 text-white",
                    isInWishlist && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
              <Button
                size="icon"
                className="btn-accent rounded-full h-8 w-8"
                onClick={(e) =>
                  handleInteraction(e, () => addToCart(comic))
                }
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
});