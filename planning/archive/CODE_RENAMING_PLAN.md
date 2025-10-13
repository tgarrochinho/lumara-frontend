# Internal Code Renaming Plan

**Goal:** Align internal code terminology with MVP UI terminology for consistency and maintainability.

**Why This Matters:**
- Reduces cognitive load for developers
- Makes code self-documenting
- Aligns codebase with product vision
- Easier onboarding for new developers
- No confusion between "what users see" vs "what code says"

---

## 📋 Terminology Mapping

| Old (Current Code) | New (MVP Code) | Status |
|-------------------|----------------|---------|
| `Concept` | `KeyDiscovery` (partial) | ⚠️ Partial |
| `DeepInsight` | `KeyDiscovery` (partial) | ⚠️ Partial |
| `Theme` | `Topic` | ❌ Not started |
| `Playbook` | `Guide` | ❌ Not started |
| `Artifact` | `Note` | ❌ Not started |
| `ArtifactThemeGroup` | `TopicGroup` | ❌ Not started |

---

## 🎯 Scope of Changes

### **1. Type Definitions (types.ts)**

**Current:**
```typescript
export interface Artifact { ... }
export interface Concept { ... }
export interface DeepInsight { ... }
export interface Theme { ... }
export interface Playbook { ... }
export interface ArtifactThemeGroup { ... }
```

**Target:**
```typescript
export interface Note { ... }
export interface KeyDiscovery { ... }  // Already exists!
export interface Topic { ... }
export interface Guide { ... }
export interface TopicGroup { ... }
```

**Strategy:**
- Keep old types as deprecated aliases initially
- Gradually migrate all usage
- Remove old types in final cleanup

---

### **2. Service Files**

**Files to Rename:**
```
src/services/
├── ConceptExtractionService.ts → KeyDiscoveryService.ts (✅ DONE in Week 1!)
├── gemini/geminiThemeService.ts → gemini/geminiTopicService.ts
├── gemini/geminiPlaybookService.ts → gemini/geminiGuideService.ts
└── (keep others as-is for now)
```

**Functions to Rename:**
```typescript
// OLD
generateConcepts() → generateKeyDiscoveries() (✅ DONE!)
extractThemes() → extractTopics()
generatePlaybook() → generateGuide()
groupArtifactsByTheme() → groupNotesByTopic()

// NEW
generateKeyDiscoveries() ✅
extractTopics()
generateGuide()
groupNotesByTopic()
```

---

### **3. Component Files**

**Files to Rename:**
```
src/components/
├── features/KnowledgeSidebar/ConceptsSection.tsx → (removed, using KeyDiscoveryCard)
├── features/KnowledgeSidebar/ThemesSection.tsx → TopicsSection.tsx (✅ DONE!)
├── playbook/ → guide/
│   ├── PlaybookView.tsx → GuideView.tsx
│   ├── PlaybookReviewModal.tsx → GuideReviewModal.tsx
│   └── PlaybookSkeleton.tsx → GuideSkeleton.tsx
```

---

### **4. Context Files**

**Files to Update:**
```
src/contexts/
├── KnowledgeBaseContext.tsx
│   └── Update: concepts/insights → keyDiscoveries ✅
│   └── Update: themes → topics
│   └── Update: playbooks → guides
│   └── Update: artifacts → notes
│
└── ChatContext.tsx
    └── Update: artifact → note
    └── Update: playbook → guide
```

**Variable Names:**
```typescript
// OLD
const [concepts, setConcepts] = useState<Concept[]>([]);
const [deepInsights, setDeepInsights] = useState<DeepInsight[]>([]);
const [themes, setThemes] = useState<Theme[]>([]);
const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
const [artifacts, setArtifacts] = useState<Artifact[]>([]);

// NEW
const [keyDiscoveries, setKeyDiscoveries] = useState<KeyDiscovery[]>([]); ✅
const [topics, setTopics] = useState<Topic[]>([]);
const [guides, setGuides] = useState<Guide[]>([]);
const [notes, setNotes] = useState<Note[]>([]);
```

---

### **5. Database Schema (dataService.ts)**

**Tables to Rename:**
```typescript
// Dexie table definitions
artifacts → notes
concepts → (remove, merged into keyDiscoveries)
deepInsights → (remove, merged into keyDiscoveries)
themes → topics
playbooks → guides

// Keep:
users, chatSessions, messages, contradictions
```

**Migration Strategy:**
1. Create new tables with new names
2. Migrate data from old tables
3. Update all queries
4. Remove old tables

---

## 📅 Implementation Plan

### **Week X: Code Renaming (Estimated 3-5 days)**

**Day 1: Types & Database**
- [ ] Create type aliases in types.ts
- [ ] Update database schema
- [ ] Create migration script
- [ ] Test data migration

**Day 2: Services**
- [ ] Rename service files
- [ ] Update function names
- [ ] Update all imports
- [ ] Run tests

**Day 3: Components**
- [ ] Rename component files
- [ ] Update component variable names
- [ ] Update props interfaces
- [ ] Test UI

**Day 4: Contexts & Integration**
- [ ] Update context files
- [ ] Update all state variables
- [ ] Test end-to-end flows
- [ ] Fix any breakages

**Day 5: Cleanup & Documentation**
- [ ] Remove deprecated type aliases
- [ ] Update TERMINOLOGY.md
- [ ] Update comments/docs
- [ ] Final testing
- [ ] Commit & merge

---

## 🚨 Migration Strategy

### **Option A: Big Bang (Risky)**
- Rename everything at once
- One massive commit
- High risk of breaking things
- Faster if it works

### **Option B: Gradual (Safer)** ⭐ RECOMMENDED
1. Add new types as aliases
2. Rename files one service at a time
3. Update consumers incrementally
4. Keep old types until all usage migrated
5. Remove old types in final commit

**Example:**
```typescript
// Step 1: Create aliases
export type Note = Artifact;
export type Topic = Theme;
export type Guide = Playbook;

// Step 2: Gradually change usage
// const artifacts: Artifact[] = ... 
const notes: Note[] = ...  // New code uses new name

// Step 3: Eventually remove aliases
// export type Note = Artifact;  // Remove this line
export interface Note { ... }   // Full definition
```

---

## 🧪 Testing Checklist

After each batch of renames:
- [ ] TypeScript compiles without errors
- [ ] All unit tests pass
- [ ] App loads without console errors
- [ ] Can create new notes
- [ ] Can generate key discoveries
- [ ] Can generate topics
- [ ] Can generate guides
- [ ] Database reads/writes work
- [ ] No broken imports

---

## 📊 Affected Files Count (Estimate)

- **Types:** 1 file (types.ts)
- **Services:** ~8 files
- **Components:** ~20 files
- **Contexts:** 2 files
- **Database:** 1 file (dataService.ts)
- **Tests:** ~10 files
- **Utils:** ~5 files

**Total: ~47 files to update**

---

## 🎯 Success Criteria

- [ ] All old type names removed
- [ ] All old file names renamed
- [ ] All old variable names updated
- [ ] Database schema matches new naming
- [ ] TERMINOLOGY.md updated
- [ ] No console errors
- [ ] All tests pass
- [ ] App works end-to-end
- [ ] Code is self-documenting (no UI/code mismatch)

---

## 📝 Notes

- This is primarily a **refactoring task** (no new features)
- Should be done **before** building new features on top
- Will make future development much clearer
- One-time pain for long-term gain
- Can be done in parallel with other work if careful

---

## 🔗 Related Documents

- [TERMINOLOGY.md](../TERMINOLOGY.md) - Current UI/code mappings
- [REFACTOR_ROADMAP.md](./REFACTOR_ROADMAP.md) - Overall refactor plan
- [types.ts](../src/types.ts) - Type definitions

---

**Last Updated:** 2025-01-XX  
**Status:** Planning phase
