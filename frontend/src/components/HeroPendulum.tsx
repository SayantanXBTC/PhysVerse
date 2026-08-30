import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Live double-pendulum. Not decorative — real integrated physics (RK4-ish).
 * Chaotic, unrepeatable. Traces a fading path. Static under reduced-motion.
 *
 * The whole marketing visual is this. Nothing else.
 */
export default function HeroPendulum({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({
    theta1: Math.PI / 2 + 0.2,
    theta2: Math.PI / 2 - 0.15,
    omega1: 0,
    omega2: 0,
    trail: [] as Array<{ x: number; y: number; life: number }>
  });
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physics constants
    const g = 9.81;
    const L1 = 1;
    const L2 = 1;
    const m1 = 1;
    const m2 = 1;
    const dt = 1 / 240; // sub-step
    const stepsPerFrame = 4;

    const derivatives = (t1: number, t2: number, o1: number, o2: number) => {
      const delta = t2 - t1;
      const sinDelta = Math.sin(delta);
      const cosDelta = Math.cos(delta);

      const den1 = (m1 + m2) * L1 - m2 * L1 * cosDelta * cosDelta;
      const den2 = (L2 / L1) * den1;

      const a1 =
        (m2 * L1 * o1 * o1 * sinDelta * cosDelta +
          m2 * g * Math.sin(t2) * cosDelta +
          m2 * L2 * o2 * o2 * sinDelta -
          (m1 + m2) * g * Math.sin(t1)) /
        den1;

      const a2 =
        (-m2 * L2 * o2 * o2 * sinDelta * cosDelta +
          (m1 + m2) * g * Math.sin(t1) * cosDelta -
          (m1 + m2) * L1 * o1 * o1 * sinDelta -
          (m1 + m2) * g * Math.sin(t2)) /
        den2;

      return { do1: a1, do2: a2, dt1: o1, dt2: o2 };
    };

    const step = () => {
      const s = stateRef.current;
      const d = derivatives(s.theta1, s.theta2, s.omega1, s.omega2);
      s.omega1 += d.do1 * dt;
      s.omega2 += d.do2 * dt;
      s.theta1 += d.dt1 * dt;
      s.theta2 += d.dt2 * dt;
      // Damping — keeps energy bounded so system doesn't run away
      s.omega1 *= 0.9995;
      s.omega2 *= 0.9995;
    };

    const draw = () => {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Anchor near top-center
      const cx = w / 2;
      const cy = h * 0.28;
      const scale = Math.min(w, h) * 0.24;

      const x1 = cx + scale * Math.sin(s.theta1);
      const y1 = cy + scale * Math.cos(s.theta1);
      const x2 = x1 + scale * Math.sin(s.theta2);
      const y2 = y1 + scale * Math.cos(s.theta2);

      // Add to trail
      s.trail.push({ x: x2, y: y2, life: 1 });
      if (s.trail.length > 500) s.trail.shift();

      // Clear (with slight fade → soft persistence)
      ctx.fillStyle = 'rgba(11, 12, 14, 0.14)';
      ctx.fillRect(0, 0, w, h);

      // Draw trail
      ctx.lineWidth = 1.5 * dpr;
      for (let i = 1; i < s.trail.length; i++) {
        const a = s.trail[i - 1];
        const b = s.trail[i];
        const alpha = (i / s.trail.length) * 0.55;
        ctx.strokeStyle = `rgba(229, 72, 77, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Rods
      ctx.strokeStyle = 'rgba(237, 238, 241, 0.85)';
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Anchor
      ctx.fillStyle = 'rgba(183, 188, 196, 0.6)';
      ctx.beginPath();
      ctx.arc(cx, cy, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Mass 1
      ctx.fillStyle = 'rgba(237, 238, 241, 0.95)';
      ctx.beginPath();
      ctx.arc(x1, y1, 5 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Mass 2 (signal)
      ctx.fillStyle = '#E5484D';
      ctx.beginPath();
      ctx.arc(x2, y2, 7 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    let last = performance.now();
    const loop = (now: number) => {
      const elapsed = now - last;
      last = now;
      // Guard against pauses (tab hidden)
      if (elapsed < 200) {
        for (let i = 0; i < stepsPerFrame; i++) step();
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    if (reduce) {
      // Draw one static frame in a graceful state
      for (let i = 0; i < 60; i++) step();
      draw();
    } else {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`w-full h-full block ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
