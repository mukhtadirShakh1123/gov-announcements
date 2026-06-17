import { useEffect, useRef } from 'react';

/**
 * Hook that saves and restores scroll position for a given key.
 *
 * Used on the feed page to restore scroll position when navigating
 * back from the detail page.
 */
export function useScrollRestore(key: string) {
  const scrollPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Restore position on mount
    const saved = scrollPositions.current.get(key);
    if (saved !== undefined) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo(0, saved);
      });
    }

    // Save position on unmount
    return () => {
      scrollPositions.current.set(key, window.scrollY);
    };
  }, [key]);
}

/**
 * A simpler approach using sessionStorage for cross-mount persistence.
 */
const SCROLL_PREFIX = 'scroll_pos_';

export function useScrollRestoreSession(key: string) {
  useEffect(() => {
    const storageKey = `${SCROLL_PREFIX}${key}`;

    // Restore
    const saved = sessionStorage.getItem(storageKey);
    if (saved !== null) {
      const pos = parseInt(saved, 10);
      if (!isNaN(pos)) {
        requestAnimationFrame(() => {
          window.scrollTo(0, pos);
        });
      }
    }

    // Save on scroll (debounced via cleanup)
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Save final position
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };
  }, [key]);
}
