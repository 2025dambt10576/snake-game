import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "Cyberpunk Cityscape",
    artist: "AI Synthbot Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_#22d3ee]"
  },
  {
    id: 2,
    title: "Neon Overdrive",
    artist: "AI Synthbot Beta",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "text-fuchsia-400",
    glow: "shadow-[0_0_15px_#e879f9]"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "AI Synthbot Gamma",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "text-green-400",
    glow: "shadow-[0_0_15px_#4ade80]"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`p-6 rounded-2xl bg-neutral-900/80 backdrop-blur border border-white/10 flex flex-col items-center justify-center w-full max-w-sm ${currentTrack.glow} transition-all duration-500`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        preload="auto"
      />
      
      <div className="flex items-center gap-3 mb-6">
        <Music className={`w-8 h-8 ${currentTrack.color} animate-pulse`} />
        <div className="text-center">
          <h2 className={`text-xl font-bold ${currentTrack.color} tracking-wider`}>{currentTrack.title}</h2>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Visualizer bars placeholder */}
      <div className="flex items-end h-8 gap-1 mb-6 w-full justify-center opacity-80">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 rounded-t-sm ${currentTrack.color.replace('text-', 'bg-')} transition-all duration-75`}
            style={{ 
              height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
              animationDelay: `${i * 0.1}s` 
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={handlePrev}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handlePlayPause}
          className={`p-4 rounded-full bg-neutral-800 border-2 transition-all ${
            isPlaying 
              ? `border-${currentTrack.color.split('-')[1]}-500 shadow-[0_0_15px_${currentTrack.glow.match(/#\w+|^/)?.[0]}]` 
              : 'border-neutral-600'
          }`}
        >
          {isPlaying ? (
            <Pause className={`w-6 h-6 ${currentTrack.color}`} />
          ) : (
            <Play className={`w-6 h-6 ${currentTrack.color} ml-1`} />
          )}
        </button>
        
        <button 
          onClick={handleNext}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between w-full">
        <button onClick={toggleMute} className="text-neutral-500 hover:text-neutral-300 transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-neutral-500 tracking-widest font-mono">LIVE AI STREAM</span>
        </div>
      </div>
    </div>
  );
}
