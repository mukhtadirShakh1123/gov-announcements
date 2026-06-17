# gov-announcements

Professional, minimal React + TypeScript application for browsing and bookmarking government announcements.

**Project Overview**

This repository is a small single-page application built with Vite, React, and TypeScript. It provides a searchable, filterable feed of announcements, a detail view for individual posts, and a bookmarks area for saved items. The project emphasizes simplicity, predictable state, and accessibility.

**Architecture Decisions**

- **Vite + React + TypeScript**: chosen for fast local development, type safety, and ecosystem familiarity.
- **Global state via React Contexts**: lightweight contexts (`AnnouncementsContext`, `BookmarksContext`, `FilterContext`) keep state shareable without adding Redux complexity.
- **Folder-based feature organization**: components grouped by responsibility (e.g., `components/`, `pages/`, `services/`) to keep imports predictable.
- **Hooks for logic reuse**: custom hooks in `src/hooks/` (e.g., `useFilteredAnnouncements`, `useAnnouncementDetail`) encapsulate data selection and side-effects.
- **Isolated services**: `src/services/api.ts` centralizes HTTP and data transformation logic (`src/utils/transformPost.ts`) for testability.

**Folder Structure**

- **[src/](src)**: application source
  - **[app/](src/app)**: app shell and layout (`[App.tsx](src/app/App.tsx)`, `[AppLayout.tsx](src/app/AppLayout.tsx)`) 
  - **[components/](src/components)**: UI components (e.g., `AnnouncementCard`, `Navbar`, `SearchBar`) 
  - **[context/](src/context)**: React Context implementations (`AnnouncementsContext.tsx`, `BookmarksContext.tsx`, `FilterContext.tsx`) 
  - **[hooks/](src/hooks)**: reusable hooks (`useFilteredAnnouncements.ts`, `useAnnouncementDetail.ts`) 
  - **[pages/](src/pages)**: route views (`FeedPage`, `DetailPage`, `BookmarksPage`) 
  - **[routes/](src/routes.tsx)**: route definitions and route-based code splitting
  - **[services/](src/services)**: API and persistence layers (`api.ts`) 
  - **[utils/](src/utils)**: small pure helpers (`filterAnnouncements.ts`, `localStorage.ts`, `transformPost.ts`) 
  - **[types/](src/types)**: TypeScript domain types (`announcement.ts`)

**Installation**

Prerequisites: Node.js 18+ (or LTS), npm or yarn

1. Install dependencies

```bash
npm install
# or
yarn
```

**Running Locally**

Start the dev server with Vite:

```bash
npm run dev
# or
yarn dev
```

Build for production:

```bash
npm run build
# or
yarn build
```

Preview production build locally:

```bash
npm run preview
# or
yarn preview
```

**Trade-offs**

- **Context vs Redux**: Contexts were chosen for simplicity; they fit this app's scale but are less performant for very large, frequently-updated state than a normalized store (e.g., Redux/RxJS). 
- **No heavy SSR**: Vite SPA is fast for client-side rendering; however, SEO-sensitive content or very high-performance initial loads would benefit from SSR.
- **Limited backend concerns**: The project assumes a simple JSON API; adding robust caching, pagination, or optimistic updates would increase complexity.

**Future Improvements**

- Add end-to-end tests (Cypress or Playwright) and integrate in CI.
- Implement pagination and server-driven filtering for large datasets.
- Introduce request caching and stale-while-revalidate (e.g., SWR or React Query) for better UX and fewer refetches.
- Add i18n support and accessibility audits.

**Testing Strategy**

- **Unit tests**: Use Jest + React Testing Library for components and hooks. Focus on critical logic in `src/utils/` and `src/hooks/`.
- **Integration tests**: Component-level tests that verify interaction between `SearchBar`, `CategoryFilter`, and `FeedPage`.
- **E2E tests**: Use Playwright or Cypress to verify critical user flows (searching, bookmarking, viewing details).
- **Linting & Formatting**: ESLint + Prettier configured via project files; run `npm run lint` as part of CI.

---

If you want, I can also add a short Quick Start section with example API response shape, or scaffold tests and CI workflow next.
