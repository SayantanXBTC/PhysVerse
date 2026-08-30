import { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  as?: 'h1' | 'h2';
}

/**
 * Editorial page header: eyebrow label + Fraunces title + optional subtitle + right-aligned actions.
 * Consistent rhythm across dashboard, formulas, gallery, challenges, leaderboard, profile.
 */
export default function PageHeader({ eyebrow, title, subtitle, actions, as = 'h1' }: PageHeaderProps) {
  const Title = as;
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-ink-700">
      <div>
        {eyebrow && <p className="label mb-3">{eyebrow}</p>}
        <Title
          className="font-display text-2xl md:text-3xl leading-[1.05] tracking-[-0.02em] text-ink-100 mb-2"
          style={{ fontWeight: 500 }}
        >
          {title}
        </Title>
        {subtitle && <p className="text-ink-300 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </header>
  );
}
