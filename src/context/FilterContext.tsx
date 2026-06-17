import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Category, FilterState } from '../types/announcement';

type FilterActions = {
  setSearchTerm: (term: string) => void;
  setCategory: (category: Category | 'All') => void;
  resetFilters: () => void;
};

const FilterStateContext = createContext<FilterState | undefined>(undefined);
const FilterActionsContext = createContext<FilterActions | undefined>(undefined);

const INITIAL_FILTERS: FilterState = {
  searchTerm: '',
  category: 'All',
};

/**
 * FilterProvider manages the filter state for the feed page.
 *
 * By extracting filter state into its own context, we:
 * 1. Preserve filter state when navigating between feed and detail pages
 * 2. Avoid coupling filter logic to the announcements data context
 * 3. Enable easy reset functionality
 */
export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState(INITIAL_FILTERS.searchTerm);
  const [category, setCategory] = useState<Category | 'All'>(
    INITIAL_FILTERS.category
  );

  const resetFilters = useCallback(() => {
    setSearchTerm(INITIAL_FILTERS.searchTerm);
    setCategory(INITIAL_FILTERS.category);
  }, []);

  const stateValue = useMemo<FilterState>(
    () => ({ searchTerm, category }),
    [searchTerm, category]
  );

  const actionsValue = useMemo<FilterActions>(
    () => ({ setSearchTerm, setCategory, resetFilters }),
    [resetFilters]
  );

  return (
    <FilterStateContext.Provider value={stateValue}>
      <FilterActionsContext.Provider value={actionsValue}>
        {children}
      </FilterActionsContext.Provider>
    </FilterStateContext.Provider>
  );
}

export function useFilterState(): FilterState {
  const context = useContext(FilterStateContext);
  if (!context) {
    throw new Error('useFilterState must be used within FilterProvider');
  }
  return context;
}

export function useFilterActions(): FilterActions {
  const context = useContext(FilterActionsContext);
  if (!context) {
    throw new Error('useFilterActions must be used within FilterProvider');
  }
  return context;
}
