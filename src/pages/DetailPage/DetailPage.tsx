import { useParams, useNavigate } from 'react-router-dom';
import { useAnnouncementDetail } from '../../hooks/useAnnouncementDetail';
import { useBookmarksActions } from '../../context/BookmarksContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import './DetailPage.css';

/**
 * Detail page for a single announcement.
 *
 * Key behaviors:
 * - Reuses cached data when navigating from the feed (no refetch)
 * - Fetches individually when accessed via direct URL
 * - Back button preserves feed state (search, filters, scroll)
 * - Displays full announcement details with bookmark toggle
 */
export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parsedId = Number(id);

  const { announcement, isLoading, error, retry } = useAnnouncementDetail(parsedId);
  const { toggleBookmark, isBookmarked } = useBookmarksActions();

  // Invalid ID
  if (isNaN(parsedId) || parsedId <= 0) {
    return (
      <main className="detail-page">
        <ErrorState message={`Invalid announcement ID: "${id}"`} />
        <div className="detail-page__nav">
          <button
            className="detail-page__back"
            onClick={() => navigate('/announcements')}
            type="button"
          >
            ← Back to Feed
          </button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="detail-page">
        <LoadingSpinner message="Loading announcement details..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="detail-page">
        <ErrorState message={error} onRetry={retry} />
        <div className="detail-page__nav">
          <button
            className="detail-page__back"
            onClick={() => navigate('/announcements')}
            type="button"
          >
            ← Back to Feed
          </button>
        </div>
      </main>
    );
  }

  if (!announcement) {
    return (
      <main className="detail-page">
        <ErrorState message="Announcement not found." />
      </main>
    );
  }

  const bookmarked = isBookmarked(announcement.id);
  const categoryClass = `detail-page__category--${announcement.category.toLowerCase()}`;

  return (
    <main className="detail-page">
      <nav className="detail-page__nav" aria-label="Navigation">
        <button
          className="detail-page__back"
          onClick={() => navigate(-1)}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Feed
        </button>
      </nav>

      <article className="detail-page__article" aria-label={`Announcement: ${announcement.title}`}>
        <header className="detail-page__header">
          <div className="detail-page__meta">
            <span className="detail-page__id">Announcement #{announcement.id}</span>
            <div className="detail-page__badges">
              <span className={`detail-page__category ${categoryClass}`}>
                {announcement.category}
              </span>
              {announcement.isUrgent && (
                <span className="detail-page__urgent" aria-label="Urgent announcement">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Urgent
                </span>
              )}
            </div>
          </div>

          <h1 className="detail-page__title">{announcement.title}</h1>
        </header>

        <div className="detail-page__body">
          <p>{announcement.body}</p>
        </div>

        <footer className="detail-page__footer">
          <button
            className={`detail-page__bookmark ${bookmarked ? 'detail-page__bookmark--active' : ''}`}
            onClick={() => toggleBookmark(announcement.id)}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            aria-pressed={bookmarked}
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={bookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {bookmarked ? 'Bookmarked' : 'Bookmark This'}
          </button>
        </footer>
      </article>
    </main>
  );
}
