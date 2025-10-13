---
name: project-bootstrap
status: backlog
created: 2025-10-13T19:36:38Z
progress: 0%
prd: .claude/prds/project-bootstrap.md
github: https://github.com/tgarrochinho/lumara-frontend/issues/2
---

# Epic: project-bootstrap

## Overview

Establish zero-to-running development infrastructure for Lumara front-end POC. This epic delivers a fully configured React 19 + TypeScript + Vite environment with state management (Zustand), data layer (TanStack Query + Dexie), styling (Tailwind), and animation libraries (Framer Motion + GSAP). Goal: `npm install && npm run dev` works, developer can immediately build features.

**Critical Success Metric**: New developer starts coding features in < 10 minutes.

---

## Architecture Decisions

### 1. Build System: Vite 6
**Decision**: Use Vite instead of Create React App or custom Webpack
**Rationale**:
- Lightning-fast HMR (< 500ms)
- Native ESM support
- Simple configuration
- Industry standard for modern React

### 2. State Management: Zustand
**Decision**: Zustand over Redux, Context API, or Jotai
**Rationale**:
- Minimal boilerplate (perfect for POC)
- TypeScript-first design
- No provider hell
- Future features need global state (working memory 7±2 items, evolution tracking)

### 3. Data Layer: TanStack Query + Dexie
**Decision**: Abstract IndexedDB with TanStack Query caching layer
**Rationale**:
- TanStack Query provides caching, optimistic updates even for local data
- Dexie makes IndexedDB bearable (mentioned in product docs)
- Separates data fetching from UI concerns
- Smooth UX without backend

### 4. Styling: Tailwind CSS
**Decision**: Tailwind over CSS Modules or styled-components
**Rationale**:
- Fast prototyping for POC
- Design tokens (brand colors) easily configured
- Utility-first matches component-based React
- Can migrate to CSS Modules later if custom visualizations need it

### 5. Animation: Dual Library Approach
**Decision**: Framer Motion + GSAP
**Rationale**:
- Framer Motion: Simple component animations (buttons, cards)
- GSAP: Complex timeline animations (evolution visualization)
- Product requires sophisticated animations (evolution timelines, memory consolidation)

### 6. TypeScript: Strict Mode
**Decision**: Enable strict mode from day 1
**Rationale**:
- Catch bugs early
- Better IDE support
- Self-documenting code
- Easier to maintain as codebase grows

---

## Technical Approach

### Frontend Architecture

```
Infrastructure Layer (This Epic)
├── Build System (Vite + TypeScript)
├── Data Layer (Dexie + TanStack Query)
├── State Layer (Zustand)
├── UI Layer (React 19 + Tailwind)
└── Animation Layer (Framer Motion + GSAP)
```

### Key Files & Their Purpose

**Configuration Files:**
- `vite.config.ts` - Build config, path aliases, plugins
- `tsconfig.json` - TypeScript strict mode, path aliases
- `tailwind.config.js` - Design tokens (Lumara brand colors)
- `eslint.config.js` - Code quality rules
- `.prettierrc` - Code formatting

**Core Library Files:**
- `src/lib/db.ts` - Dexie database instance, schema
- `src/lib/store.ts` - Zustand store configuration
- `src/lib/query.ts` - TanStack Query client setup
- `src/utils/cn.ts` - Tailwind class merging utility

**Base Components (Validation Only):**
- `src/components/ui/Button.tsx` - Styled button
- `src/components/ui/Card.tsx` - Container component
- `src/components/ui/Input.tsx` - Form input

**Documentation:**
- `README.md` - Setup instructions, quick start
- `DEVELOPMENT.md` - Architecture patterns, how to use each tool

### No Backend Required

All data persistence uses IndexedDB:
- No API calls
- No authentication
- No server-side logic
- Users can test immediately

---

## Implementation Strategy

### Simplification Approach

**Leverage Existing Tools:**
- Use Vite official React-TS template as starting point
- Use Tailwind official setup guide
- Don't reinvent configuration

**Minimal Viable Setup:**
- Empty database schema (just structure, no tables)
- Single example Zustand slice
- One TanStack Query hook example
- Three base components (Button, Card, Input)

**Defer Complexity:**
- No testing framework (add when features need it)
- No CI/CD (add when deploying)
- No advanced ESLint rules (start simple)

### Development Phases (5 Days)

**Day 1: Foundation**
- Bootstrap project from Vite template
- Configure TypeScript + path aliases
- Set up ESLint + Prettier
- Verify dev server runs

**Day 2: Data Infrastructure**
- Install & configure Dexie
- Install & configure Zustand
- Install & configure TanStack Query
- Wire up providers
- Create example usage

**Day 3: UI Foundation**
- Install & configure Tailwind with Lumara design tokens
- Create three base components
- Test HMR with component edits
- Verify Tailwind styling works

**Day 4: Animation & Documentation**
- Install Framer Motion + GSAP
- Add simple animation example
- Write README.md (setup guide)
- Write DEVELOPMENT.md (architecture guide)

**Day 5: Validation & Polish**
- Test fresh install scenario
- Run all npm scripts
- Fix any issues
- Final documentation pass

### Risk Mitigation

**Risk: Configuration complexity**
- Mitigation: Start with official templates, document every change

**Risk: Scope creep**
- Mitigation: Strict 5-day limit, defer everything non-critical

**Risk: Dependency conflicts**
- Mitigation: Lock versions in package.json, test install

---

## Task Breakdown Preview

High-level task categories (will be decomposed into detailed tasks):

- [ ] **Initialize Project** - npm init, Vite template, Git setup
- [ ] **Configure TypeScript** - tsconfig.json, path aliases, strict mode
- [ ] **Configure Dev Tools** - ESLint, Prettier, editor config
- [ ] **Set Up Data Layer** - Dexie + TanStack Query + Zustand
- [ ] **Configure Styling** - Tailwind + design tokens + global styles
- [ ] **Create Base Components** - Button, Card, Input with Tailwind
- [ ] **Set Up Animations** - Framer Motion + GSAP examples
- [ ] **Write Documentation** - README.md + DEVELOPMENT.md
- [ ] **Validation Testing** - Fresh install test, all scripts work
- [ ] **Final Polish** - Code cleanup, documentation review

**Total: 10 task categories** (each will have 3-5 subtasks when decomposed)

---

## Dependencies

### External Dependencies (npm packages)

**Critical Path:**
1. Node.js 18+ must be installed
2. React 19, TypeScript, Vite (core framework)
3. Zustand, TanStack Query, Dexie (data layer)
4. Tailwind (styling)
5. Framer Motion, GSAP (animations)

**Full dependency list in PRD Technology Stack section**

### Documentation Dependencies

**Must reference:**
- `docs/UI_UX_SPECIFICATIONS.md` - Lumara brand colors, typography
- `docs/PERSONAL_TRUTH_STRATEGY.md` - Keep simple, POC-focused approach
- `docs/MEMORY_PSYCHOLOGY_ARCHITECTURE.md` - Future data model hints

### No Team Dependencies

This epic is 100% independent - no blockers from other work.

---

## Success Criteria (Technical)

### Must Pass All Tests

**Installation Test:**
```bash
rm -rf node_modules package-lock.json
npm install
# ✅ Zero errors
```

**Development Test:**
```bash
npm run dev
# ✅ Server starts in < 5 seconds
# ✅ Opens browser to http://localhost:5173
# ✅ Page loads with no console errors
# ✅ See Button, Card, Input rendered
```

**Type Check Test:**
```bash
npm run type-check
# ✅ Zero TypeScript errors
```

**Build Test:**
```bash
npm run build
# ✅ Builds successfully
# ✅ dist/ folder created
# ✅ Bundle size < 200KB gzipped
```

**HMR Test:**
```bash
# With dev server running:
# 1. Edit src/components/ui/Button.tsx
# 2. Change text or style
# ✅ Page updates in < 500ms
# ✅ No full page reload
```

**Data Persistence Test:**
```bash
# Open browser DevTools → Application → IndexedDB
# ✅ Database exists (even if empty)
# ✅ Can write test data
# ✅ Data persists on page refresh
```

**State Management Test:**
```bash
# In browser:
# 1. Trigger Zustand store update
# ✅ Component re-renders
# ✅ State persists correctly
```

### Quality Gates

**Code Quality:**
- [ ] Zero ESLint errors
- [ ] Zero Prettier formatting issues
- [ ] Zero `any` types without justification comment
- [ ] All imports use `@/*` path aliases

**Documentation:**
- [ ] README.md has clear setup instructions
- [ ] DEVELOPMENT.md explains architecture
- [ ] Code comments explain non-obvious config
- [ ] All config files have header comments

**Performance:**
- [ ] Dev server boots in < 5 seconds
- [ ] HMR updates in < 500ms
- [ ] Production bundle < 200KB gzipped
- [ ] No console warnings in dev mode

---

## Estimated Effort

### Timeline: 5 Days (40 hours)

**Day-by-day breakdown:**
- Day 1: 8 hours (Foundation)
- Day 2: 8 hours (Data Layer)
- Day 3: 8 hours (UI Foundation)
- Day 4: 8 hours (Animation + Docs)
- Day 5: 8 hours (Validation + Polish)

### Critical Path

**Blocking sequence:**
1. Project initialization (Day 1 AM) → Blocks everything
2. TypeScript config (Day 1 AM) → Blocks all coding
3. Vite config (Day 1 PM) → Blocks dev server
4. Data layer setup (Day 2) → Blocks feature development
5. Styling setup (Day 3 AM) → Blocks component work

**Parallelizable work:**
- Documentation can be written incrementally
- Base components can be created in any order
- Animation examples independent of each other

### Resource Requirements

**Developer:** 1 full-time developer (5 days)
**Skills needed:**
- React + TypeScript experience
- Vite configuration knowledge
- Tailwind CSS familiarity
- Git basics

**Hardware:** Standard development machine, modern browser

**Access:** npm registry (public packages only)

---

## Acceptance Criteria

### From PRD - Must Achieve

✅ **Developer can:**
1. Clone repo
2. Run `npm install` - succeeds with zero errors
3. Run `npm run dev` - server starts immediately
4. Open localhost:5173 - see working app
5. Edit a component - HMR updates instantly
6. Read README - understand setup in 5 minutes
7. Read DEVELOPMENT.md - understand architecture patterns
8. Start building features - no configuration blockers

✅ **Project has:**
1. All dependencies in package.json with locked versions
2. TypeScript strict mode enabled, zero errors
3. ESLint + Prettier configured and working
4. Complete folder structure from PRD
5. Dexie database connection working
6. Zustand store example demonstrating pattern
7. TanStack Query example showing usage
8. Tailwind configured with Lumara brand colors
9. Three base components (Button, Card, Input)
10. Framer Motion + GSAP examples
11. README.md + DEVELOPMENT.md complete
12. Production build succeeds

✅ **Quality standards:**
1. No console errors in dev mode
2. No TypeScript errors
3. No ESLint errors
4. All code formatted with Prettier
5. All configuration documented
6. Git history clean (no test commits)

---

## Post-Epic: Immediate Next Steps

**Once this epic is complete:**

1. **Feature PRD Creation:**
   - `/pm:prd-new working-memory-ui` - The 7±2 sidebar component
   - `/pm:prd-new understanding-evolution` - Core differentiation feature
   - `/pm:prd-new contradiction-detection` - AI-powered conflict detection

2. **Validation:**
   - Test infrastructure with first feature implementation
   - Identify any missing tools
   - Update DEVELOPMENT.md based on learnings

3. **Team Onboarding:**
   - Share README.md with team
   - Walkthrough DEVELOPMENT.md patterns
   - Demo HMR, Zustand, TanStack Query usage

---

## Notes

**Why only 10 task categories?**
- Each category groups 3-5 related subtasks
- Keeps epic manageable
- Avoids over-planning
- Allows flexibility during implementation

**What makes this "minimal"?**
- No testing framework (defer to features)
- No CI/CD (defer to deployment)
- No environment config (defer to backend)
- No advanced tooling (add when needed)
- Three components only (Button, Card, Input)

**Can we go faster than 5 days?**
- Yes, if using official templates aggressively
- Focus on "good enough" over "perfect"
- Defer anything not blocking feature work
- 3-day sprint is possible with experience

---

## Tasks Created

- [ ] #10 - Create Base UI Components (parallel: false, 3h)
- [ ] #11 - Set Up Animation Libraries (parallel: true, 2h)
- [ ] #12 - Write Project Documentation (parallel: true, 4h)
- [ ] #3 - Initialize Project Foundation (parallel: false, 4h)
- [ ] #4 - Configure TypeScript and Build System (parallel: false, 3h)
- [ ] #5 - Configure Development Tools (parallel: true, 3h)
- [ ] #6 - Set Up Data Persistence Layer (Dexie) (parallel: true, 3h)
- [ ] #7 - Configure State Management (Zustand) (parallel: true, 2h)
- [ ] #8 - Set Up Data Fetching Layer (TanStack Query) (parallel: false, 3h)
- [ ] #9 - Configure Styling System (Tailwind CSS) (parallel: true, 3h)

**Total tasks:** 10
**Parallel tasks:** 6 (003, 004, 005, 007, 009, 010)
**Sequential tasks:** 4 (001, 002, 006, 008)
**Estimated total effort:** 30 hours

**Critical path:** #3 → #4 → #9 → #10 → #11 (15 hours if executed sequentially)
**Optimized path:** With parallel execution: ~20 hours (savings from parallel data layer + docs work)
---

**Epic Status:** Tasks decomposed and ready for execution
**Next Command:** `/pm:epic-sync project-bootstrap` (to sync to GitHub) or start implementing tasks
