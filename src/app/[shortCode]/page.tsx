/**
 * Handles URL redirection based on short codes
 * This component manages URL redirection for a URL shortener service
 */

import {
  getShortUrl,
  incrementUrlVisits,
  ShortUrlType,
} from '@/models/shortUrl';
import { redirect } from 'next/navigation';
import { RedirectType } from 'next/navigation';

type PageProps = {
  params: Promise<{ shortCode: string }>;
};

/**
 * RedirectPage component handles the redirection logic
 * @param params - Contains the shortCode from the URL
 * @returns JSX element or triggers redirect
 */
export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;

  const shortUrl: ShortUrlType | null = await getShortUrl(shortCode);
  if (!shortUrl) {
    return <div>URL not found</div>;
  }

  if (shortUrl.status !== 'enabled') {
    return <div>URL is disabled</div>;
  }

  await incrementUrlVisits(shortCode);
  redirect(shortUrl.originalUrl, RedirectType.push);
}
