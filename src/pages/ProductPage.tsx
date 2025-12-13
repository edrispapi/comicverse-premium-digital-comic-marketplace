import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye, BookOpenCheck, Send, Play } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComicCard } from '@/components/ui/comic-card';
import { useAppStore, useAudioControls } from '@/store/use-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { useComic, useComics, useAuthors, useGenres, useComicComments, useUpdateRating, usePostComment } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
const commentSchema = z.object({
  message: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment is too long'),
});
type CommentFormData = z.infer<typeof commentSchema>;
const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500 rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [1, 1.5, 0],
            opacity: [1, 1, 0],
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.5, delay: i * 0.03, ease: "easeOut" }}
        />
      ))}
    </div>
  );
function StarRating({ comicId, initialRating, votes }: { comicId: string, initialRating: number, votes: number }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(0);
  const updatePts = useAppStore(s => s.updatePts);
  const { mutate: updateRating, isPending } = useUpdateRating(comicId);
  const handleRate = (rating: number) => {
    if (isPending || currentRating > 0) return;
    setCurrentRating(rating);
    updateRating(rating, {
      onSuccess: () => {
        toast.success(`You rated this ${rating} stars! +5 points`);
        updatePts(5);
      },
      onError: () => {
        toast.error('Failed to submit rating.');
        setCurrentRating(0);
      }
    });
  };
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-6 h-6 cursor-pointer transition-all duration-200",
              (hoverRating || currentRating || Math.round(initialRating)) >= star ? 'text-red-500 fill-red-500' : 'text-neutral-600',
              isPending || currentRating > 0 ? 'cursor-not-allowed' : ''
            )}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
          />
        ))}
      </div>
      <Badge variant="outline" className="text-sm">{initialRating.toFixed(1)} ({votes} votes)</Badge>
    </div>
  );
}
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: comic, isLoading, error } = useComic(id);
  const { data: allComicsData = [], isLoading: comicsLoading } = useComics();
  const { data: allAuthors } = useAuthors();
  const { data: allGenres = [] } = useGenres();
  const { data: comments } = useComicComments(id);
  const { mutate: postComment, isPending: isPostingComment } = usePostComment(id!);
  const [showConfetti, setShowConfetti] = useState(false);
  const addToCart = useAppStore(s => s.addToCart);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const isInWishlist = useAppStore(s => s.isInWishlist(id || ''));
  const updatePts = useAppStore(s => s.updatePts);
  const pts = useAppStore(s => s.pts);
  const { playAudio } = useAudioControls();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const commentForm = useForm<CommentFormData>({ resolver: zodResolver(commentSchema) });
  const handlePostComment = (data: CommentFormData) => {
    postComment(data.message, {
      onSuccess: () => {
        toast.success("Comment posted! +10 points");
        updatePts(10);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        commentForm.reset();
      },
      onError: () => toast.error("Failed to post comment.")
    });
  };
  const getAwards = (comic: any) => {
    const awards = [];
    const daysSinceRelease = (new Date().getTime() - new Date(comic.releaseDate).getTime()) / (1000 * 3600 * 24);
    if (comic.ratings.avg >= 4.5 && comic.ratings.votes >= 50) awards.push({ type: 'Top Rated', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' });
    if (daysSinceRelease < 7 && comic.ratings.votes >= 10) awards.push({ type: 'New & Hot', color: 'bg-red-500/20 text-red-400 border-red-500/30' });
    if (comic.ratings.votes > 200) awards.push({ type: 'Bestseller', color: 'bg-green-500/20 text-green-400 border-green-500/30' });
    return awards;
  };
  if (isLoading) {
    return (
      <div className="bg-comic-black min-h-screen text-white"><Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-24 w-full" />
              <div className="flex gap-4"><Skeleton className="h-12 w-48" /><Skeleton className="h-12 w-32" /></div>
            </div>
          </div>
          <div className="mt-16"><Skeleton className="h-64 w-full" /></div>
        </main><Footer />
      </div>
    );
  }
  if (error || !comic) {
    return (
      <div className="bg-comic-black min-h-screen text-white flex flex-col"><Navbar />
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold">Comic Not Found</h1>
            <p className="mt-4 text-neutral-400">We couldn't find the comic you're looking for.</p>
            <Button asChild className="mt-8 btn-accent"><Link to="/catalog">Back to Catalog</Link></Button>
          </div>
        </div><Footer />
      </div>
    );
  }
  const comicAuthors = comic.authorIds.map(authorId => allAuthors?.find(a => a.id === authorId)).filter(Boolean);
  const comicGenres = comic.genreIds.map(genreId => allGenres.find(g => g.id === genreId)).filter(Boolean);
  const relatedComics = allComicsData.filter(c => c.genreIds.some(g => comic.genreIds.includes(g)) && c.id !== comic.id).slice(0, 4);
  const awards = getAwards(comic);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <motion.div style={{ y }} variants={itemVariants} className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-red-500/10">
                <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
              <motion.div variants={containerVariants} className="space-y-6">
                <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight">{comic.title}</motion.h1>
                <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4 text-neutral-300">
                  <StarRating comicId={comic.id} initialRating={comic.ratings.avg} votes={comic.ratings.votes} />
                  <span className="text-neutral-500">|</span><div>{comic.pages} pages</div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                  {awards.map(award => <Badge key={award.type} variant="secondary" className={award.color}>{award.type}</Badge>)}
                  {comicGenres.map(genre => genre && (<Badge key={genre.id} variant="secondary" className="bg-neutral-800 text-neutral-300">{genre.name}</Badge>))}
                </motion.div>
                <motion.p variants={itemVariants} className="text-lg text-neutral-300 max-w-prose">{comic.description}</motion.p>
                <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4 pt-4">
                  <span className="text-4xl font-bold">${comic.price.toFixed(2)}</span>
                  <Button size="lg" className="btn-accent flex-1" onClick={() => addToCart(comic)}><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</Button>
                  <Button size="lg" variant="outline" className="border-2" onClick={() => toggleWishlist(comic)}><Heart className={cn("mr-2 h-5 w-5", isInWishlist && "fill-red-500 text-red-500")} /> Wishlist</Button>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4">
                  <Dialog>
                    <DialogTrigger asChild><Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Look Inside ({comic.previewImageUrls.length})</Button></DialogTrigger>
                    <DialogContent className="max-w-4xl bg-comic-card border-white/10 text-white">
                      <DialogHeader><DialogTitle>Preview: {comic.title}</DialogTitle><DialogDescription className='text-muted-foreground'>Swipe or use arrows to navigate pages.</DialogDescription></DialogHeader>
                      <Carousel className="w-full"><CarouselContent>{comic.previewImageUrls.map((url, index) => (<CarouselItem key={index}><img src={url} alt={`Preview page ${index + 1}`} className="w-full h-auto object-contain rounded-md aspect-video" loading="lazy" /></CarouselItem>))}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>
                    </DialogContent>
                  </Dialog>
                  {comic.audioUrl && (
                    <Button variant="outline" onClick={() => playAudio(comic)}>
                      <Play className="mr-2 h-4 w-4" /> Listen Audiobook
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </div>
            <motion.div variants={itemVariants} className="mt-16">
              <Card className="bg-comic-card border-white/10 relative" role="log">
                <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>
                <CardHeader><CardTitle>Comments ({comments?.length || 0})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Form {...commentForm}>
                      <form onSubmit={commentForm.handleSubmit(handlePostComment)} className="flex items-start gap-4">
                        <Avatar><AvatarImage src={`https://i.pravatar.cc/150?u=current-user`} /><AvatarFallback>U</AvatarFallback></Avatar>
                        <div className="flex-1 space-y-2">
                          <FormField control={commentForm.control} name="message" render={({ field }) => (<FormItem><FormControl><Textarea placeholder="Add a comment..." {...field} className="bg-neutral-800/50" /></FormControl><FormMessage /></FormItem>)} />
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-neutral-400">Your points: {pts}</p>
                            <Button type="submit" className="btn-accent" disabled={isPostingComment}><Send className="mr-2 h-4 w-4" /> {isPostingComment ? 'Posting...' : 'Post Comment'}</Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                    <div className="space-y-4">
                      <AnimatePresence>
                        {comments?.map((comment, index) => (
                          <motion.div key={comment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-start gap-4">
                            <Avatar><AvatarImage src={comment.user.avatar} /><AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex-1 bg-neutral-800/50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-white">{comment.user.name}</p>
                                <p className="text-xs text-neutral-400">{formatDistanceToNow(new Date(comment.time), { addSuffix: true })}</p>
                              </div>
                              <p className="text-neutral-300 mt-1">{comment.message}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <section className="py-16 md:py-24 bg-comic-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Also Like</h2>
          {comicsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
            </div>
          ) : relatedComics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedComics.map(relatedComic => (<ComicCard key={relatedComic.id} comic={relatedComic} />))}
            </div>
          ) : null}
        </div>
      </section>
      <Footer />
    </div>
  );
}