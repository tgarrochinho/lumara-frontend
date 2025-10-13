# Implementation Checklist - What You're Missing

This checklist identifies **what you need before starting MVP implementation** based on your existing codebase.

---

## ✅ What You Already Have

### Infrastructure ✅
- [x] **Vite build setup** (vite.config.ts)
- [x] **TypeScript** configured
- [x] **React 19** installed
- [x] **Tailwind CSS** for styling
- [x] **Storybook** for component development
- [x] **Playwright** for E2E testing
- [x] **ESLint** for code quality
- [x] **Husky + lint-staged** for pre-commit hooks

### Data Layer ✅
- [x] **Dexie (IndexedDB)** for local storage
- [x] **DataService** for CRUD operations
- [x] **Type definitions** (subject.types.ts, chat.types.ts, knowledge.types.ts)
- [x] **Database schema** (database.schema.ts)

### AI Services ✅
- [x] **Multi-provider support** (Gemini, LocalLLM, Mock)
- [x] **AIService interface** with implementations
- [x] **Embedding service** (TensorFlow.js + USE)
- [x] **Content parsing** service
- [x] **Concept extraction** service
- [x] **Deep insight generation** service

### Context/State Management ✅
- [x] **AppContext** (global app state)
- [x] **SubjectContext** (subject management)
- [x] **ChatContext** (messaging)
- [x] **KnowledgeBaseContext** (artifacts, concepts, insights)

### Existing Components ✅
- [x] **AppCore** (main application container)
- [x] **Dashboard** (subject list)
- [x] **SubjectChatView** (chat interface)
- [x] **KnowledgeSidebar** (left panel)
- [x] **RightSidebar** (output panel)
- [x] **TopBarHeader** (navigation)

### Routing ✅
- [x] **React Router** installed
- [x] **AppRouter** component exists

---

## ❌ What You're Missing (CRITICAL)

### 1. MVP Scope Alignment ❌

**Problem:** Current codebase has MORE features than MVP spec requires.

**Example:**
- Current: Concepts, DeepInsights, Themes, Playbooks, Contradictions
- MVP spec: Just basic Insights and Topics
- Current: 3-panel layout already exists
- MVP spec: Assumes starting from scratch

**Action Required:**
```markdown
☐ DECISION NEEDED: Are you refactoring existing app OR building new MVP?

Option A: Refactor Existing (Recommended)
- Keep existing 3-panel layout
- Simplify features to MVP scope
- Remove complexity (playbooks, contradictions)
- Timeline: 6-8 weeks

Option B: Build New MVP from Scratch
- Start with clean slate
- Follow MVP spec exactly
- Parallel development
- Timeline: 12 weeks
```

---

### 2. Backend API Contracts ❌

**Problem:** MVP spec assumes REST API, but you have local-only IndexedDB.

**Current State:**
```typescript
// You have this (local only):
await dataService.getConversations(subjectId);
// Returns from IndexedDB

// MVP spec assumes this:
await fetch('/api/conversations?subjectId=123');
// Returns from backend server
```

**Questions:**
- ☐ Is there a backend server? If yes, what's the URL?
- ☐ Are there API endpoints? If yes, where's the OpenAPI spec?
- ☐ Is authentication required? If yes, JWT? OAuth? Session?
- ☐ Is this local-only forever, or backend coming later?

**Action Required:**
```markdown
☐ Define API Architecture:

Option A: Local-Only (Current)
- Keep IndexedDB as primary storage
- No backend needed
- Update MVP spec to reflect this
- Add offline-first patterns

Option B: Backend API
- Document all endpoints
- Create API service layer
- Add authentication
- Handle sync between local/remote

Option C: Hybrid
- IndexedDB for offline
- API for sync
- Conflict resolution strategy
```

---

### 3. Expertise Stage Logic ❌

**Problem:** MVP spec defines 4 stages, but logic for transitions unclear.

**Current Code:**
```typescript
// From Dashboard/utils.ts (you already have this!)
export const getProgressIndicator = (
  artifactCount: number, 
  hasPlaybook: boolean
): { stage: ExpertiseStage; description: string } => {
  if (hasPlaybook && artifactCount > 10) 
    return { stage: 'mature', ... };
  else if (artifactCount > 8) 
    return { stage: 'synthesizing', ... };
  else if (artifactCount > 3) 
    return { stage: 'developing', ... };
  else 
    return { stage: 'exploring', ... };
};
```

**Missing:**
- ☐ Should this logic change for MVP?
- ☐ Different thresholds without playbooks?
- ☐ How to handle existing users with different data?

**Action Required:**
```markdown
☐ Finalize Expertise Stage Rules:

Proposed MVP Logic (No playbooks):
- Exploring: 0-5 insights
- Building: 6-15 insights  
- Synthesizing: 16-30 insights
- Mature: 30+ insights

☐ Update getProgressIndicator function
☐ Add tests for stage transitions
☐ Document in MVP spec
```

---

### 4. Routing & URL Structure ❌

**Problem:** Current routing unclear, MVP spec doesn't define URLs.

**Current:**
```typescript
// You have AppRouter.tsx but what are the routes?
```

**Missing:**
```markdown
☐ Define URL structure:

Proposed:
/                          → Dashboard (subject list)
/subject/:subjectId        → Subject view (show what?)
/subject/:subjectId/chat   → Chat view (conversation list)
/subject/:subjectId/chat/:conversationId → Active conversation

Questions:
- Where do Explore/Create panels show?
- Are they always visible in subject view?
- Or separate routes?
```

**Action Required:**
```markdown
☐ Document routing architecture
☐ Update AppRouter.tsx with all routes
☐ Add route guards (auth, subject exists)
☐ Handle 404s and redirects
```

---

### 5. Environment Configuration ❌

**Problem:** No .env.example file found.

**Missing:**
```bash
# .env.example
VITE_AI_SERVICE=local # or gemini or mock
VITE_GEMINI_API_KEY=your_key_here
VITE_LOCAL_LLM_BASE_URL=http://localhost:1234
VITE_LOCAL_LLM_MODEL=llama-3.2-3b-instruct
VITE_ENABLE_ANALYTICS=false
VITE_LOG_LEVEL=info
```

**Action Required:**
```markdown
☐ Create .env.example with all required variables
☐ Document each variable in README
☐ Add validation for required env vars at startup
☐ Create .env.local for development
```

---

### 6. Error Boundary Implementation ❌

**Problem:** MVP spec requires ErrorBoundary, but none found in codebase.

**Missing:**
```typescript
// components/ErrorBoundary.tsx - doesn't exist
```

**Action Required:**
```markdown
☐ Create ErrorBoundary component
☐ Wrap AppCore with ErrorBoundary
☐ Add error reporting (console for MVP)
☐ Add retry/reload button
☐ Test with intentional errors
```

**Template:**
```typescript
// components/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

### 7. Loading & Empty State Components ❌

**Problem:** MVP requires standardized LoadingState and EmptyState components.

**Current:** Scattered loading indicators across components.

**Action Required:**
```markdown
☐ Create LoadingState component
☐ Create EmptyState component
☐ Create Spinner component
☐ Use consistently across all components
```

**Templates:**
```typescript
// components/ui/LoadingState.tsx
export const LoadingState: React.FC = () => (
  <div className="loading-state">
    <Spinner />
    <p>Loading...</p>
  </div>
);

// components/ui/EmptyState.tsx
interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  icon, 
  action 
}) => (
  <div className="empty-state">
    {icon}
    <p>{message}</p>
    {action && (
      <button onClick={action.onClick}>{action.label}</button>
    )}
  </div>
);
```

---

### 8. Panel Communication Architecture ❌

**Problem:** MVP spec defines PanelEventBus, but current code doesn't have it.

**Current:** Likely using props drilling or context.

**Action Required:**
```markdown
☐ Implement PanelEventBus (from MVP spec)
☐ OR Document current communication pattern
☐ Standardize across all panels
☐ Add TypeScript types for events
```

**If implementing EventBus:**
```typescript
// utils/panelEvents.ts (from MVP spec)
export type PanelEvent =
  | { type: 'INSIGHT_CLICKED'; payload: { insightId: string } }
  | { type: 'TOPIC_CLICKED'; payload: { topicId: string } }
  | { type: 'CONVERSATION_OPENED'; payload: { conversationId: string } }
  | { type: 'OUTPUT_GENERATED'; payload: { outputId: string } };

class PanelEventBus {
  private handlers = new Map<string, Array<(payload: any) => void>>();
  
  emit(event: PanelEvent) {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach(handler => handler(event.payload));
  }
  
  on(type: PanelEvent['type'], handler: (payload: any) => void) {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }
  
  off(type: PanelEvent['type'], handler: (payload: any) => void) {
    const handlers = this.handlers.get(type) || [];
    const filtered = handlers.filter(h => h !== handler);
    this.handlers.set(type, filtered);
  }
}

export const panelEvents = new PanelEventBus();
```

---

### 9. Output Generation Service ❌

**Problem:** MVP requires "Generate Summary" and "Generate Guide" but service unclear.

**Current:** You have PlaybookService, but MVP doesn't use playbooks.

**Questions:**
- ☐ What's the difference between Summary and Guide?
- ☐ Are these AI-generated outputs?
- ☐ What data do they use as input?
- ☐ Where are they stored?

**Action Required:**
```markdown
☐ Create OutputGenerationService:

interface OutputGenerationService {
  generateSummary(subjectId: string): Promise<Output>;
  generateGuide(subjectId: string): Promise<Output>;
}

☐ Define Output entity in types
☐ Add to database schema
☐ Implement using existing AI services
☐ Add progress tracking
☐ Handle errors gracefully
```

---

### 10. Conversation vs Session Confusion ❌

**Problem:** Current code uses "ChatSession", MVP uses "Conversation".

**Current:**
```typescript
// types/chat.types.ts
export interface ChatSession {
  id: string;
  subjectId: string;
  title: string;
  // ...
}
```

**MVP Spec:**
```typescript
// MVP wants this:
export interface Conversation {
  id: string;
  subjectId: string;
  title: string;
  preview: string;
  lastMessageAt: Date;
  // ...
}
```

**Action Required:**
```markdown
☐ DECISION: Rename ChatSession → Conversation everywhere?
☐ OR: Keep ChatSession and update MVP spec?
☐ Ensure consistency between spec and code
☐ Update all imports and usages
```

---

### 11. Data Migration Strategy ❌

**Problem:** If refactoring existing app, existing users have data.

**Questions:**
- ☐ Are there existing users with data?
- ☐ Do you need to migrate their data?
- ☐ Can you wipe the database for MVP?

**Action Required if migration needed:**
```markdown
☐ Document current schema version
☐ Create migration scripts
☐ Test migration with real data
☐ Add rollback mechanism
☐ Notify users before migration
```

---

### 12. Component Registry ❌

**Problem:** MVP spec has COMPONENTS registry, but doesn't exist.

**From MVP Spec:**
```typescript
// components/registry.ts
export const COMPONENTS = {
  SubjectOverviewCard: 'SubjectOverviewCard',
  TopicsList: 'TopicsList',
  // ...
} as const;
```

**Action Required:**
```markdown
☐ Create components/registry.ts
☐ List ALL components used in app
☐ Use as single source of truth
☐ Update imports to reference registry
☐ Enforce in code reviews
```

---

### 13. Design Tokens ❌

**Problem:** MVP mentions Tailwind CSS but no design system documented.

**Missing:**
```css
/* What are your colors? */
--color-primary: ?
--color-accent: ?
--color-background: ?
--color-surface: ?
--color-text: ?
--color-border: ?

/* What are your spacing values? */
/* What are your typography scales? */
/* What are your breakpoints? */
```

**Action Required:**
```markdown
☐ Document design tokens in Tailwind config
☐ Create design system doc
☐ Add Storybook story for design tokens
☐ Ensure consistency across components
```

---

### 14. Testing Infrastructure ❌

**Problem:** MVP requires unit + integration + E2E tests.

**Current:** You have Playwright for E2E, but unit test setup unclear.

**Action Required:**
```markdown
☐ Verify unit test setup (Vitest? Jest?)
☐ Create test utils (render helpers, mock data)
☐ Add test:unit script to package.json
☐ Document testing guidelines
☐ Set up CI to run tests
```

---

### 15. Deployment Strategy ❌

**Problem:** How will MVP be deployed?

**Questions:**
- ☐ Where will it be hosted? (Vercel? Netlify? AWS?)
- ☐ What's the build command?
- ☐ What environment variables are needed in production?
- ☐ Is there a staging environment?
- ☐ How are updates deployed?

**Action Required:**
```markdown
☐ Choose hosting platform
☐ Create deployment config
☐ Set up CI/CD pipeline
☐ Document deployment process
☐ Test production build locally
```

---

## 📋 Pre-Implementation Checklist

Before writing ANY new code, complete these:

### Architecture Decisions (P0 - BLOCKS ALL WORK)
```markdown
☐ DECISION: Refactor existing app OR build new MVP?
☐ DECISION: Backend API or local-only?
☐ DECISION: Keep "ChatSession" or rename to "Conversation"?
☐ DECISION: URL structure for routing
☐ DECISION: Current 3-panel layout vs MVP spec layout
```

### Documentation (P0 - BLOCKS TEAM COORDINATION)
```markdown
☐ Create API contracts document (if backend exists)
☐ Create .env.example with all variables
☐ Document expertise stage logic
☐ Document routing architecture
☐ Document data migration strategy (if needed)
```

### Foundation Components (P0 - BLOCKS FEATURE WORK)
```markdown
☐ Create ErrorBoundary component
☐ Create LoadingState component
☐ Create EmptyState component
☐ Create PanelEventBus (or document alternative)
☐ Create components/registry.ts
```

### Services (P0 - BLOCKS CORE FEATURES)
```markdown
☐ Create/refactor OutputGenerationService
☐ Standardize error handling across services
☐ Add progress tracking to long operations
```

### Types & Schemas (P1 - IMPORTANT)
```markdown
☐ Align types with MVP spec
☐ Add missing types (Output, etc.)
☐ Update database schema if needed
☐ Create mock data generators for testing
```

### Testing (P1 - IMPORTANT)
```markdown
☐ Set up unit test infrastructure
☐ Create test utilities
☐ Write tests for ErrorBoundary
☐ Write tests for PanelEventBus
```

### Design System (P2 - NICE TO HAVE)
```markdown
☐ Document design tokens
☐ Create Storybook stories for tokens
☐ Ensure Tailwind config is complete
```

---

## 🚦 Implementation Readiness Score

**Current Status: 40% Ready**

**What you have (40%):**
- ✅ Build infrastructure (10%)
- ✅ Data layer (10%)
- ✅ AI services (10%)
- ✅ Basic components (10%)

**What you're missing (60%):**
- ❌ Architecture decisions (20%)
- ❌ API contracts (10%)
- ❌ Foundation components (10%)
- ❌ Services alignment (10%)
- ❌ Testing infrastructure (5%)
- ❌ Documentation (5%)

**Target for implementation start: 80% Ready**

Minimum requirements:
1. All P0 architecture decisions made
2. All P0 components created
3. API contracts documented (if backend)
4. Types aligned with spec

---

## 📅 Recommended Next Steps

### This Week (Week 0 - Pre-Implementation)

**Days 1-2: Architecture Decisions**
- [ ] Meet with team to decide refactor vs new build
- [ ] Decide on backend API vs local-only
- [ ] Document URL structure
- [ ] Align MVP spec with current codebase realities

**Days 3-4: Foundation Components**
- [ ] Create ErrorBoundary
- [ ] Create LoadingState/EmptyState
- [ ] Create PanelEventBus or document alternative
- [ ] Create components/registry.ts

**Day 5: Documentation Sprint**
- [ ] Create .env.example
- [ ] Document expertise stage logic
- [ ] Document routing
- [ ] Create API contracts (if backend)

### Week 1: Begin MVP Implementation

Only start Week 1 AFTER completing Week 0 checklist!

---

## ⚠️ Red Flags

**DO NOT start implementation if:**
- ❌ Architecture decisions still unclear
- ❌ Team disagrees on approach
- ❌ API contracts undefined (if backend needed)
- ❌ No ErrorBoundary exists
- ❌ Types don't match between spec and code

**These will cause:**
- Rework and wasted effort
- Team confusion and merge conflicts
- Bugs that are hard to debug
- Delayed timeline

---

## 💡 Key Insight

**Your situation is different from MVP spec assumptions:**

MVP Spec Assumes:
- Starting from scratch
- Backend API exists
- Simple 3-panel layout to build

Your Reality:
- Complex app already exists
- Local-only IndexedDB storage
- 3-panel layout already implemented
- More features than MVP requires

**This is GOOD news!** You're ahead on infrastructure. But you need to:
1. Simplify existing features to MVP scope
2. Update specs to match reality
3. Focus on polish and user experience

**Estimated timeline with your codebase: 6-8 weeks** (not 12 weeks from scratch)

---

## 🎯 Critical Questions to Answer TODAY

Before ANY coding:

1. **Are we refactoring the existing app or building a new MVP in parallel?**
   - Answer: __________________________

2. **Is there a backend API, or is this local-only forever?**
   - Answer: __________________________

3. **Do we keep existing features (Concepts, DeepInsights, Playbooks) or remove for MVP?**
   - Answer: __________________________

4. **What is the URL structure for routing?**
   - Answer: __________________________

5. **Who is responsible for which components in the 12-week plan?**
   - Answer: __________________________

**Fill these in, then you're ready to start.**
