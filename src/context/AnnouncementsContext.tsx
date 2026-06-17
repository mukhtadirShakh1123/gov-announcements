import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Announcement } from '../types/announcement';
import { fetchAllPosts } from '../services/api';
import { transformPosts } from '../utils/transformPost';

/**
 * AnnouncementsContext shape.
 *
 * Separating the context into data + actions prevents unnecessary re-renders.
 * Components that only need data won't re-render when action references change.
 */
type AnnouncementsState = {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
};

type AnnouncementsActions = {
  retry: () => void;
  getAnnouncementById: (id: number) => Announcement | undefined;
};

const AnnouncementsStateContext = createContext<AnnouncementsState | undefined>(
  undefined
);
const AnnouncementsActionsContext = createContext<
  AnnouncementsActions | undefined
>(undefined);

/**
 * Provider that manages the lifecycle of announcements data.
 *
 * Architecture decisions:
 * - Split into two contexts (state + actions) to minimize re-renders.
 *   Components that only call `retry()` won't re-render on data changes.
 * - Data is fetched once and cached — detail pages reuse this cache.
 * - Error state includes a retry mechanism for resilience.
 */
export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rawPosts = await fetchAllPosts();
      const transformed = transformPosts(rawPosts);
      setAnnouncements(transformed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const getAnnouncementById = useCallback(
    (id: number): Announcement | undefined => {
      return announcements.find((a) => a.id === id);
    },
    [announcements]
  );

  const stateValue = useMemo<AnnouncementsState>(
    () => ({ announcements, isLoading, error }),
    [announcements, isLoading, error]
  );

  const actionsValue = useMemo<AnnouncementsActions>(
    () => ({ retry: loadAnnouncements, getAnnouncementById }),
    [loadAnnouncements, getAnnouncementById]
  );

  return (
    <AnnouncementsStateContext.Provider value={stateValue}>
      <AnnouncementsActionsContext.Provider value={actionsValue}>
        {children}
      </AnnouncementsActionsContext.Provider>
    </AnnouncementsStateContext.Provider>
  );
}

/**
 * Hook to access announcements data (reactive).
 */
export function useAnnouncementsState(): AnnouncementsState {
  const context = useContext(AnnouncementsStateContext);
  if (!context) {
    throw new Error(
      'useAnnouncementsState must be used within AnnouncementsProvider'
    );
  }
  return context;
}

/**
 * Hook to access announcements actions (stable references).
 */
export function useAnnouncementsActions(): AnnouncementsActions {
  const context = useContext(AnnouncementsActionsContext);
  if (!context) {
    throw new Error(
      'useAnnouncementsActions must be used within AnnouncementsProvider'
    );
  }
  return context;
}
