/**
 * Validates if the provided string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid, false otherwise
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};