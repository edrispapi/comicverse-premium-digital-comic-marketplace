import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { useAppStore } from '@/store/use-store';
import { useAudiobooks } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
export function AudiobooksPage() {
  const searchTerm = useAppStore(s => s.searchTerm);
  const { data: audiobooks, isLoading, error } = useAudiobooks();
  const filteredAudiobooks = useMemo(() => {
    if (!audiobooks) return [];
    return audiobooks.filter(comic =>
      searchTerm ? comic.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );
  }, [searchTerm, audiobooks]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Audiobooks</h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">
            Immerse yourself in your favorite stories. Listen on the go, anytime, anywhere.
          </p>
        </motion.div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
          </div>
        ) : error ? (
          <div className="text-center py-16"><h2 className="text-2xl font-semibold text-red-500">Failed to load audiobooks.</h2></div>
        ) : filteredAudiobooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAudiobooks.map((comic, index) => (
              <motion.div
                key={comic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <AudiobookCard comic={comic} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Results Found</h2>
            <p className="mt-2 text-neutral-400">Try adjusting your search term.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}