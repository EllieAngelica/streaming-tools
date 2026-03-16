# StreamTools

Real-time streaming alerts & overlays for OBS, built with SvelteKit. Connects to **StreamElements**, **Ko-fi**, and **Kick** to display follow, subscription, tip, and merch alerts as a browser source overlay.

## Features

- **OBS Browser Source Overlay** — Transparent, lightweight alert display designed for OBS. Add `/overlay` as a browser source and alerts appear on stream.
- **Theme Editor** — Visual editor with live preview. Customize colors, fonts, animations, positioning, and per-alert-type styling. Copy a pre-configured OBS URL with one click.
- **Multi-Source Support** — Receive events from StreamElements (socket.io), Ko-fi (webhooks), and Kick (Pusher WebSocket).
- **Web Animations API** — Smooth entrance/exit animations (fade, slide, bounce, zoom) using the Web Animations API instead of CSS classes.
- **Dashboard** — Manage connections, send test alerts, and view recent events.
- **Zero-Config Dev Mode** — Add `?dev=true` to the overlay URL for a toolbar that fires test alerts without needing any integrations connected.

## Tech Stack

| Tool | Purpose |
|------|---------|
| SvelteKit (Svelte 5) | Framework — runes, server routes, SSR |
| Tailwind CSS v4 | Styling with custom theme tokens |
| TypeScript | Full type safety |
| Vercel | Deployment (`@sveltejs/adapter-vercel`) |
| socket.io-client | StreamElements real-time connection |
| pusher-js | Kick real-time connection |

Only **2 runtime dependencies** beyond SvelteKit itself.

## Getting Started

```bash
# Clone and install
git clone https://github.com/EllieAngelica/streaming-tools.git
cd streaming-tools
npm install

# Set up environment variables (optional for dev)
cp .env.example .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the landing page.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/overlay` | OBS browser source — add this URL in OBS |
| `/overlay?dev=true` | Overlay with test alert toolbar |
| `/dashboard` | Connection management & test alerts |
| `/dashboard/editor` | Visual theme editor with live preview |

## OBS Setup

1. Open the **Theme Editor** at `/dashboard/editor`
2. Customize your alert style, animation, and position
3. Click **Copy OBS URL** — this generates a URL with your config embedded
4. In OBS, add a **Browser Source** and paste the URL
5. Set the source dimensions to match your canvas (e.g. 1920x1080)
6. Alerts will appear with a transparent background

## Environment Variables

```env
# Ko-fi webhook verification token (from Ko-fi webhook settings)
KOFI_VERIFICATION_TOKEN=

# StreamElements JWT token (optional — can also be set in dashboard UI)
STREAMELEMENTS_JWT=

# Kick channel slug (optional — can also be set in dashboard UI)
KICK_CHANNEL_SLUG=
```

## Project Structure

```
src/
├── lib/
│   ├── components/alerts/   # AlertCard, AlertContainer
│   ├── server/              # Server-side event bus
│   ├── services/            # StreamElements, Kick integrations
│   ├── stores/              # Alert queue, theme config (Svelte stores)
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Animation keyframes, default config
├── routes/
│   ├── api/
│   │   ├── events/          # SSE endpoint for server → overlay
│   │   ├── kofi/            # Ko-fi webhook receiver
│   │   └── test-alert/      # Test alert POST endpoint
│   ├── dashboard/
│   │   └── editor/          # Theme editor page
│   └── overlay/             # OBS browser source page
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run check    # Svelte/TypeScript type checking
npm run test     # Run tests with Vitest
```

## How It Works

All event sources (StreamElements, Ko-fi, Kick) normalize their events into a single `AlertEvent` type:

```typescript
interface AlertEvent {
  id: string;
  type: 'follow' | 'sub' | 'tip' | 'merch';
  source: 'streamelements' | 'kofi' | 'kick';
  username: string;
  message?: string;
  amount?: number;
  currency?: string;
  tier?: string;
  timestamp: number;
}
```

Events flow through an alert queue store that manages visible alerts, a backlog for overflow, and auto-dismiss timers. The theme config (stored in localStorage and optionally encoded in the URL) controls every visual aspect of how alerts render.

## License

MIT
