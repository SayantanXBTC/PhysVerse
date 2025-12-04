import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[], enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

// Common shortcuts for simulation editor
export const simulationEditorShortcuts = (
  isRunning: boolean,
  setIsRunning: (running: boolean) => void,
  handleReset: () => void,
  handleSave: () => void
): ShortcutConfig[] => [
  {
    key: ' ',
    action: () => setIsRunning(!isRunning),
    description: 'Play/Pause simulation'
  },
  {
    key: 'r',
    action: handleReset,
    description: 'Reset simulation'
  },
  {
    key: 's',
    ctrl: true,
    action: handleSave,
    description: 'Save simulation'
  },
  {
    key: 'Escape',
    action: () => setIsRunning(false),
    description: 'Stop simulation'
  }
];

// Keyboard shortcuts help modal data
export const getShortcutsHelp = (): { category: string; shortcuts: { keys: string; description: string }[] }[] => [
  {
    category: 'Simulation Control',
    shortcuts: [
      { keys: 'Space', description: 'Play/Pause simulation' },
      { keys: 'R', description: 'Reset simulation' },
      { keys: 'Esc', description: 'Stop simulation' }
    ]
  },
  {
    category: 'File Operations',
    shortcuts: [
      { keys: 'Ctrl+S', description: 'Save simulation' },
      { keys: 'Ctrl+N', description: 'New simulation' }
    ]
  },
  {
    category: 'Navigation',
    shortcuts: [
      { keys: 'Ctrl+D', description: 'Go to dashboard' },
      { keys: 'Ctrl+G', description: 'Go to gallery' }
    ]
  }
];
