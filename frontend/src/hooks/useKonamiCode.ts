import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp', 
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

export function useKonamiCode(callback: () => void) {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = [...prev, e.key].slice(-10);
        
        // Check if konami code matches
        if (newKeys.length === 10 && 
            newKeys.every((key, i) => key === KONAMI_CODE[i])) {
          callback();
          return [];
        }
        
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);

  return keys.length;
}
