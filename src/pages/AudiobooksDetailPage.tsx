import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Play, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { useAppStore, useAudioControls } from '@/store/use-store';
import { cn } from '@/lib/utils';
import { useAudiobook, useAudiobooks, useAuthors, useGenres } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from '@/components/ui/card';
import { GlobalAudioPlayer } from '@/components/audio/GlobalAudioPlayer';
import { PageWrapper } from '@/components/layout/PageWrapper';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
export function AudiobooksDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: comic, isLoading, error } = useAudiobook(id);
  const { data: allAudiobooksData } = useAudiobooks();
  const allAudiobooks = allAudiobooksData || [];
  const { data: allAuthors } = useAuthors();
  const { data: allGenres = [] } = useGenres();
  const addToCart = useAppStore(s => s.addToCart);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const isInWishlist = useAppStore(s => s.isInWishlist(id || ''));
  const { playAudio } = useAudioControls();
  if (isLoading) {
    return (
      <PageWrapper navbar={<Navbar />} footer={<Footer />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4"><Skeleton className="h-12 w-48" /><Skeleton className="h-12 w-32" /></div>
          </div>
        </div>
      </PageWrapper>
    );
  }
  if (error || !comic) {
    return (
      <PageWrapper navbar={<Navbar />} footer={<Footer />}>
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold">Audiobook Not Found</h1>
            <p className="mt-4 text-neutral-400">We couldn't find the audiobook you're looking for.</p>
            <Button asChild className="mt-8 btn-accent"><Link to="/audiobooks">Back to Audiobooks</Link></Button>
          </div>
        </div>
      </PageWrapper>
    );
  }
  const comicAuthors = comic.authorIds.map(authorId => allAuthors?.find(a => a.id === authorId)).filter(Boolean);
  const comicGenres = comic.genreIds.map(genreId => allGenres.find(g => g.id === genreId)).filter(Boolean);
  const relatedAudiobooks = (allAudiobooks || [])
    .filter(c => c.genreIds.some(g => comic.genreIds.includes(g)) && c.id !== comic.id)
    .slice(0, 4);
  return (
    <>
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
                <Link to="/audiobooks">Audiobooks</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{comic.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div variants={itemVariants} className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-comic-accent/10">
              <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover" />
            </motion.div>
            <motion.div variants={containerVariants} className="space-y-6 flex flex-col">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight">{comic.title}</motion.h1>
              <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4 text-neutral-300">
                <div className="flex items-center gap-1 text-amber-400"><Star className="w-5 h-5 fill-current" /><span className="font-semibold text-lg">{comic.rating.toFixed(1)}</span></div>
                <span className="text-neutral-500">|</span>
                <div>By {comicAuthors.map((a, i) => a && <React.Fragment key={a.id}><Link to={`/authors/${a.id}`} className="hover:text-comic-accent transition-colors">{a.name}</Link>{i < comicAuthors.length - 1 ? ', ' : ''}</React.Fragment>)}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                {comicGenres.map(genre => genre && (<Badge key={genre.id} variant="secondary" className="bg-neutral-800 text-neutral-300">{genre.name}</Badge>))}
                {comic.duration && <Badge variant="outline">{comic.duration}</Badge>}
              </motion.div>
              <motion.div variants={itemVariants} className="text-lg text-neutral-300 max-w-prose">
                <p className="line-clamp-4">{comic.description}</p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4 pt-4 mt-auto">
                <span className="text-4xl font-bold">${comic.price.toFixed(2)}</span>
                <Button size="lg" className="btn-accent flex-1" onClick={() => addToCart(comic)}><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</Button>
                <Button size="lg" variant="outline" className="border-2" onClick={() => toggleWishlist(comic)}><Heart className={cn("mr-2 h-5 w-5", isInWishlist && "fill-red-500 text-red-500")} /> Wishlist</Button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button size="lg" className="w-full bg-white text-black hover:bg-neutral-200" onClick={() => playAudio(comic)}>
                  <Play className="mr-2 h-5 w-5" /> Listen Now
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="mt-16">
            <Collapsible className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full text-lg justify-between">
                  Transcript
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="bg-comic-card border-white/10 mt-2">
                  <CardContent className="p-6 text-neutral-400 text-sm leading-relaxed">
                    <p className="whitespace-pre-wrap">{`Mock transcript for ${comic.title}:\n\n[00:01] Narrator: In a world beyond imagination...\n[00:05] Character A: We can't turn back now!\n\nThis feature enhances accessibility and provides a deeper engagement with the story. The full transcript would be displayed here, allowing users to read along as they listen.`}</p>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        </motion.div>
        {relatedAudiobooks.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedAudiobooks.map(relatedComic => (<AudiobookCard key={relatedComic.id} comic={relatedComic} />))}
            </div>
          </section>
        )}
      </PageWrapper>
      <GlobalAudioPlayer />
    </>
  );
}