import type { Announcement, Category, RawPost } from '../types/announcement';

/**
 * Capitalizes the first letter of every word in a string.
 * Handles multiple spaces and edge cases gracefully.
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Derives the category from the post ID using modulo arithmetic.
 */
export function deriveCategory(id: number): Category {
  const remainder = id % 4;
  switch (remainder) {
    case 0:
      return 'Health';
    case 1:
      return 'Transport';
    case 2:
      return 'Education';
    default:
      return 'Infrastructure';
  }
}

/**
 * Determines if a post is urgent based on its ID.
 */
export function isPostUrgent(id: number): boolean {
  return id % 7 === 0;
}

/**
 * Transforms a raw JSONPlaceholder post into our domain Announcement type.
 *
 * This is a pure function with no side effects, making it easy to test
 * and reason about. The transformation logic is centralized here to
 * maintain a single source of truth for data mapping.
 */
export function transformPost(post: RawPost): Announcement {
  return {
    id: post.id,
    title: capitalizeWords(post.title),
    body: post.body,
    category: deriveCategory(post.id),
    isUrgent: isPostUrgent(post.id),
  };
}

/**
 * Transforms an array of raw posts into announcements.
 */
export function transformPosts(posts: RawPost[]): Announcement[] {
  return posts.map(transformPost);
}
