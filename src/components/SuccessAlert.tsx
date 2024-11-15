import { useState } from 'react';
import { Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CopyButton } from './CopyButton';

/**
 * Props for the SuccessAlert component
 * @interface SuccessAlertProps
 * @property {string} message - The message to display in the alert
 * @property {function} onCopy - Callback function triggered when content is copied
 */
type SuccessAlertProps = {
  message: string;
  onCopy: (text: string) => void;
}

/**
 * Success alert component with copy functionality.
 * Displays a success message with the ability to copy content.
 * 
 * @component
 * @example
 * ```tsx
 * <SuccessAlert 
 *   message="Operation successful: Content copied" 
 *   onCopy={(text) => console.log('Copied:', text)} 
 * />
 * ```
 * 
 * @param {SuccessAlertProps} props - Component props
 * @param {string} props.message - The message to display in the alert
 * @param {function} props.onCopy - Callback function when content is copied
 * @returns {JSX.Element} A success alert with copy functionality
 */
export function SuccessAlert({ message, onCopy }: SuccessAlertProps) {
  /** State to track if content has been copied */
  const [copied, setCopied] = useState(false);

  /**
   * Handles the copy operation
   * @param {string} text - The text to be copied
   */
  const handleCopy = (text: string) => {
    onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Alert className="mt-4">
      <Check className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        {message}
        <CopyButton
          textToCopy={message.split(': ')[1]}
          onCopy={onCopy}
        />
      </AlertDescription>
    </Alert>
  );
}