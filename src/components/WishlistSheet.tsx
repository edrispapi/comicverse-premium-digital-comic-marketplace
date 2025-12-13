import React from 'react';
import { useAppStore } from '@/store/use-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, X, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
export function WishlistSheet() {
  const isWishlistOpen = useAppStore(s => s.isWishlistOpen);
  const toggleWishlistSheet = useAppStore(s => s.toggleWishlistSheet);
  const wishlist = useAppStore(s => s.wishlist);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const navigate = useNavigate();
  return (
    <Sheet open={isWishlistOpen} onOpenChange={toggleWishlistSheet}>
      <SheetContent className="bg-comic-card border-l-white/10 text-white flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white">Your Wishlist</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
                <Heart className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
                <p className="mt-2 text-sm">Add your favorite comics to see them here.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                <AnimatePresence>
                  {wishlist.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="flex items-start gap-4"
                    >
                      <Link to={`/comic/${item.id}`} onClick={toggleWishlistSheet}>
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-20 h-auto object-cover rounded-md aspect-[2/3]"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/comic/${item.id}`} onClick={toggleWishlistSheet}>
                          <h4 className="font-semibold text-white hover:text-comic-accent transition-colors">{item.title}</h4>
                        </Link>
                        <p className="text-sm text-neutral-400">${item.price.toFixed(2)}</p>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-2"
                        >
                          <Button
                            variant="outline"
                            className="btn-accent w-full text-sm h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/comic/${item.id}#community`);
                              toggleWishlistSheet();
                            }}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Join Community
                          </Button>
                        </motion.div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-red-500 h-8 w-8"
                        onClick={() => toggleWishlist(item)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}