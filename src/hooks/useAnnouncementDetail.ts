import { useEffect, useState } from 'react';
import type { Announcement } from '../types/announcement';
import { fetchPostById } from '../services/api';
import { transformPost } from '../utils/transformPost';
import { useAnnouncementsActions } from '../context/AnnouncementsContext';

type UseAnnouncementDetailResult = {
  announcement: Announcement | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
};

/**
 * Hook that provides a single announcement, using the cache-first strategy:
 *
 * 1. If the announcement exists in the global context (navigated from feed),
 *    return it immediately — zero network requests.
 * 2. If not found (direct URL navigation), fetch it individually.
 *
 * This optimization prevents redundant API calls while maintaining
 * a seamless experience for direct URL access.
 */
export function useAnnouncementDetail(
  id: number
): UseAnnouncementDetailResult {
  const { getAnnouncementById } = useAnnouncementsActions();

  // Try cache first
  const cached = getAnnouncementById(id);

  const [announcement, setAnnouncement] = useState<Announcement | null>(
    cached ?? null
  );
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rawPost = await fetchPostById(id);
      setAnnouncement(transformPost(rawPost));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load announcement';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we already have the data from cache, update state and skip fetch
    if (cached) {
      setAnnouncement(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Direct navigation — need to fetch
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cached]);

  return {
    announcement,
    isLoading,
    error,
    retry: fetchDetail,
  };
}
