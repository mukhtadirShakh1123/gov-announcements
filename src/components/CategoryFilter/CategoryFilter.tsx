import { memo } from 'react';
import { CATEGORIES, type Category } from '../../types/announcement';
import { useFilterState, useFilterActions } from '../../context/FilterContext';
import './CategoryFilter.css';

const ALL_OPTIONS: Array<Category | 'All'> = ['All', ...CATEGORIES];

/**
 * Category filter using button group pattern.
 *
 * Uses button group instead of a select dropdown for:
 * - Better discoverability (all options visible)
 * - Faster interaction (single click vs click-then-select)
 * - More accessible keyboard navigation
 * - Easier to style consistently across browsers
 */
function CategoryFilterComponent() {
  const { category: activeCategory } = useFilterState();
  const { setCategory } = useFilterActions();

  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      <span className="category-filter__label">Category</span>
      <div className="category-filter__options">
        {ALL_OPTIONS.map((cat) => (
          <button
            key={cat}
            className={`category-filter__btn ${
              activeCategory === cat ? 'category-filter__btn--active' : ''
            } ${cat !== 'All' ? `category-filter__btn--${cat.toLowerCase()}` : ''}`}
            onClick={() => setCategory(cat)}
            aria-pressed={activeCategory === cat}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export const CategoryFilter = memo(CategoryFilterComponent);
