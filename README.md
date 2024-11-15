# Gui Shortener

A modern URL shortener built with Next.js 14, Redis Cloud, and Vercel.

- Production URL: https://gslink.vercel.app/
- Development URL: http://localhost:300
- API Docs: https://gslink.vercel.app/docs

## Features

- URL shortening with custom IDs
- Real-time analytics
- URL management (enable/disable)
- Dashboard for URL stats
- Redis Cloud for fast URL resolution
- Serverless deployment on Vercel

## Tech Stack

Frontend:

- Next.js
- TypeScript
- React
- Tailwind
- Shadcn

Backend:

- Typescript
- Redis
- Nanoid

## Setup

1. Clone repository:

```bash
git clone https://github.com/guiofsaints/gslink
cd gslink
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

5. Access in your browser: http://localhost:3000

## Testing

Run tests:

```bash
# Run all tests
npm test
# Run tests in watch mode
npm run test:watch
# Run tests with coverage
npm run test:coverage
```

Test files are located in the `__tests__` directory and follow the naming convention `*.test.ts`.

## API Routes

- `POST /api/shorten`: Create short URL
- `GET /api/shorten`: Get ALL Short URL
- `PATCH /api/shorten`: Update short URL
- `DELETE /api/shorten/:shortCode`: Delete short URL
- `GET /:shortCode`: Redirect to original URL

## Deployment

## Vercel CLI Setup

1. Install Vercel CLI globally:

```bash
npm install -g vercel
```

2. Login to your Vercel account:

```bash
vercel login
```

3. Link your project to Vercel:

```bash
# Navigate to your project directory
cd gslink

# Link to Vercel
vercel link

# Follow the prompts to:
# - Select or create a Vercel account
# - Select or create a project
# - Link to existing project or create new one
```

4. Pull environment variables from Vercel (optional):

```bash
vercel env pull
```

Deploy to Vercel:

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```
