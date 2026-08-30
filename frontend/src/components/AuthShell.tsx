import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { ReactNode } from 'react';
import HeroPendulum from './HeroPendulum';
import OrbitMark from './OrbitMark';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Split-screen auth layout. Left = live physics visual; right = form.
 * On <lg the visual collapses to a tight top strip.
 */
export default function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-dvh bg-ink-950 text-ink-100 grid lg:grid-cols-2">
      {/* Visual half */}
      <aside
        aria-hidden="true"
        className="relative hidden lg:block bg-ink-900 bg-grid overflow-hidden border-r border-ink-700"
      >
        <div className="absolute inset-0">
          <HeroPendulum />
        </div>
        <div className="absolute top-6 left-6">
          <Link to="/" className="text-ink-100">
            <OrbitMark />
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 text-xs font-mono text-ink-500">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-500 animate-pulse" />
          <span>double pendulum · integrating at 240 Hz</span>
        </div>
      </aside>

      {/* Compact mobile top strip with visual */}
      <div className="relative lg:hidden h-40 bg-ink-900 bg-grid overflow-hidden border-b border-ink-700">
        <HeroPendulum />
        <div className="absolute top-4 left-4">
          <Link to="/" className="text-ink-100">
            <OrbitMark size={22} />
          </Link>
        </div>
      </div>

      {/* Form half */}
      <main className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 lg:py-16">
        <div className="max-w-md w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-100 transition-colors duration-fast mb-8"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <p className="label mb-4">{eyebrow}</p>
          <h1
            className="font-display text-3xl md:text-[2.75rem] leading-[1.05] tracking-[-0.02em] mb-3 text-ink-100"
            style={{ fontWeight: 500 }}
          >
            {title}
          </h1>
          {subtitle && <p className="text-ink-300 mb-8">{subtitle}</p>}

          <div className="space-y-6">{children}</div>

          {footer && <div className="mt-8 text-sm text-ink-500">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
