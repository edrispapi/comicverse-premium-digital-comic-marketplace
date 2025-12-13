import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ComicCard } from '@/components/ui/comic-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/store/use-store';
import { useComics } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
function HeroSlider() {
  const { data: allComics, isLoading } = useComics();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const featuredComics = useMemo(() => {
    if (!allComics) return [];
    return [...allComics]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [allComics]);
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);
  const onDotClick = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);
  if (isLoading) {
    return <Skeleton className="w-full h-[60vh] md:h-[80vh]" />;
  }
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] group">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full h-full"
      >
        <CarouselContent>
          {featuredComics.map((comic) => (
            <CarouselItem key={comic.id} className="relative w-full h-full">
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${comic.coverUrl})` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-comic-black via-comic-black/80 to-transparent" />
              <div className="relative h-full flex items-end md:items-center text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-0">
                  <motion.div
                    className="max-w-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">{comic.title}</h1>
                    <p className="mt-4 text-lg text-neutral-300 max-w-prose line-clamp-3">{comic.description}</p>
                    <div className="mt-8 flex items-center gap-4">
                      <Button asChild size="lg" className="btn-accent rounded-full px-8 py-6 text-base font-semibold">
                        <Link to={`/comic/${comic.id}`}>Read Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-2 border-white/50 hover:bg-white/10 hover:text-white">
                        <Link to="/catalog">Explore Catalog</Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {featuredComics.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ${current === index ? 'w-6 bg-comic-accent' : 'w-2 bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
export function HomePage() {
  const searchTerm = useAppStore(s => s.searchTerm);
  const { data: allComics, isLoading } = useComics();
  const filteredComics = useMemo(() => {
    if (!allComics) return [];
    if (!searchTerm) return allComics;
    return allComics.filter(comic =>
      comic.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allComics, searchTerm]);
  const trendingComics = useMemo(() => filteredComics.slice(0, 5), [filteredComics]);
  const newReleases = useMemo(() => filteredComics.slice(5, 10), [filteredComics]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Toaster theme="dark" />
      <Navbar />
      <main>
        <HeroSlider />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trending Now Section */}
          <section className="py-16 md:py-24">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Trending Now</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
              </div>
            ) : trendingComics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trendingComics.map((comic, index) => (
                  <motion.div key={comic.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                    <ComicCard comic={comic} />
                  </motion.div>
                ))}
              </div>
            ) : null}
          </section>
          {/* New Releases Section */}
          <section className="py-16 md:py-24 bg-comic-card -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-8">New Releases</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
              </div>
            ) : newReleases.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {newReleases.map((comic, index) => (
                   <motion.div key={comic.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                      <ComicCard comic={comic} />
                  </motion.div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}