import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AnnouncementsProvider } from '../context/AnnouncementsContext';
import { BookmarksProvider } from '../context/BookmarksContext';
import { FilterProvider } from '../context/FilterContext';
import { routes } from '../routes/routes';

const router = createBrowserRouter(routes);

/**
 * Root application component.
 *
 * Context provider ordering:
 * 1. AnnouncementsProvider — base data layer
 * 2. BookmarksProvider — depends on announcement IDs
 * 3. FilterProvider — UI state for the feed
 *
 * The router is created outside the component to prevent
 * re-creation on re-renders (React Router v6 best practice).
 */
export function App() {
  return (
    <AnnouncementsProvider>
      <BookmarksProvider>
        <FilterProvider>
          <RouterProvider router={router} />
        </FilterProvider>
      </BookmarksProvider>
    </AnnouncementsProvider>
  );
}
