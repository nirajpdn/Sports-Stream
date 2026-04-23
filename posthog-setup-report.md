# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Sports Stream project. A new PostHog singleton (`app/utils/posthog.server.ts`) was created using the `posthog-node` server-side SDK, configured for the Vercel serverless environment (`flushAt: 1`, `flushInterval: 0`, `enableExceptionAutocapture: true`). Event tracking was added to the Remix loader in `app/routes/index.tsx` (page view on each request, keyed by the visitor's IP address) and to the data-fetch utility `app/utils/getStream.ts` (success and failure events, with full exception capture on errors). Environment variables `POSTHOG_API_KEY` and `POSTHOG_HOST` were written to `.env`.

| Event | Description | File |
|---|---|---|
| `sports_page_viewed` | Fired server-side in the Remix loader on each page request; includes `$current_url` and an IP-derived `distinctId`. | `app/routes/index.tsx` |
| `sports_data_loaded` | Fired when the sports stream data is successfully fetched; includes `event_count` and `day_count` properties. | `app/utils/getStream.ts` |
| `sports_data_load_failed` | Fired when the data fetch fails; includes `error_message`. Also calls `captureException` for full error tracking. | `app/utils/getStream.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/343652/dashboard/1502107
- **Daily page views:** https://us.posthog.com/project/343652/insights/neugV0LN
- **Unique visitors per day:** https://us.posthog.com/project/343652/insights/lusF5IDF
- **Sports data load success vs failure:** https://us.posthog.com/project/343652/insights/O2f7ZWQB
- **Average events loaded per fetch:** https://us.posthog.com/project/343652/insights/QwenAltN
- **Data load error rate:** https://us.posthog.com/project/343652/insights/o1pPVdA3

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
