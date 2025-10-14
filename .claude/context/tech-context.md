---
created: 2025-10-14T16:58:14Z
last_updated: 2025-10-14T16:58:14Z
version: 1.0
author: Claude Code PM System
---

# Technical Context & Dependencies

## Technology Stack

### Core Framework
- **React** `19.1.1` - Latest React with improved concurrent features
- **React DOM** `19.1.1` - DOM rendering for React
- **TypeScript** `5.9.3` - Type-safe JavaScript with strict mode
- **Vite** `7.1.7` - Next-generation build tool with HMR

---

## Runtime Dependencies

### State Management
- **Zustand** `5.0.8` - Minimal hook-based state management
  - Usage: Global app state
  - Location: `src/lib/store.ts`
  - DevTools: Integrated for debugging

- **TanStack Query** `5.90.3` - Async state management
  - Usage: Server state & data fetching
  - Location: `src/lib/query.ts`
  - DevTools: `@tanstack/react-query-devtools` `5.90.2`

### Data Persistence
- **Dexie** `4.2.1` - IndexedDB wrapper
  - Usage: Local-first data storage
  - Location: `src/lib/db.ts`
  - Features: Transactions, migrations, queries

- **dexie-react-hooks** `4.2.0` - React hooks for Dexie
  - Usage: `useLiveQuery()` for reactive queries

- **idb** `8.0.3` - Lightweight IndexedDB library
  - Usage: Low-level IndexedDB operations

### AI & ML
- **@xenova/transformers** `2.17.2` - Transformers.js for browser ML
  - Model: `Xenova/all-MiniLM-L6-v2`
  - Size: 23MB cached in browser
  - Dimensions: 384-dimensional embeddings
  - Location: `src/lib/ai/embeddings/transformers.ts`

### Animations
- **Framer Motion** `12.23.24` - Production-ready animation library
  - Usage: Component animations, transitions
  - Features: Layout animations, gestures, variants

- **GSAP** `3.13.0` - Professional animation platform
  - Usage: Complex timeline animations
  - Features: ScrollTrigger, timelines, tweens

### Utilities
- **clsx** `2.1.1` - Conditional className utility
- **tailwind-merge** `3.3.1` - Merge Tailwind classes intelligently
  - Combined in: `src/utils/cn.ts`

---

## Development Dependencies

### Build Tools
- **@vitejs/plugin-react** `5.0.4` - React plugin for Vite
- **PostCSS** `8.5.6` - CSS transformations
- **Autoprefixer** `10.4.21` - CSS vendor prefixes

### Styling
- **Tailwind CSS** `4.1.14` - Utility-first CSS framework
- **@tailwindcss/postcss** `4.1.14` - Tailwind PostCSS plugin

### TypeScript
- **@types/react** `19.1.16` - React type definitions
- **@types/react-dom** `19.1.9` - React DOM type definitions
- **@types/node** `24.6.0` - Node.js type definitions
- **typescript-eslint** `8.45.0` - ESLint TypeScript parser

### Testing
- **Vitest** `3.2.4` - Vite-native test framework
  - Config: `vitest.config.ts`
  - UI: `@vitest/ui` `3.2.4`
  - Coverage: `@vitest/coverage-v8` `3.2.4`

- **@testing-library/react** `16.3.0` - React testing utilities
- **@testing-library/jest-dom** `6.9.1` - Custom Jest matchers
- **@testing-library/user-event** `14.6.1` - User interaction simulation

- **jsdom** `27.0.0` - DOM implementation for testing
- **fake-indexeddb** `6.2.3` - IndexedDB mock for tests

### Code Quality
- **ESLint** `9.36.0` - Linting for code quality
  - Core: `@eslint/js` `9.36.0`
  - React: `eslint-plugin-react` `7.37.5`
  - Hooks: `eslint-plugin-react-hooks` `5.2.0`
  - Refresh: `eslint-plugin-react-refresh` `0.4.22`
  - Prettier: `eslint-plugin-prettier` `5.5.4`
  - Config: `eslint-config-prettier` `10.1.8`
  - Globals: `globals` `16.4.0`

- **Prettier** `3.6.2` - Code formatting
  - Config: `.prettierrc`
  - Integration: ESLint plugin

---

## Node.js Environment

### Requirements
- **Node.js:** 18+ (recommended: 20+)
- **npm:** 9+ (comes with Node 18+)
- **Package Manager:** npm (not yarn or pnpm)

### Environment
- **Type:** `"module"` (ES modules)
- **Private:** `true` (not published to npm)

---

## Build Configuration

### Vite (`vite.config.ts`)
```typescript
{
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    hmr: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist'
  }
}
```

### TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind (`tailwind.config.js`)
- Version: 4.1.14 (latest)
- Mode: JIT compiler
- Content: `src/**/*.{ts,tsx}`
- Custom theme: Lumara brand colors

---

## Browser Compatibility

### Target Browsers
- **Chrome:** 90+ (required for Chrome AI features)
- **Chrome Canary/Dev:** Latest (for Gemini Nano)
- **Firefox:** 88+ (limited AI features)
- **Safari:** 14+ (limited AI features)
- **Edge:** 90+ (Chromium-based)

### Required Web APIs
- **IndexedDB:** For data persistence
- **Web Workers:** For background processing
- **WebGPU:** For AI acceleration (Chrome AI)
- **Cache API:** For model caching
- **Crypto API:** For hashing and security

---

## AI System Dependencies

### Chrome AI (Gemini Nano)
- **Origin Trial Token:** Required in `index.html`
- **Expiry:** March 2026
- **Browser:** Chrome Canary/Dev 130+
- **Status:** Experimental (origin trial)

### Transformers.js
- **Model:** `Xenova/all-MiniLM-L6-v2`
- **Size:** ~23MB
- **Cache:** Browser Cache API + IndexedDB
- **Performance:** <100ms after initial load
- **Quality:** Suitable for semantic similarity

---

## Performance Targets

### Build Performance
- **Dev Server Startup:** <2s
- **HMR Update:** <100ms
- **Production Build:** <10s
- **Test Suite:** <20s

### Runtime Performance
- **First Paint:** <1s
- **Time to Interactive:** <2s
- **Bundle Size:** <500KB (gzipped)
- **Memory Usage:** <100MB baseline

### AI Performance
- **Embedding Generation:** <100ms (cached model)
- **Similarity Search:** <50ms for 1000 memories
- **Chat Response:** <2s
- **Model Load:** <30s (one-time)

---

## Development Tools

### Debugging
- **React DevTools:** Browser extension
- **Zustand DevTools:** Redux DevTools integration
- **TanStack Query DevTools:** Built-in component
- **Vite DevTools:** HMR overlay

### Testing
- **Vitest UI:** `npm run test:ui`
- **Coverage Reports:** `npm run test:coverage`
- **Watch Mode:** `npm test`

---

## Scripts Reference

```json
{
  "dev": "vite",                      // Dev server with HMR
  "build": "tsc -b && vite build",    // Type check + build
  "test": "vitest",                   // Run tests in watch mode
  "test:ui": "vitest --ui",           // Visual test runner
  "test:run": "vitest run",           // Run tests once
  "test:coverage": "vitest run --coverage",  // Coverage report
  "lint": "eslint . --ext ts,tsx",    // Check for issues
  "lint:fix": "eslint . --ext ts,tsx --fix",  // Auto-fix issues
  "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,css,md}\"",
  "preview": "vite preview"           // Preview production build
}
```

---

## Dependency Management

### Update Policy
- **Major versions:** Evaluate breaking changes
- **Minor versions:** Safe to update
- **Patches:** Auto-update weekly

### Lock File
- **File:** `package-lock.json`
- **Commit:** Always committed to git
- **Integrity:** Verified on CI

### Security
- **Audit:** Run `npm audit` regularly
- **Updates:** Monitor Dependabot alerts
- **Patches:** Apply security patches immediately

---

## Environment Variables

### Vite Environment
- **Development:** Automatic from Vite
- **Production:** Set `NODE_ENV=production`

### Custom Variables
- Prefix: `VITE_` for client-side access
- Location: `.env` files (not committed)
- Example: `VITE_API_URL=https://api.example.com`

---

## Integration Points

### External Services
- **GitHub:** Source control and CI/CD
- **Chrome AI Origin Trial:** AI provider
- **Hugging Face:** Model CDN for Transformers.js

### APIs Used
- **Chrome AI Prompt API:** `window.ai` (experimental)
- **IndexedDB API:** Via Dexie wrapper
- **Cache API:** For model storage

---

## Future Dependencies (Planned)

### Next Epic (Understanding Evolution)
- No new dependencies expected
- Uses existing React, TypeScript, Dexie stack

### Memory Architecture (Phase 2)
- Potential: Additional animation libraries
- Potential: Chart/visualization libraries

### Provider Expansion (v2-v4)
- **Gemini API SDK:** For cloud fallback
- **OpenAI SDK:** Alternative provider
- **Anthropic SDK:** Claude integration
- **LM Studio Client:** Local model support

---

## Known Issues & Workarounds

### Zustand + React 19
- **Issue:** Infinite loops with selectors
- **Fix:** Use `useShallow` from `zustand/shallow`
- **Location:** All Zustand hooks

### Dexie v4 Import
- **Issue:** Import syntax changed in v4
- **Fix:** Use named imports: `import { Dexie } from 'dexie'`
- **Status:** Fixed in codebase

### Vitest + IndexedDB
- **Issue:** Real IndexedDB not available in tests
- **Fix:** Use `fake-indexeddb` mock
- **Location:** `vitest.config.ts` setup

---

## Development Environment Setup

### Prerequisites
```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 9+
```

### Installation
```bash
# Install all dependencies
npm install

# Verify installation
npm run build    # Should succeed
npm test        # Should run tests
```

### IDE Setup (Recommended)
- **VS Code Extensions:**
  - ESLint
  - Prettier
  - TypeScript Vue Plugin (Volar)
  - Tailwind CSS IntelliSense

---

**Last Updated:** 2025-10-14T16:58:14Z
