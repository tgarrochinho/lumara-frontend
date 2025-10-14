---
created: 2025-10-14T16:58:14Z
last_updated: 2025-10-14T16:58:14Z
version: 1.0
author: Claude Code PM System
---

# Product Context & Requirements

## Product Vision

**Lumara:** A metacognitive AI partner that helps you build personal truth by tracking how your understanding evolves over time.

### The Core Innovation

**Track not just what sources say, but how YOU interpret them.**

```
Three Types of Truth:
├─ External Truth (what sources say) → ChatGPT/Claude do this
├─ Collective Truth (what documents reveal) → Supermemory does this
└─ Personal Truth (what works for YOU) → Only Lumara does this ✨
```

---

## The Fundamental Difference

### What Everyone Else Does
Store static information: "Coach said use continental grip"

### What Lumara Does
Track evolution of understanding:

```
Jan 1:  "Coach said continental grip"
        I understood: "Use for all serves"
        Tested: 40% success

Feb 1:  "Coach said continental grip" (same source!)
        I understood: "Only for flat serves"
        Tested: 70% success

Mar 1:  "Coach said continental grip" (same source!)
        I understood: "It's about wrist angle, not grip"
        Tested: 85% success

Personal Truth: Context-dependent technique with flexible wrist
Confidence: 85% (stable for 45 days)
```

**The source didn't change. Your understanding evolved. Only Lumara tracks that journey.**

---

## Target Users

### Primary: Knowledge Workers
- **Product Managers** - Track what actually improves team productivity
- **Consultants** - Build pattern library of what works where
- **Entrepreneurs** - Test assumptions, track learnings
- **Coaches** - Document what techniques work for which clients

### Secondary: Skill Learners
- **Athletes** - Track technique evolution, what actually improves performance
- **Developers** - Track framework patterns, what actually ships quality code
- **Musicians** - Track practice techniques, what actually improves sound
- **Language Learners** - Track grammar rules, what actually works in conversation

### Tertiary: Researchers
- **PhD Students** - Organize literature, track understanding evolution
- **Academics** - Synthesize contradictions, build defensible arguments
- **Writers** - Track research, develop personal voice

---

## Core Features (Current & Planned)

### ✅ Implemented: AI Foundation
- **Local-First AI:** Chrome Gemini Nano + Transformers.js
- **Provider Abstraction:** Extensible for future AI providers
- **Embeddings:** 384-dim vectors for semantic similarity
- **Similarity Detection:** Cosine similarity with <50ms performance
- **Contradiction Detection:** Semantic analysis ready for UI
- **Error Handling:** Comprehensive retry logic

### 🚀 Next: Understanding Evolution MVP (2 weeks)
**The killer differentiator - what nobody else has**

**Features:**
1. **Evolution Timeline**
   - Visual timeline of how understanding changed
   - Show trigger events (contradiction, practice, reflection)
   - Display confidence trajectory
   - Highlight breakthrough moments

2. **Interpretation Tracking**
   - Capture user's understanding at each point
   - Link to source material (unchanging)
   - Track reinterpretations of same source
   - Show what caused reinterpretation

3. **Confidence Scoring**
   - Based on testing results (success rate)
   - Stability over time (how long stable)
   - Contradiction resolution (conflicts resolved)
   - Personal experience (direct vs. indirect)

4. **Practice/Testing Tracking**
   - Record attempts and successes
   - Link results to interpretations
   - Update confidence automatically
   - Show improvement over time

### 📋 Phase 2: Memory Architecture (20 days)
**Transform from documents to memory-based system**

**Phases:**
- **Phase 0:** Foundation & planning (days 1-2)
- **Phase 1:** Data model evolution (days 3-5)
- **Phase 2:** UI restructure - 3-panel layout (days 6-10)
- **Phase 3:** Memory mechanics & consolidation (days 11-15)
- **Phase 4:** Polish & migration (days 16-20)

**Memory Types (Psychology-Based):**
- **Episodic:** Experiences (what happened)
- **Semantic:** Knowledge (what you know)
- **Procedural:** Methods (how to do things)
- **Working:** Current session (7±2 items limit)
- **Long-Term:** Consolidated knowledge

### 💎 Phase 3: Core Features
1. **Living Playbooks**
   - Auto-generate from high-confidence knowledge
   - Update as understanding evolves
   - Show decay warnings for old sections
   - Organize by confidence level

2. **Thinking Coach**
   - Detect confirmation bias
   - Warn about overconfidence
   - Suggest testing untested beliefs
   - Highlight stagnant knowledge

3. **Pattern Discovery**
   - Find temporal patterns
   - Identify causal relationships
   - Suggest connections
   - Surface insights

---

## User Experience Principles

### 1. Metacognitive Awareness
**Show users HOW they think, not just what they think**

- Evolution timelines make thinking visible
- Confidence scores reveal certainty levels
- Contradiction alerts highlight conflicts
- Pattern discoveries surface blind spots

### 2. Local-First Privacy
**Data never leaves user's device**

- All AI processing client-side
- IndexedDB for local storage
- Offline-capable after setup
- No server tracking

### 3. Progressive Disclosure
**Simple on surface, powerful underneath**

- Start with simple memory capture
- Reveal evolution timeline when relevant
- Show patterns when discovered
- Advanced features opt-in

### 4. Confidence Over Quantity
**Quality of understanding matters more than volume**

- Confidence bars everywhere
- Test results affect scoring
- Decay warnings for old knowledge
- Encourage periodic review

---

## User Journeys

### Journey 1: First-Time User (Product Manager)
1. **Sign up** → See onboarding: "Track what actually works"
2. **Add first memory** → "Daily standups are essential"
3. **AI detects pattern** → "You said standups waste time 3 weeks ago"
4. **Contradiction alert** → Choose to keep both, add context
5. **Track testing** → Record next 5 standups, 3 worked well
6. **See evolution** → Timeline shows opinion changed
7. **Generate playbook** → "Standups work for co-located teams <7 people"
8. **Aha moment** → "This tracks MY truth, not generic advice"

### Journey 2: Skill Learner (Tennis Player)
1. **Add technique note** → "Coach says continental grip"
2. **Test in practice** → Record 10 serves, 4 successful
3. **Confidence score** → 40% (low, based on testing)
4. **Practice more** → Adjust understanding: "Continental for flat serves only"
5. **Test again** → 7/10 successful
6. **Confidence updates** → 70% (improving)
7. **Breakthrough** → "It's about wrist angle, not just grip"
8. **See evolution** → 3-month timeline shows journey to 85% confidence

### Journey 3: Researcher (PhD Student)
1. **Add literature note** → "Smith says X about memory"
2. **Add contradicting note** → "Jones says Y about memory"
3. **Contradiction detected** → Both papers shown side-by-side
4. **Synthesize** → "Context matters: X for short-term, Y for long-term"
5. **Track understanding** → Evolution from confusion to clarity
6. **Generate insight** → Pattern: Memory type determines mechanism
7. **Build argument** → Defensible thesis from tracked evolution

---

## Success Metrics

### User Success Signals
- "I can see how my thinking evolved"
- "I know what I actually know vs. what I assume"
- "I caught my own contradictions"
- "I can defend my decisions with evidence"

### Business Metrics
- **Day 1:** User creates 3+ memories
- **Day 7:** First contradiction resolved
- **Day 14:** First evolution timeline viewed
- **Day 30:** 70% still active
- **Month 3:** 80% retention

### North Star Metric
**Average confidence increase over time**
- Shows users building trusted knowledge
- Not just storing information
- Quality over quantity focus

---

## Competitive Positioning

### vs. ChatGPT
- **Them:** External truth (what AI knows)
- **Us:** Personal truth (what YOU know works)
- **Differentiator:** Evolution tracking

### vs. Supermemory
- **Them:** Document storage + RAG search
- **Us:** Understanding evolution + confidence scoring
- **Differentiator:** Track interpretation, not just storage

### vs. Notion AI
- **Them:** Document organization with AI assist
- **Us:** Memory psychology + evolution tracking
- **Differentiator:** Scientific memory model

### vs. Obsidian
- **Them:** Networked notes (PKM)
- **Us:** Metacognitive partner (thinking coach)
- **Differentiator:** Active contradiction detection

---

## Business Model (Future)

### Pricing Tiers
- **Starter:** $20/month - 100 memories, basic features
- **Professional:** $40/month - Unlimited, all features
- **Team:** $60/month/user - Shared knowledge spaces
- **Enterprise:** Custom pricing - SSO, compliance, SLA

### Value Proposition
- **For PM:** $40/month = 1 hour saved per month = ROI
- **For Consultant:** Better client recommendations = Worth 10x
- **For Student:** Faster learning = Priceless

---

## Must-Preserve Features

**From `docs/CORE_FEATURES.md`:**

1. **Contradiction Detection**
   - Embeddings + semantic similarity (>0.7)
   - Resolution UI component
   - Threshold-based detection
   - Must keep functional during refactors

2. **Duplication Detection**
   - Cosine similarity (>0.85)
   - Pre-creation alerts
   - Prevention mechanism
   - User notification before duplicating

---

## Documentation References

- **Product Vision:** `docs/PRODUCT_DEFINITION_COMPLETE.md`
- **Killer Feature:** `docs/UNDERSTANDING_EVOLUTION_MVP.md`
- **Memory Architecture:** `docs/MEMORY_IMPLEMENTATION_PLAN.md`
- **Core Features:** `docs/CORE_FEATURES.md`
- **UI/UX:** `docs/UI_UX_SPECIFICATIONS.md`
- **Brand:** `docs/LUMARA_BRAND_GUIDELINES.md`

---

**Last Updated:** 2025-10-14T16:58:14Z
