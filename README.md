# Sports & Stream

Sports & Stream is a Remix app that fetches a weekly sports stream schedule and lets users open streams in a full-screen player.

## Features

- Weekly sports listing loaded server-side from `SOURCE_URL`
- Day-based filtering (`All` + individual day tags)
- Full-screen player modal (iframe stream playback)
- Dark/light mode toggle (Chakra UI color mode)
- Responsive layout with Chakra UI
- Client-only Lottie animations to avoid SSR crashes
- Graceful fallback when `SOURCE_URL` is missing or invalid

## Tech Stack

- Remix (`@remix-run/*` 1.7.5)
- React 18
- TypeScript
- Chakra UI + Emotion
- Axios

## Environment

Create `.env` in the project root:

```env
SOURCE_URL=https://your-source-url
```

`npm run start` preloads dotenv, so `.env` is read in production mode too.

## Local Development

```bash
npm install
npm run dev
```

## Production Run

```bash
npm run build
npm run start
```

## Deployment

Vercel deployment is configured via `vercel.json` with a custom `api/index.js` entry that serves Remix build output.
