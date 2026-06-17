import { useMemo } from 'react';
import type { Announcement } from '../types/announcement';
import { useAnnouncementsState } from '../context/AnnouncementsContext';
import { useFilterState } from '../context/FilterContext';
import { filterAnnouncements } from '../utils/filterAnnouncements';

/**
 * Hook that provides filtered announcements using memoization.
 *
 * The filtering is only recomputed when the announcements array
 * or filter state changes, preventing unnecessary work during
 * unrelated re-renders.
 */
export function useFilteredAnnouncements(): Announcement[] {
  const { announcements } = useAnnouncementsState();
  const filters = useFilterState();

  return useMemo(
    () => filterAnnouncements(announcements, filters),
    [announcements, filters]
  );
}
