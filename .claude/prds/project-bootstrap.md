---
name: project-bootstrap
description: Set up front-end development infrastructure - zero features, just tooling
status: backlog
created: 2025-10-13T19:17:23Z
---

# PRD: project-bootstrap

## Executive Summary

Bootstrap the **development infrastructure only** for Lumara's front-end POC. This PRD covers package.json, folder structure, tooling, and configuration - **no product features**.

**What This Includes**: npm packages, TypeScript config, dev server, project structure, design tokens, base components (Button, Card)

**What This Does NOT Include**: Understanding evolution, contradiction detection, memory UI, or any actual product features (those get separate PRDs)

**Goal**: Developer can run `npm install && npm run dev` and start building features immediately.

---

## Problem Statement

### What problem are we solving?

The codebase is completely empty - no package.json, no src/, no configuration. We need foundational infrastructure before any feature work can begin.

### Why is this important now?

Without this setup:
- ❌ Can't write TypeScript
- ❌ Can't render React components
- ❌ Can't persist data
- ❌ Can't start feature development

### What this is NOT

This is **NOT** about building product features. This is purely infrastructure. Think of it as "make the kitchen work" before "cook the meal."

---

## User Stories

### Primary Persona: Developer Building Lumara Features

**As a** developer who will implement understanding evolution,
**I want** a fully configured development environment,
**So that** I can start coding features without fighting with webpack configs.

**Acceptance Criteria:**
- ✅ Run `npm install` - everything installs
- ✅ Run `npm run dev` - dev server starts
- ✅ Edit a component - HMR works instantly
- ✅ Write TypeScript - types validate correctly
- ✅ Save data to IndexedDB - persists on refresh
- ✅ Import from `@/components/Button` - path aliases work

**As a** developer implementing the memory UI,
**I want** state management and data layer ready,
**So that** I can focus on product logic, not infrastructure.

**Acceptance Criteria:**
- ✅ Zustand configured for global state
- ✅ TanStack Query set up for data fetching
- ✅ IndexedDB service with basic CRUD operations
- ✅ Example showing how to use each tool

---

## Requirements

### Functional Requirements

#### FR1: Package Management
- **FR1.1**: Create package.json with all dependencies
- **FR1.2**: Lock dependency versions
- **FR1.3**: Define npm scripts (dev, build, type-check, lint)
- **FR1.4**: Document what each dependency does

#### FR2: Build System
- **FR2.1**: Configure Vite 6 with React plugin
- **FR2.2**: Set up TypeScript compilation
- **FR2.3**: Configure path aliases (`@/*`)
- **FR2.4**: Enable hot module replacement
- **FR2.5**: Production build optimization

#### FR3: Project Structure
Create organized folders:
```
src/
├── components/      # React components
│   ├── ui/         # Base components (Button, Card, Input)
│   └── layout/     # Layout shells
├── lib/            # Core libraries
│   ├── db.ts       # IndexedDB setup (Dexie)
│   ├── store.ts    # Zustand store setup
│   └── query.ts    # TanStack Query config
├── hooks/          # Custom React hooks
├── types/          # TypeScript definitions
├── styles/         # Global CSS and design tokens
├── utils/          # Helper functions
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

#### FR4: TypeScript Configuration
- **FR4.1**: Strict mode enabled
- **FR4.2**: Path aliases configured
- **FR4.3**: React types included
- **FR4.4**: No implicit any

#### FR5: Data Persistence Layer
- **FR5.1**: Install Dexie.js (IndexedDB wrapper)
- **FR5.2**: Create database connection file (`lib/db.ts`)
- **FR5.3**: Define basic schema (can be empty tables)
- **FR5.4**: Export typed database instance

#### FR6: State Management
- **FR6.1**: Install Zustand
- **FR6.2**: Create store setup file (`lib/store.ts`)
- **FR6.3**: Example slice showing pattern
- **FR6.4**: TypeScript integration

#### FR7: Data Fetching Layer
- **FR7.1**: Install TanStack Query
- **FR7.2**: Configure QueryClient (`lib/query.ts`)
- **FR7.3**: Wrap App with QueryClientProvider
- **FR7.4**: Example query hook

#### FR8: Styling System
- **FR8.1**: Install Tailwind CSS
- **FR8.2**: Configure design tokens in `tailwind.config.js`:
  - Colors: Indigo-Violet gradient (#6366F1 → #8B5CF6)
  - Dark background (#0A0E1A)
  - Typography: Inter (UI), SF Mono (code)
- **FR8.3**: Create global styles file
- **FR8.4**: Dark mode as default

#### FR9: Animation Libraries
- **FR9.1**: Install Framer Motion (component animations)
- **FR9.2**: Install GSAP (timeline animations)
- **FR9.3**: Basic animation example

#### FR10: Development Tools
- **FR10.1**: ESLint configuration
- **FR10.2**: Prettier configuration
- **FR10.3**: ESLint + Prettier integration
- **FR10.4**: Editor config (.vscode/settings.json)

#### FR11: Base UI Components
Create minimal starter components to validate setup:
- **FR11.1**: `Button` - Just a styled button, no business logic
- **FR11.2**: `Card` - Container component
- **FR11.3**: `Input` - Form input
- **FR11.4**: Show all three in dev mode to confirm setup works

#### FR12: Documentation
- **FR12.1**: README.md with setup instructions
- **FR12.2**: DEVELOPMENT.md with:
  - How to use Zustand
  - How to use TanStack Query
  - How to use IndexedDB
  - Project structure explanation
- **FR12.3**: Comment examples in code

---

### Non-Functional Requirements

#### NFR1: Developer Experience
- **NFR1.1**: `npm run dev` starts in < 5 seconds
- **NFR1.2**: HMR updates in < 500ms
- **NFR1.3**: TypeScript errors show in terminal and IDE
- **NFR1.4**: Clear error messages

#### NFR2: Performance Baselines
- **NFR2.1**: Initial JS bundle < 200KB (gzipped)
- **NFR2.2**: Dev server boots quickly
- **NFR2.3**: No console errors on load

#### NFR3: Code Quality
- **NFR3.1**: ESLint catches common mistakes
- **NFR3.2**: Prettier formats consistently
- **NFR3.3**: TypeScript strict mode enforced
- **NFR3.4**: No `any` types without comment

#### NFR4: Browser Support
- **NFR4.1**: Modern browsers only (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **NFR4.2**: IndexedDB support required
- **NFR4.3**: No IE11 support

---

## Success Criteria

### Technical Validation

**Installation Test:**
```bash
npm install
# ✅ No errors, all packages installed
```

**Development Test:**
```bash
npm run dev
# ✅ Server starts at http://localhost:5173
# ✅ Page loads with "Hello Lumara" or similar
# ✅ No console errors
```

**Type Check Test:**
```bash
npm run type-check
# ✅ 0 TypeScript errors
```

**Build Test:**
```bash
npm run build
# ✅ Builds successfully
# ✅ dist/ folder created
```

**Component Test:**
- ✅ Button renders on screen
- ✅ Button has Tailwind styles applied
- ✅ Edit Button.tsx, see HMR update

**Data Test:**
- ✅ Open IndexedDB in browser devtools
- ✅ Database exists
- ✅ Can write/read data

**State Test:**
- ✅ Zustand store defined
- ✅ Can update state, component re-renders

### Definition of Done

- [ ] All dependencies in package.json
- [ ] package-lock.json committed
- [ ] Development server runs without errors
- [ ] TypeScript compiles without errors
- [ ] ESLint and Prettier configured
- [ ] Project structure created with all folders
- [ ] Dexie database connection works
- [ ] Zustand store example works
- [ ] TanStack Query example works
- [ ] Tailwind configured with design tokens
- [ ] Base components render correctly
- [ ] README.md and DEVELOPMENT.md written
- [ ] Can build for production
- [ ] Git initialized with proper .gitignore

---

## Technology Stack

### Core Framework
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.3.0"
}
```

### Build & Dev Tools
```json
{
  "vite": "^6.0.0",
  "@vitejs/plugin-react": "^4.0.0"
}
```

### State Management & Data
```json
{
  "zustand": "^4.5.0",                    // Global state
  "@tanstack/react-query": "^5.0.0",     // Data fetching layer
  "dexie": "^4.0.0",                      // IndexedDB wrapper
  "dexie-react-hooks": "^1.1.0"
}
```

### Routing
```json
{
  "react-router-dom": "^6.0.0"
}
```

### Styling
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

### Animation
```json
{
  "framer-motion": "^11.0.0",            // Component animations
  "gsap": "^3.12.0"                       // Timeline animations
}
```

### Utilities
```json
{
  "date-fns": "^3.0.0",                  // Date handling
  "lucide-react": "^0.300.0"             // Icons
}
```

### Dev Tools
```json
{
  "eslint": "^8.0.0",
  "@typescript-eslint/parser": "^6.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "prettier": "^3.1.0",
  "eslint-config-prettier": "^9.1.0"
}
```

### Why These Choices?

**Zustand** - Simple, powerful state management. Perfect for working memory (7±2 items), evolution state.

**TanStack Query** - Even for local data! Provides caching, optimistic updates, background refetching over IndexedDB.

**Dexie.js** - Makes IndexedDB bearable. Your docs already mention it.

**GSAP + Framer Motion** - Framer for simple stuff, GSAP for complex evolution timeline animations.

**Tailwind** - Fast prototyping. Can switch to CSS Modules later if custom viz gets complex.

---

## Out of Scope

### ❌ Not in This PRD

**Product Features:**
- Understanding evolution timeline (separate PRD)
- Contradiction detection (separate PRD)
- Memory psychology UI (separate PRD)
- AI service integration (separate PRD)
- Working memory component (separate PRD)
- Any actual user-facing functionality

**Advanced Infrastructure:**
- Unit testing setup (defer to feature PRDs)
- E2E testing beyond MCP tools
- CI/CD pipelines
- Deployment configuration
- Environment variables management
- Error tracking services
- Analytics integration

**Backend Concerns:**
- API server
- Authentication
- Database server
- Cloud storage

### Why Deferred?

These are deferred because:
1. **Focus**: Get infrastructure working first
2. **Speed**: Each adds complexity and time
3. **Validation**: Many depend on feature decisions
4. **Iteration**: Add incrementally as needed

---

## Implementation Plan

### Phase 1: Foundation (Day 1)

**Morning: Project Initialization**
1. `npm init -y`
2. Install core: React 19, TypeScript, Vite
3. Configure `vite.config.ts`
4. Configure `tsconfig.json`
5. Create folder structure
6. Git init + .gitignore

**Afternoon: Development Tools**
1. Install ESLint + Prettier
2. Configure both
3. Set up editor config
4. Test linting + formatting
5. Document setup in README

**Validation:** Can start dev server, see React app

---

### Phase 2: Data & State (Day 2)

**Morning: Data Persistence**
1. Install Dexie.js
2. Create `lib/db.ts`
3. Define basic schema (empty tables for now)
4. Test IndexedDB connection
5. Document usage

**Afternoon: State & Data Fetching**
1. Install Zustand
2. Create `lib/store.ts` with example slice
3. Install TanStack Query
4. Create `lib/query.ts`
5. Wrap app with providers
6. Create example hook
7. Document patterns

**Validation:** Can read/write IndexedDB, update Zustand state, see re-renders

---

### Phase 3: Styling & UI (Day 3)

**Morning: Design System**
1. Install Tailwind
2. Configure `tailwind.config.js` with:
   - Brand colors
   - Typography
   - Dark mode
3. Create global styles
4. Test Tailwind classes work

**Afternoon: Base Components**
1. Create `components/ui/Button.tsx`
2. Create `components/ui/Card.tsx`
3. Create `components/ui/Input.tsx`
4. Render all three in App.tsx
5. Test HMR with edits
6. Document component patterns

**Validation:** All components render with Tailwind styles

---

### Phase 4: Animation & Polish (Day 4)

**Morning: Animation Setup**
1. Install Framer Motion + GSAP
2. Add simple animation to Button (Framer)
3. Create GSAP example
4. Document when to use which

**Afternoon: Documentation**
1. Write comprehensive README.md
2. Write DEVELOPMENT.md:
   - How to use Zustand
   - How to use TanStack Query
   - How to use Dexie
   - Component patterns
   - File organization
3. Add code comments
4. Final testing

**Validation:** New developer can clone, read docs, start coding

---

### Phase 5: Validation (Day 5)

**Full Stack Test:**
1. Fresh clone to new folder
2. Follow README instructions
3. Run all npm scripts
4. Test all features
5. Fix any issues
6. Update docs

**Deliverables Checklist:**
- [ ] Code compiles
- [ ] Dev server runs
- [ ] All base components work
- [ ] IndexedDB stores data
- [ ] Zustand state updates
- [ ] TanStack Query works
- [ ] Tailwind styles apply
- [ ] Animations work
- [ ] README complete
- [ ] DEVELOPMENT.md complete
- [ ] Production build succeeds

---

## Constraints & Assumptions

### Constraints

**Technical:**
- Front-end only (no backend in POC)
- Modern browsers only (no legacy support)
- Local storage only (IndexedDB)

**Timeline:**
- Must complete in 5 days max
- Should be simple enough to not need debugging

**Scope:**
- Infrastructure ONLY
- No product features

### Assumptions

**Technical:**
- Users have Node.js 18+
- Users have modern browsers
- IndexedDB available

**Product:**
- Features will be built after this
- Docs in docs/ are current
- Stack choices are final for POC

---

## Dependencies

### External Dependencies

**Runtime Dependencies:** Listed in Technology Stack section above

**Documentation Dependencies:**
- `docs/UI_UX_SPECIFICATIONS.md` - Design tokens
- `docs/MEMORY_PSYCHOLOGY_ARCHITECTURE.md` - Data model hints
- `docs/PERSONAL_TRUTH_STRATEGY.md` - Architecture simplicity

### Team Dependencies

**None** - This is purely infrastructure setup.

---

## Risks & Mitigation

### High Risk

**Risk:** Complexity creep - adding "just one more thing"
**Impact:** High - Delays feature development
**Mitigation:**
- Strict scope adherence
- 5-day time box
- Defer everything not critical

### Medium Risk

**Risk:** Configuration issues block development
**Impact:** Medium - Frustrating but fixable
**Mitigation:**
- Start with official templates
- Document every config decision
- Test on fresh install

### Low Risk

**Risk:** Dependency conflicts
**Impact:** Low - Usually resolvable
**Mitigation:**
- Lock versions in package.json
- Test before committing

---

## Post-Bootstrap: Next Steps

Once this PRD is complete, create these feature PRDs:

**Week 2-3:**
- `/pm:prd-new working-memory-ui` - The 7±2 sidebar
- `/pm:prd-new understanding-evolution` - The killer feature

**Week 4:**
- `/pm:prd-new contradiction-detection` - Core differentiation
- `/pm:prd-new chat-interface` - Main conversation view

**Month 2:**
- Memory psychology views
- Pattern discovery
- Confidence visualization

---

## Appendix

### Final Folder Structure

```
lumara-frontend/
├── .claude/
│   ├── prds/
│   │   └── project-bootstrap.md
│   └── settings.local.json
├── docs/                          # Product docs (existing)
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   └── layout/
│   │       └── RootLayout.tsx
│   ├── lib/
│   │   ├── db.ts                 # Dexie setup
│   │   ├── store.ts              # Zustand store
│   │   └── query.ts              # TanStack Query config
│   ├── hooks/
│   │   └── useExample.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── cn.ts                 # Class name helper
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── README.md
└── DEVELOPMENT.md
```

### Key Configuration Files

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\""
  }
}
```

**tsconfig.json highlights:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Success Definition

**This PRD is successful when:**

✅ A new developer can:
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`
4. See a working React app
5. Edit a component and see HMR
6. Write TypeScript with no errors
7. Use Zustand, TanStack Query, Dexie
8. Read docs and understand everything

✅ Feature development can begin:
1. No "I need to configure X first"
2. No "How do I set up Y?"
3. Focus purely on product features

**That's it. Infrastructure done. Features next.** 🚀

---

**Ready to implement?** Run: `/pm:prd-parse project-bootstrap`
