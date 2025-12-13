import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from 'react-use';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { useAppStore } from '@/store/use-store';
import { useAuthors, useGenres } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api-client';
import type { Comic } from '@shared/types';
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
  const [filters, setFilters] = useState({ genres: [] as string[], sort: 'newest' });
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['audiobooks', searchTerm, filters],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: '8',
        search: searchTerm,
        genres: filters.genres.join(','),
        sort: filters.sort,
      });
      return api<{ items: Comic[], nextPage: number | null }>(`/api/audiobooks?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  });
  useEffect(() => {
    if (intersection && intersection.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [intersection, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const audiobooks = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Audiobooks</h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">Immerse yourself in captivating stories, brought to life by talented narrators.</p>
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              placeholder="Search for an audiobook..."
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
                  <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Genres</Button>
                </SheetTrigger>
                <SheetContent className="bg-comic-card border-l-white/10 text-white">
                  <SheetHeader><SheetTitle>Filter by Genre</SheetTitle></SheetHeader>
                  <Filters filters={filters} setFilters={setFilters} genres={genresData} authors={authorsData} />
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
        {isFetching && !isFetchingNextPage && !audiobooks.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full h-64 rounded-lg" />)}
          </div>
        ) : error ? (
          <div className="text-center py-16"><h2 className="text-2xl font-semibold text-red-500">Failed to load audiobooks.</h2></div>
        ) : audiobooks.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audiobooks.map((comic) => (
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
        <div ref={intersectionRef} className="h-10" />
        {isFetchingNextPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="w-full h-64 rounded-lg" />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}