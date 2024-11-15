/**
 * Table component for displaying and managing shortened URLs
 * Provides functionality for viewing, editing, deleting, and copying URLs
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Trash2, Loader2, Link2 } from 'lucide-react';
import { ShortUrlType } from '@/models/shortUrl';
import { useState } from 'react';
import { CopyButton } from './CopyButton';
import moment from 'moment';
import { Switch } from './ui/switch';

/**
 * Props for the ShortenedUrlTable component
 */
type ShortenedUrlTableProps = {
  urls: ShortUrlType[];
  onEdit: (ShortUrl: ShortUrlType) => void;
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
  editingUrl: ShortUrlType | null;
  setEditingUrl: (ShortUrl: ShortUrlType | null) => void;
  onSaveEdit: () => void;
  isDeletingUrl: string | null;
  isEditingUrl: string | null;
}

/**
 * Generates a styled badge based on URL status
 */
const getStatusBadge = (status: string) => {
  const variants = {
    enabled: "bg-green-100 text-green-800",
    disabled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800"
  };

  return (
    <Badge variant="outline" className={`${variants[status as keyof typeof variants]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

/**
 * Renders a table displaying shortened URLs with management functionality
 */
export function ShortenedUrlTable({
  urls = [],
  onEdit,
  onDelete,
  onCopy,
  editingUrl,
  setEditingUrl,
  onSaveEdit,
  isDeletingUrl,
  isEditingUrl,
}: ShortenedUrlTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveAndClose = () => {
    onSaveEdit();
    setDialogOpen(false);
  };

  if (!urls || urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
        <Link2 className="h-8 w-8 mb-2" />
        <p>No shortened URLs yet. Try creating one above!</p>
      </div>
    );
  }

  /**
   * Handles URL status toggle in edit dialog
   */
  const handleStatusChange = (checked: boolean) => {
    if (editingUrl) {
      setEditingUrl({
        ...editingUrl,
        status: checked ? 'enabled' : 'disabled'
      });
    }
  };

  const sortedUrls = [...urls].sort((a, b) =>
    moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Created At</TableHead>
          <TableHead className="text-center">Original URL</TableHead>
          <TableHead className="text-center">Short URL</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Visits</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUrls.map((url: ShortUrlType, index: number) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {moment(url.createdAt).format('DD/MM/YYYY HH:mm')}
            </TableCell>
            <TableCell className="font-medium">{url.originalUrl}</TableCell>
            <TableCell>{url.shortUrl}</TableCell>
            <TableCell className="text-center">
              {getStatusBadge(url.status || 'enabled')}
            </TableCell>
            <TableCell className="text-center">{url.visits || 0}</TableCell>
            <TableCell>
              <div className="flex space-x-2 justify-end">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(url)}
                      disabled={isEditingUrl === url.shortCode}
                    >
                      {isEditingUrl === url.shortCode ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                      <span className="sr-only">Edit URL</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit URL</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="items-center gap-4">
                        <Label htmlFor="original-url" className="text-right">
                          Original URL
                        </Label>
                        <Input
                          id="original-url"
                          value={editingUrl?.originalUrl || ''}
                          onChange={(e) =>
                            setEditingUrl(
                              editingUrl
                                ? { ...editingUrl, originalUrl: e.target.value }
                                : null
                            )
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="items-center gap-4">
                        <Label htmlFor="status" className="text-left mr-4">URL Status</Label>
                        <Switch
                          id="status"
                          className="text-left"
                          checked={editingUrl?.status === 'enabled'}
                          onCheckedChange={handleStatusChange}
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveAndClose} disabled={isEditingUrl === url.shortCode}>
                      {isEditingUrl === url.shortCode ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(url.shortCode)}
                  disabled={isDeletingUrl === url.shortCode}
                >
                  {isDeletingUrl === url.shortCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete URL</span>
                </Button>
                <CopyButton
                  textToCopy={url.shortUrl || ""}
                  onCopy={onCopy}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}