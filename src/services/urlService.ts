import { api, ApiResponse } from "@/lib/api"
import { ShortUrlType } from "@/models/shortUrl";

export async function createUrl(url: string): Promise<ApiResponse<ShortUrlType>> {
  return api<ShortUrlType>('/api/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
}

export async function getUrls(): Promise<ApiResponse<ShortUrlType[]>> {
  return api<ShortUrlType[]>('/api/shorten');
}

export async function updateUrl(shortUrl: ShortUrlType): Promise<ApiResponse<ShortUrlType>> {
  return api<ShortUrlType>('/api/shorten', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shortUrl),
  })
}

export async function deleteUrl(shortCode: string): Promise<ApiResponse<{ shortCode: string, status: number }>> {
  return api<{ shortCode: string, status: number }>(`/api/shorten/${shortCode}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shortCode }),
  })
}