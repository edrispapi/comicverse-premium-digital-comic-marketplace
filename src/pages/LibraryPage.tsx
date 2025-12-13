import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLibraryShelves } from '@/store/use-store';
import { useComics } from '@/lib/queries';
import { ComicCard } from '@/components/ui/comic-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpenCheck, CheckCircle, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
function Shelf({ comics, emptyTitle, emptyMessage, isLoading }: { comics: any[], emptyTitle: string, emptyMessage: string, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
        ))}
      </div>
    );
  }
  if (comics.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-semibold">{emptyTitle}</h3>
        <p className="mt-2 text-neutral-400">{emptyMessage}</p>
        <Button asChild className="mt-6 btn-accent"><Link to="/catalog">Explore Catalog</Link></Button>
      </div>
    );
  }
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {comics.map((comic) => (
        <motion.div key={comic.id} variants={itemVariants}>
          <ComicCard comic={comic} />
        </motion.div>
      ))}
    </motion.div>
  );
}
export function LibraryPage() {
  const { reading, completed, wishlist, updateLibrary } = useLibraryShelves();
  const { data: allComicsData = [], isLoading } = useComics();
  useEffect(() => {
    if (allComicsData) {
      updateLibrary(allComicsData);
    }
  }, [allComicsData, updateLibrary]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold tracking-tight mb-8">My Library</h1>
          <Tabs defaultValue="reading" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-comic-card">
              <TabsTrigger value="reading"><BookOpenCheck className="mr-2 h-4 w-4" /> Reading</TabsTrigger>
              <TabsTrigger value="completed"><CheckCircle className="mr-2 h-4 w-4" /> Completed</TabsTrigger>
              <TabsTrigger value="wishlist"><Heart className="mr-2 h-4 w-4" /> Wishlist</TabsTrigger>
            </TabsList>
            <TabsContent value="reading" className="mt-8">
              <Shelf comics={reading} isLoading={isLoading} emptyTitle="Nothing here yet!" emptyMessage="Start reading a comic to see it here." />
            </TabsContent>
            <TabsContent value="completed" className="mt-8">
              <Shelf comics={completed} isLoading={isLoading} emptyTitle="No finished comics" emptyMessage="Complete a comic to add it to this shelf." />
            </TabsContent>
            <TabsContent value="wishlist" className="mt-8">
              <Shelf comics={wishlist} isLoading={isLoading} emptyTitle="Your wishlist is empty" emptyMessage="Add some comics you want to read later." />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}