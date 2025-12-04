import { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory?: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);

  useEffect(() => {
    let animationFrameId: number;

    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      frameCountRef.current++;
      frameTimesRef.current.push(delta);
      
      // Keep only last 60 frames
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Update metrics every second
      if (delta >= 1000) {
        const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);

        setMetrics({
          fps,
          frameTime: avgFrameTime,
          memory: (performance as any).memory?.usedJSHeapSize / 1048576 // MB
        });

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameId = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition z-50"
        title="Performance Monitor"
        aria-label="Toggle performance monitor"
      >
        <Activity size={20} />
      </button>

      {/* Metrics Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 space-y-2 text-sm z-50 min-w-[200px]">
          <div className="font-semibold text-gray-300 border-b border-gray-700 pb-2">
            Performance
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">FPS:</span>
            <span className={`font-mono font-bold ${getFPSColor(metrics.fps)}`}>
              {metrics.fps}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Frame Time:</span>
            <span className="font-mono text-gray-300">
              {metrics.frameTime.toFixed(2)}ms
            </span>
          </div>

          {metrics.memory && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Memory:</span>
              <span className="font-mono text-gray-300">
                {metrics.memory.toFixed(1)}MB
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-gray-700">
            <div className="text-xs text-gray-500">
              Target: 60 FPS
            </div>
          </div>
        </div>
      )}
    </>
  );
}
