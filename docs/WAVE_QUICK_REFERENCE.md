# Wave Execution Quick Reference

**For:** CCPM `/pm` command execution
**Source:** `docs/WAVE_ROADMAP.md`

---

## ✅ Completed Waves

### Wave 0.1: Project Bootstrap
```bash
# Status: ✅ Implemented
# PRD: .claude/prds/project-bootstrap.md
```

### Wave 0.2: AI Foundation Setup
```bash
# Status: ✅ Implemented
# PRD: .claude/prds/ai-foundation-setup.md
```

---

## 🚀 Next Wave: Understanding Evolution MVP

### Command to Start
```bash
/pm:prd-new understanding-evolution "Track how user understanding evolves over time with visual timeline, confidence scoring, and practice tracking - the killer differentiator"
```

### After PRD Created
```bash
# 1. Parse PRD to Epic
/pm:prd-parse understanding-evolution

# 2. Decompose Epic to Tasks
/pm:epic-decompose understanding-evolution

# 3. Sync to GitHub Issues
/pm:github-sync understanding-evolution

# 4. Start Parallel Execution
/pm:epic-start understanding-evolution
```

---

## 📋 Future Waves (In Order)

### Wave 2: Memory Architecture Foundation
**Duration:** 10 days | **Priority:** HIGH

```bash
/pm:prd-new memory-foundation "Transform data model to psychology-based memory system with types, strength tracking, and consolidation states"
```

**Scope:** Phases 0-2 of Memory Implementation Plan
- Foundation & planning (Days 1-2)
- Data model evolution (Days 3-5)
- Basic UI restructure (Days 6-10)

---

### Wave 3: Memory Mechanics & Polish
**Duration:** 10 days | **Priority:** HIGH

```bash
/pm:prd-new memory-mechanics "Add memory consolidation engine, strength algorithms, animations, and data migration"
```

**Scope:** Phases 3-4 of Memory Implementation Plan
- Memory mechanics (Days 1-5)
- Polish & migration (Days 6-10)

---

### Wave 4: Core Product Features
**Duration:** 3 weeks | **Priority:** MEDIUM

```bash
/pm:prd-new core-features "Living playbooks, thinking coach, and pattern discovery features"
```

**Sub-Waves (Can Execute Separately):**
- 4.1: Living Playbooks (Week 1)
- 4.2: Thinking Coach (Week 2)
- 4.3: Pattern Discovery (Week 3)

---

### Wave 5: Contradiction Resolution UI
**Duration:** 1 week | **Priority:** HIGH

```bash
/pm:prd-new contradiction-ui "User-friendly contradiction resolution interface with side-by-side comparison and resolution options"
```

**Dependencies:** Wave 1 (Evolution MVP)

---

### Wave 6: Duplication Detection & Prevention
**Duration:** 3 days | **Priority:** MEDIUM

```bash
/pm:prd-new duplication-prevention "Prevent duplicate memory creation with pre-check alerts and merge suggestions"
```

**Can run parallel with:** Wave 5

---

### Wave 7: Multi-Provider Support
**Duration:** 2 weeks | **Priority:** MEDIUM

```bash
/pm:prd-new multi-provider "Add Gemini API, OpenAI, Claude, and LM Studio provider support with API key management"
```

**Scope:** v2-v3 provider roadmap
- v2: Gemini API + key management (Week 1)
- v3: OpenAI, Claude, LM Studio (Week 2)

---

## 🔄 Standard Wave Workflow

For any new wave:

```bash
# 1. Create PRD
/pm:prd-new [wave-name] "[description]"

# 2. Parse to Epic
/pm:prd-parse [wave-name]

# 3. Decompose Tasks
/pm:epic-decompose [wave-name]

# 4. Sync to GitHub
/pm:github-sync [wave-name]

# 5. Execute (parallel agents spawn)
/pm:epic-start [wave-name]

# 6. On completion:
#    - Create PR
#    - Merge to main
#    - Mark PRD as implemented
#    - Update context docs
```

---

## 📊 Wave Status Overview

| Wave | Status | Duration | Priority | Dependencies |
|------|--------|----------|----------|--------------|
| 0.1 Bootstrap | ✅ Done | 3 days | - | None |
| 0.2 AI Foundation | ✅ Done | 1 week | - | Wave 0.1 |
| **1 Evolution MVP** | **🎯 Next** | **2 weeks** | **CRITICAL** | Wave 0.2 |
| 2 Memory Foundation | 📋 Planned | 10 days | HIGH | Wave 1 |
| 3 Memory Mechanics | 📋 Planned | 10 days | HIGH | Wave 2 |
| 4 Core Features | 📋 Planned | 3 weeks | MEDIUM | Wave 2 |
| 5 Contradiction UI | 📋 Planned | 1 week | HIGH | Wave 1, 2 |
| 6 Duplication | 📋 Planned | 3 days | MEDIUM | Wave 2 |
| 7 Multi-Provider | 📋 Future | 2 weeks | MEDIUM | Wave 0.2 |

---

## 🎯 Why Wave 1 First?

**Understanding Evolution MVP is the killer feature:**
- ✨ **Unique:** Nobody else tracks understanding evolution
- 🎨 **Demostrable:** 60-second "aha moment" demo
- 📈 **Validates:** Core value proposition
- 🔑 **Differentiates:** From ChatGPT, Supermemory, Notion AI
- ⚡ **Foundation Ready:** All AI capabilities in place

**User reaction goal:** "This isn't just notes - it's my intellectual journey."

---

## 📝 After Wave Completion

Update these files:
1. `.claude/prds/[wave-name].md` - Mark status as "implemented"
2. `.claude/context/progress.md` - Add to completed epics
3. `.claude/context/project-state.md` - Update current state
4. `docs/WAVE_ROADMAP.md` - Mark wave as complete
5. This file - Update status table

---

**Quick Access:** Keep this file open when executing waves
**Full Details:** See `docs/WAVE_ROADMAP.md`
