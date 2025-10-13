# Lumara - Your Metacognitive AI Partner

Lumara is a metacognitive AI partner designed to help you build personal truth through tracking how your understanding evolves over time. Unlike traditional knowledge tools that store what sources say, Lumara tracks how *you* interpret and reinterpret information, helping you discover what truly works for you.

## What Makes Lumara Different

**Three Types of Truth:**
- **External Truth** (what sources say) - ChatGPT/Claude do this
- **Collective Truth** (what documents reveal) - Tools like Supermemory do this
- **Personal Truth** (what works for YOU) - **Only Lumara does this**

Lumara tracks your understanding evolution:
```
January: "Coach said continental grip"
         You understood: "For all serves"
         Tested: 40% success

February: "Coach said continental grip"
          You understood: "Only for flat serves"
          Tested: 70% success

March: "Coach said continental grip"
       You understood: "It's about wrist angle"
       Tested: 85% success

Your Personal Truth: Context-dependent technique
```

**The source didn't change. Your understanding evolved. Lumara tracks that.**

## Features

- **Understanding Evolution**: Track how your interpretation of information changes over time
- **Local-First Architecture**: All data stored locally with offline support via IndexedDB
- **Memory Psychology**: UI organized around how human memory actually works (Working → Episodic → Semantic → Procedural)
- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **Smooth Animations**: Framer Motion and GSAP for delightful interactions
- **Type-Safe**: Full TypeScript coverage with strict mode
- **Real-Time State**: Zustand for global state, TanStack Query for server state

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/tgarrochinho/lumara-frontend.git
cd lumara-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot module replacement
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The dev server will automatically open the browser for you.

### Build for Production

```bash
# Type check and build
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server with HMR on port 5173 |
| `npm run build` | Type check with TypeScript and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check for code quality issues |
| `npm run lint:fix` | Run ESLint and automatically fix issues |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check if files are formatted correctly (useful for CI) |

## Project Structure

```
lumara-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components (Button, Card, Input)
│   │   ├── QueryTest.tsx    # TanStack Query demo
│   │   ├── StoreTest.tsx    # Zustand store demo
│   │   └── DexieTest.tsx    # Dexie database demo
│   ├── lib/                 # Core libraries
│   │   ├── store.ts         # Zustand state management
│   │   ├── db.ts            # Dexie IndexedDB configuration
│   │   └── query.ts         # TanStack Query client setup
│   ├── hooks/               # Custom React hooks
│   │   └── useExampleQuery.ts
│   ├── utils/               # Utility functions
│   │   └── cn.ts            # className merging utility
│   ├── styles/              # Global styles
│   │   └── globals.css      # Tailwind directives and global CSS
│   ├── features/            # Feature-specific components (coming soon)
│   ├── types/               # TypeScript type definitions
│   └── assets/              # Static assets
├── .claude/                 # Claude Code configuration and MCP tools
├── docs/                    # Product specifications and planning
├── public/                  # Static public assets
└── dist/                    # Production build output (generated)
```

## Technology Stack

### Core
- **Frontend Framework**: [React 19](https://react.dev/) - Latest React with improved hooks and concurrent features
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) - Type safety and enhanced developer experience
- **Build Tool**: [Vite 7](https://vitejs.dev/) - Lightning-fast HMR and optimized builds

### Styling
- **CSS Framework**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS with custom brand design tokens
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/) + [GSAP 3](https://greensock.com/gsap/) - Smooth, performant animations

### State Management
- **Client State**: [Zustand 5](https://github.com/pmndrs/zustand) - Minimal, hook-based state management
- **Server State**: [TanStack Query 5](https://tanstack.com/query/) - Async state management with caching
- **Database**: [Dexie 4](https://dexie.org/) - IndexedDB wrapper for local-first data persistence

### Code Quality
- **Linting**: [ESLint 9](https://eslint.org/) - Code quality and best practices
- **Formatting**: [Prettier 3](https://prettier.io/) - Consistent code formatting
- **Type Checking**: TypeScript strict mode with comprehensive compiler options

## Development Features

- **Hot Module Replacement (HMR)**: Instant updates during development
- **Path Aliases**: Use `@/*` imports for cleaner imports (e.g., `@/components/ui/Button`)
- **Redux DevTools**: Zustand store integration for debugging
- **React Query DevTools**: Visual debugging for server state
- **Source Maps**: Full source maps in production builds for debugging

## Learn More

For detailed development guidelines, architecture overview, and code patterns, see [DEVELOPMENT.md](./DEVELOPMENT.md).

### Documentation
- [Product Vision & Planning](./docs/) - Product specifications and strategic decisions
- [MCP Tools Guide](./MCP_TOOLS.md) - Browser automation and testing tools
- [Claude Code Config](./CLAUDE.md) - Development workflow with Claude

### External Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TanStack Query Documentation](https://tanstack.com/query/)
- [Dexie.js Documentation](https://dexie.org/)

## Contributing

This project is in active development. Contributions, issues, and feature requests are welcome!

## License

This project is part of the Lumara ecosystem.

---

**Built with modern web technologies for a local-first, privacy-focused experience.**
