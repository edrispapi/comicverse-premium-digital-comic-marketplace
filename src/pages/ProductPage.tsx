import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye, Send, Play, ThumbsUp, ThumbsDown, Smile, File, Mic, Video, Image as ImageIcon, MessageCircle, MessageSquareMore } from 'lucide-react';
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
import { useComic, useComics, useAuthors, useGenres, useComicComments, useUpdateRating, usePostComment, useComicPosts, usePostPost, useVotePost } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Post } from '@shared/types';

import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
const commentSchema = z.object({ message: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment is too long') });
const postSchema = z.object({
  type: z.enum(['text', 'image', 'video', 'voice', 'file']),
  content: z.string().min(1, 'Content is required'),
});
type CommentFormData = z.infer<typeof commentSchema>;
type PostFormData = z.infer<typeof postSchema>;
const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i} className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} initial={{ scale: 0, opacity: 1 }} animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0], x: Math.random() * 200 - 100, y: Math.random() * 200 - 100, rotate: Math.random() * 360 }} transition={{ duration: 1.5, delay: i * 0.03, ease: "easeOut" }} />
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
      onSuccess: () => { toast.success(`You rated this ${rating} stars! +5 points`); updatePts(5); },
      onError: () => { toast.error('Failed to submit rating.'); setCurrentRating(0); }
    });
  };
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={cn("w-6 h-6 cursor-pointer transition-all duration-200", (hoverRating || currentRating || Math.round(initialRating)) >= star ? 'text-red-500 fill-red-500' : 'text-neutral-600', isPending || currentRating > 0 ? 'cursor-not-allowed' : '')} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => handleRate(star)} />
        ))}
      </div>
      <Badge variant="outline" className="text-sm">{initialRating.toFixed(1)} ({votes} votes)</Badge>
    </div>
  );
}
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles: { x: number, y: number, size: number, speedX: number, speedY: number, color: string }[] = [];
    const createParticles = () => {
      particles = [];
      const particleCount = 100;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: 'rgba(239, 68, 68, 0.5)',
        });
      }
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    createParticles();
    animate();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; createParticles(); };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />;
};
const PostBubble = ({ post, comicId }: { post: Post, comicId: string }) => {
    const { mutate: votePost } = useVotePost(comicId);
    const upvotePercentage = post.reactions.votes > 0 ? (post.reactions.up / post.reactions.votes) * 100 : 50;
    const PostIcon = ({ type }: { type: Post['type'] }) => {
        switch (type) {
          case 'image': return <ImageIcon className="w-4 h-4" />;
          case 'video': return <Video className="w-4 h-4" />;
          case 'voice': return <Mic className="w-4 h-4" />;
          case 'file': return <File className="w-4 h-4" />;
          default: return null;
        }
    };
    return (
        <div className="flex items-start gap-3 py-3">
            <Avatar className="mt-1"><AvatarImage src={post.user.avatar} /><AvatarFallback>👤</AvatarFallback></Avatar>
            <div className="flex-1 space-y-2">
                <div className="relative p-3 rounded-xl bg-neutral-800/50 border-l-4 border-red-500 shadow-md">
                    <div className="flex items-center justify-between"><p className="font-semibold text-white">{post.user.name}</p><p className="text-xs text-neutral-400">{formatDistanceToNow(new Date(post.time), { addSuffix: true })}</p></div>
                    <div className="mt-2 text-neutral-300 text-sm">{post.type === 'text' && <p>{post.content}</p>}{post.type === 'image' && <img src={post.content} className="rounded-md max-h-64" alt="Post content"/>}{post.type === 'video' && <video src={post.content} controls className="rounded-md w-full" />}{post.type === 'voice' && <audio src={post.content} controls className="w-full" />}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 pl-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 h-7 px-2" onClick={() => votePost({ postId: post.id, up: true })}><ThumbsUp className="w-4 h-4" /> {post.reactions.up}</Button>
                    <div className="w-16 h-1 bg-neutral-700 rounded-full overflow-hidden flex-1"><div className="h-full bg-red-500" style={{ width: `${upvotePercentage}%` }} /></div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 h-7 px-2" onClick={() => votePost({ postId: post.id, up: false })}><ThumbsDown className="w-4 h-4" /> {post.reactions.down}</Button>
                    <div className="flex items-center gap-1 ml-auto">
                        {Object.entries(post.reactions.stickers).map(([emoji, count]) => <Badge key={emoji} variant="secondary" className="px-1.5">{emoji} {count}</Badge>)}
                    </div>
                </div>
            </div>
        </div>
    );
};
export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { data: comic, isLoading, error } = useComic(id);
  const { data: allComicsData = [], isLoading: comicsLoading } = useComics();
  const { data: allAuthors } = useAuthors();
  const { data: allGenres = [] } = useGenres();
  const { data: comments } = useComicComments(id);
  const { data: posts } = useComicPosts(id);
  const { mutate: postComment, isPending: isPostingComment } = usePostComment(id!);
  const { mutate: postPost, isPending: isPostingPost } = usePostPost(id!);
  const [showConfetti, setShowConfetti] = useState(false);
  const addToCart = useAppStore(s => s.addToCart);
  const toggleWishlist = useAppStore(s => s.toggleWishlist);
  const isInWishlist = useAppStore(s => s.isInWishlist(id || ''));
  const updatePts = useAppStore(s => s.updatePts);
  const pts = useAppStore(s => s.pts);
  const libraryUnlocked = useAppStore(s => s.libraryUnlocked);
  const { playAudio } = useAudioControls();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const commentForm = useForm<CommentFormData>({ resolver: zodResolver(commentSchema) });
  const postForm = useForm<PostFormData>({ resolver: zodResolver(postSchema), defaultValues: { type: 'text', content: '' } });
  const handlePostComment = (data: CommentFormData) => {
    postComment(data.message, {
      onSuccess: () => { toast.success("Comment posted! +10 points"); updatePts(10); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2000); commentForm.reset(); },
      onError: () => toast.error("Failed to post comment.")
    });
  };
  const handlePostPost = (data: PostFormData) => {
    postPost(data, {
      onSuccess: () => { toast.success("Post added to community feed!"); postForm.reset(); },
      onError: () => toast.error("Failed to add post.")
    });
  };
  const getAwards = (comic: any) => {
    const awards = [];
    if (!comic || !comic.releaseDate || !comic.ratings) return [];
    const daysSinceRelease = (new Date().getTime() - new Date(comic.releaseDate).getTime()) / (1000 * 3600 * 24);
    if (comic.ratings.avg >= 4.5 && comic.ratings.votes >= 50) awards.push({ type: 'Top Rated', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' });
    if (daysSinceRelease < 7 && comic.ratings.votes >= 10) awards.push({ type: 'New & Hot', color: 'bg-red-500/20 text-red-400 border-red-500/30' });
    if (comic.ratings.votes > 200) awards.push({ type: 'Bestseller', color: 'bg-green-500/20 text-green-400 border-green-500/30' });
    return awards;
  };
  const handlePlayAudio = () => {
    if (!comic) return;
    if (libraryUnlocked[comic.id]) {
      playAudio(comic);
    } else {
      toast.info("Purchase this audiobook to unlock playback.", {
        action: { label: "Add to Cart", onClick: () => addToCart(comic) },
      });
    }
  };
  const CommunityFeed = () => (
    <Card className="bg-comic-card border-white/10" role="log">
        <CardHeader><CardTitle>Community Feed ({posts?.length || 0})</CardTitle></CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div className="h-[500px]">
                    {posts && posts.length > 0 ? (
                        <div className="h-full overflow-auto">
                            {posts.slice(0, 50).map((post, index) => (
                                <PostBubble
                                    key={post.id ?? `post-${index}`}
                                    post={post}
                                    comicId={id!}
                                />
                            ))}
                        </div>
                    ) : <div className="text-center text-neutral-400 pt-16">Be the first to post!</div>}
                </div>
                <Form {...postForm}><form onSubmit={postForm.handleSubmit(handlePostPost)} className="flex items-start gap-4 pt-6 border-t border-white/10"><Avatar><AvatarImage src={`https://i.pravatar.cc/150?u=current-user`} /><AvatarFallback>👤</AvatarFallback></Avatar><div className="flex-1 space-y-2"><div className="flex gap-2"><FormField control={postForm.control} name="type" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="text">Text</SelectItem><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent></Select></FormItem>)} /><FormField control={postForm.control} name="content" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input placeholder={postForm.watch('type') === 'text' ? "Share your thoughts..." : "Enter media URL..."} {...field} /></FormControl><FormMessage /></FormItem>)} /></div><div className="flex justify-end"><Button type="submit" className="btn-accent" disabled={isPostingPost}>{isPostingPost ? 'Posting...' : 'Post'}</Button></div></div></form></Form>
            </div>
        </CardContent>
    </Card>
  );
  if (isLoading) return <div className="bg-comic-black min-h-screen text-white"><Navbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"><div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"><Skeleton className="w-full aspect-[2/3] rounded-lg" /><div className="space-y-6"><Skeleton className="h-12 w-3/4" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-24 w-full" /><div className="flex gap-4"><Skeleton className="h-12 w-48" /><Skeleton className="h-12 w-32" /></div></div></div><div className="mt-16"><Skeleton className="h-64 w-full" /></div></main><Footer /></div>;
  if (error || !comic) return <div className="bg-comic-black min-h-screen text-white flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center text-center"><div><h1 className="text-4xl font-bold">Comic Not Found</h1><p className="mt-4 text-neutral-400">We couldn't find the comic you're looking for.</p><Button asChild className="mt-8 btn-accent"><Link to="/catalog">Back to Catalog</Link></Button></div></div><Footer /></div>;
  const comicAuthors = comic.authorIds.map(authorId => allAuthors?.find(a => a.id === authorId)).filter(Boolean);
  const comicGenres = comic.genreIds.map(genreId => allGenres?.find(g => g.id === genreId)).filter(Boolean);
  const relatedComics = allComicsData.filter(c => c.genreIds?.some(g => comic.genreIds?.includes(g)) && c.id !== comic.id).slice(0, 4);
  const awards = getAwards(comic);
  const safeRatings = comic.ratings ?? { avg: 0, votes: 0, up: 0, down: 0 };
  return (
    <div className="bg-comic-black min-h-screen text-white relative overflow-hidden">
      <ParticleCanvas />
      <Navbar />
      <main className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <motion.div style={{ y }} variants={itemVariants} className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-red-500/10"><img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover" loading="lazy" /></motion.div>
              <motion.div variants={containerVariants} className="space-y-6">
                <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight">{comic.title}</motion.h1>
                <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4 text-neutral-300"><StarRating comicId={comic.id} initialRating={safeRatings.avg} votes={safeRatings.votes} /><span className="text-neutral-500">|</span><div>{comic.pages} pages</div></motion.div>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-2">{awards.map(award => <Badge key={award.type} variant="secondary" className={award.color}>{award.type}</Badge>)}{comicGenres.map(genre => genre && (<Badge key={genre.id} variant="secondary" className="bg-neutral-800 text-neutral-300">{genre.name}</Badge>))}</motion.div>
                <motion.p variants={itemVariants} className="text-lg text-neutral-300 max-w-prose">{comic.description}</motion.p>
                <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4 pt-4">
                  {comic.audioUrl ? <Button size="lg" className="btn-accent flex-1" onClick={handlePlayAudio}><Play className="mr-2 h-5 w-5" /> Listen Free</Button> : <span className="text-4xl font-bold">${comic.price.toFixed(2)}</span>}
                  <Button size="lg" className={cn("flex-1", comic.audioUrl ? "bg-white text-black hover:bg-neutral-200" : "btn-accent")} onClick={() => addToCart(comic)}><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</Button>
                  <Button size="lg" variant="outline" className="border-2" onClick={() => toggleWishlist(comic)}><Heart className={cn("mr-2 h-5 w-5", isInWishlist && "fill-red-500 text-red-500")} /> Wishlist</Button>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4"><Dialog><DialogTrigger asChild><Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Look Inside ({comic.previewImageUrls?.length ?? 0})</Button></DialogTrigger><DialogContent className="max-w-4xl bg-comic-card border-white/10 text-white"><DialogHeader><DialogTitle>Preview: {comic.title}</DialogTitle><DialogDescription className='text-muted-foreground'>Swipe or use arrows to navigate pages.</DialogDescription></DialogHeader><Carousel className="w-full"><CarouselContent>{comic.previewImageUrls?.map((url, index) => (<CarouselItem key={index}><img src={url} alt={`Preview page ${index + 1}`} className="w-full h-auto object-contain rounded-md aspect-video" loading="lazy" /></CarouselItem>))}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel></DialogContent></Dialog></motion.div>
              </motion.div>
            </div>
            <motion.div variants={itemVariants} className="mt-16" id="community">
                {isMobile ? (
                    <Sheet><SheetTrigger asChild><Button className="w-full btn-accent" size="lg"><MessageCircle className="mr-2 h-5 w-5" /> View Community</Button></SheetTrigger><SheetContent side="bottom" className="h-[90%] bg-comic-card border-t-white/10 text-white p-0"><SheetHeader className="p-4 border-b border-white/10"><SheetTitle>Community Feed</SheetTitle></SheetHeader><div className="p-4"><CommunityFeed /></div></SheetContent></Sheet>
                ) : <CommunityFeed />}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <section className="py-16 md:py-24 bg-comic-card relative z-10"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold tracking-tight mb-8">You Might Also Like</h2>{comicsLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}</div> : relatedComics.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{relatedComics.map(relatedComic => (<ComicCard key={relatedComic.id} comic={relatedComic} />))}</div> : null}</div></section>
      <Footer />
    </div>
  );
}