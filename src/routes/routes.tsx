import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from '../app/AppLayout';
import { FeedPage } from '../pages/FeedPage';
import { DetailPage } from '../pages/DetailPage';
import { BookmarksPage } from '../pages/BookmarksPage';
import { NotFoundPage } from '../pages/NotFoundPage';

/**
 * Centralized route configuration.
 *
 * Benefits of declarative route config:
 * - Single source of truth for all routes
 * - Easy to add route guards, lazy loading, or meta info later
 * - Consistent layout wrapper via AppLayout
 */
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/announcements" replace />,
      },
      {
        path: 'announcements',
        element: <FeedPage />,
      },
      {
        path: 'announcements/:id',
        element: <DetailPage />,
      },
      {
        path: 'bookmarks',
        element: <BookmarksPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
