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

## Structure

```
gslink/
├── .vscode/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/

```

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

5. Build for production:

```bash
npm run build
```

## Testing

The project uses Jest and Supertest for API testing.

1. Install testing dependencies:

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/jest-dom supertest @types/supertest @jest/globals
```

2. Run tests:

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

Deploy to Vercel:

```bash
vercel deploy
```

## License

MIT
