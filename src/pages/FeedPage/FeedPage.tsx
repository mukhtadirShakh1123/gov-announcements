import { useAnnouncementsState, useAnnouncementsActions } from '../../context/AnnouncementsContext';
import { useBookmarksActions } from '../../context/BookmarksContext';
import { useFilteredAnnouncements } from '../../hooks/useFilteredAnnouncements';
import { useScrollRestoreSession } from '../../hooks/useScrollRestore';
import { useFilterState } from '../../context/FilterContext';
import { SearchBar } from '../../components/SearchBar';
import { CategoryFilter } from '../../components/CategoryFilter';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import './FeedPage.css';

/**
 * Feed page — the main listing page for announcements.
 *
 * Responsibilities:
 * - Displays filtered, searchable list of announcements
 * - Loading, error, and empty states
 * - Preserves scroll position and filter state across navigation
 *
 * Performance:
 * - Cards are memoized (React.memo with custom comparison)
 * - Filtered results are memoized (useMemo in hook)
 * - Scroll position restored from sessionStorage
 */
export function FeedPage() {
  const { isLoading, error } = useAnnouncementsState();
  const { retry } = useAnnouncementsActions();
  const { isBookmarked } = useBookmarksActions();
  const filteredAnnouncements = useFilteredAnnouncements();
  const { searchTerm, category } = useFilterState();

  // Restore scroll when returning from detail page
  useScrollRestoreSession('feed');

  if (isLoading) {
    return (
      <main className="feed-page">
        <LoadingSpinner message="Fetching government announcements..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="feed-page">
        <ErrorState message={error} onRetry={retry} />
      </main>
    );
  }

  const hasActiveFilters = searchTerm !== '' || category !== 'All';

  return (
    <main className="feed-page">
      <div className="feed-page__header">
        <h1 className="feed-page__title">Public Announcements</h1>
        <p className="feed-page__description">
          Stay informed with the latest government notices, updates, and alerts across all departments.
        </p>
      </div>

      <section className="feed-page__filters" aria-label="Filter announcements">
        <SearchBar />
        <CategoryFilter />
      </section>

      {filteredAnnouncements.length > 0 && (
        <div className="feed-page__results-info" aria-live="polite">
          <span>
            Showing <strong>{filteredAnnouncements.length}</strong> announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </span>
        </div>
      )}

      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon="search"
          title="No announcements found"
          description={
            hasActiveFilters
              ? 'Try adjusting your search term or category filter.'
              : 'There are no announcements available at this time.'
          }
        />
      ) : (
        <div className="feed-page__grid" role="feed" aria-label="Announcements feed">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isBookmarked={isBookmarked(announcement.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
