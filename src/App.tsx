import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen relative flex border-t-4 border-cyan-500 flex-col overflow-hidden selection:bg-cyan-500/30">
      
      {/* Dynamic Background Noise & Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black" />
         <div 
           className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
           }}
         />
         <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-cyan-900/10 to-transparent mix-blend-screen" />
         <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-fuchsia-900/10 to-transparent mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-center gap-3">
         <Gamepad2 className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" />
         <h1 className="text-3xl font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
           <span className="text-cyan-400">NEON</span>
           <span className="text-fuchsia-400">ARCADE</span>
         </h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col xl:flex-row items-center justify-center gap-12 p-6 pb-20">
        
        {/* Game Area */}
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out">
           <SnakeGame />
        </div>

        {/* Multimedia Panel Area */}
        <div className="flex-shrink-0 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-24 duration-1000 ease-out delay-150">
          <div className="hidden xl:block bg-neutral-900/50 backdrop-blur px-4 py-2 rounded border border-neutral-800 text-neutral-400 font-mono text-xs uppercase tracking-widest w-full text-center">
            System Auxiliary Panel
          </div>
          <MusicPlayer />
          
          <div className="hidden xl:flex w-full px-6 py-4 bg-neutral-900/30 backdrop-blur rounded-2xl border border-white/5 flex-col gap-3">
             <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>CPU TEMP</span>
                <span className="text-green-400">42°C</span>
             </div>
             <div className="w-full bg-neutral-950 rounded-full h-1">
                <div className="bg-green-400 h-1 rounded-full shadow-[0_0_5px_#4ade80]" style={{width: '42%'}} />
             </div>
             <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mt-2">
                <span>MEMORY</span>
                <span className="text-cyan-400">16 GB</span>
             </div>
             <div className="w-full bg-neutral-950 rounded-full h-1">
                <div className="bg-cyan-400 h-1 rounded-full shadow-[0_0_5px_#22d3ee]" style={{width: '64%'}} />
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
