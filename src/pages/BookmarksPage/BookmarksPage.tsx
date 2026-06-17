import { useMemo } from 'react';
import { useAnnouncementsState } from '../../context/AnnouncementsContext';
import { useBookmarksState, useBookmarksActions } from '../../context/BookmarksContext';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import './BookmarksPage.css';

/**
 * Bookmarks page displays only saved announcements.
 *
 * Edge cases handled:
 * - Empty bookmarks state
 * - Bookmarks referencing announcements that haven't been loaded yet
 * - Bookmarks referencing IDs that no longer exist (deleted announcements)
 */
export function BookmarksPage() {
  const { announcements, isLoading } = useAnnouncementsState();
  const { bookmarkedIds } = useBookmarksState();
  const { isBookmarked } = useBookmarksActions();

  // Get bookmarked announcements, filtering out any that no longer exist
  const bookmarkedAnnouncements = useMemo(() => {
    if (announcements.length === 0) return [];
    return announcements.filter((a) => bookmarkedIds.has(a.id));
  }, [announcements, bookmarkedIds]);

  if (isLoading) {
    return (
      <main className="bookmarks-page">
        <div className="bookmarks-page__header">
          <h1 className="bookmarks-page__title">Bookmarked Announcements</h1>
        </div>
        <LoadingSpinner message="Loading bookmarks..." />
      </main>
    );
  }

  return (
    <main className="bookmarks-page">
      <div className="bookmarks-page__header">
        <h1 className="bookmarks-page__title">Bookmarked Announcements</h1>
        <p className="bookmarks-page__description">
          {bookmarkedIds.size > 0
            ? `You have ${bookmarkedIds.size} saved announcement${bookmarkedIds.size !== 1 ? 's' : ''}.`
            : 'Save announcements to access them quickly later.'}
        </p>
      </div>

      {bookmarkedAnnouncements.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="No bookmarks yet"
          description="Start bookmarking announcements from the feed to save them here for quick access."
          actionLabel="Browse Announcements"
          actionTo="/announcements"
        />
      ) : (
        <div className="bookmarks-page__grid" role="feed" aria-label="Bookmarked announcements">
          {bookmarkedAnnouncements.map((announcement) => (
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
