import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const STORAGE_KEY = 'physverse:lastKnownLevel';

/**
 * Watches user.level. When it increases, opens the level-up modal.
 * Persists last-known level in localStorage to survive reloads.
 */
export function useLevelUp() {
  const user = useAuthStore(s => s.user);
  const [open, setOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const initialized = useRef(false);

  useEffect(() => {
    if (!user?.level) return;

    const stored = Number(localStorage.getItem(STORAGE_KEY));

    if (!initialized.current) {
      // On first load with a user, just record current level — no modal
      if (!Number.isFinite(stored) || stored === 0) {
        localStorage.setItem(STORAGE_KEY, String(user.level));
      }
      initialized.current = true;
      return;
    }

    if (Number.isFinite(stored) && user.level > stored) {
      setNewLevel(user.level);
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, String(user.level));
    }
  }, [user?.level]);

  return {
    open,
    level: newLevel,
    close: () => setOpen(false)
  };
}
