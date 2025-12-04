import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function KeyboardShortcutsOverlay() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show/hide with '?' key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShow(prev => !prev);
      }
      // Hide with Escape
      if (e.key === 'Escape') {
        setShow(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  if (!show) return null;
  
  const shortcuts = [
    { key: 'Space', action: 'Play/Pause simulation', category: 'Playback' },
    { key: 'R', action: 'Reset simulation', category: 'Playback' },
    { key: 'S', action: 'Take screenshot', category: 'Capture' },
    { key: '?', action: 'Toggle keyboard shortcuts', category: 'Help' },
    { key: 'Esc', action: 'Close dialogs', category: 'Navigation' },
    { key: '←/→', action: 'Adjust parameters', category: 'Controls' },
  ];
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeInUp"
      onClick={() => setShow(false)}
    >
      <div 
        className="glass-red max-w-2xl w-full p-8 rounded-3xl border-2 border-red-500/40 shadow-2xl shadow-red-900/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white">Keyboard Shortcuts</h2>
          <button
            onClick={() => setShow(false)}
            className="p-2 hover:bg-red-950/50 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="text-gray-400 hover:text-white" size={24} />
          </button>
        </div>
        
        <div className="space-y-3">
          {shortcuts.map(({ key, action, category }) => (
            <div 
              key={key} 
              className="flex items-center justify-between p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-colors group"
            >
              <div>
                <span className="text-gray-300 font-medium">{action}</span>
                <span className="text-xs text-gray-500 ml-2">· {category}</span>
              </div>
              <kbd className="px-3 py-1.5 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300 font-mono text-sm font-bold group-hover:border-red-500/50 transition-colors">
                {key}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-red-950/20 border border-red-500/20 rounded-xl">
          <p className="text-sm text-gray-400 text-center">
            Press <kbd className="px-2 py-1 bg-black/40 border border-red-500/20 rounded text-red-400 font-mono mx-1">?</kbd> 
            anytime to toggle this menu
          </p>
        </div>
      </div>
    </div>
  );
}
