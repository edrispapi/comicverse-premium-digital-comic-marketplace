import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useComics, useAudiobooks } from '@/lib/queries';
import { useLibraryShelves } from '@/store/use-store';
import { ComicCard } from '@/components/ui/comic-card';
import { AudiobookCard } from '@/components/ui/audiobook-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Comic } from '@shared/types';
interface RecommendedCarouselProps {
  type: 'comics' | 'audiobooks';
  className?: string;
}
export function RecommendedCarousel({ type, className }: RecommendedCarouselProps) {
  const { reading } = useLibraryShelves();
  const { data: allComics, isLoading: comicsLoading } = useComics();
  const { data: allAudiobooks, isLoading: audiobooksLoading } = useAudiobooks();
  const recommendations = useMemo(() => {
    const sourceData = type === 'comics' ? (allComics ?? []) : (allAudiobooks ?? []);
    if (!sourceData || sourceData.length === 0 || reading.length === 0) {
      return [];
    }
    const readingComic = reading[0];
    const readingGenreIds = new Set(readingComic.genreIds);
    const readingAuthorIds = new Set(readingComic.authorIds);
    const scoredRecs = sourceData
      .filter(item => item.id !== readingComic.id) // Exclude the source comic
      .map(item => {
        let score = 0;
        item.genreIds.forEach(gid => {
          if (readingGenreIds.has(gid)) score += 2;
        });
        item.authorIds.forEach(aid => {
          if (readingAuthorIds.has(aid)) score += 1;
        });
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || Math.random() - 0.5); // Sort by score, then randomize
    return scoredRecs.slice(0, 8);
  }, [type, allComics, allAudiobooks, reading]);
  const isLoading = type === 'comics' ? comicsLoading : audiobooksLoading;
  if (isLoading) {
    return (
      <div className={className}>
        <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  if (recommendations.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }
  const readingComicTitle = reading[0]?.title;
  return (
    <div className={className}>
      <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Like</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full group"
      >
        <CarouselContent className="-ml-4">
          {recommendations.map((item: Comic) => (
            <CarouselItem key={item.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              <div className="relative">
                {type === 'comics' ? <ComicCard comic={item} /> : <AudiobookCard comic={item} />}
                {readingComicTitle && (
                  <Badge variant="secondary" className="absolute top-4 left-4 z-10 bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    Because you liked {readingComicTitle}
                  </Badge>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:shadow-red-glow" />
        <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:shadow-red-glow" />
      </Carousel>
    </div>
  );
}