import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useAuthors, useGenres, useComics } from '@/lib/queries';
import { ComicCard } from '@/components/ui/comic-card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MultiSelectField, MultiSelectOption } from '@/components/ui/multi-select';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageWrapper } from '@/components/layout/PageWrapper';
type StatusFilter = 'newHot' | 'bestseller' | 'topRated';
interface FiltersState {
  genres: string[];
  authors: string[];
  status: StatusFilter[];
  sort: string;
}
const statusOptions: { id: StatusFilter; label: string }[] = [
  { id: 'newHot', label: 'New & Hot' },
  { id: 'bestseller', label: 'Bestseller' },
  { id: 'topRated', label: 'Top Rated' },
];
export function CatalogPage() {
  const { data: comicsData = [], isLoading, error } = useComics();
  const { data: authorsData = [] } = useAuthors();
  const { data: genresData = [] } = useGenres();
  const [filters, setFilters] = useState<FiltersState>({ genres: [], authors: [], status: [], sort: 'newest' });
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FiltersState>(filters);
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);
  const authorOptions: MultiSelectOption[] = useMemo(() => authorsData.map(a => ({ value: a.id, label: a.name })), [authorsData]);
  const genreOptions: MultiSelectOption[] = useMemo(() => genresData.map(g => ({ value: g.id, label: g.name })), [genresData]);
  const filteredComics = useMemo(() => {
    if (!comicsData) return [];
    let comics = [...comicsData];
    if (filters.genres.length > 0) {
      comics = comics.filter(comic => comic.genreIds.some(id => filters.genres.includes(id)));
    }
    if (filters.authors.length > 0) {
      comics = comics.filter(comic => comic.authorIds.some(id => filters.authors.includes(id)));
    }
    if (filters.status.length > 0) {
      comics = comics.filter(comic => {
        return filters.status.every(status => {
          if (status === 'newHot') {
            const releaseDate = new Date(comic.releaseDate);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return releaseDate > sevenDaysAgo;
          }
          if (status === 'bestseller') return (comic.ratings?.votes || 0) > 200;
          if (status === 'topRated') return (comic.ratings?.avg || 0) >= 4.5;
          return true;
        });
      });
    }
    if (filters.sort === 'newest') comics.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    else if (filters.sort === 'popular' || filters.sort === 'rating') comics.sort((a, b) => (b.ratings?.avg ?? 0) - (a.ratings?.avg ?? 0));
    return comics;
  }, [comicsData, filters]);
  const activeFilterCount = filters.genres.length + filters.authors.length + filters.status.length;
  const handleSaveFilters = () => {
    setFilters(tempFilters);
    setSheetOpen(false);
  };
  const handleCancelFilters = () => {
    setTempFilters(filters);
    setSheetOpen(false);
  };
  const removeFilter = (type: 'genre' | 'author' | 'status', value: string) => {
    if (type === 'genre') setFilters(f => ({ ...f, genres: f.genres.filter(g => g !== value) }));
    if (type === 'author') setFilters(f => ({ ...f, authors: f.authors.filter(a => a !== value) }));
    if (type === 'status') setFilters(f => ({ ...f, status: f.status.filter(s => s !== value) as StatusFilter[] }));
  };
  const FilterControls = ({ inSheet = false }: { inSheet?: boolean }) => {
    const currentFilters = inSheet ? tempFilters : filters;
    const setCurrentFilters = inSheet ? setTempFilters : setFilters;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Genres</h3>
          <MultiSelectField
            options={genreOptions}
            selected={currentFilters.genres}
            onChange={(selected) => setCurrentFilters(f => ({ ...f, genres: selected }))}
            placeholder="Select genres..."
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Authors</h3>
          <MultiSelectField
            options={authorOptions}
            selected={currentFilters.authors}
            onChange={(selected) => setCurrentFilters(f => ({ ...f, authors: selected }))}
            placeholder="Select authors..."
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Status</h3>
          <div className="space-y-2">
            {statusOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${option.id}-${inSheet}`}
                  checked={currentFilters.status.includes(option.id)}
                  onCheckedChange={(checked) => {
                    setCurrentFilters(f => ({
                      ...f,
                      status: checked
                        ? [...f.status, option.id]
                        : f.status.filter(s => s !== option.id)
                    }));
                  }}
                />
                <Label htmlFor={`${option.id}-${inSheet}`} className="font-normal text-neutral-300 hover:text-red-400 cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  return (
    <PageWrapper navbar={<Navbar />} footer={<Footer />}>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Catalog</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold tracking-tight">Full Catalog</h1>
      <div className="sticky top-16 z-40 bg-comic-black/80 backdrop-blur-lg py-4 my-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="hover:shadow-red-glow transition-shadow">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && <Badge variant="secondary" className="ml-2 bg-red-500/20 text-red-400">{activeFilterCount}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-comic-card border-l-white/10 text-white flex flex-col">
              <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
              <div className="flex-1 overflow-y-auto pr-4 -mr-6 pl-1">
                <FilterControls inSheet />
              </div>
              <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex-1" onClick={handleCancelFilters}>Cancel</Button>
                <Button className="btn-accent flex-1" onClick={handleSaveFilters}>Save</Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            {filters.genres.map(id => {
              const genre = genresData.find(g => g.id === id);
              return genre && <Badge key={id} variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 flex-shrink-0">{genre.name} <button onClick={() => removeFilter('genre', id)} className="ml-1"><X className="h-3 w-3"/></button></Badge>
            })}
            {filters.authors.map(id => {
              const author = authorsData.find(a => a.id === id);
              return author && <Badge key={id} variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 flex-shrink-0">{author.name} <button onClick={() => removeFilter('author', id)} className="ml-1"><X className="h-3 w-3"/></button></Badge>
            })}
            {filters.status.map(id => {
              const status = statusOptions.find(s => s.id === id);
              return status && <Badge key={id} variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 flex-shrink-0">{status.label} <button onClick={() => removeFilter('status', id)} className="ml-1"><X className="h-3 w-3"/></button></Badge>
            })}
          </div>
          <Select value={filters.sort} onValueChange={(value) => setFilters(f => ({ ...f, sort: value }))}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
        </div>
      ) : error ? (
        <div className="text-center py-16"><h2 className="text-2xl font-semibold text-red-500">Failed to load comics.</h2></div>
      ) : filteredComics.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredComics.map((comic, index) => (
            <motion.div key={comic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
              <ComicCard comic={comic} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Results Found</h2>
          <p className="mt-2 text-neutral-400">Try adjusting your filters.</p>
        </div>
      )}
    </PageWrapper>
  );
}