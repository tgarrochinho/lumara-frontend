# Core Features - MUST PRESERVE

These features are fundamental to NexusMind and MUST be preserved during MVP refactoring.

---

## ⭐ 1. Contradictions Detection

**What it does:**
- Detects when two "Notes & Ideas" (Artifacts) **contradict** each other
- Shows user when their knowledge has conflicts
- Allows user to resolve contradictions

**Example:**
```
Note 1: "Exercise improves sleep quality"
Note 2: "Exercise before bed disrupts sleep"
→ CONTRADICTION DETECTED
→ User decides which to keep or how to reconcile
```

**Technical:**
- Uses embeddings + semantic similarity
- Threshold-based detection
- ContradictionResolutionDecision component
- Contradiction types and service

**During MVP:**
- ✅ KEEP detection logic
- ✅ KEEP resolution UI
- 🔄 Simplify notification flow
- 🔄 Polish UI but preserve functionality

---

## ⭐ 2. Duplication Detection

**What it does:**
- Detects when a new "Note & Idea" is **very similar** to an existing one
- Prevents duplicate entries
- Alerts user before creating duplicate

**Example:**
```
Existing Note: "Machine learning uses neural networks"
New Note: "ML utilizes neural nets"
→ DUPLICATION DETECTED
→ User can merge or keep both
```

**Technical:**
- Uses embeddings + cosine similarity
- Similar logic pattern to Contradictions
- Threshold-based detection
- DuplicationResolutionDecision component

**During MVP:**
- ✅ KEEP detection logic
- ✅ KEEP prevention mechanism
- 🔄 Simplify alert UI
- 🔄 Make it less intrusive

---

## 🎯 Why These Are Core

Both features ensure **knowledge quality**:

1. **Contradictions** → Helps user identify conflicts in their thinking
2. **Duplication** → Keeps knowledge base clean and organized

These are **unique differentiators** for NexusMind - they make it a smart thinking partner, not just a note-taking app.

---

## 🛠️ Implementation Notes

### Shared Pattern:
Both use similar detection logic:
```typescript
// Similarity detection (shared)
const similarity = cosineSimilarity(embedding1, embedding2);

if (similarity > DUPLICATION_THRESHOLD) {
  // Handle duplication
}

if (similarity > CONTRADICTION_THRESHOLD && semanticConflict) {
  // Handle contradiction
}
```

### Components:
- `ContradictionResolutionDecision.tsx` → Keep, simplify
- `DuplicationResolutionDecision.tsx` → Keep, simplify
- Detection services → Keep core logic
- UI flows → Simplify but preserve

---

## ✅ Success Criteria

After MVP refactor:
- [x] Contradictions still detected automatically
- [x] Duplications still prevented
- [x] User can resolve both types
- [x] UI is cleaner but functional
- [x] Performance is good (not slower)

---

**Remember:** These features define what makes NexusMind special. Don't remove them!
