'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShortenedUrlTable } from '@/components/ShortenedUrlTable';
import { SuccessAlert } from '@/components/SuccessAlert';
import { UrlInput } from '@/components/UrlInput';
import { ShortUrlType } from '@/models/shortUrl';
import { createUrl, deleteUrl, getUrls, updateUrl } from '@/services/urlService';
import { ArrowRight, Loader2 } from "lucide-react";
import Link from 'next/link';

export default function URLShortener() {
  const [url, setUrl] = useState<string>("");
  const [shortenedUrls, setShortenedUrls] = useState<ShortUrlType[]>([]);
  const [editingUrl, setEditingUrl] = useState<ShortUrlType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShorteningUrl, setIsShorteningUrl] = useState(false);
  const [isDeletingUrl, setIsDeletingUrl] = useState<string | null>(null);
  const [isEditingUrl, setIsEditingUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (url) {
      try {
        setIsShorteningUrl(true);
        const { data } = await createUrl(url);
        setShortenedUrls([...shortenedUrls, data] as ShortUrlType[]);
        setSuccessMessage(`URL shortened successfully: ${data?.shortUrl}`);
        setUrl("");
      } finally {
        setIsShorteningUrl(false);
      }
    }
  };

  const handleDelete = async (shortCode: string) => {
    try {
      setIsDeletingUrl(shortCode);
      const { status } = await deleteUrl(shortCode)
      if (status === 200) {
        setShortenedUrls(shortenedUrls.filter((url) => url.shortCode !== shortCode));
      }
    } finally {
      setIsDeletingUrl(null);
    }
  };

  const handleEdit = async (shorUrl: ShortUrlType) => {
    try {
      setIsEditingUrl(shorUrl.shortCode);
      setEditingUrl(shorUrl);
    } finally {
      setIsEditingUrl(null);
    }
  };

  const handleSaveEdit = async () => {
    if (editingUrl) {
      const { status } = await updateUrl(editingUrl);

      if (status === 200) {
        setShortenedUrls((prevUrls: ShortUrlType[]) =>
          prevUrls.map((url: ShortUrlType): ShortUrlType =>
            url.shortCode === editingUrl.shortCode ? editingUrl : url
          )
        );
        setEditingUrl(null);
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage(`Copied to clipboard: ${text}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUrls();
        setShortenedUrls(data || []);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mt-10 mb-10 bg-gradient-to-r from-yellow-50 to-green-100">
        <CardHeader>
          <CardTitle className="text-4xl bg-gradient-to-r from-green-500 to-yellow-500 text-transparent bg-clip-text font-bold">
            Gui Shortener</CardTitle>
          <CardDescription>Shorten your long URLs with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <UrlInput
            url={url}
            onUrlChange={setUrl}
            onShorten={handleCreate}
            isLoading={isShorteningUrl}
          />
          {successMessage && (
            <SuccessAlert message={successMessage} onCopy={handleCopy} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Shortened URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <ShortenedUrlTable
            urls={shortenedUrls}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            editingUrl={editingUrl}
            setEditingUrl={setEditingUrl}
            onSaveEdit={handleSaveEdit}
            isDeletingUrl={isDeletingUrl}
            isEditingUrl={isEditingUrl}
          />
        </CardContent>
      </Card>


      <Card className="mt-10">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Integrate URL shortening into your applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Explore our API documentation to learn how to integrate URL shortening functionality into your applications
              </p>
              <p className="text-sm text-muted-foreground">
                Built with OpenAPI Specification and SwaggerUI
              </p>
            </div>
            <Link
              href="/docs"
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
            >
              View Docs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}