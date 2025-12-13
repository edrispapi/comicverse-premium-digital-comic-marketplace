import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { authors as allAuthors, genres as allGenres } from '@shared/mock-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComicCard } from '@/components/ui/comic-card';
import { useAppStore } from '@/store/use-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { useComic, useComics } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: comic, isLoading, error } = useComic(id);
  const { data: allComics } = useComics();
  const addToCart = useAppStore(s => s.addToCart);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const isInWishlist = useAppStore(s => s.isInWishlist(id || ''));
  const searchTerm = useAppStore(s => s.searchTerm);
  if (isLoading) {
    return (
      <div className="bg-comic-black min-h-screen text-white"><Navbar />
        <main className="py-16 md:py-24"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4"><Skeleton className="h-12 w-48" /><Skeleton className="h-12 w-32" /></div>
            </div>
          </div>
        </div></main>
      <Footer /></div>
    );
  }
  if (error || !comic) {
    return (
      <div className="bg-comic-black min-h-screen text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold">Comic Not Found</h1>
            <p className="mt-4 text-neutral-400">We couldn't find the comic you're looking for.</p>
            <Button asChild className="mt-8 btn-accent"><Link to="/catalog">Back to Catalog</Link></Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  const comicAuthors = comic.authorIds.map(authorId => allAuthors.find(a => a.id === authorId)).filter(Boolean);
  const comicGenres = comic.genreIds.map(genreId => allGenres.find(g => g.id === genreId)).filter(Boolean);
  const relatedComics = (allComics || [])
    .filter(c => c.genreIds.some(g => comic.genreIds.includes(g)) && c.id !== comic.id)
    .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 4);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-comic-accent/10">
              <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover" />
            </motion.div>
            <div className="space-y-6">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-5xl font-bold tracking-tight">{comic.title}</motion.h1>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-center flex-wrap gap-4 text-neutral-300">
                <div className="flex items-center gap-1 text-amber-400"><Star className="w-5 h-5 fill-current" /><span className="font-semibold text-lg">{comic.rating.toFixed(1)}</span></div>
                <span className="text-neutral-500">|</span><div>By {comicAuthors.map(a => a?.name).join(', ')}</div>
                <span className="text-neutral-500">|</span><div>{comic.pages} pages</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-2">
                {comicGenres.map(genre => genre && (<Badge key={genre.id} variant="secondary" className="bg-neutral-800 text-neutral-300">{genre.name}</Badge>))}
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-lg text-neutral-300 max-w-prose">{comic.description}</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex items-center flex-wrap gap-4 pt-4">
                <span className="text-4xl font-bold">${comic.price.toFixed(2)}</span>
                <Button size="lg" className="btn-accent flex-1" onClick={() => addToCart(comic)}><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</Button>
                <Button size="lg" variant="outline" className="border-2" onClick={() => toggleWishlist(comic)}><Heart className={cn("mr-2 h-5 w-5", isInWishlist && "fill-red-500 text-red-500")} /> Wishlist</Button>
                {comic.previewImageUrls.length > 0 && (
                  <Sheet>
                    <SheetTrigger asChild><Button size="lg" variant="outline" className="border-2"><Eye className="mr-2 h-5 w-5" /> Preview</Button></SheetTrigger>
                    <SheetContent className="w-full sm:max-w-3xl bg-comic-card border-l-white/10 text-white">
                      <SheetHeader><SheetTitle>Preview: {comic.title}</SheetTitle></SheetHeader>
                      <div className="py-4">
                        <Carousel><CarouselContent>{comic.previewImageUrls.map((url, index) => (<CarouselItem key={index}><img src={url} alt={`Preview page ${index + 1}`} className="w-full h-auto object-contain rounded-md" /></CarouselItem>))}</CarouselContent><CarouselPrevious className="text-white" /><CarouselNext className="text-white" /></Carousel>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      {relatedComics.length > 0 && (
        <section className="py-16 md:py-24 bg-comic-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedComics.map(relatedComic => (<ComicCard key={relatedComic.id} comic={relatedComic} />))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}