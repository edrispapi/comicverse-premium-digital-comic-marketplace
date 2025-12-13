import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useGenres, useAuthors, useSearchResults } from '@/lib/queries';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { ComicCard } from '@/components/ui/comic-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};
export function AdvancedSearchWizard({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [searchParams, setSearchParams] = useState({
    q: '',
    genres: [] as string[],
    authorIds: [] as string[],
    priceMax: 100,
    sort: 'rating',
  });
  const navigate = useNavigate();
  const { data: genres = [] } = useGenres();
  const { data: authors = [] } = useAuthors();
  const isResultsStep = step === 3;
  const { data: results, isLoading } = useSearchResults(searchParams, isResultsStep);
  const handleNext = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 3));
  };
  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };
  const handleFinish = () => {
    const query = new URLSearchParams();
    if (searchParams.q) query.set('q', searchParams.q);
    if (searchParams.genres.length > 0) query.set('genres', searchParams.genres.join(','));
    if (searchParams.authorIds.length > 0) query.set('authorIds', searchParams.authorIds.join(','));
    query.set('priceMax', searchParams.priceMax.toString());
    query.set('sort', searchParams.sort);
    onOpenChange(false);
    navigate(`/search?${query.toString()}`);
  };
  const handleCheckboxChange = (field: 'genres' | 'authorIds', id: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((item) => item !== id)
        : [...prev[field], id],
    }));
  };
  const steps = [
    // Step 1: Keyword
    <div key="step1" className="space-y-6">
      <h2 className="text-2xl font-bold text-center">What are you looking for?</h2>
      <Input
        type="text"
        placeholder="e.g., Spider-Man, The Watchmen..."
        className="h-12 text-lg text-center"
        value={searchParams.q}
        onChange={(e) => setSearchParams({ ...searchParams, q: e.target.value })}
      />
    </div>,
    // Step 2: Genres & Authors
    <div key="step2" className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-4">Refine by Genre or Author</h2>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <h3 className="font-semibold mb-2">Genres</h3>
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center space-x-2 mb-2">
              <Checkbox id={`genre-${genre.id}`} checked={searchParams.genres.includes(genre.id)} onCheckedChange={() => handleCheckboxChange('genres', genre.id)} />
              <Label htmlFor={`genre-${genre.id}`}>{genre.name}</Label>
            </div>
          ))}
        </ScrollArea>
        <ScrollArea className="h-full pr-4">
          <h3 className="font-semibold mb-2">Authors</h3>
          {authors.map((author) => (
            <div key={author.id} className="flex items-center space-x-2 mb-2">
              <Checkbox id={`author-${author.id}`} checked={searchParams.authorIds.includes(author.id)} onCheckedChange={() => handleCheckboxChange('authorIds', author.id)} />
              <Label htmlFor={`author-${author.id}`}>{author.name}</Label>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>,
    // Step 3: Price
    <div key="step3" className="space-y-8">
      <h2 className="text-2xl font-bold text-center">Set Your Budget</h2>
      <div className="text-center text-4xl font-bold text-red-400">${searchParams.priceMax.toFixed(2)}</div>
      <Slider
        value={[searchParams.priceMax]}
        onValueChange={(value) => setSearchParams({ ...searchParams, priceMax: value[0] })}
        max={100}
        step={1}
      />
    </div>,
    // Step 4: Results
    <div key="step4" className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-4">
        Found {results?.length ?? 0} results
      </h2>
      <ScrollArea className="flex-1 -mx-6 px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full aspect-[2/3]" />)}
          </div>
        ) : results && results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {results.slice(0, 4).map((comic) => <ComicCard key={comic.id} comic={comic} />)}
          </div>
        ) : (
          <div className="text-center text-neutral-400 pt-16">No results found. Try adjusting your filters.</div>
        )}
      </ScrollArea>
    </div>,
  ];
  return (
    <div className="flex flex-col h-full p-6">
      <Progress value={(step + 1) * 25} className="mb-6 [&>div]:bg-red-500" />
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {step < 3 ? (
          <Button className="btn-accent" onClick={handleNext}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button className="btn-accent" onClick={handleFinish}>
            <Sparkles className="mr-2 h-4 w-4" /> View All Results
          </Button>
        )}
      </div>
    </div>
  );
}