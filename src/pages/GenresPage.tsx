import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ComicCard } from '@/components/ui/comic-card';
import { Separator } from '@/components/ui/separator';
import { useComics, useGenres } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { PageWrapper } from '@/components/layout/PageWrapper';
export function GenresPage() {
  const { data: comicsData = [], isLoading: comicsLoading } = useComics();
  const comicsItems = comicsData;
  const { data: genresData, isLoading: genresLoading } = useGenres();
  return (
    <PageWrapper navbar={<Navbar />} footer={<Footer />}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Explore by Genre</h1>
        <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">
          From epic superhero sagas to mind-bending sci-fi, find your next favorite story.
        </p>
      </motion.div>
      <div className="mt-16 space-y-16">
        {genresLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <section key={i}>
              <Skeleton className="h-10 w-1/4 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
              </div>
            </section>
          ))
        ) : (
          genresData?.map((genre, genreIndex) => {
            const genreComics = comicsItems.filter(comic => comic.genreIds.includes(genre.id)).slice(0, 5) || [];
            if (comicsLoading && genreComics.length === 0) {
              return (
                <section key={genre.id}>
                  <h2 className="text-3xl font-bold mb-6 text-left">{genre.name}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
                  </div>
                </section>
              )
            }
            if (genreComics.length === 0) return null;
            return (
              <motion.section key={genre.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: genreIndex * 0.1 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-bold mb-6 text-left">{genre.name}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {genreComics.map((comic, comicIndex) => (
                    <motion.div key={comic.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: comicIndex * 0.05 }} viewport={{ once: true }}>
                      <ComicCard comic={comic} />
                    </motion.div>
                  ))}
                </div>
                {genreIndex < genresData.length - 1 && <Separator className="mt-16 bg-white/10" />}
              </motion.section>
            );
          })
        )}
      </div>
    </PageWrapper>
  );
}