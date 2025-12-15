import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Crown, Heart, MessageSquare, Award, Send, Smile, Image as ImageIcon, Video, Mic, File as FileIcon, X, ClipboardCopy, Download, Edit2, Trash2, Filter } from 'lucide-react';
import type { Comic, Post, Comment } from '@shared/types';
import { useComicPosts, usePostReply, useHeartPost, useAwardComic, useReactToPost, useAuthors, useGenres } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocalStorage } from 'react-use';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppStore } from '@/store/use-store';
import { MultiSelectField, MultiSelectOption } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const replySchema = z.object({ message: z.string().min(1, 'Reply cannot be empty').max(500) });
type ReplyFormData = z.infer<typeof replySchema>;
const STICKERS = ['👍', '���️', '🔥', '😂', '😮', '😢', '🙏', '💯', '⭐', '🚀', '🎉', '🙌'];
const AWARDS = [
    { emoji: '🥉', name: 'Silver', type: '🥉-silver-medal' },
    { emoji: '🥈', name: 'Bronze', type: '🥈-bronze-medal' },
    { emoji: '🥇', name: 'Gold', type: '🥇-gold-medal' },
    { emoji: '📚', name: 'Bookworm', type: '📚-bookworm' },
    { emoji: '💎', name: 'Diamond', type: '💎-diamond' },
    { emoji: '🎖️', name: 'Medal', type: '��️-medal' },
];
const statusOptions: { id: PostStatusFilter; label: string }[] = [
  { id: 'highReactions', label: 'High Reactions' },
  { id: 'popular', label: 'Popular' },
  { id: 'recent', label: 'Recent' },
];
type PostStatusFilter = 'highReactions' | 'popular' | 'recent';
interface PostFiltersState {
  authors: string[];
  status: PostStatusFilter[];
}
const ConfettiBurst = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-red-500 rounded-full"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [1, 1.5, 0],
          opacity: [1, 1, 0],
          x: Math.random() * 150 - 75,
          y: Math.random() * 150 - 75,
          rotate: Math.random() * 360,
        }}
        transition={{ duration: 1.2, delay: i * 0.02, ease: "easeOut" }}
      />
    ))}
  </div>
);
const PostContent = ({ post }: { post: Post }) => {
  const contentMap = {
    image: <img src={post.content} className="rounded-md max-h-64 object-cover w-full" alt="Post content" />,
    video: <video src={post.content} controls className="rounded-md w-full max-h-64" />,
    voice: <audio src={post.content} controls className="w-full" />,
    file: <div className="flex items-center gap-2 p-2 bg-neutral-700/50 rounded-md"><FileIcon className="w-5 h-5" /><span className="truncate">{post.content}</span></div>,
    text: <p className="whitespace-pre-wrap">{post.content}</p>,
  };
  return <div className="relative">{contentMap[post.type]}</div>;
};
const ReplyModal = ({ post, comicId }: { post: Post; comicId: string }) => {
  const { mutate: postReply, isPending } = usePostReply(comicId);
  const form = useForm<ReplyFormData>({ resolver: zodResolver(replySchema), defaultValues: { message: '' } });
  const handleReply = (data: ReplyFormData) => {
    postReply({ postId: post.id, message: data.message }, {
      onSuccess: () => { form.reset(); toast.success("Reply posted!"); },
      onError: () => toast.error("Failed to post reply."),
    });
  };
  return (
    <DialogContent
      className="bg-comic-card border-white/10 text-white sm:max-w-[525px]"
      aria-labelledby={`reply-title-${post.id}`}
      aria-describedby={`reply-desc-${post.id}`}
    >
      <DialogHeader>
        <DialogTitle id={`reply-title-${post.id}`}>Replies to {post.user.name}</DialogTitle>
        <DialogDescription id={`reply-desc-${post.id}`}>View and post replies for this message.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col h-[60vh]">
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4">
            {(post.replies && post.replies.length > 0) ? post.replies.map(reply => (
              <div key={reply.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8"><AvatarImage src={reply.user.avatar} /><AvatarFallback>👤</AvatarFallback></Avatar>
                <div className="flex-1 p-3 rounded-lg bg-neutral-800/50">
                  <div className="flex items-center justify-between"><p className="font-semibold text-sm">{reply.user.name}</p><p className="text-xs text-neutral-400">{formatDistanceToNow(new Date(reply.time), { addSuffix: true })}</p></div>
                  <p className="mt-1 text-sm text-neutral-300">{reply.message}</p>
                </div>
              </div>
            )) : <p className="text-center text-neutral-400 pt-8">No replies yet.</p>}
          </div>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Form {...form}><form onSubmit={form.handleSubmit(handleReply)} className="flex items-center gap-2">
            <FormField control={form.control} name="message" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input placeholder="Write a reply..." {...field} className="bg-neutral-800/50" /></FormControl><FormMessage /></FormItem>)} />
            <Button type="submit" size="icon" className="btn-accent flex-shrink-0" disabled={isPending}><Send className="h-4 w-4" /></Button>
          </form></Form>
        </div>
      </div>
    </DialogContent>
  );
};
const PostCard = ({ post, comicId }: { post: Post; comicId: string; }) => {
  const { mutate: heartPost } = useHeartPost(comicId);
  const { mutate: awardComic } = useAwardComic(comicId);
  const { mutate: reactToPost } = useReactToPost(comicId);
  const updatePts = useAppStore(s => s.updatePts);
  const [showConfetti, setShowConfetti] = useState(false);
  const handleAward = (awardType: string) => {
    awardComic({ award: awardType }, {
      onSuccess: () => {
        toast.success(`You awarded this comic '${awardType.split('-')[1]}'! +10 points`);
        updatePts(10);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      },
      onError: () => toast.error("Failed to give award."),
    });
  };
  const handleReact = (sticker: string) => {
    reactToPost({ postId: post.id, sticker }, {
      onSuccess: () => {
        toast.success(`You reacted with ${sticker}`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      },
      onError: () => toast.error("Failed to react."),
    });
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/comic/${comicId}#post-${post.id}`);
    toast.success("Post link copied to clipboard!");
  };
  return (
    <motion.div variants={itemVariants} className="flex items-start gap-3 py-3">
      <Avatar className="mt-1"><AvatarImage src={post.user.avatar} /><AvatarFallback>👤</AvatarFallback></Avatar>
      <div className="flex-1 space-y-1">
        <div className="relative p-3 rounded-xl bg-neutral-800/50 shadow-md">
          <div className="flex items-center justify-between"><p className="font-semibold text-white flex items-center gap-2">{post.user.name} {post.user.isCreator && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}</p><p className="text-xs text-neutral-400">{formatDistanceToNow(new Date(post.time), { addSuffix: true })}</p></div>
          <div className="mt-2 text-neutral-300 text-sm"><PostContent post={post} /></div>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-400 pl-2 relative">
          <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-7 px-2 hover:bg-red-500/10 text-red-400" onClick={() => heartPost({ postId: post.id })}><Heart className="w-4 h-4" /> {post.reactions.heart}</Button>
          <Dialog><DialogTrigger asChild><Button variant="ghost" size="sm" className="flex items-center gap-1 h-7 px-2 hover:bg-red-500/10"><MessageSquare className="w-4 h-4" /> {post.replies?.length || 0}</Button></DialogTrigger><ReplyModal post={post} comicId={comicId} /></Dialog>
          <Popover>
            <PopoverTrigger asChild><Button variant="ghost" size="sm" className="flex items-center gap-1 h-7 px-2 hover:bg-red-500/10"><Smile className="w-4 h-4" /></Button></PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-comic-card border-white/10 grid grid-cols-6 gap-1">
              {STICKERS.map(sticker => <Button key={sticker} variant="ghost" size="icon" className="h-8 w-8 text-xl" onClick={() => handleReact(sticker)}>{sticker}</Button>)}
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="flex items-center gap-1 h-7 px-2 hover:bg-red-500/10"><Award className="w-4 h-4" /> Award</Button></DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-1 bg-comic-card border-red-500/20 grid grid-cols-2 gap-1">
              {AWARDS.map(award => (
                <Button key={award.type} variant="ghost" size="sm" className="h-10 justify-start gap-2" onClick={() => handleAward(award.type)}>
                  <span className="text-lg">{award.emoji}</span>{award.name}
                </Button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-0.5 border-l border-neutral-600/50 pl-2 ml-2">
            <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:scale-105 transition-transform" onClick={handleCopy}><ClipboardCopy className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Copy Link</p></TooltipContent></Tooltip></TooltipProvider>
            <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:scale-105 transition-transform" onClick={() => toast.info("Mock download started.")}><Download className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Download</p></TooltipContent></Tooltip></TooltipProvider>
            <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:scale-105 transition-transform" onClick={() => toast.info("Mock edit action.")}><Edit2 className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Edit</p></TooltipContent></Tooltip></TooltipProvider>
            <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:scale-105 transition-transform" onClick={() => toast.warning("Mock delete action.")}><Trash2 className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Delete</p></TooltipContent></Tooltip></TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export function BookCommunityChannel({ comic }: { comic: Comic }) {
  const [isJoined, setIsJoined] = useLocalStorage(`comic-joined-${comic.id}`, false);
  const { data: posts, isLoading } = useComicPosts(comic.id);
  const { data: allAuthors } = useAuthors();
  const userId = useAppStore(s => s.userId);
  const toggleAuth = useAppStore(s => s.toggleAuth);
  const hasAccess = !!userId && !!isJoined;
  const [filters, setFilters] = useState<PostFiltersState>({ authors: [], status: [] });
  const authorOptions: MultiSelectOption[] = useMemo(() => {
    if (!allAuthors) return [];
    return comic.authorIds
      .map(id => allAuthors.find(a => a.id === id))
      .filter(Boolean)
      .map(a => ({ value: a!.id, label: a!.name }));
  }, [allAuthors, comic.authorIds]);
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let filtered = [...posts];
    if (filters.authors.length > 0) {
      filtered = filtered.filter(post => post.user.isCreator && comic.authorIds.some(aid => filters.authors.includes(aid)));
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter(post => {
        return filters.status.every(status => {
          if (status === 'highReactions') return (post.reactions.heart || 0) > 10;
          if (status === 'popular') return (post.reactions.votes || 0) > 20;
          if (status === 'recent') {
            const postDate = new Date(post.time);
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            return postDate > oneDayAgo;
          }
          return true;
        });
      });
    }
    return filtered;
  }, [posts, filters, comic.authorIds]);
  const handleJoinClick = () => {
    if (userId) setIsJoined(!isJoined);
    else {
      toggleAuth(true);
      toast.info("Please log in to join the community.");
    }
  };
  const removeFilter = (type: 'author' | 'status', value: string) => {
    if (type === 'author') setFilters(f => ({ ...f, authors: f.authors.filter(a => a !== value) }));
    if (type === 'status') setFilters(f => ({ ...f, status: f.status.filter(s => s !== value) as PostStatusFilter[] }));
  };
  return (
    <Card className="bg-comic-card border-white/10 flex flex-col h-full" role="log" aria-label={`Community channel for ${comic.title}`}>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="glass-dark backdrop-blur-md p-4 border-b border-red-500/20 flex justify-between items-center gap-4 shadow-red-glow">
          <div className="flex items-center gap-4 flex-shrink min-w-0">
            <img src={comic.coverUrl} alt={comic.title} className="w-12 h-16 object-cover rounded-md shadow-lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">{comic.title}</h3>
              <p className="text-sm text-neutral-400">{Math.floor(100 + Math.random() * 900)} members</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex -space-x-2 overflow-hidden p-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Avatar key={i} className="w-10 h-10 border-2 border-red-500/50 shadow-md hover:z-10 hover:scale-110 transition-transform duration-200">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=community-${i}`} />
                  <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button className="btn-accent" onClick={handleJoinClick}>{isJoined ? 'Leave' : 'Join'}</Button>
          </div>
        </div>
        <div className="p-2 border-b border-white/10 flex flex-col sm:flex-row gap-2 bg-red-500/5">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <MultiSelectField options={authorOptions} selected={filters.authors} onChange={(s) => setFilters(f => ({...f, authors: s}))} placeholder="Filter by Creator" />
            <div className="flex items-center space-x-2 p-2 rounded-md border border-input bg-comic-card">
              {statusOptions.map(opt => (
                <div key={opt.id} className="flex items-center space-x-1">
                  <Checkbox id={`post-filter-${opt.id}`} checked={filters.status.includes(opt.id)} onCheckedChange={c => setFilters(f => ({...f, status: c ? [...f.status, opt.id] : f.status.filter(s => s !== opt.id)}))} />
                  <Label htmlFor={`post-filter-${opt.id}`} className="text-xs">{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            {filters.authors.map(id => {
              const author = allAuthors?.find(a => a.id === id);
              return author && <Badge key={id} variant="secondary" className="bg-red-500/20 text-red-400">{author.name} <button onClick={() => removeFilter('author', id)} className="ml-1"><X className="h-3 w-3"/></button></Badge>
            })}
            {filters.status.map(id => {
              const status = statusOptions.find(s => s.id === id);
              return status && <Badge key={id} variant="secondary" className="bg-red-500/20 text-red-400">{status.label} <button onClick={() => removeFilter('status', id)} className="ml-1"><X className="h-3 w-3"/></button></Badge>
            })}
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <ScrollArea className="absolute inset-0 p-4">
            <div className={`transition-all duration-300 ${!hasAccess ? 'blur-sm opacity-60' : ''}`}>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full my-3" />)
                : filteredPosts && filteredPosts.length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {filteredPosts.map(post => <PostCard key={post.id} post={post} comicId={comic.id} />)}
                  </motion.div>
                )
                : <div className="text-center text-neutral-400 pt-16">No posts match your filters.</div>}
            </div>
          </ScrollArea>
          {!hasAccess && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 p-4 text-center">
              <p className="text-lg font-semibold text-white">Join the community to view and post</p>
              <Button className="mt-4 btn-accent" onClick={handleJoinClick}>{userId ? 'Join Community' : 'Log In to Join'}</Button>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2 bg-neutral-800/50 rounded-full p-2">
            <Input placeholder={hasAccess ? "Send a message..." : "Join to send a message"} disabled={!hasAccess} className="bg-transparent border-none focus-visible:ring-0 flex-1" />
            <Button type="submit" size="icon" className="btn-accent rounded-full flex-shrink-0" disabled={!hasAccess}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}