import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Physicist {
  name: string;
  years: string;
  contribution: string;
  imagePath: string;
  quote: string;
  simulations?: string;
}

interface Props {
  physicists: Physicist[];
  createSlug: (name: string) => string;
}

/**
 * Merry-go-round style orbit. All cards ride an ellipse around a center
 * point. Front cards (bottom of ellipse) large & bright; back cards (top)
 * small & dim. Constant rotation via rAF.
 */
export default function PhysicistOrbitCarousel({ physicists, createSlug }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(m.matches);
    const cb = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    m.addEventListener('change', cb);
    return () => m.removeEventListener('change', cb);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || !visible) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
      return;
    }
    const DEG_PER_SEC = 15;
    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setAngle(a => (a + DEG_PER_SEC * dt) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [reducedMotion, paused, visible]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e?.isIntersecting ?? true),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = physicists.length;
  const step = 360 / n;
  const RX = 420; // horizontal radius
  const RY = 90;  // vertical radius (flatten for perspective)

  return (
    <div className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full opacity-70"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="ringFade" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#E5484D" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#E5484D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#E5484D" stopOpacity="0" />
            </radialGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g
            transform="translate(800 620) scale(1 0.28)"
            stroke="url(#ringFade)"
            strokeWidth="2.5"
            fill="none"
            filter="url(#ringGlow)"
          >
            {[520, 620, 720, 820, 950, 1080, 1220, 1380].map((r, i) => (
              <ellipse key={r} cx="0" cy="0" rx={r} ry={r} opacity={1 - i * 0.09} />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative text-center mb-8 sm:mb-12 px-4">
        <p className="text-xs sm:text-sm tracking-[0.4em] text-red-400 font-semibold mb-2 uppercase">
          Physicists
        </p>
        <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
          Explore the minds that shaped our understanding of the universe.
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative mx-auto"
        style={{ height: '460px', maxWidth: '1100px' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute left-1/2 top-1/2">
          {physicists.map((p, i) => {
            const t = ((i * step + angle) * Math.PI) / 180;
            const x = Math.sin(t) * RX;
            const y = -Math.cos(t) * RY; // top when cos=1 => y negative (behind)
            const depth = (Math.cos(t) + 1) / 2; // 1 back (top), 0 front (bottom)
            const frontness = 1 - depth; // 1 front, 0 back
            const scale = 0.55 + 0.55 * frontness;
            const opacity = 0.3 + 0.7 * frontness;
            const zIndex = Math.round(frontness * 100);
            const isFront = frontness > 0.88;

            return (
              <div
                key={p.name}
                className="absolute"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                  opacity,
                  zIndex
                }}
              >
                <PhysicistCard
                  physicist={p}
                  index={i}
                  isFront={isFront}
                  slug={createSlug(p.name)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PhysicistCard({
  physicist,
  index,
  isFront,
  slug
}: {
  physicist: Physicist;
  index: number;
  isFront: boolean;
  slug: string;
}) {
  return (
    <Link to={`/physicist/${slug}`} className="group block relative w-[180px]">
      {isFront && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(229,72,77,0.65),rgba(229,72,77,0.2)_45%,transparent_75%)] blur-2xl animate-pulse"
        />
      )}
      <article
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-red-950/40 via-black/80 to-black/95 backdrop-blur-sm transition-all duration-300 ${
          isFront
            ? 'border-2 border-red-500/80 shadow-[0_0_60px_-8px_rgba(229,72,77,0.75)]'
            : 'border border-red-500/25 shadow-[0_0_20px_-15px_rgba(229,72,77,0.4)]'
        }`}
      >
        <span className="absolute top-2 left-2 z-10 font-mono text-[10px] text-red-300/80 tabular-nums tracking-widest">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={physicist.imagePath}
            alt={physicist.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='240'><rect fill='#3b0d10' width='180' height='240'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='12' fill='#fca5a5'>Portrait</text></svg>`;
              (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h3 className="text-sm font-black text-white leading-[0.95] mb-0.5 drop-shadow-lg truncate">
              {physicist.name}
            </h3>
            <p className="text-red-400 text-[10px] font-bold tabular-nums font-mono tracking-wide">
              {physicist.years}
            </p>
          </div>
        </div>

        <div className="p-2.5 space-y-1">
          <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2">
            {physicist.contribution}
          </p>
          <span className="inline-flex items-center gap-1 text-red-400 text-[9px] font-bold tracking-widest uppercase group-hover:text-red-300 transition-colors">
            Explore <ArrowRight size={9} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </article>
    </Link>
  );
}
