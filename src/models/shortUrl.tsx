import { deleteValue, exists, getKeys, getValue, setValue } from '@/lib/storage';
import { nanoid } from 'nanoid';

/** Maximum attempts to generate a unique short code */
const MAX_RETRIES_ID = 5;

/**
 * Short URL data structure
 * @interface ShortUrlType
 */
export type ShortUrlType = {
  shortCode: string
  originalUrl: string
  shortUrl?: string
  status: 'enabled' | 'disabled'
  visits?: number
  createdAt: string
  updatedAt?: string
}

/**
 * Visit count data structure
 * @interface VisitType
 */
export type VisitType = {
  visits: number
};

/**
 * Generates a unique short code
 * @returns {Promise<string|null>} Generated unique ID or null if max retries exceeded
 */
async function generateUniqueId(): Promise<string | null> {
  let attempts = 0;

  while (attempts < MAX_RETRIES_ID) {
    const shortCode = nanoid(6);
    const hasId = await exists(`url:${shortCode}`);
    if (!hasId) {
      return shortCode;
    }
    attempts++;
  }

  return null;
}

/**
 * Creates a new shortened URL
 * @param {string} url - Original URL to shorten
 * @returns {Promise<ShortUrlType|null>} Created short URL data or null if generation fails
 */
export async function createShortUrl(url: string): Promise<ShortUrlType | null> {
  const shortCode = await generateUniqueId();

  if (!shortCode) {
    return null;
  }

  const urlData: ShortUrlType = {
    shortCode: shortCode?.trim(),
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`,
    originalUrl: url.trim(),
    status: 'enabled',
    createdAt: new Date().toISOString(),
  };

  await setValue(`url:${shortCode}`, urlData);
  return urlData;
}

/**
 * Updates existing short URL data
 * @param {string} shortCode - Short code to update
 * @param {ShortUrlType} updatedUrlData - Updated URL data
 * @returns {Promise<ShortUrlType>} Updated URL data
 */
export async function updateShortUrl(shortCode: string, updatedUrlData: ShortUrlType): Promise<ShortUrlType> {
  await setValue(`url:${shortCode}`, updatedUrlData);
  return updatedUrlData;
}

/**
 * Checks if a short code exists
 * @param {string} shortCode - Short code to check
 * @returns {Promise<Boolean|null>} True if exists
 */
export async function existsShortUrl(shortCode: string): Promise<Boolean | null> {
  return exists(`url:${shortCode}`);
}

/**
 * Retrieves short URL data
 * @param {string} shortCode - Short code to retrieve
 * @returns {Promise<ShortUrlType|null>} URL data or null if not found
 */
export async function getShortUrl(shortCode: string): Promise<ShortUrlType | null> {
  return getValue<ShortUrlType>(`url:${shortCode}`);
}

/**
 * Gets visit count for a short URL
 * @param {string} shortCode - Short code to get visits for
 * @returns {Promise<VisitType|null>} Visit data or null if not found
 */
export async function getShortUrlVisits(shortCode: string): Promise<VisitType | null> {
  return getValue<VisitType>(`visits:${shortCode}`);
}

/**
 * Increments visit count for a short URL
 * @param {string} shortCode - Short code to increment visits for
 */
export async function incrementUrlVisits(shortCode: string) {
  const data = await getShortUrlVisits(shortCode);
  if (data !== null && data !== undefined) {
    await setValue(`visits:${shortCode}`, { "visits": data.visits + 1 });
  } else {
    await setValue(`visits:${shortCode}`, { "visits": 1 });
  }
}

/**
 * Deletes a short URL and its visit data
 * @param {string} shortCode - Short code to delete
 * @returns {Promise<boolean>} True if successfully deleted
 * @throws {Error} If deletion fails
 */
export async function deleteShortUrl(shortCode: string): Promise<boolean> {
  try {
    const urlExists = await exists(`url:${shortCode}`);
    if (!urlExists) {
      return false;
    }
    await Promise.all([
      deleteValue(`url:${shortCode}`),
      deleteValue(`visits:${shortCode}`)
    ]);
    return true;
  } catch (error) {
    console.error('Error deleting URL:', error);
    throw new Error('Failed to delete URL');
  }
}

/**
 * Deactivates a short URL
 * @param {string} shortCode - Short code to deactivate
 * @returns {Promise<boolean>} True if successfully deactivated
 * @throws {Error} If deactivation fails
 */
export async function deactivateShortUrl(shortCode: string): Promise<boolean> {
  try {
    const urlData = await getShortUrl(shortCode);
    if (!urlData) {
      return false;
    }

    const updatedData: ShortUrlType = {
      ...urlData,
      status: 'disabled',
      updatedAt: new Date().toISOString()
    };

    await setValue(`url:${shortCode}`, updatedData);
    return true;
  } catch (error) {
    throw new Error('Failed to deactivate URL');
  }
}

/**
 * Retrieves all short URLs with their visit counts
 * @returns {Promise<ShortUrlType[]>} Array of all short URL data
 */
export async function getAllShortUrl(): Promise<ShortUrlType[]> {
  const keys = await getKeys('url:*');
  const urls = await Promise.all(
    keys.map(async (key) => {
      const shortCode = key.split(':')[1];
      const data = await getValue(key);
      const dataVisits = (await getValue(`visits:${shortCode}`)) || { visits: 0 };

      return {
        shortCode,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`,
        ...data,
        visits: dataVisits.visits,
      } as ShortUrlType;
    })
  );

  return urls;
}