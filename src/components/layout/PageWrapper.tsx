import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface PageWrapperProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
export function PageWrapper({ children, navbar, footer, className }: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-comic-black text-white">
      {navbar}
      <main className="flex-1">
        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
          <motion.div
            className="py-16 md:py-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {children}
          </motion.div>
        </div>
      </main>
      {footer}
    </div>
  );
}