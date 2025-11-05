/**
 * API Configuration
 *
 * In development: Uses Vite proxy to localhost:4000
 * In production: Uses VITE_API_URL environment variable
 */

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get the full API endpoint URL
 * @param path - API path (e.g., '/api/auth/login')
 * @returns Full URL for the API endpoint
 */
export function getApiUrl(path: string): string {
  // In development, use relative path (Vite proxy handles it)
  if (import.meta.env.DEV) {
    return path;
  }

  // In production, use the configured API URL
  return `${API_URL}${path}`;
}

export default { getApiUrl };
