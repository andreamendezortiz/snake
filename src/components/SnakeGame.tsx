import { useState, useEffect, useRef, useCallback } from 'react';
import { Point, Direction } from '../types';
import { Trophy, RefreshCw, Play, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = Direction.UP;
const SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const lastMoveTime = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, score, highScore]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setDirection(prev => {
      if (newDirection === Direction.UP && prev !== Direction.DOWN) return Direction.UP;
      if (newDirection === Direction.DOWN && prev !== Direction.UP) return Direction.DOWN;
      if (newDirection === Direction.LEFT && prev !== Direction.RIGHT) return Direction.LEFT;
      if (newDirection === Direction.RIGHT && prev !== Direction.LEFT) return Direction.RIGHT;
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': changeDirection(Direction.UP); break;
        case 'ArrowDown': changeDirection(Direction.DOWN); break;
        case 'ArrowLeft': changeDirection(Direction.LEFT); break;
        case 'ArrowRight': changeDirection(Direction.RIGHT); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection]);

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (time: number) => {
      if (time - lastMoveTime.current >= SPEED) {
        moveSnake();
        lastMoveTime.current = time;
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#39ff14' : '#00ffff';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = index === 0 ? '#39ff14' : '#00ffff';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Background glow for the container */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-neon-pink/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neon-blue/10 blur-[100px] pointer-events-none" />

      <div className="flex justify-between w-full items-end gap-12">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Session Score</span>
          <div className="text-4xl font-bold neon-text-green tabular-nums">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Trophy size={14} className="text-neon-pink" />
            <span className="text-[10px] uppercase tracking-widest">High Score</span>
          </div>
          <div className="text-2xl font-bold text-zinc-300 tabular-nums">
            {highScore.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg neon-border-blue bg-zinc-950 transition-all duration-500 group-hover:scale-[1.01]"
        />
        
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-lg animate-in fade-in duration-300">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-bold neon-text-pink mb-2">GAME OVER</h2>
                <p className="text-zinc-400 mb-6 text-sm">Better luck next run, pilot.</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-neon-pink text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,0,255,0.5)]"
                >
                  <RefreshCw size={18} />
                  RESTART
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold neon-text-blue mb-6 tracking-tighter">PAUSED</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-3 bg-neon-blue text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                >
                  <Play size={18} fill="currentColor" />
                  RESUME
                </button>
                <p className="mt-4 text-[10px] uppercase tracking-widest text-zinc-500">Press Space to toggle</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button
            onClick={() => changeDirection(Direction.UP)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-400 active:bg-neon-pink active:text-black hover:border-neon-pink transition-all shadow-lg active:shadow-[0_0_15px_rgba(255,0,255,0.4)]"
          >
            <ChevronUp size={28} />
          </button>
          <div />
          
          <button
            onClick={() => changeDirection(Direction.LEFT)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-400 active:bg-neon-blue active:text-black hover:border-neon-blue transition-all shadow-lg active:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
          >
            <ChevronLeft size={28} />
          </button>
          
          <button
            onClick={() => setIsPaused(p => !p)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-400 active:bg-neon-green active:text-black hover:border-neon-green transition-all shadow-lg active:shadow-[0_0_15px_rgba(57,255,20,0.4)]"
          >
            {isPaused ? <Play size={20} fill="currentColor" /> : <div className="w-2.5 h-2.5 bg-zinc-400 rounded-sm" />}
          </button>

          <button
            onClick={() => changeDirection(Direction.RIGHT)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-400 active:bg-neon-blue active:text-black hover:border-neon-blue transition-all shadow-lg active:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
          >
            <ChevronRight size={28} />
          </button>

          <div />
          <button
            onClick={() => changeDirection(Direction.DOWN)}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-400 active:bg-neon-pink active:text-black hover:border-neon-pink transition-all shadow-lg active:shadow-[0_0_15px_rgba(255,0,255,0.4)]"
          >
            <ChevronDown size={28} />
          </button>
          <div />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mt-2">D-Pad Controls</span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-950/50 flex flex-col gap-1">
          <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-wider">Movement</span>
          <span className="text-xs text-zinc-400">Arrow Keys</span>
        </div>
        <div className="p-3 border border-zinc-800 rounded-xl bg-zinc-950/50 flex flex-col gap-1">
          <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-wider">Pause / Play</span>
          <span className="text-xs text-zinc-400">Spacebar</span>
        </div>
      </div>
    </div>
  );
}
