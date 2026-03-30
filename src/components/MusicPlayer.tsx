import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyber Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'Retro Wave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/drive/400/400',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'AI Composer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/horizon/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md bg-[#0a0a0a] backdrop-blur-xl rounded-[32px] p-6 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-6">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-2xl overflow-hidden border border-purple-500/30 flex-shrink-0"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover grayscale transition-transform duration-1000 ${isPlaying ? 'scale-110' : ''}`}
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
            >
              <h3 className="text-white font-bold text-xl truncate">{currentTrack.title}</h3>
              <p className="text-purple-400 text-sm truncate">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handlePrev} className="text-white/60 hover:text-white transition-colors">
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-black hover:bg-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={handleNext} className="text-white/60 hover:text-white transition-colors">
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">
        <div className="flex items-center gap-1.5">
          <Volume2 size={12} />
          <span>STEREO OUTPUT</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Music size={12} />
          <span>TRACK {currentTrackIndex + 1}/{DUMMY_TRACKS.length}</span>
        </div>
      </div>
    </div>
  );
};
