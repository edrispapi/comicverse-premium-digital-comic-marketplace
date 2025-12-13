import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { comics, authors as allAuthors, genres as allGenres } from '@/lib/comic-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComicCard } from '@/components/ui/comic-card';
import { useAppStore } from '@/store/use-store';
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const comic = comics.find(c => c.id === id);
  const addToCart = useAppStore(s => s.addToCart);
  if (!comic) {
    return (
      <div className="bg-comic-black min-h-screen text-white flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-4xl font-bold">Comic Not Found</h1>
          <p className="mt-4 text-neutral-400">We couldn't find the comic you're looking for.</p>
          <Button asChild className="mt-8 btn-accent">
            <Link to="/catalog">Back to Catalog</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  const comicAuthors = comic.authorIds.map(authorId => allAuthors.find(a => a.id === authorId)).filter(Boolean);
  const comicGenres = comic.genreIds.map(genreId => allGenres.find(g => g.id === genreId)).filter(Boolean);
  const relatedComics = comics.filter(c => c.genreIds.some(g => comic.genreIds.includes(g)) && c.id !== comic.id).slice(0, 4);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-comic-accent/10"
            >
              <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover" />
            </motion.div>
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight"
              >
                {comic.title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center flex-wrap gap-4 text-neutral-300"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold text-lg">{comic.rating.toFixed(1)}</span>
                </div>
                <span className="text-neutral-500">|</span>
                <div>By {comicAuthors.map(a => a?.name).join(', ')}</div>
                <span className="text-neutral-500">|</span>
                <div>{comic.pages} pages</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-2"
              >
                {comicGenres.map(genre => genre && (
                  <Badge key={genre.id} variant="secondary" className="bg-neutral-800 text-neutral-300">{genre.name}</Badge>
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-neutral-300 max-w-prose"
              >
                {comic.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-4 pt-4"
              >
                <span className="text-4xl font-bold">${comic.price.toFixed(2)}</span>
                <Button size="lg" className="btn-accent flex-1" onClick={() => addToCart(comic)}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="border-2">
                  <Heart className="mr-2 h-5 w-5" /> Wishlist
                </Button>
                {comic.previewImageUrls.length > 0 && (
                    <Button size="lg" variant="outline" className="border-2">
                        <Eye className="mr-2 h-5 w-5" /> Preview
                    </Button>
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
              {relatedComics.map(relatedComic => (
                <ComicCard key={relatedComic.id} comic={relatedComic} />
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}