import { memo, useId } from 'react';
import { useFilterState, useFilterActions } from '../../context/FilterContext';
import './SearchBar.css';

/**
 * Search input component with real-time filtering.
 *
 * Uses the filter context directly, so filtering happens on keystroke
 * without any extra API calls. The context-based approach means the
 * search term persists when navigating back from a detail page.
 */
function SearchBarComponent() {
  const { searchTerm } = useFilterState();
  const { setSearchTerm } = useFilterActions();
  const inputId = useId();

  return (
    <div className="search-bar" role="search" aria-label="Search announcements">
      <label htmlFor={inputId} className="search-bar__label">
        Search Announcements
      </label>
      <div className="search-bar__input-wrapper">
        <svg
          className="search-bar__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id={inputId}
          type="search"
          className="search-bar__input"
          placeholder="Search by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
        {searchTerm && (
          <button
            className="search-bar__clear"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
