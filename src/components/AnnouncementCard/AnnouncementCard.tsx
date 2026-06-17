import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Announcement } from '../../types/announcement';
import { useBookmarksActions } from '../../context/BookmarksContext';
import './AnnouncementCard.css';

type AnnouncementCardProps = {
  announcement: Announcement;
  isBookmarked: boolean;
};

/**
 * Card component for displaying an announcement summary.
 *
 * Memoized with React.memo and a custom comparison to prevent
 * re-renders when the parent list re-renders but this card's
 * data hasn't changed.
 */
function AnnouncementCardComponent({
  announcement,
  isBookmarked,
}: AnnouncementCardProps) {
  const { toggleBookmark } = useBookmarksActions();
  const { id, title, category, body, isUrgent } = announcement;

  const categoryClass = `card__category--${category.toLowerCase()}`;

  return (
    <article
      className={`card ${isUrgent ? 'card--urgent' : ''}`}
      aria-label={`Announcement: ${title}`}
    >
      <div className="card__header">
        <div className="card__badges">
          <span className={`card__category ${categoryClass}`}>
            {category}
          </span>
          {isUrgent && (
            <span className="card__urgent" aria-label="Urgent announcement">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Urgent
            </span>
          )}
        </div>
        <button
          className={`card__bookmark ${isBookmarked ? 'card__bookmark--active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(id);
          }}
          aria-label={isBookmarked ? `Remove bookmark for ${title}` : `Bookmark ${title}`}
          aria-pressed={isBookmarked}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <Link to={`/announcements/${id}`} className="card__link">
        <h2 className="card__title">{title}</h2>
        <p className="card__body">{body}</p>
        <span className="card__read-more">
          Read full announcement
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </Link>

      <div className="card__footer">
        <span className="card__id">#{id}</span>
      </div>
    </article>
  );
}

export const AnnouncementCard = memo(
  AnnouncementCardComponent,
  (prev, next) =>
    prev.announcement.id === next.announcement.id &&
    prev.isBookmarked === next.isBookmarked
);
