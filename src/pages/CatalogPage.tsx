import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useAuthors, useGenres, useComics } from '@/lib/queries';
import { ComicCard } from '@/components/ui/comic-card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store/use-store';
import { Skeleton } from '@/components/ui/skeleton';
import { RecommendedCarousel } from '@/components/recommendations/RecommendedCarousel';
function FilterSidebar({
  filters,
  setFilters,
  genres,
  authors,
}: {
  filters: any;
  setFilters: any;
  genres: any[];
  authors: any[];
}) {
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
        <h3 className="font-semibold text-lg mb-4">Genres</h3>
        <div className="space-y-2">
          {genres.map(genre => (
            <div key={genre.id} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre.id}`}
                checked={filters.genres.includes(genre.id)}
                onCheckedChange={(checked) => handleGenreChange(!!checked, genre.id)}
              />
              <Label htmlFor={`genre-${genre.id}`} className="font-normal text-neutral-300 hover:text-red-400 cursor-pointer">{genre.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Authors</h3>
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {authors.map(author => (
              <div key={author.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`author-${author.id}`}
                  checked={filters.authors.includes(author.id)}
                  onCheckedChange={(checked) => handleAuthorChange(!!checked, author.id)}
                />
                <Label htmlFor={`author-${author.id}`} className="font-normal text-neutral-300 hover:text-red-400 cursor-pointer">{author.name}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <Button className="w-full" variant="outline" onClick={() => setFilters({ genres: [], authors: [] })}>Clear Filters</Button>
    </aside>
  );
}
export function CatalogPage() {
  const searchTerm = useAppStore(s => s.searchTerm);
  const { data: comicsData = [], isLoading, error } = useComics();
  const comics = comicsData;
  const { data: authorsData = [] } = useAuthors();
  const { data: genresData = [] } = useGenres();
  const [filters, setFilters] = useState<{ genres: string[], authors: string[] }>({ genres: [], authors: [] });
  const filteredComics = useMemo(() => {
    if (!comics) return [];
    return comics.filter(comic => {
      const searchMatch = searchTerm ? comic.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const genreMatch = filters.genres.length > 0 ? comic.genreIds.some(id => filters.genres.includes(id)) : true;
      const authorMatch = filters.authors.length > 0 ? comic.authorIds.some(id => filters.authors.includes(id)) : true;
      return searchMatch && genreMatch && authorMatch;
    });
  }, [searchTerm, comics, filters]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Full Catalog</h1>
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild><Button variant="outline" size="icon"><Filter className="h-5 w-5" /></Button></SheetTrigger>
                <SheetContent className="bg-comic-card border-l-white/10 text-white">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <ScrollArea className="h-[calc(100%-4rem)] pr-4">
                    <FilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      genres={genresData}
                      authors={authorsData}
                    />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-12">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                genres={genresData}
                authors={authorsData}
              />
              <RecommendedCarousel type="comics" />
            </div>
          </div>
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
              </div>
            ) : error ? (
              <div className="text-center py-16"><h2 className="text-2xl font-semibold text-red-500">Failed to load comics.</h2></div>
            ) : filteredComics.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredComics.map((comic, index) => (
                  <motion.div key={comic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                    <ComicCard comic={comic} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold">No Results Found</h2>
                <p className="mt-2 text-neutral-400">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}