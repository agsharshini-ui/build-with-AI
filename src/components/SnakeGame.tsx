import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
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
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/60 backdrop-blur-md rounded-[40px] border-2 border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      <div className="flex justify-between w-full items-center px-4">
        <div className="font-mono text-3xl tracking-widest">
          <span className="text-cyan-400 uppercase">SCORE: </span>
          <span className="text-white">{score}</span>
        </div>
        <button 
          onClick={() => setIsPaused(p => !p)}
          className="px-6 py-1.5 rounded-full border border-cyan-400 text-cyan-400 text-[10px] uppercase tracking-widest hover:bg-cyan-400/10 transition-colors"
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      <div 
        className="relative bg-[#080808] border border-cyan-500/30 rounded-xl overflow-hidden shadow-[inset_0_0_30px_rgba(6,182,212,0.2)]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-all duration-150 ${
              i === 0 
                ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10' 
                : 'bg-cyan-600/80'
            }`}
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899] animate-pulse"
          style={{
            width: 14,
            height: 14,
            left: food.x * 20 + 3,
            top: food.y * 20 + 3,
          }}
        />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
            <h2 className="text-pink-500 text-5xl font-bold tracking-tighter mb-8 drop-shadow-[0_0_20px_#ec4899]">GAME OVER</h2>
            <button
              onClick={resetGame}
              className="px-12 py-3.5 bg-cyan-400 text-black font-black rounded-full hover:bg-cyan-300 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.6)] uppercase tracking-widest text-sm"
            >
              RESTART
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {isPaused && !isGameOver && score === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
            <button
              onClick={() => setIsPaused(false)}
              className="px-12 py-4 border-2 border-cyan-400 text-cyan-400 font-bold rounded-full hover:bg-cyan-400/10 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase tracking-widest text-sm"
            >
              START GAME
            </button>
            <p className="mt-6 text-cyan-400/60 text-[10px] uppercase tracking-[0.3em] font-bold">Use Arrow Keys to Move</p>
          </div>
        )}
      </div>
      
      <div className="text-cyan-400/40 text-[10px] uppercase tracking-[0.3em]">
        Retro Cybernetic Simulation v1.0
      </div>
    </div>
  );
};
