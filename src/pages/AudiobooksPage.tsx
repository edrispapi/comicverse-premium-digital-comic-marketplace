import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { useAppStore } from '@/store/use-store';
import { useAuthors, useGenres, useAudiobooks } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RecommendedCarousel } from '@/components/recommendations/RecommendedCarousel';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
const parseDuration = (durationStr: string | undefined): number => {
  if (!durationStr) return 0;
  const parts = durationStr.split(' ');
  const hours = parts[0] ? parseInt(parts[0].replace('h', '')) : 0;
  const minutes = parts[1] ? parseInt(parts[1].replace('m', '')) : 0;
  return hours + minutes / 60;
};
function Filters({ filters, setFilters, genres }: any) {
  const handleGenreChange = (checked: boolean, genreId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      genres: checked ? [...prev.genres, genreId] : prev.genres.filter((id: string) => id !== genreId),
    }));
  };
  return (
    <aside className="w-full space-y-6 p-4">
      <h3 className="font-semibold text-lg">Genres</h3>
      <ScrollArea className="h-64">
        <div className="space-y-2 pr-4">
          {genres.map((g: any) => (
            <div key={g.id} className="flex items-center space-x-2">
              <Checkbox id={`g-${g.id}`} checked={filters.genres.includes(g.id)} onCheckedChange={(c) => handleGenreChange(!!c, g.id)} />
              <Label htmlFor={`g-${g.id}`} className="font-normal text-neutral-300">{g.name}</Label>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button className="w-full" variant="outline" onClick={() => setFilters((prev: any) => ({ ...prev, genres: [] }))}>Clear Genres</Button>
    </aside>
  );
}
export function AudiobooksPage() {
  const searchTerm = useAppStore(s => s.searchTerm);
  const setSearchTerm = useAppStore(s => s.setSearchTerm);
  const { data: authorsData = [] } = useAuthors();
  const { data: genresData = [] } = useGenres();
  const { data: audiobooksData = [], isLoading, error } = useAudiobooks();
  const [filters, setFilters] = useState({ genres: [] as string[], sort: 'newest' });
  const { totalHours, totalTitles } = useMemo(() => {
    if (!audiobooksData) return { totalHours: 0, totalTitles: 0 };
    const hours = audiobooksData.reduce((sum, book) => sum + parseDuration(book.duration), 0);
    return {
      totalHours: Math.floor(hours),
      totalTitles: audiobooksData.length,
    };
  }, [audiobooksData]);
  const filteredAndSortedAudiobooks = useMemo(() => {
    let audiobooks = [...audiobooksData];
    if (searchTerm) audiobooks = audiobooks.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filters.genres.length > 0) audiobooks = audiobooks.filter(a => a.genreIds.some(gid => filters.genres.includes(gid)));
    if (filters.sort === 'newest') audiobooks.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    else if (filters.sort === 'popular') audiobooks.sort((a, b) => b.rating - a.rating);
    return audiobooks;
  }, [audiobooksData, searchTerm, filters]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Audiobooks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Audiobooks</h1>
            <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">Immerse yourself in captivating stories, brought to life by talented narrators.</p>
            <div className="mt-8 flex justify-center items-center gap-6 text-lg">
              <span><strong className="text-red-400">{totalTitles}</strong> Titles</span>
              <span className="text-neutral-600">|</span>
              <span><strong className="text-red-400">{totalHours}</strong>+ Hours of Content</span>
            </div>
          </motion.div>
          <section className="mb-16">
            <RecommendedCarousel type="audiobooks" />
          </section>
          <div className="sticky top-16 z-40 bg-comic-black/80 backdrop-blur-lg py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Genres</Button>
                  </SheetTrigger>
                  <SheetContent className="bg-comic-card border-l-white/10 text-white">
                    <SheetHeader><SheetTitle>Filter by Genre</SheetTitle></SheetHeader>
                    <Filters filters={filters} setFilters={setFilters} genres={genresData} />
                  </SheetContent>
                </Sheet>
                <div className="hidden sm:block">
                  <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.genres.map(gid => {
                  const genre = genresData.find(g => g.id === gid);
                  return genre ? <Badge key={gid} variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">{genre.name} <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setFilters(prev => ({...prev, genres: prev.genres.filter(g => g !== gid)}))}><X className="h-3 w-3"/></Button></Badge> : null;
                })}
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full h-64 rounded-lg" />)}
            </div>
          ) : error ? (
            <div className="text-center py-16"><h2 className="text-2xl font-semibold text-red-500">Failed to load audiobooks.</h2></div>
          ) : filteredAndSortedAudiobooks.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredAndSortedAudiobooks.map((comic) => (
                <motion.div key={comic.id} variants={itemVariants}>
                  <AudiobookCard comic={comic} authorName={authorsData.find(a => comic.authorIds.includes(a.id))?.name} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">No Results Found</h2>
              <p className="mt-2 text-neutral-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}