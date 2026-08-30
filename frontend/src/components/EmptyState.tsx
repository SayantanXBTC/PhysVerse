import { ReactNode } from 'react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

interface EmptyStateProps {
  icon?: PhosphorIcon;
  title: string;
  body?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="border border-dashed border-ink-700 rounded-lg px-6 py-9 flex flex-col items-center text-center"
    >
      {Icon && (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-ink-900 border border-ink-700 text-ink-500 mb-4">
          <Icon size={18} weight="regular" />
        </span>
      )}
      <h3 className="font-display text-lg text-ink-100 mb-2" style={{ fontWeight: 500 }}>
        {title}
      </h3>
      {body && <p className="text-sm text-ink-500 max-w-sm mb-5">{body}</p>}
      {action}
    </div>
  );
}
