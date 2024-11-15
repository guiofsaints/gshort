import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Props for the UrlInput component
 * @interface UrlInputProps
 * @property {string} url - Current URL value
 * @property {function} onUrlChange - Callback function when URL input changes
 * @property {function} onShorten - Callback function when shorten button is clicked
 * @property {boolean} isLoading - Loading state for the shorten operation
 */
type UrlInputProps = {
  url: string;
  onUrlChange: (url: string) => void;
  onShorten: () => void;
  isLoading: boolean;
};

/**
 * URL input component with validation and shortening functionality.
 * Provides URL input field, validation, and shortening button with loading state.
 *
 * @component
 * @example
 * ```tsx
 * <UrlInput
 *   url={url}
 *   onUrlChange={setUrl}
 *   onShorten={handleShorten}
 *   isLoading={loading}
 * />
 * ```
 */
export function UrlInput({
  url,
  onUrlChange,
  onShorten,
  isLoading,
}: UrlInputProps) {
  /** State to store validation error message */
  const [error, setError] = useState<string>('');

  /**
   * Validates if the provided string is a valid URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is valid, false otherwise
   */
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Handles form submission with validation
   * Sets error message if validation fails
   */
  const handleSubmit = () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError('');
    onShorten();
  };

  /**
   * Handles URL input changes and clears error state
   * @param {string} value - New URL input value
   */
  const handleUrlChange = (value: string) => {
    setError('');
    onUrlChange(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          type="url"
          placeholder="Enter your long URL here"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          disabled={isLoading}
          className={error ? 'border-red-500' : ''}
        />
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Shorten
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default UrlInput;
