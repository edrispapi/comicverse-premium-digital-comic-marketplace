# ComicVerse - Premium Digital Comic Marketplace

[cloudflarebutton]

## Overview

ComicVerse is a high-performance, visually immersive Single Page Application (SPA) designed to be the premier destination for digital comics, manga, and graphic novels. Built on Cloudflare Workers for edge-speed performance, the application mimics the 'cinematic' feel of premium streaming platforms (like Netflix) but adapted for e-commerce.

The core experience revolves around a 'Dark Mode First' aesthetic, utilizing deep blacks, charcoal grays, and vibrant neon accents (Orange/Yellow) to make cover art pop.

## Key Features

- **Immersive Hero Experience**: Full-width cinematic hero slider on the homepage with parallax effects and motion.
- **Smart Catalog**: Masonry-style, filterable grid for browsing titles, optimized with virtualization.
- **Interactive Product Detail**: Dedicated pages with glassmorphism, 'peek-inside' previews, and seamless cart addition.
- **Authors & Creators Hub**: Spotlight sections with circular avatars and biographies.
- **Seamless Cart System**: Global sliding drawer cart with persistence via client-side state.
- **Responsive Design**: Flawless across devices with mobile-first approach.
- **Micro-Interactions**: Smooth animations powered by Framer Motion.

## Tech Stack

- **Frontend**: React 18, TypeScript, React Router, Tailwind CSS v3, Shadcn/UI, Framer Motion, Zustand, TanStack Query
- **Backend**: Hono, Cloudflare Workers, Durable Objects (via custom entity library)
- **Utilities**: Lucide React (icons), clsx, tailwind-merge, class-variance-authority, Sonner (toasts)
- **State & Data**: Zustand (global state), TanStack Query (caching), localStorage persistence
- **Build & Deploy**: Vite, Bun, Wrangler

## Quick Start

1. **Clone the repository**:
   ```
   git clone <your-repo-url>
   cd comicverse
   ```

2. **Install dependencies** (using Bun):
   ```
   bun install
   ```

3. **Start development server**:
   ```
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Development

- **Linting**: `bun run lint`
- **Build for production**: `bun run build`
- **Preview production build**: `bun run preview`
- **Type generation** (Cloudflare Workers): `bun run cf-typegen`

### Project Structure

```
├── src/              # React frontend
│   ├── components/   # UI components (Shadcn/UI + custom)
│   ├── pages/        # Route pages (HomePage.tsx is entry)
│   ├── hooks/        # Custom React hooks
│   └── lib/          # Utilities & API client
├── worker/           # Cloudflare Worker backend (Hono routes)
├── shared/           # Shared types & mock data
└── vite.config.ts    # Vite + Cloudflare plugin
```

### API Endpoints

All APIs under `/api/*`. Extend in `worker/user-routes.ts` using entity patterns from `worker/entities.ts`.

- GET `/api/users` - List users (paginated)
- POST `/api/users` - Create user
- Similar for chats/messages

Uses type-safe `ApiResponse<T>` from `shared/types.ts`.

### Customization

- **Pages**: Edit `src/pages/HomePage.tsx` (home), add routes in `src/main.tsx`.
- **Styles**: Tailwind config in `tailwind.config.js`, globals in `src/index.css`.
- **Theme**: Dark-mode by default; toggle via `ThemeToggle`.
- **State**: Cart/Wishlist in Zustand stores (add in future phases).
- **Data**: Replace mock data in `shared/mock-data.ts`.

**Do not modify**: `wrangler.jsonc`, `worker/core-utils.ts`, `worker/index.ts`.

## Deployment

Deploy to Cloudflare Workers with edge caching & Durable Objects:

1. **Build the app**:
   ```
   bun run build
   ```

2. **Deploy**:
   ```
   bun run deploy
   ```

[cloudflarebutton]

Wrangler handles assets SPA-routing (`assets.not_found_handling: "single-page-application"`).

### Environment

- Single `GlobalDurableObject` binding for all entities (users, chats, future: comics/cart).
- Migrations auto-managed.

## Contributing

1. Fork & clone.
2. Install with Bun.
3. Create feature branch: `git checkout -b feature/amazing-ui`.
4. Commit: `git commit -m "feat: add comic previews"`.
5. Push & PR.

Follow TypeScript, ESLint, and UI non-negotiables (shadcn/Tailwind standards).

## License

MIT. See [LICENSE](LICENSE) for details.