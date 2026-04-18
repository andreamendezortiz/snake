/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Activity, Gamepad2, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-950 selection:bg-neon-pink selection:text-white">
      {/* Background visual elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-pink blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-blue blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-6xl z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 bg-neon-pink text-[10px] text-black font-black uppercase tracking-tighter">System: Online</div>
              <div className="px-2 py-0.5 bg-zinc-800 text-[10px] text-zinc-400 font-bold uppercase tracking-widest border border-zinc-700">Ver 2.0.26</div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">
              Neon<span className="neon-text-pink">Beats</span>
            </h1>
            <p className="text-zinc-500 uppercase tracking-[0.3em] font-bold text-xs">Aesthetic Arcade x Sound Console</p>
          </div>
          
          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Grid Status</span>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <Activity size={14} className="text-neon-green" />
                <span className="text-xs font-bold text-zinc-300">STABLE</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Game Section */}
          <div className="lg:col-span-8 flex justify-center">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="w-full flex justify-center"
             >
               <SnakeGame />
             </motion.div>
          </div>

          {/* Side Control Section */}
          <div className="lg:col-span-4 flex flex-col gap-8 h-full">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500 px-2">
                <Radio size={16} />
                <h2 className="text-[10px] uppercase font-black tracking-[0.2em]">Audio Transmission</h2>
              </div>
              <MusicPlayer />
            </section>

            <section className="flex-1 p-6 border border-zinc-800 rounded-3xl bg-zinc-900/40 backdrop-blur-sm space-y-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-zinc-500">
                <Gamepad2 size={16} />
                <h2 className="text-[10px] uppercase font-black tracking-[0.2em]">Quick Tips</h2>
              </div>
              
              <ul className="space-y-4">
                <li className="flex gap-4 group">
                  <div className="w-1.5 bg-neon-pink group-hover:h-full h-8 transition-all duration-300" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase italic">Eat to Grow</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-tighter">Consumption increases tail length and scoring multipliers.</p>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <div className="w-1.5 bg-neon-blue group-hover:h-full h-8 transition-all duration-300" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase italic">Avoid Edges</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-tighter">Collision with boundaries or self results in structural failure.</p>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <div className="w-1.5 bg-neon-green group-hover:h-full h-8 transition-all duration-300" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase italic">Flow State</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-tighter">Music helps focus. Switch tracks to find your perfect rhythmic match.</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <footer className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-600">
          <span>&copy; 2026 AI Arcades Inc. / Neural Audio Labs</span>
          <div className="flex gap-8">
            <span className="hover:text-neon-pink cursor-pointer transition-colors">Terminals</span>
            <span className="hover:text-neon-blue cursor-pointer transition-colors">Neural Link</span>
            <span className="hover:text-neon-green cursor-pointer transition-colors">Nodes</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
