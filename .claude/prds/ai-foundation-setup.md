---
name: ai-foundation-setup
description: Establish local-first AI foundation using Chrome Gemini Nano and browser-based embeddings for privacy-focused cognitive augmentation
status: implemented
created: 2025-10-14T03:15:05Z
completed: 2025-10-14T09:30:00Z
---

# PRD: AI Foundation Setup

## Executive Summary

Establish Lumara's AI foundation as a **completely local-first, privacy-preserving system** using Chrome's built-in Gemini Nano model and browser-based embeddings (Transformers.js). This foundation enables all future Lumara features (contradiction detection, confidence scoring, memory classification) while ensuring user data never leaves their device.

**Key Innovation:** Zero-cost, zero-server AI that runs entirely in the browser, differentiating Lumara as the most private memory augmentation tool available.

---

## Problem Statement

### The Problem
To build Lumara's core features (contradiction detection, confidence scoring, evolution tracking), we need:
1. **Conversational AI** - Natural dialogue for memory creation
2. **Semantic embeddings** - Vector representations for similarity detection
3. **Text analysis** - Classification and reasoning capabilities

Traditional solutions require:
- ❌ Backend servers (cost, complexity, latency)
- ❌ API keys (user friction, cost per request)
- ❌ Data transmission (privacy concerns, GDPR compliance)
- ❌ Always-online requirement (poor UX)

### Why Now?
- ✅ Chrome's Gemini Nano is available in Origin Trial (until March 2026)
- ✅ Transformers.js enables production-ready browser embeddings
- ✅ WebGPU acceleration makes browser AI performant
- ✅ Users increasingly demand privacy-first tools

### The Opportunity
Build Lumara as a **true local-first application** where:
- User memories never leave their device
- No server costs for AI inference
- Works offline after initial model download
- Differentiates from ChatGPT/Supermemory/Notion

---

## User Stories

### Primary Persona: Privacy-Conscious Knowledge Worker

**As a** product manager concerned about data privacy
**I want** my thoughts and memories to stay completely private
**So that** I can think freely without worry about data leaks or corporate surveillance

**Acceptance Criteria:**
- All AI processing happens on my device
- No data is sent to external servers
- App works offline after setup
- Clear messaging about privacy guarantees

---

### User Journey: First-Time Setup

```
1. User opens Lumara in Chrome
   → Sees: "Setting up AI models (one-time, ~25MB download)"

2. Chrome downloads Gemini Nano (automatic)
   → Status: "Downloading conversational AI..."

3. Transformers.js downloads embedding model
   → Status: "Downloading semantic analysis..."
   → Progress bar: [████████░░] 80%

4. Models cache in browser
   → Success: "✅ AI ready! Everything runs on your device."

5. User starts chatting
   → Fast, private, offline-capable
```

**Pain Points Addressed:**
- ❌ No API key setup friction
- ❌ No monthly AI costs
- ❌ No privacy policy concerns
- ❌ No slow server round-trips

---

## Requirements

### Functional Requirements

#### FR-1: Chrome AI Integration
**Priority:** CRITICAL
**Description:** Integrate Chrome's built-in Gemini Nano for conversational AI

**Technical Details:**
- Register for Prompt API Origin Trial
- Add origin trial token to app
- Implement AI session management
- Handle graceful degradation if unavailable

**Acceptance Criteria:**
- [ ] Origin trial token added to `index.html`
- [ ] `LocalAIService` class created with session management
- [ ] Chat responses work in Chrome Canary/Dev
- [ ] Fallback message shown in non-Chrome browsers
- [ ] Error handling for "model not ready" state

---

#### FR-2: Browser-Based Embeddings
**Priority:** CRITICAL
**Description:** Use Transformers.js for semantic embeddings generation

**Technical Details:**
- Install `@xenova/transformers` package
- Use `Xenova/all-MiniLM-L6-v2` model (23MB, 384 dimensions)
- Cache model in browser (IndexedDB/Cache API)
- Generate embeddings for all user text

**Acceptance Criteria:**
- [ ] Transformers.js installed and configured
- [ ] Model loads on first use and caches
- [ ] `generateEmbedding(text)` function returns 384-dim vector
- [ ] Embedding generation takes <100ms after initial load
- [ ] Model reuses cache on subsequent visits

---

#### FR-3: Similarity Detection
**Priority:** CRITICAL
**Description:** Compare embeddings using cosine similarity for contradiction/duplication detection

**Technical Details:**
- Implement cosine similarity function
- Set thresholds: duplication (>0.85), contradiction (>0.70)
- Cache embeddings in Dexie with memories
- Batch similarity checks for performance

**Acceptance Criteria:**
- [ ] `cosineSimilarity(a, b)` returns accurate scores
- [ ] `findSimilar(text, memories, threshold)` finds matches
- [ ] Performance: <50ms for 1000 memory comparisons
- [ ] Embeddings stored with memories in IndexedDB

---

#### FR-4: AI Provider Abstraction (Future-Proof Architecture)
**Priority:** CRITICAL
**Description:** Create extensible abstraction layer that starts with Chrome AI but supports any provider: local models (LM Studio), cloud APIs (Gemini, OpenAI, Claude), or user's own keys

**Strategic Vision:**
- **v1 (MVP):** Chrome AI (Gemini Nano) - Free, private, on-device
- **v2 (3 months):** Gemini API - For non-Chrome users, with user's API key
- **v3 (6 months):** Multi-provider support - LM Studio, OpenAI, Claude, Anthropic
- **v4 (12 months):** Lumara-hosted API - For users who want managed service

**Technical Details:**
```typescript
// Core abstraction - supports ANY provider
interface AIProvider {
  // Metadata
  readonly name: string;
  readonly type: 'local' | 'cloud' | 'hosted';
  readonly requiresApiKey: boolean;

  // Capabilities
  capabilities: {
    chat: boolean;
    embeddings: boolean;
    streaming: boolean;
    multimodal: boolean;
  };

  // Core operations
  chat(message: string, context?: string[]): Promise<string>;
  chatStream?(message: string, context?: string[]): AsyncIterator<string>;
  embed(text: string): Promise<number[]>;

  // High-level operations (built on primitives)
  detectContradiction(text1: string, text2: string): Promise<ContradictionResult>;
  findSimilar(text: string, memories: Memory[], threshold: number): Promise<SimilarityMatch[]>;

  // Lifecycle
  initialize(config?: ProviderConfig): Promise<void>;
  dispose(): Promise<void>;
  healthCheck(): Promise<ProviderHealth>;
}

// v1: Chrome AI (built-in, free)
class ChromeAIProvider implements AIProvider {
  name = 'Chrome AI (Gemini Nano)';
  type = 'local';
  requiresApiKey = false;
  // Uses window.ai API + Transformers.js for embeddings
}

// v2: Gemini API (user's key)
class GeminiAPIProvider implements AIProvider {
  name = 'Google Gemini API';
  type = 'cloud';
  requiresApiKey = true;
  // Uses fetch() to api.generativeai.google.com
}

// v3: LM Studio (local models)
class LMStudioProvider implements AIProvider {
  name = 'LM Studio';
  type = 'local';
  requiresApiKey = false;
  // Connects to localhost:1234 (LM Studio server)
}

// v3: OpenAI
class OpenAIProvider implements AIProvider {
  name = 'OpenAI (GPT-4)';
  type = 'cloud';
  requiresApiKey = true;
  // Uses OpenAI SDK
}

// v3: Anthropic Claude
class ClaudeProvider implements AIProvider {
  name = 'Anthropic Claude';
  type = 'cloud';
  requiresApiKey = true;
  // Uses Anthropic SDK
}

// Smart provider selection
async function selectProvider(
  userPreference?: ProviderType,
  apiKeys?: Record<string, string>
): Promise<AIProvider> {
  // Try user preference first
  if (userPreference) {
    const provider = await tryProvider(userPreference, apiKeys);
    if (provider) return provider;
  }

  // Fallback chain (privacy-first)
  const providers = [
    () => new ChromeAIProvider(),           // Free, private
    () => new LMStudioProvider(),           // Local models
    () => new GeminiAPIProvider(apiKeys),   // Cloud fallback
    () => new OpenAIProvider(apiKeys),      // Alternative cloud
  ];

  for (const factory of providers) {
    try {
      const provider = factory();
      await provider.initialize();
      const health = await provider.healthCheck();
      if (health.available) return provider;
    } catch (e) {
      continue;
    }
  }

  throw new Error('No AI provider available');
}
```

**User Settings (Future):**
```typescript
interface AISettings {
  preferredProvider: 'chrome-ai' | 'gemini' | 'openai' | 'claude' | 'lm-studio' | 'auto';
  apiKeys: {
    gemini?: string;
    openai?: string;
    claude?: string;
  };
  localModelPath?: string; // For LM Studio
  fallbackStrategy: 'privacy-first' | 'performance-first' | 'cost-first';
}
```

**Acceptance Criteria (v1 - This Epic):**
- [ ] `AIProvider` interface defined with full extensibility
- [ ] `ChromeAIProvider` fully implements interface
- [ ] Provider selection logic implemented (Chrome AI only for now)
- [ ] Settings UI scaffold created (can add providers later)
- [ ] Clear documentation for adding new providers
- [ ] Unit tests demonstrate adding mock provider

---

#### FR-5: Model Loading UX
**Priority:** HIGH
**Description:** Show clear progress during initial model download

**Technical Details:**
- Detect if models already cached
- Show loading spinner during download
- Display progress percentage if available
- Show success message when ready

**Acceptance Criteria:**
- [ ] Loading state shown during model initialization
- [ ] Progress indicator for Transformers.js download
- [ ] Success message: "AI ready! Everything runs on your device"
- [ ] Clear error messages if models fail to load
- [ ] "Learn more" link explaining privacy benefits

---

### Non-Functional Requirements

#### NFR-1: Performance
- **Target:** Embedding generation <100ms (after initial load)
- **Target:** Chat response <2 seconds (varies by prompt complexity)
- **Target:** Initial model load <30 seconds (one-time, 25MB total)
- **Target:** App remains responsive during AI operations (use Web Workers if needed)

#### NFR-2: Browser Compatibility
- **Chrome Canary/Dev 130+:** Full functionality
- **Chrome Stable:** Graceful degradation (show "Use Chrome Canary" message)
- **Firefox/Safari/Edge:** Show clear message: "AI features require Chrome"
- **Mobile Chrome:** Detect and warn if insufficient resources

#### NFR-3: Privacy & Security
- **Data Storage:** All AI operations local, IndexedDB only
- **Network:** No AI-related network requests after model download
- **Transparency:** Clear UI messaging about local processing
- **Compliance:** GDPR compliant (no data leaves device)

#### NFR-4: Resource Usage
- **Memory:** <500MB total (Chrome AI + Transformers.js + runtime)
- **Storage:** ~25MB cached models (Gemini Nano on-device, Transformers.js cached)
- **CPU:** Non-blocking, shouldn't freeze UI
- **Battery:** Optimize for laptop/mobile usage

#### NFR-5: Reliability
- **Model Availability:** Check model status before use
- **Error Recovery:** Clear error messages with actionable steps
- **Offline Support:** Works after initial model download
- **Cache Invalidation:** Handle model updates gracefully

---

## Success Criteria

### Technical Success (Week 1)
- [ ] Chrome AI chat works in Chrome Canary
- [ ] Embeddings generate successfully
- [ ] Cosine similarity accurately detects duplicates (>0.85)
- [ ] Models cache and reload on subsequent visits
- [ ] Zero server requests for AI operations

### User Experience Success (Week 2)
- [ ] First-time setup takes <60 seconds
- [ ] Embedding generation feels instant (<100ms)
- [ ] Chat responses feel natural (<2s)
- [ ] Users understand "local-first" benefit from UI messaging

### Validation Metrics (Week 3-4)
- [ ] 90%+ of test users successfully set up AI
- [ ] 0 privacy-related concerns raised
- [ ] Embedding accuracy: >85% for contradiction detection
- [ ] Chat quality: Users can't distinguish from cloud AI

### Business Impact
- [ ] Zero AI infrastructure costs
- [ ] Privacy as competitive differentiator in marketing
- [ ] Foundation ready for Wave 1 features (contradiction detection)

---

## Constraints & Assumptions

### Technical Constraints
1. **Chrome-only (initially):** Gemini Nano only in Chrome
2. **Origin Trial expiration:** March 2026 deadline
3. **Model size:** 25MB download required on first visit
4. **Device requirements:** 8GB+ RAM for optimal performance

### Assumptions
1. **Target users have modern devices:** 8GB+ RAM, recent CPU
2. **Acceptable first-load time:** Users willing to wait 30s for setup
3. **Chrome adoption:** Primary users willing to use Chrome Canary/Dev for testing
4. **Model quality:** Gemini Nano sufficient for memory classification
5. **Embedding quality:** MiniLM-L6-v2 sufficient for semantic similarity

### Dependencies
- **Chrome Prompt API:** Depends on Google maintaining Origin Trial
- **Transformers.js:** Depends on Hugging Face maintaining package
- **IndexedDB:** Browser support for caching

---

## Out of Scope

### Explicitly NOT Building (v1 - This Epic)
- ❌ Gemini API integration (v2)
- ❌ OpenAI/Claude integration (v3)
- ❌ LM Studio integration (v3)
- ❌ User API key management UI (v2)
- ❌ Multi-provider switching UI (v2)
- ❌ Backend proxy infrastructure (v4)
- ❌ Voice input/output
- ❌ Image analysis
- ❌ Real-time collaboration with AI
- ❌ Model fine-tuning
- ❌ Custom embeddings training

### In Scope for Future Epics
**v2: Cloud Provider Support (3 months)**
- ✅ Gemini API integration (user's API key)
- ✅ API key management UI
- ✅ Provider selection settings
- ✅ Cost tracking per provider

**v3: Multi-Provider Ecosystem (6 months)**
- ✅ LM Studio integration (localhost:1234)
- ✅ OpenAI API support
- ✅ Anthropic Claude support
- ✅ Provider comparison benchmarks
- ✅ Streaming responses

**v4: Managed Service (12 months)**
- ✅ Lumara-hosted API (optional)
- ✅ Pay-as-you-go pricing
- ✅ No API key needed (Lumara absorbs costs)

## Future Provider Roadmap

### Provider Evolution Strategy

```
Timeline:

Month 0 (v1) - Chrome AI Only
├─ Chrome AI (Gemini Nano): Free, on-device, private
├─ Transformers.js: Browser embeddings
└─ Target: Chrome Canary/Dev users

Month 3 (v2) - Add Gemini API
├─ Chrome AI: Still primary (privacy-first)
├─ Gemini API: Fallback for non-Chrome
│   └─ User provides API key
├─ Settings UI: Choose provider
└─ Target: All browsers

Month 6 (v3) - Multi-Provider
├─ Chrome AI: Privacy option
├─ LM Studio: Power user option
│   └─ Run local Llama, Mistral, etc.
├─ Gemini API: Cloud option
├─ OpenAI: Alternative cloud
├─ Claude: Alternative cloud
└─ Target: Everyone finds their fit

Month 12 (v4) - Managed Service
├─ Chrome AI: Free tier (on-device)
├─ LM Studio: Free tier (local)
├─ Cloud APIs: Free tier (user's keys)
├─ Lumara Hosted: Paid tier
│   └─ No API key needed
│   └─ We handle all AI costs
│   └─ $10-20/month subscription
└─ Target: Non-technical users
```

### Provider Comparison Matrix (Future State)

| Provider | Type | Privacy | Cost | Setup | Performance | Availability |
|----------|------|---------|------|-------|-------------|--------------|
| **Chrome AI** | Local | ⭐⭐⭐⭐⭐ | Free | Easy | Fast | Chrome only |
| **LM Studio** | Local | ⭐⭐⭐⭐⭐ | Free | Medium | Varies | All browsers |
| **Gemini API** | Cloud | ⭐⭐⭐ | User pays | Easy | Fast | All browsers |
| **OpenAI** | Cloud | ⭐⭐⭐ | User pays | Easy | Fast | All browsers |
| **Claude** | Cloud | ⭐⭐⭐ | User pays | Easy | Fast | All browsers |
| **Lumara Hosted** | Cloud | ⭐⭐⭐⭐ | $10-20/mo | Easy | Fast | All browsers |

### User Personas & Provider Fit

**Privacy Advocate:**
- Primary: Chrome AI or LM Studio
- Fallback: None (stays local)
- Rationale: Data never leaves device

**Power User:**
- Primary: LM Studio (custom models)
- Secondary: OpenAI (for complex tasks)
- Rationale: Control + flexibility

**Casual User:**
- Primary: Lumara Hosted (v4)
- Secondary: Chrome AI (if on Chrome)
- Rationale: Just works, no setup

**Budget-Conscious:**
- Primary: Chrome AI
- Secondary: LM Studio
- Rationale: Zero cost forever

**Multi-Device User:**
- Primary: Gemini API or Lumara Hosted
- Rationale: Works everywhere, syncs across devices

---

## Dependencies

### External Dependencies
1. **Chrome Prompt API Origin Trial**
   - Status: Active (expires March 2026)
   - Risk: Medium (Google could end trial early)
   - Mitigation: Monitor trial status, prepare backend fallback

2. **Transformers.js Package**
   - Status: Stable (v2.x)
   - Risk: Low (well-maintained by Hugging Face)
   - Mitigation: Lock version, monitor for breaking changes

3. **Gemini Nano Model Availability**
   - Status: Rolling out gradually
   - Risk: Medium (not all users have it yet)
   - Mitigation: Show clear setup instructions

### Internal Dependencies
1. **Dexie Database** - For caching embeddings
2. **React 19** - UI for loading states
3. **Vite Dev Server** - localhost:5173 for Origin Trial

---

## Technical Architecture

### Component Structure (Future-Proof)
```
src/
├── lib/
│   ├── ai/
│   │   ├── types.ts             # AIProvider interface & types
│   │   ├── registry.ts          # Provider registry & selection
│   │   │
│   │   ├── providers/           # v1: Only ChromeAIProvider
│   │   │   ├── base.ts          # BaseProvider abstract class
│   │   │   ├── chrome-ai.ts     # v1: Chrome AI (Gemini Nano)
│   │   │   ├── gemini-api.ts    # v2: Gemini API (user's key)
│   │   │   ├── lm-studio.ts     # v3: LM Studio (localhost)
│   │   │   ├── openai.ts        # v3: OpenAI API
│   │   │   └── claude.ts        # v3: Anthropic Claude
│   │   │
│   │   ├── embeddings/          # Embedding implementations
│   │   │   ├── transformers.ts  # Browser-based (Transformers.js)
│   │   │   ├── gemini.ts        # v2: Gemini API embeddings
│   │   │   └── openai.ts        # v3: OpenAI embeddings
│   │   │
│   │   └── utils/
│   │       ├── similarity.ts    # Cosine similarity
│   │       └── streaming.ts     # v3: Streaming helpers
│   │
│   └── db.ts                    # Dexie with embedding cache
│
├── components/
│   ├── ai/
│   │   ├── AISetup.tsx          # First-time setup wizard
│   │   ├── AIStatus.tsx         # "AI Ready" indicator
│   │   ├── ProviderSelector.tsx # v2: Choose AI provider
│   │   └── APIKeyManager.tsx    # v2: Manage API keys
│   │
│   └── settings/
│       └── AISettings.tsx       # v2: AI preferences
│
└── config/
    ├── chromeAI.ts              # Origin trial token
    └── providers.ts             # Provider configuration
```

### Data Flow (v1 - Chrome AI)
```
User Input
    ↓
AI Registry
    ↓
Provider Selection
    └→ ChromeAIProvider (only option in v1)
        ├→ Chat: Chrome AI (window.ai)
        │   └→ Gemini Nano (on-device)
        │
        └→ Embeddings: Transformers.js
            └→ MiniLM-L6-v2 (cached in browser)
                ↓
            384-dim vector
                ↓
            Store in Dexie + Memory
```

### Data Flow (v3 - Multi-Provider Future)
```
User Input
    ↓
AI Registry
    ↓
Provider Selection (based on user settings)
    ├→ ChromeAIProvider (privacy-first)
    ├→ LMStudioProvider (power users)
    ├→ GeminiAPIProvider (cloud fallback)
    ├→ OpenAIProvider (alternative)
    └→ ClaudeProvider (alternative)
        │
        ├→ Chat: Provider-specific
        │   ├─ Chrome AI: window.ai
        │   ├─ LM Studio: fetch('http://localhost:1234')
        │   ├─ Gemini: fetch('https://generativelanguage.googleapis.com')
        │   ├─ OpenAI: OpenAI SDK
        │   └─ Claude: Anthropic SDK
        │
        └→ Embeddings: Provider-specific
            ├─ Browser: Transformers.js (free)
            ├─ Gemini: API embeddings (paid)
            └─ OpenAI: API embeddings (paid)
```

### Adding New Providers (Developer Guide)

**Step 1: Implement Interface**
```typescript
// src/lib/ai/providers/my-provider.ts
import { BaseProvider } from './base';

export class MyProvider extends BaseProvider {
  name = 'My Cool AI';
  type = 'cloud'; // or 'local' | 'hosted'
  requiresApiKey = true;

  capabilities = {
    chat: true,
    embeddings: true,
    streaming: false,
    multimodal: false,
  };

  async chat(message: string): Promise<string> {
    // Your implementation
  }

  async embed(text: string): Promise<number[]> {
    // Your implementation
  }

  async initialize(config?: ProviderConfig): Promise<void> {
    // Setup logic
  }

  async healthCheck(): Promise<ProviderHealth> {
    // Return availability status
  }
}
```

**Step 2: Register Provider**
```typescript
// src/lib/ai/registry.ts
import { MyProvider } from './providers/my-provider';

export const providerRegistry = {
  'chrome-ai': ChromeAIProvider,
  'gemini': GeminiAPIProvider,
  'my-cool-ai': MyProvider, // ← Add here
  // ... more providers
};
```

**Step 3: Add to Settings UI**
```typescript
// src/components/settings/AISettings.tsx
<ProviderSelector
  options={[
    { value: 'chrome-ai', label: 'Chrome AI (Free)' },
    { value: 'gemini', label: 'Google Gemini' },
    { value: 'my-cool-ai', label: 'My Cool AI' }, // ← Add here
  ]}
/>
```

**That's it!** The abstraction handles the rest.

---

## Implementation Plan

### Phase 1: Chrome AI Setup (Days 1-2)
1. Register for Origin Trial → get token
2. Add token to `index.html`
3. Create `chromeAI.ts` service
4. Implement session management
5. Test basic chat functionality

**Deliverable:** Chat works in Chrome Canary

---

### Phase 2: Embeddings Integration (Days 3-4)
1. Install Transformers.js
2. Create `embeddings.ts` service
3. Implement model loading with progress
4. Test embedding generation
5. Add caching layer

**Deliverable:** Embeddings generate <100ms

---

### Phase 3: Similarity Detection (Day 5)
1. Implement cosine similarity
2. Create `findSimilar()` function
3. Test with sample memories
4. Validate accuracy thresholds

**Deliverable:** Similarity detection working

---

### Phase 4: Provider Abstraction (Day 6)
1. Define `AIProvider` interface
2. Refactor Chrome AI to use interface
3. Create auto-selection logic
4. Add error handling

**Deliverable:** Clean architecture for future providers

---

### Phase 5: UX Polish (Day 7)
1. Build loading UI components
2. Add progress indicators
3. Implement error states
4. Add "privacy" messaging

**Deliverable:** Great first-time experience

---

### Phase 6: Testing & Validation (Days 8-10)
1. Test on different devices
2. Validate performance targets
3. Test offline functionality
4. Document setup for team

**Deliverable:** Production-ready AI foundation

---

## Risk Assessment

### High Risks

#### Risk 1: Chrome AI Not Working for All Users
**Probability:** Medium
**Impact:** High
**Mitigation:**
- Provide clear instructions for Origin Trial setup
- Show browser compatibility checker
- Prepare backend fallback for v2

#### Risk 2: Model Download Fails
**Probability:** Low
**Impact:** High
**Mitigation:**
- Retry logic with exponential backoff
- Clear error messages with troubleshooting steps
- Test on slow connections

### Medium Risks

#### Risk 3: Performance on Older Devices
**Probability:** Medium
**Impact:** Medium
**Mitigation:**
- Set minimum device requirements (8GB RAM)
- Show warning on low-spec devices
- Optimize with Web Workers if needed

#### Risk 4: Origin Trial Expires
**Probability:** Low (March 2026)
**Impact:** High
**Mitigation:**
- Monitor trial status monthly
- Plan backend fallback well in advance
- Prepare user migration strategy

---

## Open Questions

1. **Fallback Strategy:** Should we build backend fallback now or wait until Chrome Stable ships?
   - **Recommendation:** Wait, focus on Chrome AI validation first

2. **Multi-browser Support:** When do we add Firefox/Safari support?
   - **Recommendation:** After Chrome AI validated, add optional API key support

3. **Model Updates:** How do we handle Chrome AI model updates?
   - **Recommendation:** Auto-detect and prompt user to refresh

4. **User Education:** How do we communicate "local-first" benefit?
   - **Recommendation:** Prominent "🔒 Everything stays on your device" badge

---

## Appendix

### Origin Trial Setup Instructions
```html
<!-- In index.html <head> -->
<meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE">
```

Register at: https://developer.chrome.com/origintrials/#/view_trial/4270982440984576

### Embedding Model Details
- **Model:** Xenova/all-MiniLM-L6-v2
- **Size:** 23MB
- **Dimensions:** 384
- **Speed:** ~50ms per text (after load)
- **Quality:** Suitable for sentence similarity

### Browser Compatibility Matrix
| Browser | Chrome AI | Embeddings | Status |
|---------|-----------|------------|---------|
| Chrome Canary 130+ | ✅ | ✅ | Full support |
| Chrome Dev 130+ | ✅ | ✅ | Full support |
| Chrome Stable | ❌ | ✅ | Partial (no chat) |
| Firefox | ❌ | ✅ | Embeddings only |
| Safari | ❌ | ✅ | Embeddings only |

### Performance Benchmarks (Target)
```
Initial Load (first visit):
- Chrome AI: 0ms (already on device)
- Transformers.js: 10-30s (23MB download)
- Total first visit: ~30s

Subsequent Loads:
- Chrome AI: <1s (session creation)
- Transformers.js: <1s (from cache)
- Total: <2s

Per-Operation:
- Chat response: 500-2000ms
- Embedding generation: 50-100ms
- Similarity check: <10ms per comparison
```

---

## Next Steps

After this PRD is approved:
1. **Parse to Epic:** Run `/pm:prd-parse ai-foundation-setup`
2. **Decompose Tasks:** Break into implementable tasks
3. **Start Development:** Begin with Chrome AI integration
4. **Validation:** Test with real users in Chrome Canary

**Estimated Timeline:** 10 working days
**Estimated Effort:** 1 developer, full-time
**Dependencies:** None (can start immediately)

---

## Strategic Benefits of Provider Abstraction

### Why Build This Way?

#### 1. **Competitive Moat**
- **Privacy-first positioning:** Chrome AI + LM Studio differentiate from cloud-only competitors
- **Cost advantage:** Zero AI costs for free tier = sustainable growth
- **Flexibility as feature:** "Works with YOUR preferred AI" = unique selling point

#### 2. **Risk Mitigation**
- **Not locked to single vendor:** If Chrome AI ends, we have fallbacks
- **Price changes:** Can switch providers if costs spike
- **Availability:** Works even if one provider has outages
- **Compliance:** Can choose local-only for regulated industries

#### 3. **User Choice = User Power**
```
Privacy-conscious → Chrome AI (free, private)
Power users → LM Studio (control, customization)
Multi-device → Gemini API (sync, anywhere)
Non-technical → Lumara Hosted (just works)
```

Everyone finds their fit, nobody excluded.

#### 4. **Future-Proof Technology Choices**
```
Today (2025):
- Chrome AI: Experimental but promising
- Transformers.js: Stable, improving

Tomorrow (2026):
- Chrome AI: Maybe standard, maybe gone
- WebGPU: Better acceleration
- New models: Better quality

With abstraction:
- Swap providers without rewriting app
- Add new tech as it emerges
- Users choose what works for them
```

#### 5. **Business Model Flexibility**
```
Phase 1: Free (Chrome AI) → Attract users
Phase 2: Freemium (LM Studio + cloud) → Power users pay
Phase 3: Premium (Lumara Hosted) → Casual users subscribe
Phase 4: Enterprise (Custom deployment) → Big contracts
```

One architecture supports entire business evolution.

### What We're Building vs. Competitors

| Feature | Lumara (This PRD) | ChatGPT | Supermemory | Notion AI |
|---------|-------------------|---------|-------------|-----------|
| **Provider Choice** | ✅ Any provider | ❌ OpenAI only | ❌ Backend only | ❌ Proprietary |
| **Local-First Option** | ✅ Chrome AI/LM Studio | ❌ Cloud only | ❌ Cloud only | ❌ Cloud only |
| **User Owns Data** | ✅ IndexedDB | ❌ OpenAI servers | ⚠️ Their backend | ❌ Notion servers |
| **Zero Cost Option** | ✅ Chrome AI free | ❌ $20/month | ❌ TBD pricing | ❌ $10/seat |
| **Offline Capable** | ✅ After setup | ❌ No | ❌ No | ❌ No |
| **API Key Not Required** | ✅ Chrome AI | ❌ Required | ❌ Required | ❌ Required |

**Result:** Lumara is positioned as the privacy-first, cost-free alternative to every competitor.

---

## Next Steps

After this PRD is approved:
1. **Parse to Epic:** Run `/pm:prd-parse ai-foundation-setup`
2. **Decompose Tasks:** Break into implementable tasks
3. **Start Development:** Begin with Chrome AI + provider abstraction
4. **Validation:** Test with real users in Chrome Canary
5. **Plan v2:** Prepare Gemini API integration (3 months)

**Estimated Timeline:** 10 working days (v1)
**Estimated Effort:** 1 developer, full-time
**Dependencies:** None (can start immediately)

**Critical Success Factor:** Get the provider abstraction RIGHT in v1, even if we only implement Chrome AI. This makes all future providers trivial to add.

---

*Created: 2025-10-14*
*Status: Backlog*
*Owner: Engineering Team*
*Reviewer: Product/Engineering Lead*

**Key Decision:** Build provider abstraction from day 1, implement only Chrome AI initially, add more providers as we grow.
