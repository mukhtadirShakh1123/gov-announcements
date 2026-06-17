import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getFromStorage, setToStorage } from '../utils/localStorage';

const BOOKMARKS_STORAGE_KEY = 'gov_announcements_bookmarks';

type BookmarksState = {
  bookmarkedIds: Set<number>;
  bookmarkCount: number;
};

type BookmarksActions = {
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  clearAllBookmarks: () => void;
};

const BookmarksStateContext = createContext<BookmarksState | undefined>(
  undefined
);
const BookmarksActionsContext = createContext<BookmarksActions | undefined>(
  undefined
);

/**
 * Validates and sanitizes bookmark data from localStorage.
 *
 * Handles edge cases:
 * - Corrupted data (non-array)
 * - Invalid IDs (non-numbers, NaN, negative)
 * - Duplicate IDs
 */
function loadBookmarksFromStorage(): Set<number> {
  const raw = getFromStorage<unknown>(BOOKMARKS_STORAGE_KEY, []);

  if (!Array.isArray(raw)) return new Set();

  const validIds = raw.filter(
    (id): id is number =>
      typeof id === 'number' && !isNaN(id) && id > 0 && Number.isInteger(id)
  );

  return new Set(validIds);
}

/**
 * BookmarksProvider manages bookmark state with localStorage persistence.
 *
 * Architecture decisions:
 * - Uses Set<number> internally for O(1) lookups.
 * - Split context pattern matches AnnouncementsContext for consistency.
 * - Syncs to localStorage on every change via useEffect.
 * - Validates data on initial load to handle corruption gracefully.
 */
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(
    loadBookmarksFromStorage
  );

  // Persist to localStorage whenever bookmarks change
  useEffect(() => {
    setToStorage(BOOKMARKS_STORAGE_KEY, Array.from(bookmarkedIds));
  }, [bookmarkedIds]);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: number): boolean => {
      return bookmarkedIds.has(id);
    },
    [bookmarkedIds]
  );

  const clearAllBookmarks = useCallback(() => {
    setBookmarkedIds(new Set());
  }, []);

  const stateValue = useMemo<BookmarksState>(
    () => ({
      bookmarkedIds,
      bookmarkCount: bookmarkedIds.size,
    }),
    [bookmarkedIds]
  );

  const actionsValue = useMemo<BookmarksActions>(
    () => ({ toggleBookmark, isBookmarked, clearAllBookmarks }),
    [toggleBookmark, isBookmarked, clearAllBookmarks]
  );

  return (
    <BookmarksStateContext.Provider value={stateValue}>
      <BookmarksActionsContext.Provider value={actionsValue}>
        {children}
      </BookmarksActionsContext.Provider>
    </BookmarksStateContext.Provider>
  );
}

export function useBookmarksState(): BookmarksState {
  const context = useContext(BookmarksStateContext);
  if (!context) {
    throw new Error(
      'useBookmarksState must be used within BookmarksProvider'
    );
  }
  return context;
}

export function useBookmarksActions(): BookmarksActions {
  const context = useContext(BookmarksActionsContext);
  if (!context) {
    throw new Error(
      'useBookmarksActions must be used within BookmarksProvider'
    );
  }
  return context;
}
