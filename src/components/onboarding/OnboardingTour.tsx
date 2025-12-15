import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Gift, MessageCircle, Sparkles } from 'lucide-react';
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
const ConfettiBurst = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 50 }).map((_, i) => (
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
          <CarouselItem><Card className="bg-comic-card/50"><CardContent className="flex aspect-square items-center justify-center p-6"><img src="https://comicvine.gamespot.com/a/uploads/scale_large/11135/111356221/9232085-asm2022036_cov.jpg" alt="Comic Cover" className="rounded-md shadow-lg" /></CardContent></Card></CarouselItem>
          <CarouselItem><Card className="bg-comic-card/50"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center">➡️ Add to Cart & Checkout</p></CardContent></Card></CarouselItem>
          <CarouselItem><Card className="bg-comic-card/50"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center">📚 Unlocked in your Library!</p></CardContent></Card></CarouselItem>
        </CarouselContent>
      </Carousel>
    ),
  },
  {
    icon: MessageCircle,
    title: "Join the Community",
    description: "Every comic has a dedicated community channel. Join the conversation, share theories, and connect with fellow fans and creators.",
    content: <Card className="bg-comic-card/50"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center">💬 Join Channel on Product Page</p></CardContent></Card>,
  },
  {
    icon: Sparkles,
    title: "Share Your Thoughts",
    description: "Post text, images, voice notes, and more. React to posts, give awards, and become a part of the story's legacy.",
    content: <Card className="bg-comic-card/50"><CardContent className="flex aspect-square items-center justify-center p-6"><p className="text-center">✍️ Post, React, and Award!</p></CardContent></Card>,
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
              <div className="mb-6 bg-red-500/20 p-3 rounded-full animate-pulse-glow">
                <CurrentIcon className="w-8 h-8 text-red-400" />
              </div>
              <DialogHeader className='text-center mb-6'>
                <DialogTitle id={`onboarding-tour-title-step-${step}`} className='text-2xl sm:text-3xl font-bold mb-2'>
                  {steps[step].title}
                </DialogTitle>
                <DialogDescription id={`onboarding-tour-desc-step-${step}`} className='text-neutral-400 max-w-md mx-auto'>
                  {steps[step].description}
                </DialogDescription>
              </DialogHeader>
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex justify-center gap-2 my-4">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-red-500 scale-125' : 'bg-neutral-600'}`} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>Skip</Button>
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>}
            <Button className="btn-accent hover:shadow-red-glow hover:scale-105 transition-all" onClick={handleNext}>
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
  if (isMobile) {
    return (
      <Sheet open={isTourOpen} onOpenChange={toggleTour}>
        <SheetContent side="bottom" className="h-[90vh] p-0 bg-comic-card border-none text-white">
          <DialogHeader className="sr-only">
            <DialogTitle id="onboarding-tour-title">Welcome to ComicVerse!</DialogTitle>
            <DialogDescription id="onboarding-tour-desc">A quick tour of the main features.</DialogDescription>
          </DialogHeader>
          <TourContent />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Dialog open={isTourOpen} onOpenChange={toggleTour}>
      <DialogContent
        className="sm:max-w-lg p-0 bg-comic-card border-white/10 glass-dark"
        aria-labelledby="onboarding-tour-title"
        aria-describedby="onboarding-tour-desc"
      >
        <DialogHeader className="sr-only">
          <DialogTitle id="onboarding-tour-title">Welcome to ComicVerse!</DialogTitle>
          <DialogDescription id="onboarding-tour-desc">A quick tour of the main features.</DialogDescription>
        </DialogHeader>
        <TourContent />
      </DialogContent>
    </Dialog>
  );
}