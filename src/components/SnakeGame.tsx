import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true); // start paused
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  // Prevent rapid double-turns killing the snake
  const nextDirectionRef = useRef(direction); 

  useEffect(() => {
    snakeRef.current = snake;
    directionRef.current = direction;
  }, [snake, direction]);

  const resetGame = () => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection({ x: 0, y: -1 });
    nextDirectionRef.current = { x: 0, y: -1 };
    setFood(generateFood(initialSnake));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' || e.key === 'Enter') {
      if (isGameOver) {
        resetGame();
      } else {
        setIsPaused(p => !p);
      }
      return;
    }

    const currentDir = nextDirectionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
    
    // Auto unpause when starting to move
    if (isPaused && !isGameOver) {
      setIsPaused(false);
    }
  }, [isGameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      const currentSnake = [...snakeRef.current];
      // Update the actual direction from the buffered input
      const currentDir = nextDirectionRef.current;
      setDirection(currentDir);
      
      const head = { ...currentSnake[0] };

      head.x += currentDir.x;
      head.y += currentDir.y;

      // Check wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      currentSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(currentSnake));
        // Don't pop(), snake grows
      } else {
        currentSnake.pop();
      }

      setSnake(currentSnake);
    };

    // calculate speed modifier based on score
    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 30) * 10);
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [isPaused, isGameOver, food, score]);

  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
    }
  }, [isGameOver, score, highScore]);

  return (
    <div className="flex flex-col items-center bg-neutral-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
      
      {/* Score Header */}
      <div className="flex w-full items-center justify-between mb-6 px-4">
        <div className="flex flex-col">
          <span className="text-neutral-500 font-mono text-xs mb-1 uppercase tracking-widest">Score</span>
          <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] font-mono leading-none">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex border border-neutral-800 bg-neutral-950 px-4 py-2 rounded-xl items-center gap-3">
          <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_#eab308]" />
          <div className="flex flex-col items-end">
            <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Top Score</span>
            <span className="text-yellow-500 font-black font-mono leading-none">
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative border-4 border-neutral-800 rounded-lg bg-black overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.1)]">
        
        {/* The Grid Canvas */}
        <div 
          className="relative grid bg-[#080808]"
          style={{
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            // Optional faint grid lines
            backgroundImage: `linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)`,
            backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`
          }}
        >
          {/* Food */}
          <div 
            className="absolute rounded-full bg-fuchsia-500 shadow-[0_0_15px_#d946ef] animate-pulse"
            style={{
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              transform: 'scale(0.8)' // Make it slightly smaller than the cell
            }}
          />

          {/* Snake Segments */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-sm ${
                  isHead 
                    ? 'bg-cyan-400 z-10 shadow-[0_0_15px_#22d3ee]' 
                    : 'bg-cyan-600/80'
                }`}
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  transform: isHead ? 'scale(1.05)' : 'scale(0.9)'
                }}
              >
                {/* Eyes for the head */}
                {isHead && (
                   <div className="relative w-full h-full">
                     <div className="absolute w-[20%] h-[20%] bg-black rounded-full top-[20%] left-[20%]" />
                     <div className="absolute w-[20%] h-[20%] bg-black rounded-full top-[20%] right-[20%]" />
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none" />
            
            {isGameOver ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <h2 className="text-4xl font-black text-red-500 drop-shadow-[0_0_15px_#ef4444] mb-2 tracking-widest uppercase">
                  System Fail
                </h2>
                <p className="text-cyan-100/70 font-mono mb-8 opacity-80">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="group relative px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 font-bold border border-cyan-500/50 hover:border-cyan-400 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2 mx-auto uppercase tracking-wider"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Reboot Sequence
                </button>
              </div>
            ) : (
              <div className="text-center animate-pulse">
                <Gamepad2 className="w-16 h-16 text-cyan-500 drop-shadow-[0_0_15px_#06b6d4] mx-auto mb-4" />
                <h2 className="text-2xl font-black tracking-widest text-white drop-shadow-[0_0_10px_#fff]">READY</h2>
                <p className="text-neutral-400 font-mono text-sm mt-4">Press any arrow key to start</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4 text-xs font-mono text-neutral-500">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md">W</kbd>
          <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md">A</kbd>
          <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md">S</kbd>
          <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md">D</kbd>
          <span className="ml-1">to move</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md">SPACE</kbd>
          <span className="ml-1">to pause</span>
        </span>
      </div>
      
    </div>
  );
}
