import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen gap-12">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center relative"
        >
          {/* Colored Boxes Graphic */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none opacity-60">
            <div className="absolute top-0 right-0 w-48 h-28 bg-cyan-500" />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-56 h-28 bg-pink-500/80" />
            <div className="absolute top-12 left-0 w-56 h-28 border-2 border-cyan-400/40 border-dashed" />
          </div>

          <h1 className="text-7xl md:text-9xl font-display italic font-black tracking-tighter leading-none relative z-10">
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">Neon Snake</span>
          </h1>
          <p className="mt-6 text-slate-400 uppercase tracking-[0.6em] text-[9px] font-bold opacity-80">Retro-Futuristic Audio-Visual Experience</p>
        </motion.header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <SnakeGame />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-auto flex flex-col gap-8"
          >
            <MusicPlayer />
            
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">System Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Neural Link</span>
                  <span className="text-xs text-cyan-400 font-mono">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Audio Buffer</span>
                  <span className="text-xs text-purple-400 font-mono">STABLE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Core Temp</span>
                  <span className="text-xs text-pink-400 font-mono">32°C</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-auto pt-12 flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em]">Designed for the Grid • 2026</p>
        </footer>
      </main>
    </div>
  );
}
