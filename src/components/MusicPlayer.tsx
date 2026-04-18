import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { TRACKS } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-sm p-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden group">
      {/* Dynamic Background Glow based on track */}
      <div 
        className="absolute inset-0 opacity-10 transition-colors duration-1000 blur-[80px]" 
        style={{ backgroundColor: currentTrack.color }} 
      />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <Music2 size={16} className="text-zinc-500" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500`} style={{ backgroundColor: currentTrack.color }} />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">Now Playing</span>
          </div>
        </div>

        <div className="space-y-1">
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="text-2xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {currentTrack.title}
            </motion.h3>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTrack.artist}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="text-xs uppercase tracking-widest font-medium text-zinc-400"
            >
              {currentTrack.artist}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Custom Progress Bar */}
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
            <motion.div 
              className="h-full rounded-full transition-colors duration-1000"
              animate={{ width: `${progress}%` }}
              style={{ backgroundColor: currentTrack.color, boxShadow: `0 0 10px ${currentTrack.color}` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-tighter text-zinc-600 font-bold">
            <span>00:{Math.floor((audioRef.current?.currentTime || 0)).toString().padStart(2, '0')}</span>
            <span>AI GENERATED AUDIO</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button 
            onClick={handlePrev}
            className="p-4 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all active:scale-95"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={handleTogglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-all shadow-xl active:scale-95 group/play"
          >
            {isPlaying ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play size={28} className="translate-x-0.5" fill="currentColor" />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="p-4 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all active:scale-95"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/30 rounded-2xl border border-zinc-700/30">
          <Volume2 size={14} className="text-zinc-500" />
          <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
             <div className="h-full w-2/3 bg-zinc-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
