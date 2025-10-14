# Lumara Feature Wave Roadmap

**Status:** Foundation Complete (Waves 0.1-0.2 ✅)
**Next:** Wave 1 - Understanding Evolution MVP
**Last Updated:** 2025-10-14

---

## 🎯 Strategic Overview

Lumara's development follows a wave-based approach, where each wave delivers a cohesive set of user-facing features. Waves can be executed with the CCPM `/pm` command system.

### Completed Waves ✅

#### Wave 0.1: Project Bootstrap (Epic 1)
**Status:** ✅ Implemented
**Duration:** 3 days
**Deliverables:**
- React 19 + TypeScript 5.9 + Vite 7 setup
- Vitest testing infrastructure
- Dexie.js IndexedDB persistence
- Tailwind CSS 4 styling system
- ESLint + Prettier code quality
- Development tooling complete

#### Wave 0.2: AI Foundation Setup (Epic 2)
**Status:** ✅ Implemented
**Duration:** 1 week (parallel execution)
**Deliverables:**
- Provider abstraction layer (extensible AI system)
- Chrome AI integration (Gemini Nano)
- Mock AI provider (testing)
- Transformers.js embeddings (384-dim vectors)
- Cosine similarity & semantic search
- Contradiction detection utilities
- Embedding cache system
- Comprehensive test suite (607 tests)

**Foundation Result:** Complete local-first AI system, zero server costs, ready for feature development.

---

## 🚀 Upcoming Waves

### Wave 1: Core User Journey (THE FOUNDATION)
**Status:** 🎯 Next Up
**Priority:** CRITICAL - Users must be able to USE the product
**Duration:** 1 week
**Source:** `docs/ONBOARDING_COLD_START_STRATEGY.md` + `docs/UI_UX_SPECIFICATIONS.md`
**PRD:** `/pm:prd-new core-user-journey "Basic memory capture, conversation interface, and viewing - the essential user experience"`

#### Why First?
Users need to be able to CREATE and VIEW memories before we can track evolution. This is the minimum viable experience that lets users start using Lumara.

#### Features
1. **Memory Capture Flow**
   - Conversational memory creation
   - Text input with AI assistance
   - Memory type selection (knowledge/experience/method)
   - Save to Dexie database

2. **Conversation Interface**
   - Chat UI with AI responses (using our Chrome AI provider)
   - Context-aware suggestions
   - Memory extraction from conversation
   - Real-time AI interaction

3. **Memory Viewing & Browsing**
   - List view of all memories
   - Filter by type
   - Search functionality
   - Memory cards with metadata
   - Edit/delete operations

4. **Basic Contradiction Detection UI**
   - Inline contradiction alerts
   - "Similar memory exists" warnings
   - Simple resolution options
   - Uses existing detection from Wave 0.2

#### Technical Approach
- Build on existing AI foundation (Wave 0.2)
- Use existing Dexie schema (Memory table ready)
- Create core UI components
- Integrate Chrome AI chat for conversation
- Wire up contradiction detection (backend ready, need UI)

#### Success Metrics
- User can create first memory in <2 minutes
- User can browse/search memories
- User sees contradiction alert on conflict
- Flow feels natural and intuitive

---

### Wave 2: Understanding Evolution MVP (THE KILLER FEATURE)
**Status:** 📋 Planned (after Wave 1)
**Priority:** CRITICAL - Product differentiator
**Duration:** 2 weeks
**Source:** `docs/UNDERSTANDING_EVOLUTION_MVP.md`
**PRD:** `/pm:prd-new understanding-evolution "Track how user understanding evolves over time - the killer differentiator"`

#### Why Second (Not First)?
Now users have memories to EVOLVE. They've created knowledge, resolved contradictions, and have data to visualize. Evolution tracking makes sense because there's evolution to track.

#### Features
1. **Evolution Timeline Visualization**
   - Visual timeline showing understanding changes
   - Trigger event markers (contradiction, practice, reflection)
   - Confidence trajectory graph
   - Breakthrough moment highlights

2. **Interpretation Tracking**
   - Capture user's understanding at each point
   - Link to source material (unchanging)
   - Track reinterpretations of same source
   - Show what caused each reinterpretation

3. **Confidence Scoring Algorithm**
   - Based on testing results (success rate)
   - Stability over time (how long unchanged)
   - Contradiction resolution count
   - Direct vs. indirect experience weighting

4. **Practice/Testing Tracking**
   - Record attempts and successes
   - Link results to interpretations
   - Auto-update confidence scores
   - Show improvement metrics

#### Technical Approach
- Extend existing Memory database schema
- Add `interpretations` array to Memory type
- Create timeline UI component (React + Framer Motion)
- Implement confidence calculation algorithm
- Build practice tracking system

#### Success Metrics
- Users can visualize 3+ evolution points
- Average confidence increase visible over time
- "Aha moment" - users see their thinking journey
- Feature demoed in <60 seconds

---

### Wave 3: Memory Architecture Foundation
**Status:** 📋 Planned
**Priority:** HIGH - Core transformation
**Duration:** 10 days (Phase 0-2 of 20-day plan)
**Source:** `docs/MEMORY_IMPLEMENTATION_PLAN.md` (Phases 0-2)
**PRD:** `/pm:prd-new memory-foundation "Transform data model to psychology-based memory system"`

#### Scope (Phases 0-2 Only)
**Phase 0 (Days 1-2):** Foundation & Planning
- Feature flags for gradual rollout
- Type extensions for memory concepts
- Migration strategy documentation

**Phase 1 (Days 3-5):** Data Model Evolution
- Extend Memory interface with:
  - Memory types (episodic, semantic, procedural)
  - Strength tracking (0-100)
  - Consolidation states
  - Temporal context
  - Associations
- Database schema migration (Dexie v3)
- Preserve existing contradiction/duplication features

**Phase 2 (Days 6-10):** Basic UI Restructure
- Implement three-panel layout skeleton:
  - Left: Working Memory (7±2 items)
  - Center: Conversation
  - Right: Long-Term Memory
- Memory type badges
- Basic strength indicators
- No animations yet (Phase 3)

#### Why Split Here?
This gives us a working memory-based data model and basic UI. Wave 3 adds the advanced mechanics and polish.

---

### Wave 4: Memory Mechanics & Polish
**Status:** 📋 Planned
**Priority:** HIGH - Complete memory system
**Duration:** 10 days (Phase 3-4 of 20-day plan)
**Source:** `docs/MEMORY_IMPLEMENTATION_PLAN.md` (Phases 3-4)
**PRD:** `/pm:prd-new memory-mechanics "Add consolidation, strength algorithms, and animations"`

#### Scope (Phases 3-4)
**Phase 3 (Days 1-5):** Memory Mechanics
- Memory strength algorithm (Ebbinghaus curve)
- Consolidation engine (working → long-term)
- Spaced repetition system
- Pattern recognition (temporal, causal)
- Enhanced contradiction resolution UI
- Association discovery

**Phase 4 (Days 6-10):** Polish & Migration
- Smooth animations (Framer Motion + GSAP)
- Data migration from old schema
- Performance optimization
- User preferences
- Memory journal feature
- Analytics dashboard

---

### Wave 5: Core Product Features
**Status:** 📋 Planned
**Priority:** MEDIUM - Value-add features
**Duration:** 3 weeks
**Source:** `docs/PRODUCT_DEFINITION_COMPLETE.md`
**PRD:** `/pm:prd-new core-features "Playbooks, Thinking Coach, and Pattern Discovery"`

#### Features

**5.1: Living Playbooks (Week 1)**
- Auto-generate from high-confidence knowledge (>80%)
- Group by topic/domain
- Show confidence per recommendation
- Last tested timestamps
- Success rates when followed
- Auto-update with new evidence
- Decay warnings for old sections

**5.2: Thinking Coach (Week 2)**
- Detect confirmation bias (ignoring contradictions)
- Warn about overconfidence (high confidence, low testing)
- Identify stagnation (beliefs unchanged for months)
- Suggest testing untested beliefs
- Highlight avoidance patterns
- Provide gentle nudges

**5.3: Pattern Discovery (Week 3)**
- Temporal pattern detection
- Causal relationship identification
- Suggest connections between memories
- Surface non-obvious insights
- Correlation analysis
- Behavioral pattern recognition

---

### Wave 6: Contradiction Resolution UI
**Status:** 📋 Planned
**Priority:** HIGH - Must-have for MVP
**Duration:** 1 week
**Source:** `docs/CORE_FEATURES.md`
**PRD:** `/pm:prd-new contradiction-ui "User-friendly contradiction resolution interface"`

#### Features
- Inline contradiction alerts in conversation
- Side-by-side comparison view
- Resolution options UI:
  - Keep both (context matters)
  - Replace old with new
  - Keep original
  - Merge into nuanced view
- Resolution history tracking
- Confidence impact visualization
- Undo/redo resolution decisions

#### Technical Requirements
- Build on existing contradiction detection (Wave 0.2)
- Create ContradictionResolutionDecision component
- Integrate with Understanding Evolution (Wave 1)
- Update confidence scores after resolution

---

### Wave 7: Duplication Detection & Prevention
**Status:** 📋 Planned
**Priority:** MEDIUM - Quality of life
**Duration:** 3 days
**Source:** `docs/CORE_FEATURES.md`
**PRD:** `/pm:prd-new duplication-prevention "Prevent duplicate memory creation"`

#### Features
- Pre-creation duplicate check (>0.85 similarity)
- Alert before creating duplicate
- Show similar existing memories
- Merge suggestions
- DuplicationResolutionDecision component
- Batch deduplication tool

---

### Wave 8: Multi-Provider Support
**Status:** 📋 Future
**Priority:** MEDIUM - Expand compatibility
**Duration:** 2 weeks
**Source:** `.claude/prds/ai-foundation-setup.md` (v2-v3 roadmap)
**PRD:** `/pm:prd-new multi-provider "Add Gemini API, OpenAI, Claude, LM Studio support"`

#### v2 Features (Week 1)
- Gemini API integration
- API key management UI
- Provider selection settings
- Cost tracking per provider
- Fallback logic

#### v3 Features (Week 2)
- LM Studio integration (localhost:1234)
- OpenAI API support
- Anthropic Claude support
- Provider comparison benchmarks
- Streaming responses

---

## 📊 Wave Execution Strategy

### Phase-Based Execution
Each wave can be executed using CCPM commands:

```bash
# 1. Create PRD
/pm:prd-new [wave-name] "[description]"

# 2. Parse PRD to Epic
/pm:prd-parse [wave-name]

# 3. Decompose Epic to Tasks
/pm:epic-decompose [wave-name]

# 4. Sync to GitHub
/pm:github-sync [wave-name]

# 5. Execute (parallel agents)
/pm:epic-start [wave-name]

# 6. Complete & PR
# Create PR, merge, mark PRD as implemented
```

### Wave Dependencies

```
Wave 0.1 (Bootstrap) ──┐
                       ├─→ Wave 0.2 (AI Foundation) ──┐
                       │                              │
                       │                              ├─→ Wave 1 (Core User Journey) ──┐
                       │                              │                                 │
                       └──────────────────────────────┘                                 │
                                                                                         │
                                                                                         ├─→ Wave 2 (Evolution MVP) ──┐
                                                                                         │                            │
                                                                                         └────────────────────────────┘
                                                                                                                      │
Wave 3 (Memory Foundation) ◄──────────────────────────────────────────────────────────────────────────────────────┘
         │
         ├─→ Wave 4 (Memory Mechanics) ──┐
         │                               │
         ├─→ Wave 6 (Contradiction UI) ──┤
         │                               ├─→ Wave 5 (Core Features)
         └─→ Wave 7 (Duplication)  ──────┘
```

### Parallel Execution Opportunities

**Can Run in Parallel:**
- Wave 6 (Contradiction UI) + Wave 7 (Duplication) - Different systems
- Wave 5.1, 5.2, 5.3 - Independent features

**Must Run Sequentially:**
- Wave 1 before Wave 2 - User journey before evolution tracking
- Wave 2 before Wave 3 - Evolution features before memory foundation
- Wave 3 before Wave 4 - Foundation before mechanics
- Wave 0.2 before Wave 8 - Provider abstraction must exist

---

## 🎯 Immediate Next Steps

### Wave 1: Core User Journey

**Ready to start:** ✅ All dependencies met

**Create PRD:**
```bash
/pm:prd-new core-user-journey "Basic memory capture, conversation interface, and viewing - the essential user experience"
```

**Expected Timeline:**
- Days 1-2: Memory capture flow
- Days 3-4: Conversation interface
- Days 5-6: Memory viewing & browsing
- Day 7: Basic contradiction detection UI
- Total: 1 week
- Outcome: Users can create and view memories

**Success Criteria:**
1. User can create first memory in <2 minutes
2. User can browse/search memories
3. User sees contradiction alert on conflict
4. Flow feels natural and intuitive

---

## 📈 Long-Term Roadmap (Beyond Waves)

### v2.0 Features (3-6 months)
- Mobile apps (iOS + Android)
- Team collaboration features
- Shared knowledge spaces
- Real-time sync (optional)
- Enterprise features (SSO, compliance)

### v3.0 Features (6-12 months)
- Playbook marketplace
- Expert consultations
- API for developers
- Integrations (Notion, Obsidian, Roam)
- Wearable integration

### v4.0 Features (12+ months)
- AR/VR experiences
- Voice-first interface
- Ambient intelligence
- Cognitive augmentation OS

---

## 🔍 Wave Selection Criteria

**Priority Matrix:**
1. **User Value** - Immediate benefit to users
2. **Product Differentiation** - Features nobody else has
3. **Technical Foundation** - Enables future features
4. **Risk Reduction** - Validate assumptions early

**Wave 1 (Core User Journey) - The Foundation:**
- ⭐⭐⭐⭐⭐ User Value - Essential functionality
- ⭐⭐⭐ Product Differentiation - Standard but necessary
- ⭐⭐⭐⭐⭐ Technical Foundation - Enables all other features
- ⭐⭐⭐⭐⭐ Risk Reduction - Users must be able to USE the product

**Wave 2 (Understanding Evolution) - The Differentiator:**
- ⭐⭐⭐⭐⭐ User Value - "Aha moment" feature
- ⭐⭐⭐⭐⭐ Product Differentiation - Unique to Lumara
- ⭐⭐⭐⭐ Technical Foundation - Uses AI foundation
- ⭐⭐⭐⭐⭐ Risk Reduction - Validates core value prop

---

## 📝 Notes for PM Execution

### Creating New Waves

When a wave is ready to become a PRD:

1. **Copy template from existing PRD** (e.g., `ai-foundation-setup.md`)
2. **Fill in wave details** from this document
3. **Run `/pm:prd-parse [name]`** to create epic
4. **Epic auto-decomposes** into tasks based on PRD sections
5. **Tasks sync to GitHub** as issues
6. **Parallel execution** via `/pm:epic-start [name]`

### Wave Completion Checklist

- [ ] All epic tasks completed
- [ ] Tests passing (607+ tests)
- [ ] PR created and reviewed
- [ ] PR merged to main
- [ ] PRD marked as "implemented"
- [ ] Context docs updated (`project-state.md`, `progress.md`)
- [ ] Wave roadmap updated (this file)

---

**Maintained by:** Main development agent
**Updated:** After each wave completion
**Source of truth:** This file + individual PRDs in `.claude/prds/`
