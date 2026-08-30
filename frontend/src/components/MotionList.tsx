import { ReactNode, Children } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MotionListProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  /** Stagger delay per item in seconds. Kept short (0.02–0.04) to stay snappy on long lists. */
  stagger?: number;
  /** Total y translation applied on enter. */
  offsetY?: number;
  as?: 'ul' | 'ol' | 'div';
}

/**
 * Subtle stagger reveal wrapper. 250-320ms, ease-out, respects prefers-reduced-motion.
 */
export default function MotionList({
  children,
  className,
  itemClassName,
  stagger = 0.03,
  offsetY = 8,
  as = 'div'
}: MotionListProps) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const variants = {
    hidden: { opacity: 0, y: offsetY },
    show:   { opacity: 1, y: 0 }
  };

  const Container = motion[as];

  return (
    <Container
      className={className}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: stagger }}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          className={itemClassName}
          variants={variants}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </Container>
  );
}
