import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBookmarksState } from '../../context/BookmarksContext';
import './Navbar.css';

/**
 * Main navigation bar component.
 *
 * Displays:
 * - Application branding (government coat-of-arms style)
 * - Navigation links with active state indication
 * - Bookmark count badge (always visible per requirements)
 *
 * Memoized because it only needs to re-render when
 * the bookmark count or current route changes.
 */
function NavbarComponent() {
  const { bookmarkCount } = useBookmarksState();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="navbar" role="banner">
      <div className="navbar__container">
        <Link to="/announcements" className="navbar__brand" aria-label="Government Announcements - Home">
          <div className="navbar__logo" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="currentColor" opacity="0.15" />
              <path d="M16 4L28 10V14H4V10L16 4Z" fill="currentColor" opacity="0.9" />
              <rect x="6" y="15" width="4" height="10" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="14" y="15" width="4" height="10" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="22" y="15" width="4" height="10" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="4" y="26" width="24" height="3" rx="1" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__title">Gov Announcements</span>
            <span className="navbar__subtitle">Official Public Notice Board</span>
          </div>
        </Link>

        <nav className="navbar__nav" role="navigation" aria-label="Main navigation">
          <Link
            to="/announcements"
            className={`navbar__link ${isActive('/announcements') && !isActive('/bookmarks') ? 'navbar__link--active' : ''}`}
            aria-current={isActive('/announcements') && !isActive('/bookmarks') ? 'page' : undefined}
          >
            <svg className="navbar__link-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Feed
          </Link>
          <Link
            to="/bookmarks"
            className={`navbar__link ${isActive('/bookmarks') ? 'navbar__link--active' : ''}`}
            aria-current={isActive('/bookmarks') ? 'page' : undefined}
          >
            <svg className="navbar__link-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Bookmarks
            {bookmarkCount > 0 && (
              <span className="navbar__badge" aria-label={`${bookmarkCount} bookmarked`}>
                {bookmarkCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export const Navbar = memo(NavbarComponent);
