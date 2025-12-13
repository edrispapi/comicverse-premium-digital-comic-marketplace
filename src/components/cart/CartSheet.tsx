import React from 'react';
import { useAppStore } from '@/store/use-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
export function CartSheet() {
  const isCartOpen = useAppStore(s => s.isCartOpen);
  const toggleCart = useAppStore(s => s.toggleCart);
  const cart = useAppStore(s => s.cart);
  const removeFromCart = useAppStore(s => s.removeFromCart);
  const updateQuantity = useAppStore(s => s.updateQuantity);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="bg-comic-card border-l-red-500/20 text-white flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
                <ShoppingCart className="w-16 h-16 mb-4 text-red-400" />
                <h3 className="text-xl font-semibold">Your cart is empty</h3>
                <p className="mt-2 text-sm">Add some comics to get started!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="flex items-start gap-4"
                    >
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-20 h-auto object-cover rounded-md aspect-[2/3]"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-sm text-neutral-400">${item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-red-400"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-red-400"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-red-500 h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
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
        {cart.length > 0 && (
          <SheetFooter className="mt-auto pt-4 border-t border-white/10">
            <div className="w-full space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Subtotal</span>
                <span className="text-red-400">${subtotal.toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full btn-accent">
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}