import { useEffect, useRef } from 'react';

export type PreviewVariant =
  | 'solar'
  | 'wave'
  | 'pendulum'
  | 'rocket'
  | 'dna'
  | 'fluid'
  | 'lorenz'
  | 'magnetic'
  | 'projectile'
  | 'spring'
  | 'orbit';

interface Props {
  variant: PreviewVariant;
  className?: string;
  intensity?: number;
}

/**
 * Compact canvas 2D animated preview per simulation type.
 * IntersectionObserver pauses when off-screen. rAF-driven, DPR-capped at 1.5.
 */
export default function LiveSimulationPreview({
  variant,
  className = '',
  intensity = 1
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let t = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.max(2, Math.round(rect.width * dpr));
      canvas.height = Math.max(2, Math.round(rect.height * dpr));
      W = rect.width;
      H = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const io = new IntersectionObserver(
      ([e]) => {
        running = e?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Persistent state
    const lorenzTrail: Array<[number, number]> = [];
    const lorenzState = { x: 0.1, y: 0, z: 0 };
    const pendulumState = { a1: Math.PI / 2, a2: Math.PI / 2, v1: 0, v2: 0 };
    const rocketParticles: Array<{ x: number; y: number; vy: number; life: number }> = [];
    const fluidParticles = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      age: Math.random() * 100
    }));

    const clamp = (v: number) => Math.min(1, v);
    const RED = (a: number) => `rgba(255,90,95,${clamp(a * intensity)})`;
    const HOT = (a: number) => `rgba(255,210,170,${clamp(a * intensity)})`;
    const WHITE = (a: number) => `rgba(255,255,255,${clamp(a * intensity)})`;

    let lastTs = 0;
    const draw = (ts: number) => {
      raf = requestAnimationFrame(draw);
      if (!running) {
        lastTs = ts;
        return;
      }
      const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016;
      lastTs = ts;
      t += dt;
      ctx.clearRect(0, 0, W, H);

      switch (variant) {
        case 'solar':
          drawSolar(ctx, W, H, t, RED, HOT, WHITE);
          break;
        case 'wave':
          drawWave(ctx, W, H, t, RED, HOT);
          break;
        case 'pendulum':
          drawPendulum(ctx, W, H, dt, pendulumState, RED, WHITE);
          break;
        case 'rocket':
          drawRocket(ctx, W, H, t, dt, rocketParticles, RED, HOT, WHITE);
          break;
        case 'dna':
          drawDNA(ctx, W, H, t, RED, HOT);
          break;
        case 'fluid':
          drawFluid(ctx, W, H, t, dt, fluidParticles, RED);
          break;
        case 'lorenz':
          drawLorenz(ctx, W, H, dt, lorenzState, lorenzTrail, RED, HOT);
          break;
        case 'magnetic':
          drawMagnetic(ctx, W, H, t, RED);
          break;
        case 'projectile':
          drawProjectile(ctx, W, H, t, RED, HOT, WHITE);
          break;
        case 'spring':
          drawSpring(ctx, W, H, t, RED, HOT, WHITE);
          break;
        case 'orbit':
          drawOrbit(ctx, W, H, t, RED, HOT, WHITE);
          break;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [variant, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}

/* --- variant renderers --- */

function drawSolar(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  RED: (a: number) => string,
  HOT: (a: number) => string,
  WHITE: (a: number) => string
) {
  const cx = W / 2;
  const cy = H / 2;
  const scale = Math.min(W, H) * 0.32;
  // orbit paths
  ctx.strokeStyle = RED(0.15);
  ctx.lineWidth = 1;
  for (const r of [0.4, 0.68, 1.0]) {
    ctx.beginPath();
    ctx.arc(cx, cy, scale * r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // sun
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.3);
  g.addColorStop(0, HOT(1));
  g.addColorStop(0.5, RED(0.9));
  g.addColorStop(1, RED(0));
  ctx.fillStyle = g;
  ctx.fillRect(cx - scale * 0.3, cy - scale * 0.3, scale * 0.6, scale * 0.6);
  ctx.fillStyle = HOT(1);
  ctx.beginPath();
  ctx.arc(cx, cy, scale * 0.09, 0, Math.PI * 2);
  ctx.fill();
  // planets
  const planets = [
    { r: 0.4, w: 0.9, size: 3 },
    { r: 0.68, w: 0.55, size: 4 },
    { r: 1.0, w: 0.32, size: 3.5 }
  ];
  for (const p of planets) {
    const a = t * p.w;
    const px = cx + Math.cos(a) * scale * p.r;
    const py = cy + Math.sin(a) * scale * p.r;
    ctx.fillStyle = RED(0.9);
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    // trailing glow
    ctx.fillStyle = WHITE(0.15);
    ctx.beginPath();
    ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  RED: (a: number) => string,
  HOT: (a: number) => string
) {
  const midY = H / 2;
  const amp = H * 0.22;
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();
    ctx.strokeStyle = layer === 1 ? HOT(0.9) : RED(0.4 - layer * 0.1);
    ctx.lineWidth = layer === 1 ? 2 : 1;
    const phase = t * (1.5 - layer * 0.4);
    const freq = 0.02 + layer * 0.006;
    for (let x = 0; x <= W; x += 2) {
      const y =
        midY +
        Math.sin(x * freq + phase) * amp * 0.6 +
        Math.sin(x * freq * 2.1 + phase * 1.5) * amp * 0.25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawPendulum(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  dt: number,
  s: { a1: number; a2: number; v1: number; v2: number },
  RED: (a: number) => string,
  WHITE: (a: number) => string
) {
  // Simplified double pendulum integration
  const g = 9.8;
  const L1 = 1;
  const L2 = 1;
  const m1 = 1;
  const m2 = 1;
  const { a1, a2, v1, v2 } = s;
  const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
  const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
  const num3 = -2 * Math.sin(a1 - a2) * m2;
  const num4 = v2 * v2 * L2 + v1 * v1 * L1 * Math.cos(a1 - a2);
  const den = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
  const acc1 = (num1 + num2 + num3 * num4) / den;
  const n1 = 2 * Math.sin(a1 - a2);
  const n2 = v1 * v1 * L1 * (m1 + m2);
  const n3 = g * (m1 + m2) * Math.cos(a1);
  const n4 = v2 * v2 * L2 * m2 * Math.cos(a1 - a2);
  const den2 = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
  const acc2 = (n1 * (n2 + n3 + n4)) / den2;
  const step = Math.min(dt * 3, 0.05);
  s.v1 += acc1 * step;
  s.v2 += acc2 * step;
  s.v1 *= 0.9995;
  s.v2 *= 0.9995;
  s.a1 += s.v1 * step;
  s.a2 += s.v2 * step;

  const cx = W / 2;
  const cy = H * 0.28;
  const scale = Math.min(W, H) * 0.24;
  const x1 = cx + Math.sin(s.a1) * scale;
  const y1 = cy + Math.cos(s.a1) * scale;
  const x2 = x1 + Math.sin(s.a2) * scale;
  const y2 = y1 + Math.cos(s.a2) * scale;

  ctx.strokeStyle = WHITE(0.5);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.fillStyle = RED(0.85);
  ctx.beginPath();
  ctx.arc(x1, y1, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x2, y2, 5, 0, Math.PI * 2);
  ctx.fill();

  // pivot
  ctx.fillStyle = WHITE(0.8);
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawRocket(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  dt: number,
  particles: Array<{ x: number; y: number; vy: number; life: number }>,
  RED: (a: number) => string,
  HOT: (a: number) => string,
  WHITE: (a: number) => string
) {
  const cx = W * 0.5;
  const period = 3.5;
  const phase = (t % period) / period;
  const rocketY = H - phase * H * 1.2;

  // exhaust particles
  if (rocketY > -20) {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 6,
        y: rocketY + 12,
        vy: 30 + Math.random() * 40,
        life: 1
      });
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.y += p.vy * dt;
    p.life -= dt * 1.5;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    const a = p.life * 0.6;
    ctx.fillStyle = p.life > 0.5 ? HOT(a) : RED(a);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 * p.life + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // rocket body
  if (rocketY > -30 && rocketY < H + 30) {
    ctx.fillStyle = WHITE(0.9);
    ctx.beginPath();
    ctx.moveTo(cx, rocketY - 12);
    ctx.lineTo(cx - 6, rocketY + 6);
    ctx.lineTo(cx + 6, rocketY + 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = RED(0.9);
    ctx.fillRect(cx - 6, rocketY + 6, 12, 4);
  }
}

function drawDNA(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  RED: (a: number) => string,
  HOT: (a: number) => string
) {
  const cx = W / 2;
  const amp = W * 0.22;
  const step = 6;
  const rungs: Array<[number, number, number, number, number]> = [];
  const strandA: Array<[number, number]> = [];
  const strandB: Array<[number, number]> = [];
  for (let y = 0; y <= H; y += step) {
    const phase = y * 0.05 + t * 1.2;
    const xa = cx + Math.sin(phase) * amp;
    const xb = cx - Math.sin(phase) * amp;
    strandA.push([xa, y]);
    strandB.push([xb, y]);
    // z-depth via sin for alpha
    const depth = Math.cos(phase);
    rungs.push([xa, y, xb, y, depth]);
  }
  // rungs (behind strands so they appear connected)
  for (let i = 0; i < rungs.length; i += 2) {
    const [xa, ya, xb, yb, depth] = rungs[i];
    ctx.strokeStyle = RED(0.15 + 0.35 * (depth + 1) / 2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xa, ya);
    ctx.lineTo(xb, yb);
    ctx.stroke();
  }
  // strands
  ctx.lineWidth = 2;
  ctx.strokeStyle = HOT(0.85);
  ctx.beginPath();
  strandA.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  ctx.strokeStyle = RED(0.85);
  ctx.beginPath();
  strandB.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

function drawFluid(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  dt: number,
  particles: Array<{ x: number; y: number; age: number }>,
  RED: (a: number) => string
) {
  // Advect particles through curl noise-ish field
  for (const p of particles) {
    const fx = p.x * W;
    const fy = p.y * H;
    const angle =
      Math.sin(p.y * 6 + t * 0.6) * 1.2 + Math.cos(p.x * 5 - t * 0.4) * 1.2;
    const nx = fx + Math.cos(angle) * 40 * dt;
    const ny = fy + Math.sin(angle) * 40 * dt;
    p.age += dt * 30;
    // draw trail dot
    const a = Math.max(0, 1 - p.age / 100);
    ctx.fillStyle = RED(0.45 * a);
    ctx.beginPath();
    ctx.arc(fx, fy, 1.4, 0, Math.PI * 2);
    ctx.fill();
    p.x = nx / W;
    p.y = ny / H;
    if (p.age > 100 || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) {
      p.x = Math.random();
      p.y = Math.random();
      p.age = 0;
    }
  }
}

function drawLorenz(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  dt: number,
  s: { x: number; y: number; z: number },
  trail: Array<[number, number]>,
  RED: (a: number) => string,
  HOT: (a: number) => string
) {
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  const step = 0.006;
  const iters = Math.min(6, Math.max(2, Math.floor(dt / step)));
  for (let i = 0; i < iters; i++) {
    const dx = sigma * (s.y - s.x);
    const dy = s.x * (rho - s.z) - s.y;
    const dz = s.x * s.y - beta * s.z;
    s.x += dx * step;
    s.y += dy * step;
    s.z += dz * step;
    const cx = W / 2 + s.x * (W / 60);
    const cy = H / 2 + (s.z - 25) * (H / 60);
    trail.push([cx, cy]);
    if (trail.length > 400) trail.shift();
  }
  if (trail.length < 2) return;
  for (let i = 1; i < trail.length; i++) {
    const alpha = i / trail.length;
    ctx.strokeStyle = alpha > 0.9 ? HOT(1) : RED(alpha * 0.7);
    ctx.lineWidth = alpha > 0.9 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(trail[i - 1][0], trail[i - 1][1]);
    ctx.lineTo(trail[i][0], trail[i][1]);
    ctx.stroke();
  }
}

function drawMagnetic(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  RED: (a: number) => string
) {
  const cx = W / 2;
  const cy = H / 2;
  const sep = Math.min(W, H) * 0.15;
  // two poles (dipole)
  const pA = { x: cx - sep, y: cy };
  const pB = { x: cx + sep, y: cy };
  ctx.lineWidth = 1;
  // sample field lines starting on ring around pA
  const N = 12;
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2 + Math.sin(t * 0.4) * 0.05;
    const startX = pA.x + Math.cos(angle) * 6;
    const startY = pA.y + Math.sin(angle) * 6;
    let x = startX;
    let y = startY;
    ctx.strokeStyle = RED(0.5);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 80; s++) {
      const dx1 = x - pA.x;
      const dy1 = y - pA.y;
      const r1 = Math.max(4, Math.hypot(dx1, dy1));
      const dx2 = x - pB.x;
      const dy2 = y - pB.y;
      const r2 = Math.max(4, Math.hypot(dx2, dy2));
      // vector = (from A outward) - (into B)
      const vx = dx1 / (r1 * r1 * r1) - dx2 / (r2 * r2 * r2);
      const vy = dy1 / (r1 * r1 * r1) - dy2 / (r2 * r2 * r2);
      const m = Math.hypot(vx, vy) || 1;
      x += (vx / m) * 3;
      y += (vy / m) * 3;
      if (x < -5 || x > W + 5 || y < -5 || y > H + 5) break;
      if (Math.hypot(x - pB.x, y - pB.y) < 4) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // poles
  ctx.fillStyle = RED(1);
  ctx.beginPath();
  ctx.arc(pA.x, pA.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(pB.x, pB.y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawProjectile(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  RED: (a: number) => string,
  HOT: (a: number) => string,
  WHITE: (a: number) => string
) {
  const period = 3.2;
  const phase = (t % period) / period;
  const v0 = W * 0.9;
  const angle = Math.PI / 4;
  const g = W * 0.9;
  const flightTime = (2 * v0 * Math.sin(angle)) / g;
  const scale = Math.min(1, phase * period / flightTime);
  const groundY = H * 0.88;
  const originX = W * 0.08;
  const T = scale * flightTime;

  // ground
  ctx.strokeStyle = WHITE(0.15);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(W, groundY);
  ctx.stroke();

  // trajectory trail
  ctx.strokeStyle = RED(0.5);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * T;
    const x = originX + v0 * Math.cos(angle) * s;
    const y = groundY - (v0 * Math.sin(angle) * s - 0.5 * g * s * s);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // dashed full arc
  ctx.strokeStyle = RED(0.15);
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * flightTime;
    const x = originX + v0 * Math.cos(angle) * s;
    const y = groundY - (v0 * Math.sin(angle) * s - 0.5 * g * s * s);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // projectile ball at current position
  const bx = originX + v0 * Math.cos(angle) * T;
  const by = groundY - (v0 * Math.sin(angle) * T - 0.5 * g * T * T);
  const g2 = ctx.createRadialGradient(bx, by, 0, bx, by, 8);
  g2.addColorStop(0, HOT(1));
  g2.addColorStop(1, RED(0));
  ctx.fillStyle = g2;
  ctx.fillRect(bx - 8, by - 8, 16, 16);
  ctx.fillStyle = HOT(1);
  ctx.beginPath();
  ctx.arc(bx, by, 4, 0, Math.PI * 2);
  ctx.fill();

  // launch marker
  ctx.fillStyle = WHITE(0.4);
  ctx.beginPath();
  ctx.arc(originX, groundY, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpring(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  RED: (a: number) => string,
  _HOT: (a: number) => string,
  WHITE: (a: number) => string
) {
  const cx = W * 0.5;
  const anchorY = H * 0.15;
  const amp = H * 0.18;
  const massY = H * 0.55 + Math.sin(t * 3.5) * amp;

  // ceiling
  ctx.strokeStyle = WHITE(0.3);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 30, anchorY);
  ctx.lineTo(cx + 30, anchorY);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 25 + i * 12, anchorY);
    ctx.lineTo(cx - 30 + i * 12, anchorY - 6);
    ctx.stroke();
  }

  // spring coils (zigzag)
  const coils = 10;
  const springLen = massY - anchorY;
  const coilStep = springLen / coils;
  const coilWidth = 12;
  ctx.strokeStyle = RED(0.75);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, anchorY);
  for (let i = 0; i < coils; i++) {
    const y1 = anchorY + coilStep * (i + 0.5);
    const dir = i % 2 === 0 ? 1 : -1;
    ctx.lineTo(cx + dir * coilWidth, y1);
  }
  ctx.lineTo(cx, massY);
  ctx.stroke();

  // mass block
  const size = 22;
  ctx.fillStyle = RED(0.9);
  ctx.fillRect(cx - size / 2, massY, size, size);
  ctx.strokeStyle = WHITE(0.4);
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - size / 2, massY, size, size);

  // equilibrium marker
  ctx.strokeStyle = WHITE(0.15);
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(cx - 40, H * 0.55 + 11);
  ctx.lineTo(cx + 40, H * 0.55 + 11);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawOrbit(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  t: number,
  RED: (a: number) => string,
  HOT: (a: number) => string,
  WHITE: (a: number) => string
) {
  const cx = W / 2;
  const cy = H / 2;
  const r = Math.min(W, H) * 0.32;

  // orbit path
  ctx.strokeStyle = RED(0.2);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // central body
  const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.35);
  gr.addColorStop(0, HOT(1));
  gr.addColorStop(1, RED(0));
  ctx.fillStyle = gr;
  ctx.fillRect(cx - r * 0.35, cy - r * 0.35, r * 0.7, r * 0.7);
  ctx.fillStyle = HOT(1);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.14, 0, Math.PI * 2);
  ctx.fill();

  // orbiting body + trail
  const speed = 0.9;
  const trailPoints = 24;
  for (let i = 0; i < trailPoints; i++) {
    const a = t * speed - i * 0.06;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    const alpha = 1 - i / trailPoints;
    ctx.fillStyle = RED(alpha * 0.6);
    ctx.beginPath();
    ctx.arc(px, py, 2 * alpha + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  const angle = t * speed;
  const bx = cx + Math.cos(angle) * r;
  const by = cy + Math.sin(angle) * r;
  ctx.fillStyle = WHITE(0.9);
  ctx.beginPath();
  ctx.arc(bx, by, 4, 0, Math.PI * 2);
  ctx.fill();
}
