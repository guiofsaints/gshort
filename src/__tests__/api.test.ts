import request from 'supertest';
import { describe, expect, it } from '@jest/globals';

const baseURL = 'http://localhost:3000/api';

interface ShortUrl {
  shortCode: string;
  originalUrl: string;
  shortUrl?: string;
  status: 'enabled' | 'disabled';
  visits: number;
  createdAt: string;
  updatedAt?: string;
}

interface APIResponse<T> {
  data: T;
  status: number;
}

describe('URL Shortener API', () => {
  let shortCode: string;

  describe('POST /shorten', () => {
    it('should create a short URL successfully', async () => {
      const response = await request(baseURL).post('/shorten').send({
        url: 'https://example.com/very-long-url',
      });

      const body = response.body as APIResponse<ShortUrl>;

      expect(response.status).toBe(201);
      expect(body.status).toBe(201);
      expect(body.data).toHaveProperty('shortCode');
      expect(body.data).toHaveProperty('originalUrl');
      expect(body.data.status).toBe('enabled');

      shortCode = body.data.shortCode;
    });

    it('should fail with invalid URL format', async () => {
      const response = await request(baseURL).post('/shorten').send({
        url: 'invalid-url',
      });

      expect(response.status).toBe(400);
    });

    it('should fail when URL is missing', async () => {
      const response = await request(baseURL).post('/shorten').send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /shorten', () => {
    it('should return list of all shortened URLs', async () => {
      const response = await request(baseURL).get('/shorten');
      const body = response.body as APIResponse<ShortUrl[]>;

      expect(response.status).toBe(200);
      expect(body.status).toBe(200);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data[0]).toHaveProperty('shortCode');
      expect(body.data[0]).toHaveProperty('originalUrl');
      expect(body.data[0]).toHaveProperty('status');
      expect(body.data[0]).toHaveProperty('visits');
      expect(body.data[0]).toHaveProperty('createdAt');
    });
  });

  describe('PATCH /shorten', () => {
    it('should update URL status successfully', async () => {
      const response = await request(baseURL)
        .patch('/shorten')
        .send({
          shortCode,
          originalUrl: 'https://example.com/updated-url',
          status: 'disabled' as const,
        });

      const body = response.body as APIResponse<ShortUrl>;

      expect(response.status).toBe(200);
      expect(body.data.status).toBe('disabled');
      expect(body.data.originalUrl).toBe('https://example.com/updated-url');
    });

    it('should fail with invalid status value', async () => {
      const response = await request(baseURL).patch('/shorten').send({
        shortCode,
        originalUrl: 'https://example.com/updated-url',
        status: 'invalid-status',
      });

      expect(response.status).toBe(400);
    });

    it('should fail with non-existent shortCode', async () => {
      const response = await request(baseURL)
        .patch('/shorten')
        .send({
          shortCode: 'nonexistent',
          originalUrl: 'https://example.com/updated-url',
          status: 'enabled' as const,
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /shorten/{shortCode}', () => {
    it('should delete URL successfully', async () => {
      const response = await request(baseURL).delete(`/shorten/${shortCode}`);
      const body = response.body as APIResponse<{ shortCode: string }>;

      expect(response.status).toBe(200);
      expect(body.data.shortCode).toBe(shortCode);
    });

    it('should fail with non-existent shortCode', async () => {
      const response = await request(baseURL).delete('/shorten/nonexistent');

      expect(response.status).toBe(404);
    });
  });
});
