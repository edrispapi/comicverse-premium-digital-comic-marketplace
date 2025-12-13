import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/use-store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Link } from 'react-router-dom';
export function GlobalAudioPlayer() {
  const queue = useAppStore(state => state.audioQueue);
  const currentId = useAppStore(state => state.currentAudioId);
  const playNext = useAppStore(state => state.playNext);
  const playPrev = useAppStore(state => state.playPrev);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const isMobile = useIsMobile();
  const currentAudio = queue.find(item => item.id === currentId);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentAudio) {
      if (audio.src !== currentAudio.audioUrl) {
        audio.src = currentAudio.audioUrl!;
      }
      audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Audio play failed:", e));
    } else if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentId, currentAudio]);
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  }, []);
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);
  const handleEnded = useCallback(() => {
    playNext();
  }, [playNext]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded]);
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value[0] / 100) * duration;
    }
  };
  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0];
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const PlayerUI = () => (
    <div className="flex items-center gap-4 w-full">
      {currentAudio && <img src={currentAudio.coverUrl} alt={currentAudio.title} className="w-14 h-14 rounded-md object-cover" />}
      <div className="flex-1">
        <p className="font-semibold truncate">{currentAudio?.title || 'No track selected'}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">{formatTime(audioRef.current?.currentTime || 0)}</span>
          <Slider value={[progress]} onValueChange={handleProgressChange} className="[&>span:first-child]:bg-red-800 [&>span:first-child>span]:bg-red-500" />
          <span className="text-xs text-neutral-400">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={playPrev} disabled={queue.length <= 1} className="text-red-400 hover:text-red-300"><SkipBack className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon" onClick={togglePlay} className="h-12 w-12 bg-red-500 text-white hover:bg-red-600 rounded-full">
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={playNext} disabled={queue.length <= 1} className="text-red-400 hover:text-red-300"><SkipForward className="w-5 h-5" /></Button>
      </div>
      <div className="hidden md:flex items-center gap-2 w-32">
        <Button variant="ghost" size="icon" onClick={toggleMute} className="text-red-400 hover:text-red-300">{isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</Button>
        <Slider value={[isMuted ? 0 : volume]} onValueChange={handleVolumeChange} max={1} step={0.01} className="[&>span:first-child]:bg-red-800 [&>span:first-child>span]:bg-red-500" />
      </div>
      <Sheet>
        <SheetTrigger asChild><Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300"><ListMusic className="w-5 h-5" /></Button></SheetTrigger>
        <SheetContent className="bg-comic-card border-l-red-500/20 text-white"><SheetHeader><SheetTitle>Up Next</SheetTitle></SheetHeader>
          <ScrollArea className="h-[calc(100%-4rem)] pr-4 mt-4">
            {queue.map(item => (
              <Link to={`/audiobooks/${item.id}`} key={item.id} className={`flex items-center gap-4 p-2 rounded-md hover:bg-red-500/10 ${item.id === currentId ? 'bg-red-500/20' : ''}`}>
                <img src={item.coverUrl} alt={item.title} className="w-12 h-12 rounded-md" />
                <p className="font-semibold">{item.title}</p>
              </Link>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
  return (
    <>
      <audio ref={audioRef} />
      <AnimatePresence>
        {currentAudio && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="p-4 glass-dark">
              <div className="max-w-7xl mx-auto">
                <PlayerUI />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}