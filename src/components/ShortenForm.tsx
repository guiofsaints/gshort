/**
 * Form component for URL shortening functionality
 * Handles URL submission and displays shortened results
 */

'use client';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

/**
 * Renders a form for URL shortening with success/error feedback
 */
export default function ShortenForm() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  /**
   * Handles form submission and URL shortening
   */
  const shortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError('Failed to shorten URL');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={shortenUrl} className="space-y-4">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          className="w-full p-2 border rounded"
          required
        />
        <Button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          Shorten URL
        </Button>
      </form>
      {shortUrl && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p>
            Short URL:{' '}
            <a href={shortUrl} className="text-blue-500">
              {shortUrl}
            </a>
          </p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}