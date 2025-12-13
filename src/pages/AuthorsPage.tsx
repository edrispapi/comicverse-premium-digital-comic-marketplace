import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ComicCard } from '@/components/ui/comic-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuthors, useComics } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
export function AuthorsPage() {
  const { data: authors, isLoading: authorsLoading } = useAuthors();
  const { data: comicsData = [], isLoading: comicsLoading } = useComics();
  const comicsItems = comicsData;
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Meet the Creators</h1>
              <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">
                Discover the masterminds behind your favorite comics. Explore their works and dive deeper into the worlds they've built.
              </p>
            </motion.div>
            <div className="mt-16 space-y-20">
              {authorsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-8">
                    <div className="flex items-center gap-8"><Skeleton className="w-32 h-32 rounded-full" /><div className="space-y-4 flex-1"><Skeleton className="h-8 w-1/4" /><Skeleton className="h-16 w-3/4" /></div></div>
                    <Skeleton className="h-px w-full" />
                  </div>
                ))
              ) : (
                authors?.map((author, authorIndex) => {
                  const authorComics = comicsItems?.filter(comic => comic.authorIds.includes(author.id)) || [];
                  return (
                    <motion.section key={author.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: authorIndex * 0.1 }} viewport={{ once: true }}>
                      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-comic-accent">
                          <AvatarImage src={author.avatarUrl} alt={author.name} />
                          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-3xl font-bold">{author.name}</h2>
                          <p className="mt-2 text-neutral-400 max-w-2xl">{author.bio}</p>
                        </div>
                      </div>
                      <Separator className="my-8 bg-white/10" />
                      <h3 className="text-2xl font-semibold mb-6">Works by {author.name}</h3>
                      {comicsLoading ? <Skeleton className="h-64 w-full" /> : authorComics.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {authorComics.map((comic, comicIndex) => (
                            <motion.div key={comic.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: comicIndex * 0.05 }} viewport={{ once: true }}>
                              <ComicCard comic={comic} />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500">No comics found for this author yet.</p>
                      )}
                    </motion.section>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}