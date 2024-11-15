# Gui Shortener

A modern URL shortener built with Next.js 14, Redis Cloud, and Vercel.

## Features

- URL shortening with custom IDs
- Real-time analytics
- URL management (enable/disable)
- Dashboard for URL stats
- Redis Cloud for fast URL resolution
- Serverless deployment on Vercel

## Tech Stack

- Next.js 14
- TypeScript
- Redis Cloud
- Tailwind CSS
- Nanoid

## Setup

1. Clone repository:

```bash
git clone https://github.com/yourusername/url-shortener.git
cd g-short
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env.local`:

4. Run development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## API Routes

- `POST /api/shorten`: Create short URL
- `GET /api/shorten`: Get ALL Short URL
- `PATCH /api/shorten`: Update short URL
- `DELETE /api/shorten/:shortCode`: Delete short URL
- `GET /:shortCode`: Redirect to original URL

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

## License

MIT
