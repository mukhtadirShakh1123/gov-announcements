import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

/**
 * Root layout component wrapping all routes.
 *
 * Provides:
 * - Consistent navbar across all pages
 * - Semantic skip-to-content link for accessibility
 * - Layout structure with min-height for footer positioning
 */
export function AppLayout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <div id="main-content">
        <Outlet />
      </div>
    </div>
  );
}
