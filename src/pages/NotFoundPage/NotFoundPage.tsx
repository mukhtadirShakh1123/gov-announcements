import { EmptyState } from '../../components/ui/EmptyState';
import './NotFoundPage.css';

/**
 * 404 page for invalid routes.
 */
export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <EmptyState
        icon="warning"
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        actionLabel="Go to Announcements"
        actionTo="/announcements"
      />
    </main>
  );
}
