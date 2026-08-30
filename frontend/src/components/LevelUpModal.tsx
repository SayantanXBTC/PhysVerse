import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, X, Sparkles } from 'lucide-react';

interface LevelUpModalProps {
  open: boolean;
  level: number;
  onClose: () => void;
}

const fireConfetti = () => {
  const opts: confetti.Options = {
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    scalar: 0.9,
    colors: ['#ef4444', '#f43f5e', '#dc2626', '#fca5a5', '#ffffff']
  };
  confetti({ ...opts, origin: { x: 0.2, y: 0.6 } });
  confetti({ ...opts, origin: { x: 0.8, y: 0.6 } });
  setTimeout(() => confetti({ ...opts, particleCount: 90, origin: { x: 0.5, y: 0.5 } }), 180);
};

export default function LevelUpModal({ open, level, onClose }: LevelUpModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    if (!reduce) fireConfetti();
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [open, reduce, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Level ${level} unlocked`}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
            animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            className="relative w-full max-w-md rounded-3xl border-2 border-red-500/40 bg-gradient-to-b from-black/95 to-red-950/40 p-8 shadow-2xl shadow-red-900/70 text-center"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-rose-700 shadow-2xl shadow-red-500/60 mb-6">
              <Trophy className="text-white" size={44} />
              {!reduce && (
                <>
                  <span className="absolute inset-0 rounded-full ring-4 ring-red-500/40 animate-ping" />
                  <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" size={20} />
                </>
              )}
            </div>

            <p className="text-sm font-semibold tracking-widest uppercase text-red-400 mb-2">
              Level Up
            </p>
            <h2 className="text-5xl font-black bg-gradient-to-r from-red-300 via-rose-300 to-red-500 bg-clip-text text-transparent mb-3">
              Level {level}
            </h2>
            <p className="text-gray-300 mb-6">
              You unlocked a new tier. Keep simulating to earn more XP.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-500/50 hover:scale-[1.02] transition-transform"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
