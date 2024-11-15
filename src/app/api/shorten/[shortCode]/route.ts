/**
 * API route handler for deleting shortened URLs
 * This module provides endpoint functionality to remove URLs from the shortener service
 */

import { ApiResponse } from '@/lib/api';
import { deleteShortUrl, existsShortUrl } from '@/models/shortUrl';
import { NextResponse } from 'next/server';

/**
 * DELETE handler for removing shortened URLs
 * @param request The incoming HTTP request
 * @param params Contains the shortCode to identify the URL for deletion
 * @returns ApiResponse with success/error message and appropriate status code
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const shortCode = (await params).shortCode;

    if (!shortCode) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: 'shortCode is required',
          status: 400,
        },
        { status: 400 }
      );
    }

    const exists = await existsShortUrl(shortCode);

    if (!exists) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: 'URL not found',
          status: 404,
        },
        { status: 404 }
      );
    }

    const isDeleted = await deleteShortUrl(shortCode);

    if (!isDeleted) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: 'URL not deleted',
          status: 500,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ shortCode: string }>>(
      {
        data: { shortCode },
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        error: 'Failed to delete URL',
        status: 500,
      },
      { status: 500 }
    );
  }
}
