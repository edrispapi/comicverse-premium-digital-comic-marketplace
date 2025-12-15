import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ComicCard } from '@/components/ui/comic-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor, useComics } from '@/lib/queries';
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
import { ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
export function AuthorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: author, isLoading: authorLoading, error: authorError } = useAuthor(id);
  const { data: allComicsData, isLoading: comicsLoading } = useComics();
  const authorComics = React.useMemo(() => {
    if (!allComicsData || !id) return [];
    return (allComicsData ?? []).filter(comic => comic.authorIds.includes(id));
  }, [allComicsData, id]);
  if (authorLoading) {
    return (
      <PageWrapper navbar={<Navbar />} footer={<Footer />}>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-1/4 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
        </div>
      </PageWrapper>
    );
  }
  if (authorError || !author) {
    return (
      <div className="bg-comic-black min-h-screen text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold">Author Not Found</h1>
            <p className="mt-4 text-neutral-400">We couldn't find the author you're looking for.</p>
            <Button asChild className="mt-8 btn-accent"><Link to="/authors">Back to Authors</Link></Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
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
            <BreadcrumbLink asChild>
              <Link to="/authors">Authors</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{author.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button asChild variant="outline" className="mb-8">
          <Link to="/authors"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Authors</Link>
        </Button>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <Avatar className="w-32 h-32 border-4 border-comic-accent">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold">{author.name}</h1>
            <p className="mt-4 text-neutral-300 max-w-3xl">{author.bio}</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Works by {author.name}</h2>
        {comicsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: authorComics.length || 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
          </div>
        ) : authorComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {authorComics.map((comic, index) => (
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
          <div className="text-center py-16 text-neutral-500">
            <p>No comics found for this author yet.</p>
          </div>
        )}
      </motion.div>
    </PageWrapper>
  );
}