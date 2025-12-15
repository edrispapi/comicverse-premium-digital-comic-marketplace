import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { ComicCard } from '@/components/ui/comic-card';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/store/use-store';
import { useComics, useAudiobooks } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useEmblaCarousel from 'embla-carousel-react';
import { RecommendedCarousel } from '@/components/recommendations/RecommendedCarousel';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
};
function HeroSlider() {
  const { data: allComicsData, isLoading } = useComics();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const isHovering = useRef(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 30]);
  const featuredComics = useMemo(() => {
    if (!allComicsData) return [];
    return [...allComicsData]
      .sort((a, b) => (b.ratings?.avg || 0) - (a.ratings?.avg || 0))
      .slice(0, 5);
  }, [allComicsData]);
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);
  const startAutoplay = useCallback(() => {
    stopAutoplay(); // Clear any existing interval
    startTimeRef.current = Date.now();
    progressRef.current = 0;
    autoplayRef.current = setInterval(() => {
      if (!isHovering.current) {
        api?.scrollNext();
      }
    }, 5000);
  }, [api, stopAutoplay]);
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      startAutoplay();
    };
    api.on('select', onSelect);
    api.on('pointerDown', stopAutoplay);
    api.on('reInit', startAutoplay);
    startAutoplay();
    const animationFrameId = requestAnimationFrame(function animate() {
      if (autoplayRef.current && !isHovering.current) {
        const elapsedTime = Date.now() - startTimeRef.current;
        progressRef.current = (elapsedTime / 5000) * 100;
        setProgress(progressRef.current);
      }
      requestAnimationFrame(animate);
    });
    return () => {
      stopAutoplay();
      api.off('select', onSelect);
      api.off('pointerDown', stopAutoplay);
      api.off('reInit', startAutoplay);
      cancelAnimationFrame(animationFrameId);
    };
  }, [api, startAutoplay, stopAutoplay]);
  const onDotClick = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);
  if (isLoading && featuredComics.length === 0) {
    return <Skeleton className="w-full h-[60vh] md:h-[80vh]" />;
  }
  return (
    <div
      className="relative w-full h-[60vh] md:h-[80vh] group"
      onMouseEnter={() => isHovering.current = true}
      onMouseLeave={() => isHovering.current = false}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full h-full">
        <CarouselContent>
          {featuredComics.map((comic) => (
            <CarouselItem key={comic.id} className="relative w-full h-full">
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${comic.coverUrl})` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-comic-black via-comic-black/80 to-transparent" />
              <div className="relative h-full flex items-end md:items-center text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-0">
                  <motion.div
                    className="max-w-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-text-glow-pulse">
                      {comic.title}
                    </h1>
                    <p className="mt-4 text-lg text-neutral-300 max-w-prose line-clamp-3">
                      {comic.description}
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <Button asChild size="lg" className="btn-accent rounded-full px-8 py-6 text-base font-semibold">
                        <Link to={`/comic/${comic.id}`}>
                          Read Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-2 border-white/50 hover:bg-white/10 hover:text-white">
                        <Link to="/catalog">Explore Catalog</Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
              {comic.bannerText && (
                <motion.div
                  className="absolute bottom-8 left-4 right-4 md:left-12 md:right-auto bg-black/70 backdrop-blur-lg rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold animate-text-glow-pulse shadow-2xl shadow-red-glow/50 z-20 max-w-sm lg:max-w-md"
                  style={{ y }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {comic.bannerText}
                </motion.div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:shadow-red-glow" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:shadow-red-glow" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-4">
        <div className="flex space-x-2">
          {featuredComics.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${current === index ? 'w-6 bg-red-500' : 'w-2 bg-red-500/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="w-8 h-8 relative">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="white/20" strokeWidth="2" />
            <motion.circle
              cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
              strokeDasharray="100.53" strokeDashoffset={100.53 - (progress / 100) * 100.53} strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
function AudiobookCarousel() {
  const { data: audiobooksData, isLoading } = useAudiobooks();
  const audiobooks = audiobooksData || [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [scaleValues, setScaleValues] = useState<number[]>([]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopPoint) => {
          const target = loopPoint.target();
          if (index === loopPoint.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      const scale = 1 - Math.abs(diffToTarget) * 0.3;
      return scale < 0 ? 0 : scale;
    });
    setScaleValues(styles);
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect).on('scroll', onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi, onSelect]);
  if (isLoading && audiobooks.length === 0) {
    return <Skeleton className="w-full h-96" />;
  }
  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef} style={{ perspective: '1000px' }}>
        <div className="flex -ml-4">
          {audiobooks?.map((comic, index) => (
            <div key={comic.id} className="flex-shrink-0 flex-grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 min-w-0 pl-4">
              <motion.div
                style={{
                  scale: scaleValues[index],
                  transform: `rotateY(${scaleValues[index] ? (1 - scaleValues[index]) * 30 * (index < (emblaApi?.selectedScrollSnap() || 0) ? -1 : 1) : 0}deg)`,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              >
                <AudiobookCard comic={comic} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <Button variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity border-red-500 hover:bg-red-500/20" onClick={() => emblaApi?.scrollPrev()}><ArrowRight className="rotate-180" /></Button>
      <Button variant="outline" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity border-red-500 hover:bg-red-500/20" onClick={() => emblaApi?.scrollNext()}><ArrowRight /></Button>
    </div>
  );
}
const testimonials = [
  { name: 'Alex R.', avatar: 'https://i.pravatar.cc/150?u=test-1', rating: 5, quote: "Mind-blowing art and a storyline that kept me hooked from start to finish. ComicVerse is my new go-to!" },
  { name: 'Samantha B.', avatar: 'https://i.pravatar.cc/150?u=test-2', rating: 5, quote: "The selection is incredible, and the reading experience is seamless. Found so many hidden gems here." },
  { name: 'David L.', avatar: 'https://i.pravatar.cc/150?u=test-3', rating: 5, quote: "As a lifelong comic fan, I'm impressed. The quality of the digital comics is top-notch. Highly recommended!" },
  { name: 'Jessica M.', avatar: 'https://i.pravatar.cc/150?u=test-4', rating: 5, quote: "A beautifully designed app that truly respects the art form. The 'cinematic' feel is real. A must-have for any fan." },
];
export function HomePage() {
  const searchTerm = useAppStore((s) => s.searchTerm);
  const { data: allComicsData, isLoading } = useComics();
  const allComics = useMemo(() => allComicsData ?? [], [allComicsData]);
  const filteredComics = useMemo(() => {
    if (!searchTerm) return allComics;
    return allComics.filter((comic) =>
      comic.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allComics, searchTerm]);
  const trendingComics = useMemo(() => filteredComics.slice(0, 5), [filteredComics]);
  const newReleases = useMemo(() => filteredComics.slice(5, 10), [filteredComics]);
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Toaster theme="dark" />
      <Navbar />
      <main>
        <HeroSlider />
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold tracking-tight mb-8">Audiobooks Spotlight</motion.h2>
            <AudiobookCarousel />
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold tracking-tight mb-8">Trending Now</motion.h2>
            {isLoading && trendingComics.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trendingComics.map((comic) => (
                  <motion.div key={comic.id} variants={itemVariants}>
                    <ComicCard comic={comic} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
        <section className="py-16 md:py-24 bg-comic-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold tracking-tight mb-8">New Releases</motion.h2>
            {isLoading && newReleases.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />)}
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {newReleases.map((comic) => (
                  <motion.div key={comic.id} variants={itemVariants}>
                    <ComicCard comic={comic} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-bold tracking-tight mb-8 text-center">What Our Readers Say</motion.h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full h-56 rounded-lg" />)}
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {testimonials.map((testimonial) => (
                  <motion.div key={testimonial.name} variants={itemVariants}>
                    <Card className="bg-comic-card border border-white/10 h-full flex flex-col p-6 hover:border-red-500/50 hover:shadow-red-glow transition-all duration-300">
                      <CardContent className="flex flex-col flex-1 p-0">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-12 w-12 mr-4"><AvatarImage src={testimonial.avatar} alt={testimonial.name} /><AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-semibold text-white">{testimonial.name}</p>
                            <div className="flex text-red-400">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
                          </div>
                        </div>
                        <p className="text-neutral-300 text-sm flex-1">"{testimonial.quote}"</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RecommendedCarousel type="comics" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}