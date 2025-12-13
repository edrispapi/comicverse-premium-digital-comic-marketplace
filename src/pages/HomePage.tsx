import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { comics } from '@/lib/comic-data';
import { ComicCard } from '@/components/ui/comic-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/store/use-store';
const featuredComic = comics[1]; // The Watchmen
export function HomePage() {
  const searchTerm = useAppStore(s => s.searchTerm);
  const filterComics = (comicList: typeof comics) => {
    if (!searchTerm) return comicList;
    return comicList.filter(comic =>
      comic.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const trendingComics = filterComics(comics.slice(0, 5));
  const newReleases = filterComics(comics.slice(5, 9));
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${featuredComic.coverUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-comic-black via-comic-black/80 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">
                {featuredComic.title}
              </h1>
              <p className="mt-4 text-lg text-neutral-300 max-w-prose">
                {featuredComic.description}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Button asChild size="lg" className="btn-accent rounded-full px-8 py-6 text-base font-semibold">
                  <Link to={`/comic/${featuredComic.id}`}>
                    Read Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-2 border-white/50 hover:bg-white/10 hover:text-white">
                  <Link to="/catalog">Explore Catalog</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Trending Now Section */}
        {trendingComics.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold tracking-tight mb-8">Trending Now</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trendingComics.map((comic, index) => (
                  <motion.div
                    key={comic.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ComicCard comic={comic} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* New Releases Section */}
        {newReleases.length > 0 && (
          <section className="py-16 md:py-24 bg-comic-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold tracking-tight mb-8">New Releases</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newReleases.map((comic, index) => (
                   <motion.div
                      key={comic.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                  >
                      <ComicCard comic={comic} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}