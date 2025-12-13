import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Filter } from 'lucide-react';
import { comics, genres, authors } from '@/lib/comic-data';
import { ComicCard } from '@/components/ui/comic-card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
function FilterSidebar() {
  return (
    <aside className="w-full space-y-8">
      <div>
        <h3 className="font-semibold text-lg mb-4">Genres</h3>
        <div className="space-y-2">
          {genres.map(genre => (
            <div key={genre.id} className="flex items-center space-x-2">
              <Checkbox id={`genre-${genre.id}`} />
              <Label htmlFor={`genre-${genre.id}`} className="font-normal text-neutral-300">{genre.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4">Authors</h3>
        <div className="space-y-2">
          {authors.map(author => (
            <div key={author.id} className="flex items-center space-x-2">
              <Checkbox id={`author-${author.id}`} />
              <Label htmlFor={`author-${author.id}`} className="font-normal text-neutral-300">{author.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <Button className="w-full btn-accent">Apply Filters</Button>
    </aside>
  );
}
export function CatalogPage() {
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Full Catalog</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><LayoutGrid className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-neutral-500"><List className="h-5 w-5" /></Button>
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon"><Filter className="h-5 w-5" /></Button>
                </SheetTrigger>
                <SheetContent className="bg-comic-card border-l-white/10 text-white">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100%-4rem)] pr-4">
                    <FilterSidebar />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {comics.map((comic, index) => (
                <motion.div
                  key={comic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ComicCard comic={comic} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}