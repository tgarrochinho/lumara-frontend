---
created: 2025-10-14T16:58:14Z
last_updated: 2025-10-14T16:58:14Z
version: 1.0
author: Claude Code PM System
---

# Project Structure & Organization

## Root Directory

```
lumara-frontend/
├── .claude/                 # CCPM project management system
├── docs/                    # Product specifications & planning
├── src/                     # Source code
├── public/                  # Static assets
├── dist/                    # Production build (generated)
├── node_modules/            # Dependencies (gitignored)
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── eslint.config.js         # ESLint rules
├── .prettierrc              # Prettier formatting rules
└── README.md                # Project documentation
```

---

## `.claude/` - CCPM Project Management

**Purpose:** Claude Code Project Management (CCPM) system for organizing epics, tasks, and parallel agent execution.

```
.claude/
├── commands/                # Slash commands
│   ├── pm/                 # /pm:* project management commands
│   │   ├── prd-new.md
│   │   ├── prd-list.md
│   │   ├── prd-parse.md
│   │   ├── epic-decompose.md
│   │   ├── epic-start.md
│   │   └── github-sync.md
│   └── context/            # /context:* commands
│
├── context/                 # Agent context documentation
│   ├── README.md           # Context usage guidelines
│   ├── project-state.md    # Current state (main reference)
│   ├── progress.md         # Current progress & status
│   ├── project-structure.md # This file
│   ├── tech-context.md     # Technologies & dependencies
│   ├── system-patterns.md  # Architecture patterns
│   ├── product-context.md  # Product requirements
│   ├── project-brief.md    # Project scope & goals
│   ├── project-overview.md # Features & capabilities
│   ├── project-vision.md   # Long-term strategy
│   └── project-style-guide.md # Coding standards
│
├── docs/                    # CCPM documentation
│   ├── parallel-execution-safeguards.md
│   └── [other workflow docs]
│
├── epics/                   # Epic task breakdown
│   ├── project-bootstrap/
│   │   ├── epic.md         # Epic definition
│   │   ├── 3.md, 4.md...   # Individual tasks
│   │   ├── github-mapping.md # GitHub issue mapping
│   │   ├── execution-status.md
│   │   └── updates/        # Task progress updates
│   │
│   └── ai-foundation-setup/
│       ├── epic.md
│       ├── 15.md, 16.md... # Tasks 15-28
│       ├── EPIC-COMPLETE.md # Completion summary
│       ├── github-mapping.md
│       └── updates/
│
├── prds/                    # Product requirement documents
│   ├── project-bootstrap.md (implemented)
│   └── ai-foundation-setup.md (implemented)
│
└── scripts/                 # CCPM automation scripts
    ├── cleanup-dev-servers.sh
    └── pm/                 # PM command implementations
        ├── prd-list.sh
        ├── prd-new.sh
        └── [other scripts]
```

**Key Files:**
- `context/project-state.md` - **PRIMARY** reference for all agents
- `epics/[epic-name]/epic.md` - Epic definition with task breakdown
- `prds/[name].md` - Product requirements driving epics

---

## `docs/` - Product Planning

**Purpose:** Strategic product documentation and specifications.

```
docs/
├── PRODUCT_DEFINITION_COMPLETE.md  # Complete product spec
├── UNDERSTANDING_EVOLUTION_MVP.md  # Killer feature definition
├── MEMORY_IMPLEMENTATION_PLAN.md   # 20-day roadmap
├── MEMORY_ARCHITECTURE.md          # Memory psychology model
├── CORE_FEATURES.md                # Must-preserve features
├── UI_UX_SPECIFICATIONS.md         # UI/UX design specs
├── DIGITAL_GARDEN_UI_DESIGN.md     # UI concept exploration
├── LUMARA_BRAND_GUIDELINES.md      # Brand identity
├── ONBOARDING_COLD_START_STRATEGY.md
├── COMPETITIVE_REALITY_CHECK.md
├── DECISION_MATRIX.md
└── [22 more planning documents]
```

**Essential Reads:**
- `PRODUCT_DEFINITION_COMPLETE.md` - Overall product vision
- `UNDERSTANDING_EVOLUTION_MVP.md` - Next epic to build
- `CORE_FEATURES.md` - Features that must be preserved

---

## `src/` - Source Code

### Top Level

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Root component
├── App.css                  # Root component styles
├── index.css                # Global styles & Tailwind
├── components/              # React components
├── lib/                     # Core libraries
├── hooks/                   # Custom React hooks
├── features/                # Feature-specific code
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
├── assets/                  # Static assets (images, icons)
├── styles/                  # Additional style files
└── test/                    # Test utilities & setup
```

---

### `src/components/` - React Components

**Organization:** UI components and domain-specific components

```
components/
├── ui/                      # Base UI components (shadcn/ui style)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── [other base components]
│
├── DexieTest.tsx            # Dexie database demo
├── QueryTest.tsx            # TanStack Query demo
├── StoreTest.tsx            # Zustand store demo
└── [feature components]     # Feature-specific components
```

**Pattern:** Components are self-contained with co-located styles when needed.

---

### `src/lib/` - Core Libraries

**Purpose:** Shared libraries and core functionality.

```
lib/
├── ai/                      # AI system (FOUNDATION COMPLETE ✅)
│   ├── types.ts            # AIProvider interface & types
│   ├── registry.ts         # Provider registry & selection
│   ├── performance.ts      # Performance monitoring
│   ├── error-handler.ts    # Error handling & retry logic
│   ├── health-monitor.ts   # Health monitoring system
│   │
│   ├── providers/          # AI provider implementations
│   │   ├── base.ts        # BaseProvider abstract class
│   │   ├── chrome-ai.ts   # Chrome Gemini Nano provider
│   │   └── mock.ts        # Mock provider (testing)
│   │
│   ├── embeddings/         # Embedding generation
│   │   ├── types.ts       # Embedding types
│   │   ├── transformers.ts # Transformers.js integration
│   │   ├── cache.ts       # IndexedDB embedding cache
│   │   └── index.ts       # Public API
│   │
│   ├── utils/              # AI utilities
│   │   ├── similarity.ts   # Cosine similarity & search
│   │   ├── contradiction.ts # Contradiction detection
│   │   ├── vector-math.ts  # Vector operations
│   │   └── progress.ts     # Progress tracking
│   │
│   └── __tests__/          # Comprehensive AI tests (607 tests ✅)
│       ├── providers.test.ts
│       ├── embeddings.test.ts
│       ├── similarity.test.ts
│       ├── contradiction.test.ts
│       ├── cache.test.ts
│       ├── error-handler.test.ts
│       ├── integration.test.ts
│       └── performance.test.ts
│
├── db.ts                    # Dexie IndexedDB configuration
├── store.ts                 # Zustand state management
├── query.ts                 # TanStack Query client
└── [future libraries]
```

**Key Subsystem:** `lib/ai/` is the most important subsystem, providing all AI capabilities.

---

### `src/hooks/` - Custom React Hooks

**Purpose:** Reusable React hooks for state and side effects.

```
hooks/
├── useExampleQuery.ts       # TanStack Query example
└── [future hooks]           # More hooks as features develop
```

**Pattern:** One hook per file, prefixed with `use`.

---

### `src/features/` - Feature Modules

**Purpose:** Feature-specific code organized by domain.

```
features/
└── [placeholder]            # Features will be added here
```

**Future Structure:**
```
features/
├── memories/                # Memory management feature
├── evolution/               # Understanding evolution feature
├── contradictions/          # Contradiction detection UI
└── playbooks/               # Living playbooks feature
```

---

### `src/types/` - TypeScript Types

**Purpose:** Shared TypeScript type definitions.

```
types/
└── [global types]           # Shared types across features
```

---

### `src/utils/` - Utility Functions

**Purpose:** Pure utility functions used across the app.

```
utils/
├── cn.ts                    # className merging (clsx + tailwind-merge)
└── [future utilities]
```

---

### `src/test/` - Test Utilities

**Purpose:** Test setup and shared test utilities.

```
test/
├── setup.ts                 # Vitest setup
└── helpers/                 # Test helper functions
```

---

## File Naming Conventions

### Components
- **PascalCase** for component files: `Button.tsx`, `MemoryCard.tsx`
- Match component name to file name
- Use `.tsx` for components with JSX

### Modules & Utilities
- **kebab-case** for non-component files: `vector-math.ts`, `error-handler.ts`
- **camelCase** for functions: `cosineSimilarity()`, `generateEmbedding()`
- Use `.ts` for pure TypeScript

### Tests
- **Same name as tested file** with `.test.ts` suffix
- Located in `__tests__/` directory near source
- Example: `similarity.ts` → `__tests__/similarity.test.ts`

### Documentation
- **SCREAMING_CASE** for important docs: `README.md`, `CORE_FEATURES.md`
- **kebab-case** for regular docs: `parallel-execution-safeguards.md`

---

## Import Path Aliases

**Configured in `vite.config.ts` and `tsconfig.json`:**

```typescript
@/              → src/
@/components    → src/components
@/lib           → src/lib
@/hooks         → src/hooks
@/utils         → src/utils
@/types         → src/types
@/styles        → src/styles
```

**Example:**
```typescript
// Instead of:
import { cn } from '../../utils/cn'

// Use:
import { cn } from '@/utils/cn'
```

---

## Module Organization Principles

1. **Colocation:** Keep related files close together
2. **Feature-Based:** Organize by feature, not file type
3. **Clear Boundaries:** Public API in `index.ts` files
4. **Test Proximity:** Tests in `__tests__/` near source
5. **Single Responsibility:** One concern per file

---

## Build Output

### Development
- **Dev Server:** Port 5173
- **Hot Module Replacement:** Instant updates
- **Source Maps:** Full source maps for debugging

### Production (`dist/`)
```
dist/
├── assets/                  # Bundled JS, CSS, assets
│   ├── index-[hash].js     # Main bundle
│   ├── index-[hash].css    # Bundled styles
│   └── [other assets]
├── index.html               # Entry HTML
└── [static files]
```

**Optimization:**
- Code splitting enabled
- Tree shaking active
- Minification on
- Asset hashing for cache busting

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.ts` | Vite build & dev server |
| `tailwind.config.js` | Tailwind CSS customization |
| `eslint.config.js` | Code quality rules |
| `.prettierrc` | Code formatting rules |
| `vitest.config.ts` | Test configuration |

---

## Key Takeaways for Agents

1. **Start with context:** Always read `.claude/context/project-state.md` first
2. **Check test files:** Tests show how to use existing code
3. **Follow patterns:** Look at existing code before creating new patterns
4. **Use path aliases:** Import with `@/` not relative paths
5. **Collocate tests:** Tests go in `__tests__/` near source
6. **Document epics:** Update `.claude/epics/` as you work

---

**Last Updated:** 2025-10-14T16:58:14Z
