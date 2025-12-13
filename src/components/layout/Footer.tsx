import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export function Footer() {
  return (
    <footer className="bg-comic-card border-t border-white/10 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <BookOpen className="h-8 w-8 text-comic-accent" />
              <span className="text-2xl font-bold">ComicVerse</span>
            </Link>
            <p className="text-sm">
              Your premier destination for digital comics, manga, and graphic novels.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link></li>
              <li><Link to="/new-releases" className="hover:text-white transition-colors">New Releases</Link></li>
              <li><Link to="/trending" className="hover:text-white transition-colors">Trending</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-white tracking-wider uppercase">Newsletter</h3>
            <p className="text-sm">Get the latest updates and special offers.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Enter your email" className="bg-neutral-800/50 border-neutral-700 flex-1" />
              <Button type="submit" size="icon" className="btn-accent flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ComicVerse. Built with ❤️ at Cloudflare.</p>
        </div>
      </div>
    </footer>
  );
}