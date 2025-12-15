import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Gift, MessageCircle, Sparkles, Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppStore } from '@/store/use-store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
const stepVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const ConfettiBurst = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-red-500 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `hsl(0, ${Math.random() * 30 + 70}%, ${Math.random() * 30 + 50}%)`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [1, 1.5, 0],
          opacity: [1, 1, 0],
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          rotate: Math.random() * 360,
        }}
        transition={{ duration: 1.5, delay: i * 0.02, ease: "easeOut" }}
      />
    ))}
  </div>
);
const steps = [
  {
    icon: Gift,
    title: "Discover & Purchase",
    description: "Explore our vast catalog, add comics to your cart, and enjoy a seamless checkout experience. Gift comics to friends and unlock audiobooks for your library.",
    content: (
      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent>
          <CarouselItem><Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex aspect-square items-center justify-center p-6"><img src="https://comicvine.gamespot.com/a/uploads/scale_large/11135/111356221/9232085-asm2022036_cov.jpg" alt="Comic Cover" className="rounded-md shadow-lg" /></CardContent></Card></CarouselItem>
          <CarouselItem><Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center text-lg">➡️ Add to Cart & Checkout</p></CardContent></Card></CarouselItem>
          <CarouselItem><Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center text-lg">📚 Unlocked in your Library!</p></CardContent></Card></CarouselItem>
        </CarouselContent>
      </Carousel>
    ),
  },
  {
    icon: MessageCircle,
    title: "Join the Community",
    description: "Every comic has a dedicated community channel. Join the conversation, share theories, and connect with fellow fans and creators.",
    content: <Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center text-lg">💬 Join Channel on Product Page</p></CardContent></Card>,
  },
  {
    icon: Sparkles,
    title: "Share Your Thoughts",
    description: "Post text, images, voice notes, and more. React to posts, give awards, and become a part of the story's legacy.",
    content: <Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center text-lg">✍️ Post, React, and Award!</p></CardContent></Card>,
  },
  {
    icon: Crown,
    title: "Unlock Premium",
    description: "Upgrade to post more, create communities, and use AI to generate books, images, and audiobooks.",
    content: (
      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent>
          <CarouselItem><Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex flex-col aspect-square items-center justify-center p-4 text-center"><Sparkles className="w-8 h-8 text-red-400 mb-2" /><h4 className="font-bold">AI Generation</h4><p className="text-xs text-neutral-300">Create unique comic panels or entire audiobooks with AI.</p></CardContent></Card></CarouselItem>
          <CarouselItem><Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex flex-col aspect-square items-center justify-center p-4 text-center"><MessageCircle className="w-8 h-8 text-red-400 mb-2" /><h4 className="font-bold">Create Communities</h4><p className="text-xs text-neutral-300">Start your own fan channels and lead the discussion.</p></CardContent></Card></CarouselItem>
          <CarouselItem><Card className="bg-comic-card/50 backdrop-blur-xl border-white/10 shadow-red-glow"><CardContent className="flex flex-col aspect-square items-center justify-center p-4 text-center"><Gift className="w-8 h-8 text-red-400 mb-2" /><h4 className="font-bold">Unlimited Posts</h4><p className="text-xs text-neutral-300">Share your thoughts without limits in any community.</p></CardContent></Card></CarouselItem>
        </CarouselContent>
      </Carousel>
    ),
  },
];
function TourContent() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const toggleTour = useAppStore(s => s.toggleTour);
  const completeTour = useAppStore(s => s.completeTour);
  const handleNext = () => {
    setDirection(1);
    if (step < steps.length - 1) setStep(step + 1);
    else {
      setIsFinished(true);
      completeTour();
      setTimeout(() => toggleTour(false), 1500);
    }
  };
  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
  };
  const handleSkip = () => {
    completeTour();
    toggleTour(false);
  };
  const CurrentIcon = steps[step].icon;
  return (
    <div className="flex flex-col h-full text-white p-6 sm:p-8 relative overflow-hidden">
      <AnimatePresence>{isFinished && <ConfettiBurst />}</AnimatePresence>
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative h-80 sm:h-96 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center"
            >
              <motion.div variants={containerVariants} className="flex flex-col items-center">
                <motion.div className="mb-6 bg-red-500/20 p-3 rounded-full animate-pulse-glow">
                  <CurrentIcon className="w-8 h-8 text-red-400" />
                </motion.div>
                <div className='text-center mb-6'>
                  <h2
                    id={`onboarding-tour-title-step-${step}`}
                    className='text-2xl sm:text-3xl font-bold mb-2 text-glow'
                  >
                    {steps[step].title}
                  </h2>
                  <p
                    id={`onboarding-tour-desc-step-${step}`}
                    className='text-neutral-400 max-w-md mx-auto'
                  >
                    {steps[step].description}
                  </p>
                </div>
                {steps[step].content}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex justify-center gap-2 my-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all hover:scale-110 ${i === step ? 'bg-red-500 scale-125 shadow-red-glow' : 'bg-neutral-600'}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>Skip</Button>
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>}
            <Button className="btn-accent hover:shadow-red-glow hover:scale-105 transition-all active:scale-95 animate-pulse-glow" onClick={handleNext}>
              {step === steps.length - 1 ? <>Finish <CheckCircle className="ml-2 h-4 w-4" /></> : <>Next <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export function OnboardingTour() {
  const isMobile = useIsMobile();
  const isTourOpen = useAppStore(s => s.isTourOpen);
  const toggleTour = useAppStore(s => s.toggleTour);
  const TourWrapper = isMobile ? Sheet : Dialog;
  const TourInner = isMobile ? SheetContent : DialogContent;
  return (
    <>
      <AnimatePresence>
        {isTourOpen && (
          <motion.div
            className="fixed inset-0 bg-comic-black/50 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <TourWrapper open={isTourOpen} onOpenChange={toggleTour}>
        <TourInner
          className={isMobile
            ? "h-[90vh] p-0 bg-comic-card/80 backdrop-blur-xl border-none text-white"
            : "sm:max-w-lg p-0 bg-comic-card/80 backdrop-blur-xl border-white/10 glass-dark"
          }
          {...(isMobile ? { side: "bottom" } : {})}
          aria-labelledby="onboarding-tour-title"
          aria-describedby="onboarding-tour-desc"
        >
          <DialogHeader className="sr-only">
            <DialogTitle id="onboarding-tour-title">Welcome to ComicVerse!</DialogTitle>
            <DialogDescription id="onboarding-tour-desc">A quick tour of the main features.</DialogDescription>
          </DialogHeader>
          <TourContent />
        </TourInner>
      </TourWrapper>
    </>
  );
}