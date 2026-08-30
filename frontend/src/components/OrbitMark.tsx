import { useReducedMotion } from 'framer-motion';

interface OrbitMarkProps {
  size?: number;
  showWord?: boolean;
  className?: string;
}

/**
 * PhysVerse brand mark: a single ink dot with a hairline elliptical orbit
 * carrying a signal-coloured body. Rotates once per 30s. Static under reduced-motion.
 */
export default function OrbitMark({ size = 28, showWord = true, className = '' }: OrbitMarkProps) {
  const reduce = useReducedMotion();

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="PhysVerse">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <ellipse
          cx="16"
          cy="16"
          rx="14"
          ry="6"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1"
          transform="rotate(-20 16 16)"
        />
        <circle cx="16" cy="16" r="3" fill="currentColor" />
        <g
          style={
            reduce
              ? undefined
              : {
                  transformOrigin: '16px 16px',
                  animation: 'orbit-rotate 30s linear infinite'
                }
          }
        >
          <circle
            cx="30"
            cy="16"
            r="1.75"
            fill="var(--signal-500)"
            transform="rotate(-20 16 16)"
          />
        </g>
      </svg>
      {showWord && (
        <span className="font-display text-base tracking-tight text-ink-100 select-none">
          PhysVerse
        </span>
      )}
      <style>{`
        @keyframes orbit-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}
