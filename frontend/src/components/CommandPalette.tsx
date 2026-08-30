import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  House,
  Compass,
  Flask,
  Trophy,
  Function as FormulaIcon,
  Star,
  User,
  SignOut,
  Plus,
  MagnifyingGlass,
  ArrowRight
} from '@phosphor-icons/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { useAuthStore } from '@/store/authStore';
import { useCommandPaletteStore } from '@/store/commandPaletteStore';

interface Action {
  id: string;
  label: string;
  hint?: string;
  icon: PhosphorIcon;
  group: 'Navigate' | 'Create' | 'Account';
  perform: () => void;
  keywords?: string;
  authOnly?: boolean;
}

export default function CommandPalette() {
  const { open, setOpen, toggle } = useCommandPaletteStore();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, setOpen]);

  const go = useCallback(
    (path: string) => {
      navigate(path);
      setOpen(false);
    },
    [navigate, setOpen]
  );

  const actions: Action[] = [
    { id: 'home',        label: 'Home',           icon: House,       group: 'Navigate', perform: () => go('/'),           keywords: 'landing start' },
    { id: 'dashboard',   label: 'Dashboard',      icon: Flask,       group: 'Navigate', perform: () => go('/dashboard'),  authOnly: true, keywords: 'lab experiments' },
    { id: 'gallery',     label: 'Public Gallery', icon: Compass,     group: 'Navigate', perform: () => go('/gallery'),    keywords: 'community browse' },
    { id: 'challenges',  label: 'Challenges',     icon: Trophy,      group: 'Navigate', perform: () => go('/challenges') },
    { id: 'formulas',    label: 'Formulas',       icon: FormulaIcon, group: 'Navigate', perform: () => go('/formulas'),   keywords: 'physics reference equations' },
    { id: 'leaderboard', label: 'Leaderboard',    icon: Star,        group: 'Navigate', perform: () => go('/leaderboard') },
    { id: 'new-sim',     label: 'New experiment', hint: 'Create', icon: Plus, group: 'Create', perform: () => go('/simulation/new'), keywords: 'create build simulation', authOnly: true },
    { id: 'profile',     label: 'Profile',        icon: User,        group: 'Account', perform: () => go('/profile'),    authOnly: true },
    { id: 'logout',      label: 'Log out',        icon: SignOut,     group: 'Account', authOnly: true,
      perform: () => { logout(); navigate('/'); setOpen(false); } }
  ];

  const visible = actions.filter((a) => !a.authOnly || isAuthenticated);
  const groups = Array.from(new Set(visible.map((a) => a.group)));

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-start justify-center pt-[10vh] px-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm anim-fade-in" />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-lg overflow-hidden anim-scale-in"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        <Command label="Command palette" className="w-full" loop>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-700">
            <MagnifyingGlass size={18} className="text-ink-500 flex-shrink-0" />
            <Command.Input
              placeholder="Search pages, actions..."
              className="flex-1 bg-transparent outline-none text-ink-100 placeholder:text-ink-500 text-base"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex text-xs font-mono px-2 py-1 rounded-sm border border-ink-700 text-ink-500">
              esc
            </kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto py-2">
            <Command.Empty className="py-8 text-center text-sm text-ink-500">
              No matches.
            </Command.Empty>

            {groups.map((group) => (
              <Command.Group
                key={group}
                heading={group.toLowerCase()}
                className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-ink-500"
              >
                {visible.filter((a) => a.group === group).map((a) => {
                  const Icon = a.icon;
                  return (
                    <Command.Item
                      key={a.id}
                      value={`${a.label} ${a.keywords || ''}`}
                      onSelect={a.perform}
                      className="mx-2 my-0.5 flex items-center gap-3 px-3 h-10 rounded-md cursor-pointer text-ink-300 aria-selected:bg-ink-800 aria-selected:text-ink-100 transition-colors duration-fast"
                    >
                      <Icon size={16} weight="regular" className="flex-shrink-0" />
                      <span className="flex-1 text-sm">{a.label}</span>
                      {a.hint && (
                        <span className="text-xs font-mono uppercase tracking-wider text-ink-500">
                          {a.hint}
                        </span>
                      )}
                      <ArrowRight size={12} className="text-ink-500 opacity-0 group-aria-selected:opacity-100" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>

          <div className="px-4 py-2 border-t border-ink-700 flex items-center justify-between text-xs text-ink-500 font-mono">
            <span>physverse · palette</span>
            <div className="flex items-center gap-3">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
