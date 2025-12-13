import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUsers, useGiftComic } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Comic } from '@shared/types';
const ConfettiBurst = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-red-500 rounded-full"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [1, 1.5, 0],
          opacity: [1, 1, 0],
          x: Math.random() * 150 - 75,
          y: Math.random() * 150 - 75,
          rotate: Math.random() * 360,
        }}
        transition={{ duration: 1.2, delay: i * 0.02, ease: "easeOut" }}
      />
    ))}
  </div>
);
export function GiftCombobox({ comic }: { comic: Comic }) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { data: users, isLoading: usersLoading } = useUsers();
  const { mutate: giftComic, isPending: isGifting } = useGiftComic(comic.id);
  const handleGift = () => {
    if (!selectedUser) {
      toast.error('Please select a user to gift to.');
      return;
    }
    giftComic({ toUserId: selectedUser.id }, {
      onSuccess: () => {
        toast.success(
          <div className="flex items-center gap-2">
            <Gift className="text-red-400" />
            <span>{`Successfully gifted to ${selectedUser.name}!`}</span>
          </div>
        );
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        setOpen(false);
        setSelectedUser(null);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to send gift.');
      },
    });
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-red-500/10 text-red-400">
          <Gift className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 glass-dark backdrop-blur-lg shadow-red-glow border-white/10">
        <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            {usersLoading ? (
              <div className="p-2 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {users?.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.name}
                      onSelect={() => {
                        setSelectedUser(user);
                      }}
                      className="cursor-pointer hover:!bg-red-500/10 hover:!text-red-400"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
        <div className="p-2 border-t border-white/10">
          <Button
            className="w-full btn-accent"
            onClick={handleGift}
            disabled={!selectedUser || isGifting}
          >
            {isGifting ? 'Sending...' : `Gift to ${selectedUser?.name || '...'}`}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}