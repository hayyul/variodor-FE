/**
 * API Configuration
 *
 * Both development and production use the production backend
 * Default: https://variodor-be.onrender.com
 * Override via VITE_API_URL environment variable
 */

const API_URL =
  import.meta.env.VITE_API_URL || 'https://variodor-be.onrender.com';

/**
 * Get the full API endpoint URL
 * @param path - API path (e.g., '/api/auth/login')
 * @returns Full URL for the API endpoint
 */
export function getApiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export default { getApiUrl };
