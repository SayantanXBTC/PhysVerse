import { useEffect, useState } from 'react';

/**
 * Full-page skeleton fallback for lazy-loaded routes.
 * Only renders after 120ms — avoids flash for fast chunk loads.
 * Respects prefers-reduced-motion.
 */
export default function PageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
      className="min-h-screen bg-black flex items-center justify-center px-4"
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl motion-safe:animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl motion-safe:animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        <div className="skeleton h-10 w-1/3 rounded-xl" />
        <div className="skeleton h-6 w-2/3 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
