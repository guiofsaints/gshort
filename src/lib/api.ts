/**
 * Generic API response type
 * @template T The expected data type of the response
 * @property {T} [data] - The response data
 * @property {string} [error] - Error message if request fails
 * @property {number} status - HTTP status code
 */
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

/**
 * Generic API fetch wrapper with error handling
 * @template T The expected response data type
 * @param {string} url - The URL to fetch from
 * @param {RequestInit} [options] - Fetch options (method, headers, body, etc.)
 * @returns {Promise<ApiResponse<T>>} Response object with data or error
 * @example
 * ```ts
 * type User = { id: number, name: string };
 * const response = await api<User>('https://api.example.com/user/1');
 * if (response.data) {
 *   console.log(response.data.name);
 * }
 * ```
 */
export async function api<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const responseData: ApiResponse<T> = await response.json();

    if (!response.ok) {
      return {
        error: responseData.error || 'An error occurred',
        status: response.status,
      };
    }

    return {
      data: responseData.data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    };
  }
}
