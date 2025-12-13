import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ComicCard } from '@/components/ui/comic-card';
import { useAppStore } from '@/store/use-store';
import { useAuthors, useGenres, useComics } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
function Filters({ filters, setFilters, genres, authors }: any) {
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
    <aside className="w-full space-y-6 p-4">
      <div>
        <h3 className="font-semibold text-lg mb-4">Genres</h3>
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {genres.map((g: any) => (
              <div key={g.id} className="flex items-center space-x-2">
                <Checkbox id={`g-${g.id}`} checked={filters.genres.includes(g.id)} onCheckedChange={(c) => handleGenreChange(!!c, g.id)} />
                <Label htmlFor={`g-${g.id}`} className="font-normal text-neutral-300">{g.name}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Authors</h3>
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {authors.map((a: any) => (
              <div key={a.id} className="flex items-center space-x-2">
                <Checkbox id={`a-${a.id}`} checked={filters.authors.includes(a.id)} onCheckedChange={(c) => handleAuthorChange(!!c, a.id)} />
                <Label htmlFor={`a-${a.id}`} className="font-normal text-neutral-300">{a.name}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Max Price: ${filters.priceMax}</h3>
        <Slider
          defaultValue={[100]}
          max={100}
          step={1}
          onValueChange={(value) => setFilters((prev: any) => ({ ...prev, priceMax: value[0] }))}
        />
      </div>
      <Button className="w-full" variant="outline" onClick={() => setFilters((prev: any) => ({ ...prev, genres: [], authors: [], priceMax: 100 }))}>Clear Filters</Button>
    </aside>
  );
}
export function CardsPage() {
  const searchTerm = useAppStore(s => s.searchTerm);
  const setSearchTerm = useAppStore(s => s.setSearchTerm);
  const { data: authorsData = [] } = useAuthors();
  const { data: genresData = [] } = useGenres();
  const { data: comicsData = [], isLoading, error } = useComics();
  const [filters, setFilters] = useState({ genres: [] as string[], authors: [] as string[], priceMax: 100, sort: 'newest' });
  const filteredAndSortedComics = useMemo(() => {
    let comics = [...comicsData];
    // Filtering
    if (searchTerm) comics = comics.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filters.genres.length > 0) comics = comics.filter(c => c.genreIds.some(gid => filters.genres.includes(gid)));
    if (filters.authors.length > 0) comics = comics.filter(c => c.authorIds.some(aid => filters.authors.includes(aid)));
    comics = comics.filter(c => c.price <= filters.priceMax);
    // Sorting
    if (filters.sort === 'newest') comics.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    else if (filters.sort === 'popular' || filters.sort === 'rating') comics.sort((a, b) => b.rating - a.rating);
    return comics;
  }, [comicsData, searchTerm, filters]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Card Gallery</h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">An endless collection of comic book art and stories. Find your next adventure.</p>
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-6 text-lg glass-dark"
            />
          </div>
        </motion.div>
        <div className="sticky top-16 z-40 bg-comic-black/80 backdrop-blur-lg py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
                </SheetTrigger>
                <SheetContent className="bg-comic-card border-l-white/10 text-white">
                  <SheetHeader><SheetTitle>Filter & Sort</SheetTitle></SheetHeader>
                  <Filters filters={filters} setFilters={setFilters} genres={genresData} authors={authorsData} />
                </SheetContent>
              </Sheet>
              <div className="hidden sm:block">
                <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {filters.genres.map(gid => {
                const genre = genresData.find(g => g.id === gid);
                return genre ? <Badge key={gid} variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">{genre.name} <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setFilters(prev => ({...prev, genres: prev.genres.filter(g => g !== gid)}))}><X className="h-3 w-3"/></Button></Badge> : null;
              })}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
          </div>
        ) : error ? (
          <div className="text-center py-16"><h2 className="text-2xl font-semibold text-red-500">Failed to load comics.</h2></div>
        ) : filteredAndSortedComics.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedComics.map((comic) => (
              <motion.div key={comic.id} variants={itemVariants}>
                <ComicCard comic={comic} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Results Found</h2>
            <p className="mt-2 text-neutral-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}