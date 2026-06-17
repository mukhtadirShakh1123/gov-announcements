import type { RawPost } from '../types/announcement';

const API_BASE = 'https://jsonplaceholder.typicode.com';

/**
 * Custom error class for API-specific errors.
 * Provides structured error information for the UI layer.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetches all posts from JSONPlaceholder.
 *
 * Uses the native Fetch API as required. Includes proper error handling
 * for network failures and non-OK responses.
 */
export async function fetchAllPosts(): Promise<RawPost[]> {
  const response = await fetch(`${API_BASE}/posts`);

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch announcements (${response.status})`,
      response.status
    );
  }

  const data: RawPost[] = await response.json();

  if (!Array.isArray(data)) {
    throw new ApiError('Invalid response format from API');
  }

  return data;
}

/**
 * Fetches a single post by ID.
 *
 * Used as a fallback when navigating directly to a detail page
 * (e.g., /announcements/23) without the feed cache being populated.
 */
export async function fetchPostById(id: number): Promise<RawPost> {
  const response = await fetch(`${API_BASE}/posts/${id}`);

  if (response.status === 404) {
    throw new ApiError(`Announcement #${id} not found`, 404);
  }

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch announcement #${id} (${response.status})`,
      response.status
    );
  }

  const data: RawPost = await response.json();

  if (!data || typeof data.id !== 'number') {
    throw new ApiError(`Invalid data for announcement #${id}`);
  }

  return data;
}
