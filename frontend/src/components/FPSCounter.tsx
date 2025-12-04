import { useState, useEffect } from 'react';

interface FPSCounterProps {
  show?: boolean;
}

export default function FPSCounter({ show = true }: FPSCounterProps) {
  const [fps, setFps] = useState(60);
  
  useEffect(() => {
    if (!show) return;
    
    let lastTime = performance.now();
    let frames = 0;
    let animationId: number;
    
    const updateFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (currentTime - lastTime)));
        frames = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(updateFPS);
    };
    
    animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className="fixed top-4 right-4 glass-red px-4 py-2 rounded-xl border border-red-500/30 z-50 shadow-xl shadow-red-900/30">
      <span className="text-sm font-mono font-bold">
        <span className={`${
          fps >= 55 ? 'text-green-400' : 
          fps >= 30 ? 'text-yellow-400' : 
          'text-red-400'
        } transition-colors duration-300`}>
          {fps}
        </span>
        <span className="text-gray-400 ml-1.5">FPS</span>
      </span>
    </div>
  );
}
