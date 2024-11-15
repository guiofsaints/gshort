/**
 * API route handlers for URL shortener operations
 * Provides endpoints for creating, reading, and updating shortened URLs
 */

import { ApiResponse } from '@/lib/api';
import {
  createShortUrl,
  getAllShortUrl,
  getShortUrl,
  ShortUrlType,
  updateShortUrl,
} from '@/models/shortUrl';
import { NextResponse } from 'next/server';

/**
 * POST handler for creating new shortened URLs
 * @param request Contains the original URL to be shortened
 * @returns ApiResponse with the created short URL data
 */
export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const shortUrl = await createShortUrl(url);

    if (!shortUrl) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: 'Could not generate unique shortCode. Please try again.',
          status: 500,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<ShortUrlType>>(
      {
        data: shortUrl,
        status: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json<ApiResponse<null>>(
      {
        error: 'Failed to create short URL',
        status: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving all shortened URLs
 * @returns ApiResponse with array of all shortened URLs
 */
export async function GET() {
  try {
    const urls = await getAllShortUrl();

    return NextResponse.json<ApiResponse<typeof urls>>(
      {
        data: urls,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        error: 'Failed to fetch URLs',
        status: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for updating existing shortened URLs
 * @param request Contains shortCode, originalUrl and status for update
 * @returns ApiResponse with the updated URL data
 */
export async function PATCH(request: Request) {
  try {
    const { shortCode, originalUrl, status } = await request.json();

    if (!shortCode || !originalUrl || !status) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: 'shortCode, status and originalUrl are required',
          status: 400,
        },
        { status: 400 }
      );
    }

    const urlData = await getShortUrl(shortCode);

    if (!urlData) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: 'URL not found',
          status: 404,
        },
        { status: 404 }
      );
    }

    const updatedUrlData = {
      ...urlData,
      status,
      originalUrl: originalUrl.trim(),
      updatedAt: new Date().toISOString(),
    };

    await updateShortUrl(shortCode, updatedUrlData);

    return NextResponse.json<ApiResponse<typeof updatedUrlData>>(
      {
        data: updatedUrlData,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating URL:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        error: 'Failed to update URL',
        status: 500,
      },
      { status: 500 }
    );
  }
}
