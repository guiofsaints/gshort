/**
 * Copy Button component with visual feedback
 * Provides a button that copies text to clipboard with temporary success indication
 */

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props for the CopyButton component
 */
type CopyButtonProps = {
  textToCopy: string;
  onCopy: (text: string) => void;
}

/**
 * Renders a button that copies text with visual feedback
 * @param textToCopy The text to be copied
 * @param onCopy Callback function executed after copying
 */
export function CopyButton({ textToCopy, onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">Copy URL</span>
    </Button>
  );
}