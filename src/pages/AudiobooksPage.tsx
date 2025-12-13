import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { useAppStore } from '@/store/use-store';
import { useAudiobooks, useNewAudiobooks, useAuthors, useGenres } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight } from 'lucide-react';
const parseDuration = (durationStr: string = '0h 0m'): number => {
  const parts = durationStr.split(' ');
  const hours = parts[0] ? parseInt(parts[0].replace('h', '')) : 0;
  const minutes = parts[1] ? parseInt(parts[1].replace('m', '')) : 0;
  return hours + minutes / 60;
};
function FiltersSidebar({ filters, setFilters, genres, authors, maxPrice, maxDuration }: any) {
  const handleGenreChange = (checked: boolean, genreId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      genres: checked ? [...prev.genres, genreId] : prev.genres.filter((id: string) => id !== genreId),
    }));
  };
  const handleAuthorChange = (checked: boolean, authorId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      authors: checked ? [...prev.authors, authorId] : prev.authors.filter((id: string) => id !== authorId),
    }));
  };
  return (
    <aside className="w-full space-y-8">
      <div>
        <h3 className="font-semibold text-lg mb-4">Sort By</h3>
        <Select value={filters.sort} onValueChange={(value) => setFilters((prev: any) => ({ ...prev, sort: value }))}>
          <SelectTrigger><SelectValue placeholder="Sort by..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
        <Slider value={[filters.price]} onValueChange={(val) => setFilters((prev: any) => ({ ...prev, price: val[0] }))} max={maxPrice} step={1} />
        <div className="flex justify-between text-sm mt-2"><span>$0</span><span>${filters.price}</span></div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Duration (hours)</h3>
        <Slider value={[filters.duration]} onValueChange={(val) => setFilters((prev: any) => ({ ...prev, duration: val[0] }))} max={maxDuration} step={0.5} />
        <div className="flex justify-between text-sm mt-2"><span>0h</span><span>{filters.duration.toFixed(1)}h</span></div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Genres</h3>
        <ScrollArea className="h-40"><div className="space-y-2 pr-4">
          {genres.map((g: any) => (<div key={g.id} className="flex items-center space-x-2"><Checkbox id={`g-${g.id}`} checked={filters.genres.includes(g.id)} onCheckedChange={(c) => handleGenreChange(!!c, g.id)} /><Label htmlFor={`g-${g.id}`} className="font-normal">{g.name}</Label></div>))}
        </div></ScrollArea>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Authors</h3>
        <ScrollArea className="h-40"><div className="space-y-2 pr-4">
          {authors.map((a: any) => (<div key={a.id} className="flex items-center space-x-2"><Checkbox id={`a-${a.id}`} checked={filters.authors.includes(a.id)} onCheckedChange={(c) => handleAuthorChange(!!c, a.id)} /><Label htmlFor={`a-${a.id}`} className="font-normal">{a.name}</Label></div>))}
        </div></ScrollArea>
      </div>
      <Button className="w-full" variant="outline" onClick={() => setFilters({ genres: [], authors: [], price: maxPrice, duration: maxDuration, sort: 'newest' })}>Clear Filters</Button>
    </aside>
  );
}
function NewReleasesCarousel() {
  const { data: audiobooks, isLoading } = useNewAudiobooks();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [scaleValues, setScaleValues] = useState<number[]>([]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopPoint) => {
          const target = loopPoint.target();
          if (index === loopPoint.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      const scale = 1 - Math.abs(diffToTarget) * 0.3;
      return scale < 0 ? 0 : scale;
    });
    setScaleValues(styles);
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect).on('scroll', onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi, onSelect]);
  if (isLoading) return <Skeleton className="w-full h-96" />;
  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef} style={{ perspective: '1000px' }}>
        <div className="flex">
          {audiobooks?.map((comic, index) => (
            <div key={comic.id} className="flex-shrink-0 flex-grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 min-w-0 pl-4">
              <motion.div
                style={{
                  scale: scaleValues[index],
                  transform: `rotateY(${scaleValues[index] ? (1 - scaleValues[index]) * 30 * (index < (emblaApi?.selectedScrollSnap() || 0) ? -1 : 1) : 0}deg)`,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              >
                <AudiobookCard comic={comic} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <Button variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => emblaApi?.scrollPrev()}><ArrowRight className="rotate-180" /></Button>
      <Button variant="outline" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => emblaApi?.scrollNext()}><ArrowRight /></Button>
    </div>
  );
}
export function AudiobooksPage() {
  const searchTerm = useAppStore(s => s.searchTerm);
  const { data: audiobooks, isLoading, error } = useAudiobooks();
  const { data: authorsData = [] } = useAuthors();
  const { data: genresData = [] } = useGenres();
  const { maxPrice, maxDuration, totalHours } = useMemo(() => {
    if (!audiobooks) return { maxPrice: 50, maxDuration: 10, totalHours: 0 };
    const prices = audiobooks.map(a => a.price);
    const durations = audiobooks.map(a => parseDuration(a.duration));
    return {
      maxPrice: Math.ceil(Math.max(...prices, 50)),
      maxDuration: Math.ceil(Math.max(...durations, 10)),
      totalHours: Math.floor(durations.reduce((sum, d) => sum + d, 0)),
    };
  }, [audiobooks]);
  const [filters, setFilters] = useState({ genres: [], authors: [], price: maxPrice, duration: maxDuration, sort: 'newest' });
  useEffect(() => {
    setFilters(prev => ({...prev, price: maxPrice, duration: maxDuration}));
  }, [maxPrice, maxDuration]);
  const filteredAudiobooks = useMemo(() => {
    if (!audiobooks) return [];
    let filtered = audiobooks.filter(comic => {
      const searchMatch = searchTerm ? comic.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const genreMatch = filters.genres.length > 0 ? comic.genreIds.some(id => filters.genres.includes(id)) : true;
      const authorMatch = filters.authors.length > 0 ? comic.authorIds.some(id => filters.authors.includes(id)) : true;
      const priceMatch = comic.price <= filters.price;
      const durationMatch = parseDuration(comic.duration) <= filters.duration;
      return searchMatch && genreMatch && authorMatch && priceMatch && durationMatch;
    });
    switch (filters.sort) {
      case 'popular': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest':
      default: filtered.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()); break;
    }
    return filtered;
  }, [searchTerm, audiobooks, filters]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Audiobooks</h1>
            <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">
              {isLoading ? <Skeleton className="h-6 w-64 mx-auto" /> : `${audiobooks?.length || 0} titles • Over ${totalHours} hours of content`}
            </p>
          </motion.div>
          <section className="py-16 md:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center md:text-left">New Releases</h2>
            <NewReleasesCarousel />
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block lg:col-span-1">
              <FiltersSidebar filters={filters} setFilters={setFilters} genres={genresData} authors={authorsData} maxPrice={maxPrice} maxDuration={maxDuration} />
            </div>
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">All Audiobooks</h2>
                <div className="lg:hidden">
                  <Sheet><SheetTrigger asChild><Button variant="outline" size="icon"><Filter className="h-5 w-5" /></Button></SheetTrigger>
                    <SheetContent className="bg-comic-card border-l-white/10 text-white"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                      <ScrollArea className="h-[calc(100%-4rem)] pr-4">
                        <FiltersSidebar filters={filters} setFilters={setFilters} genres={genresData} authors={authorsData} maxPrice={maxPrice} maxDuration={maxDuration} />
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
                </div>
              ) : error ? (
                <div className="text-center py-16"><h2 className="text-2xl font-semibold text-red-500">Failed to load audiobooks.</h2></div>
              ) : filteredAudiobooks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredAudiobooks.map((comic, index) => (
                    <motion.div key={comic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                      <AudiobookCard comic={comic} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16"><h2 className="text-2xl font-semibold">No Results Found</h2><p className="mt-2 text-neutral-400">Try adjusting your search or filters.</p></div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}