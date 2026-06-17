import type { Announcement, FilterState } from '../types/announcement';

/**
 * Filters announcements based on search term and category.
 *
 * This is a pure function that can be used with useMemo for
 * performance optimization. Both filters are applied simultaneously,
 * and search is case-insensitive across title and body.
 */
export function filterAnnouncements(
  announcements: Announcement[],
  filters: FilterState
): Announcement[] {
  const { searchTerm, category } = filters;
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return announcements.filter((announcement) => {
    // Category filter
    const matchesCategory =
      category === 'All' || announcement.category === category;

    // Search filter — matches against title and body
    const matchesSearch =
      normalizedSearch === '' ||
      announcement.title.toLowerCase().includes(normalizedSearch) ||
      announcement.body.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}
