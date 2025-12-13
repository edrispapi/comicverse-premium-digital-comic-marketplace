import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
interface CheckoutStepperProps {
  steps: { title: string; content: React.ReactNode }[];
  currentStep: number;
}
const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};
export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  currentStep > index ? 'bg-comic-accent border-comic-accent text-comic-black' :
                  currentStep === index ? 'border-comic-accent scale-110 shadow-accent-glow' : 'border-neutral-600 bg-comic-card text-neutral-400'
                )}
              >
                {currentStep > index ? '✓' : index + 1}
              </div>
              <p className={cn(
                "mt-2 text-xs sm:text-sm font-medium transition-colors",
                currentStep >= index ? 'text-white' : 'text-neutral-500'
              )}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4 transition-colors duration-500",
                currentStep > index ? 'bg-comic-accent' : 'bg-neutral-700'
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}