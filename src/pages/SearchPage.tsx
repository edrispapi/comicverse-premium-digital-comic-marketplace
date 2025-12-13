import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ComicCard } from '@/components/ui/comic-card';
import { useSearchResults } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageWrapper } from '@/components/layout/PageWrapper';
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const queryParams = useMemo(() => {
    const q = searchParams.get('q') ?? '';
    const genres = searchParams.get('genres')?.split(',') ?? [];
    const authorIds = searchParams.get('authorIds')?.split(',') ?? [];
    const priceMax = Number(searchParams.get('priceMax')) || 100;
    const sort = searchParams.get('sort') ?? 'rating';
    return { q, genres, authorIds, priceMax, sort };
  }, [searchParams]);
  const { data: comics, isLoading, error } = useSearchResults(queryParams, true);
  return (
    <PageWrapper navbar={<Navbar />} footer={<Footer />}>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Search Results</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-4xl font-bold tracking-tight mb-2">Search Results</h1>
      <p className="text-neutral-400 mb-8">
        {isLoading ? 'Searching for comics...' : `Found ${comics?.length || 0} comics matching your criteria.`}
      </p>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-red-500">Failed to load search results.</h2>
        </div>
      ) : comics && comics.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comics.map((comic, index) => (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ComicCard comic={comic} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Results Found</h2>
          <p className="mt-2 text-neutral-400">Try adjusting your search criteria in the advanced search.</p>
          <Button asChild className="mt-6 btn-accent">
            <Link to="/catalog">Browse Catalog</Link>
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}