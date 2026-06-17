/**
 * Core domain types for the Government Announcements application.
 *
 * These types represent the transformed data model used throughout the app,
 * separate from the raw API response shape.
 */

export const CATEGORIES = ['Health', 'Transport', 'Education', 'Infrastructure'] as const;

export type Category = (typeof CATEGORIES)[number];

export type Announcement = {
  id: number;
  title: string;
  body: string;
  category: Category;
  isUrgent: boolean;
};

/**
 * Raw API response shape from JSONPlaceholder.
 * Kept separate from our domain type to maintain a clean boundary
 * between external data and internal representation.
 */
export type RawPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

/**
 * Filter state used across the feed.
 */
export type FilterState = {
  searchTerm: string;
  category: Category | 'All';
};
