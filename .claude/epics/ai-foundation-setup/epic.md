---
name: ai-foundation-setup
status: backlog
created: 2025-10-14T03:23:59Z
progress: 0%
prd: .claude/prds/ai-foundation-setup.md
github: https://github.com/tgarrochinho/lumara-frontend/issues/14
---

# Epic: AI Foundation Setup

## Overview

Establish Lumara's AI infrastructure as a **local-first, privacy-preserving system** with extensible provider architecture. Start with Chrome Gemini Nano + browser embeddings (v1), but build abstractions that support future providers (Gemini API, LM Studio, OpenAI, Claude).

**Core Implementation:**
- Chrome AI (Gemini Nano) for conversational responses
- Transformers.js (MiniLM-L6-v2) for semantic embeddings
- Provider abstraction layer for future extensibility
- IndexedDB caching for embeddings
- Clean separation: chat vs embeddings vs similarity

**Strategic Goal:** Zero backend costs, complete privacy, easy provider additions later.

---

## Architecture Decisions

### 1. **Provider Abstraction Pattern**
**Decision:** Implement full provider abstraction in v1, even though we only ship Chrome AI initially.

**Rationale:**
- Future providers (Gemini API, LM Studio, OpenAI) become trivial to add (3 files, ~100 lines)
- Prevents technical debt and rewrites later
- Enables gradual rollout (Chrome AI → Gemini API → Multi-provider)
- Supports multiple business models (free tier, paid tier, enterprise)

**Implementation:**
```typescript
interface AIProvider {
  readonly name: string;
  readonly type: 'local' | 'cloud' | 'hosted';
  readonly requiresApiKey: boolean;
  capabilities: { chat, embeddings, streaming, multimodal };

  chat(message, context?): Promise<string>;
  embed(text): Promise<number[]>;
  initialize(config?): Promise<void>;
  healthCheck(): Promise<ProviderHealth>;
}
```

### 2. **Separate Chat and Embeddings**
**Decision:** Don't force all providers to implement both chat and embeddings.

**Rationale:**
- Chrome AI: Good for chat, but embeddings need Transformers.js
- LM Studio: Great for both
- OpenAI: Excellent for both, but costs money
- Transformers.js: Only embeddings (no chat)

**Implementation:**
- Providers declare capabilities
- Mix and match: Chrome AI chat + Transformers.js embeddings
- Future: Gemini chat + OpenAI embeddings (if user prefers)

### 3. **Lazy Loading & Caching**
**Decision:** Load models on-demand, cache aggressively.

**Rationale:**
- First visit: ~30s model download acceptable
- Subsequent visits: <1s from cache = great UX
- Don't block app startup

**Implementation:**
- Chrome AI: Already on-device (0ms)
- Transformers.js: Load on first use, cache in browser
- Embeddings: Store with memories in IndexedDB (never regenerate)

### 4. **Origin Trial Token Management**
**Decision:** Hardcode token in repo, not .env

**Rationale:**
- Origin trial tokens are public by design
- Tied to domain, time-limited (March 2026)
- No security risk
- Easier deployment

**Implementation:**
```html
<!-- index.html -->
<meta http-equiv="origin-trial" content="ACTUAL_TOKEN_HERE">
```

### 5. **Testing Strategy**
**Decision:** Mock providers for unit tests, real providers for integration tests.

**Rationale:**
- Chrome AI not available in CI/CD
- Need fast unit tests without network
- Integration tests validate real behavior

**Implementation:**
```typescript
class MockAIProvider implements AIProvider { ... }
// Unit tests use MockAIProvider
// Manual integration tests use ChromeAIProvider
```

---

## Technical Approach

### Frontend Components

#### Core AI Services (`src/lib/ai/`)
```
src/lib/ai/
├── types.ts                 # AIProvider interface, types
├── registry.ts              # Provider selection logic
├── providers/
│   ├── base.ts              # BaseProvider abstract class
│   └── chrome-ai.ts         # ChromeAIProvider (v1 only)
├── embeddings/
│   └── transformers.ts      # Transformers.js wrapper
└── utils/
    └── similarity.ts        # Cosine similarity functions
```

**Key Responsibilities:**
- `types.ts`: Define AIProvider contract
- `registry.ts`: Select best available provider
- `chrome-ai.ts`: Chrome AI + Transformers.js implementation
- `similarity.ts`: Embedding comparison logic

#### UI Components (`src/components/ai/`)
```
src/components/ai/
├── AISetup.tsx              # First-time setup wizard
├── AIStatus.tsx             # "AI Ready" indicator
└── AILoadingState.tsx       # Model download progress
```

**Key Responsibilities:**
- `AISetup`: Guide user through model download
- `AIStatus`: Show current AI provider status
- `AILoadingState`: Progress bar for Transformers.js download

#### Configuration (`src/config/`)
```
src/config/
├── chromeAI.ts              # Origin trial token
└── providers.ts             # Provider registry (v1: Chrome AI only)
```

### Data Layer

#### Dexie Schema Extension
```typescript
// Extend Memory type to include embeddings
interface Memory {
  id: string;
  content: string;
  embedding?: number[];  // 384-dim vector
  createdAt: Date;
  // ... other fields
}

// Index on embedding for future vector search optimization
this.version(2).stores({
  memories: '++id, content, createdAt, *tags, embedding'
});
```

**Caching Strategy:**
- Generate embedding once when memory created
- Store with memory in IndexedDB
- Never regenerate (embeddings are deterministic)
- Pre-compute similarities for frequent queries

### Integration Points

#### 1. Memory Creation Flow
```
User types message
    ↓
AI chat response (Chrome AI)
    ↓
Extract memory content
    ↓
Generate embedding (Transformers.js)
    ↓
Check for contradictions (similarity search)
    ↓
Store memory + embedding (Dexie)
```

#### 2. Contradiction Detection Flow
```
New memory with embedding
    ↓
Load existing memories with embeddings
    ↓
Compute cosine similarity for each
    ↓
Filter by threshold (>0.70 = potential contradiction)
    ↓
Use Chrome AI to analyze semantic contradiction
    ↓
Show resolution UI if contradiction found
```

---

## Implementation Strategy

### Phase 1: Core Infrastructure (Days 1-3)
**Goal:** Get provider abstraction and Chrome AI working

**Tasks:**
1. Define AIProvider interface with full extensibility
2. Implement ChromeAIProvider (chat + embeddings)
3. Add Origin Trial token
4. Create provider registry and selection logic
5. Write unit tests with MockProvider

**Validation:**
- Chrome AI chat works in Chrome Canary
- Provider abstraction allows easy MockProvider
- All interfaces TypeScript-strict compliant

### Phase 2: Embeddings & Similarity (Days 4-5)
**Goal:** Get semantic search working

**Tasks:**
1. Integrate Transformers.js (MiniLM-L6-v2)
2. Implement embedding generation with caching
3. Build cosine similarity functions
4. Add embedding storage to Dexie schema

**Validation:**
- Embeddings generate in <100ms (after initial load)
- Model caches correctly (check browser DevTools)
- Similarity scores accurate (manual test cases)

### Phase 3: UI & UX (Days 6-7)
**Goal:** Great first-time experience

**Tasks:**
1. Build AISetup wizard component
2. Add model loading progress indicators
3. Create AIStatus indicator
4. Add error states and fallbacks

**Validation:**
- First-time setup intuitive (<60s)
- Progress indicators accurate
- Clear error messages if model fails

### Phase 4: Integration & Testing (Days 8-10)
**Goal:** Wire everything together

**Tasks:**
1. Integrate with existing chat UI
2. Add contradiction detection flow
3. Write integration tests
4. Performance optimization
5. Documentation for adding providers

**Validation:**
- Full chat → embedding → similarity → storage flow works
- Performance targets met (<100ms embeddings, <2s chat)
- Documentation clear enough for future provider additions

---

## Task Breakdown Preview

High-level task categories (will be decomposed into detailed tasks):

- [ ] **AI Provider Infrastructure** - Interface, registry, Chrome AI implementation
- [ ] **Embeddings System** - Transformers.js integration, caching, storage
- [ ] **Similarity Detection** - Cosine similarity, contradiction detection logic
- [ ] **UI Components** - Setup wizard, status indicator, loading states
- [ ] **Dexie Schema** - Extend Memory type, add embedding storage
- [ ] **Integration** - Wire AI into existing chat, memory creation flows
- [ ] **Testing** - Unit tests (mocks), integration tests (real providers)
- [ ] **Documentation** - Provider addition guide, architecture decisions
- [ ] **Performance** - Optimize embedding generation, cache strategies
- [ ] **Error Handling** - Fallbacks, clear error messages, health checks

**Total: 10 task categories (simplified per instructions)**

---

## Dependencies

### External Dependencies
1. **Chrome Prompt API Origin Trial**
   - Status: Active (expires March 2026)
   - Action: Register at https://developer.chrome.com/origintrials/#/view_trial/4270982440984576
   - Risk: Medium (Google could end early)
   - Mitigation: Build abstraction so fallback providers easy to add

2. **Transformers.js v2.x**
   - Package: `@xenova/transformers`
   - Version: Lock to 2.x (breaking changes in 3.x?)
   - Risk: Low (stable, well-maintained)

3. **MiniLM-L6-v2 Model**
   - Source: Hugging Face CDN
   - Size: 23MB
   - Risk: Low (cached after first load)

### Internal Dependencies
1. **Dexie Database** - Already implemented in project
2. **React 19** - Already implemented
3. **TypeScript 5.9** - Already configured
4. **Vite Dev Server** - For localhost:5173 Origin Trial testing

### Prerequisite Work
- ✅ React 19 setup complete
- ✅ Dexie installed and configured
- ✅ TypeScript strict mode enabled
- ✅ Test infrastructure (Vitest) ready

**No blockers - can start immediately.**

---

## Success Criteria (Technical)

### Performance Benchmarks
- [ ] **First visit setup:** <30 seconds (model download)
- [ ] **Subsequent visits:** <1 second (from cache)
- [ ] **Embedding generation:** <100ms per text (after model load)
- [ ] **Chat response:** <2 seconds (varies by prompt)
- [ ] **Similarity search:** <50ms for 1000 memories

### Quality Gates
- [ ] **TypeScript strict:** Zero `any` types in AI code
- [ ] **Test coverage:** >80% for AI services
- [ ] **Error handling:** All async operations have try/catch
- [ ] **Browser compatibility:** Works in Chrome Canary/Dev 130+
- [ ] **Cache validation:** Models persist across sessions

### Acceptance Criteria
- [ ] Chrome AI chat produces coherent responses
- [ ] Embeddings accurately detect semantic similarity
- [ ] Contradiction detection finds true contradictions (>70% accuracy in manual tests)
- [ ] UI clearly shows AI status and loading progress
- [ ] Documentation enables adding new provider in <2 hours
- [ ] Zero server costs (no API calls after model download)

### Future-Proofing Validation
- [ ] MockProvider demonstrates extensibility
- [ ] Adding new provider requires only 3 files
- [ ] Settings UI scaffold ready for provider selection
- [ ] Clear separation between chat and embeddings

---

## Estimated Effort

### Timeline
**Total: 10 working days (2 weeks)**

| Phase | Duration | Risk Level |
|-------|----------|------------|
| Phase 1: Infrastructure | 3 days | Medium (Chrome AI reliability) |
| Phase 2: Embeddings | 2 days | Low (proven tech) |
| Phase 3: UI/UX | 2 days | Low (straightforward) |
| Phase 4: Integration & Testing | 3 days | Medium (integration complexity) |

### Resource Requirements
- **1 Full-stack Developer** - Proficient in TypeScript, React, browser APIs
- **Part-time Product Designer** - For AI setup UX (optional, can use MVP UI)
- **Testing Support** - Chrome Canary testing on multiple devices

### Critical Path Items
1. **Origin Trial Token** - Must obtain before testing (5 minutes)
2. **Chrome AI Availability** - User must have Chrome Canary/Dev (documented)
3. **Model Download Success** - First-time setup must work reliably (monitored)

### Risk Mitigation
- **Chrome AI unreliable:** Document clear setup instructions, test extensively
- **Performance issues:** Use Web Workers if needed (not expected)
- **Model download fails:** Implement retry logic with exponential backoff
- **Provider abstraction over-engineered:** Keep v1 simple, scaffold only what's needed

---

## Post-Epic Roadmap

After this epic completes, these become possible:

### Immediate Next Steps (Epic Dependency Chain)
1. **Contradiction Detection Epic** - Uses AI foundation
2. **Confidence Scoring Epic** - Uses embeddings for consistency checks
3. **Memory Classification Epic** - Uses AI to categorize memories

### Future AI Enhancements (Separate Epics)
- **v2 (3 months):** Gemini API Provider - Add as second option
- **v3 (6 months):** Multi-Provider Support - LM Studio, OpenAI, Claude
- **v4 (12 months):** Lumara Hosted - Managed AI service option

---

## Technical Debt Prevention

### What We're Building Right
1. ✅ **Provider abstraction** - Makes future additions easy
2. ✅ **Separate concerns** - Chat ≠ Embeddings ≠ Similarity
3. ✅ **Type safety** - Full TypeScript coverage
4. ✅ **Test mocks** - Can test without real AI

### What We're Deferring (Acceptable)
1. ⏳ **Streaming responses** - Not needed for MVP, easy to add later
2. ⏳ **Multi-browser support** - Focus on Chrome first, expand later
3. ⏳ **Advanced caching** - Simple caching sufficient, optimize later
4. ⏳ **WebGPU acceleration** - Nice to have, not critical

### What We're Explicitly NOT Building
1. ❌ **Backend proxy** - Local-first is the point
2. ❌ **User API keys** - Not until v2 (Gemini API)
3. ❌ **Model fine-tuning** - Out of scope
4. ❌ **Voice/image** - Text only for MVP

---

## Key Decisions Requiring Sign-Off

Before starting implementation, confirm:

1. **✅ Chrome-only for v1?**
   - Decision: Yes, Chrome Canary/Dev only initially
   - Impact: Limits early adopters but ensures quality

2. **✅ Build full provider abstraction now?**
   - Decision: Yes, even though we only ship Chrome AI
   - Impact: +1 day development time, but makes future work trivial

3. **✅ Hardcode Origin Trial token?**
   - Decision: Yes, in index.html
   - Impact: Public in repo, but that's fine (tokens are public)

4. **✅ 30-second first-time setup acceptable?**
   - Decision: Yes, model download is one-time
   - Impact: User must wait, but clear progress shown

---

## Tasks Created

This epic has been decomposed into 10 concrete tasks:

### Task Summary

| # | Task | Effort | Parallel | Dependencies |
|---|------|--------|----------|--------------|
| 001 | AI Provider Infrastructure & Abstraction Layer | 12-16h (M) | ✅ Yes | None |
| 002 | Browser-Based Embeddings with Transformers.js | 10-14h (M) | ✅ Yes | None |
| 003 | Similarity Detection & Contradiction Logic | 8-10h (S) | ❌ No | 002 |
| 004 | Dexie Schema Extension for Embeddings | 4-6h (S) | ❌ No | 002 |
| 005 | AI Setup UI Components & Loading States | 10-12h (M) | ❌ No | 001, 002 |
| 006 | Integration with Chat & Memory Flows | 14-18h (L) | ❌ No | 001-005 |
| 007 | Testing Infrastructure for AI System | 10-14h (M) | ✅ Yes | 001-003 |
| 008 | Error Handling & Health Checks | 8-12h (M) | ✅ Yes | 001, 002 |
| 009 | Performance Optimization & Caching | 10-14h (M) | ✅ Yes | 002, 003 |
| 010 | Documentation & Provider Addition Guide | 12-16h (M) | ✅ Yes | 001 |

**Total Estimated Effort:** 108-142 hours (~3 developer-weeks)

**Parallelization Strategy:**
- **Wave 1 (Parallel):** Tasks 001, 002 (foundation)
- **Wave 2 (Sequential):** Tasks 003, 004 (depends on embeddings)
- **Wave 3 (Parallel):** Tasks 007, 008, 009, 010 (can start alongside Wave 2)
- **Wave 4 (Sequential):** Task 005 (UI components)
- **Wave 5 (Sequential):** Task 006 (final integration)

### Next Steps

To sync these tasks to GitHub:
```bash
/pm:epic-sync ai-foundation-setup
```

This will create GitHub issues for each task and link them to the epic.
