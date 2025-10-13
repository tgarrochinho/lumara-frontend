# Knowledge Sidebar - Acceptance Criteria

**Definition of "done" for all planned work**
**Last Updated:** 2025-10-07

---

## 🎯 Purpose

This document defines clear, measurable acceptance criteria for each feature and phase of Knowledge Sidebar development. Use this as a checklist before marking any task as complete.

---

## ✅ Phase 1: Code Cleanup & Refactoring

### Task 1.1: Verify and Remove Deprecated Components

**Acceptance Criteria:**

#### Functional Requirements
- [ ] All potentially deprecated components verified (PinnedIdeasSection, TopicsSection, ThemesSection, SearchAndModeToggle)
- [ ] No imports of deprecated components found in codebase
- [ ] Deprecated component files deleted from filesystem
- [ ] `index.ts` exports updated to remove deleted components

#### Quality Requirements
- [ ] Build completes successfully: `npm run build` exits with code 0
- [ ] No TypeScript errors
- [ ] No broken imports or references
- [ ] Git commit created with clear message

#### Testing Requirements
- [ ] Dev server runs without errors: `npm run dev`
- [ ] App loads in browser without console errors
- [ ] All existing Knowledge Sidebar features work

---

### Task 1.2: Extract MainView Component

**Acceptance Criteria:**

#### Functional Requirements
- [ ] New file created: `src/components/features/KnowledgeSidebar/MainView.tsx`
- [ ] MainView component renders all existing sections:
  - [ ] Pinned section displays correctly
  - [ ] Topics section displays correctly
  - [ ] Archive section displays correctly
- [ ] Search filtering still works
- [ ] Empty states still render
- [ ] Loading states still work

#### Quality Requirements
- [ ] `KnowledgeSidebar.tsx` reduced from 745 to < 600 lines
- [ ] `MainView.tsx` is ~250 lines or less
- [ ] No code duplication between files
- [ ] Props interface clearly defined with TypeScript
- [ ] Build succeeds with no warnings
- [ ] No ESLint errors

#### Visual Requirements
- [ ] UI looks identical to before refactor
- [ ] All animations work (slide-in, fade, pulse)
- [ ] Hover states work on all cards
- [ ] Responsive layout maintained

#### Testing Requirements
- [ ] Manual testing completed:
  - [ ] Click topics to drill down
  - [ ] Pin/unpin artifacts
  - [ ] Archive/restore artifacts
  - [ ] Search and filter
  - [ ] Expand/collapse sections
- [ ] No console errors during testing
- [ ] Performance not degraded (initial render < 100ms)

#### Documentation Requirements
- [ ] Git commit message describes changes clearly
- [ ] Code comments explain non-obvious logic
- [ ] Props interface documented with JSDoc (if needed)

---

### Task 1.3: Extract TopicDetailView Component

**Acceptance Criteria:**

#### Functional Requirements
- [ ] New file created: `src/components/features/KnowledgeSidebar/TopicDetailView.tsx`
- [ ] TopicDetailView component renders all sections:
  - [ ] Back button navigates to main view
  - [ ] Topic header with summary displays
  - [ ] Focus (pinned in topic) section displays
  - [ ] Key Discoveries section displays
  - [ ] Ideas section displays
  - [ ] Archive (in topic) section displays
- [ ] Topic drill-down flow works end-to-end
- [ ] Section collapse/expand works

#### Quality Requirements
- [ ] `KnowledgeSidebar.tsx` reduced to < 400 lines
- [ ] `TopicDetailView.tsx` is ~250 lines or less
- [ ] Main file only contains:
  - [ ] State management
  - [ ] Data filtering logic
  - [ ] Conditional rendering
  - [ ] Animation tracking
- [ ] Build succeeds with no warnings

#### Visual Requirements
- [ ] Topic detail view looks identical to before
- [ ] Back button visible and styled correctly
- [ ] All sections render with proper spacing
- [ ] Animations work in topic view

#### Testing Requirements
- [ ] Manual testing completed:
  - [ ] Click topic card → Opens detail view
  - [ ] Click back button → Returns to main view
  - [ ] Pin/unpin in topic view
  - [ ] Archive/restore in topic view
  - [ ] Expand/collapse sections
- [ ] No console errors
- [ ] State preserved when navigating back

#### Documentation Requirements
- [ ] Git commit with clear description
- [ ] CURRENT_STATUS.md updated with new file structure

---

### Task 1.4: Extract Mock Data to Separate File

**Acceptance Criteria:**

#### Functional Requirements
- [ ] New file created: `src/components/features/KnowledgeSidebar/mockData.ts`
- [ ] `generateMockArtifacts` function moved to mockData.ts
- [ ] Function exported and imported correctly
- [ ] Empty state still shows mock data

#### Quality Requirements
- [ ] Build succeeds
- [ ] No eslint errors
- [ ] Function signature unchanged

#### Testing Requirements
- [ ] Empty subject shows 6 mock artifacts
- [ ] Mock data has correct structure
- [ ] No console errors

---

## ✅ Phase 2: New Features - Priority 1

### Task 2.1: Build SubjectOverviewCard

**Acceptance Criteria:**

#### Functional Requirements
- [ ] Component created: `SubjectOverviewCard.tsx`
- [ ] Props interface matches specification:
  ```typescript
  interface SubjectOverviewCardProps {
    subject: Subject;
    artifactCount: number;
    lastActiveAt: Date;
    onViewDetails?: () => void;
  }
  ```
- [ ] Expertise stage logic implemented:
  - [ ] 0-5 artifacts: "Exploring" stage
  - [ ] 6-15 artifacts: "Building Knowledge" stage
  - [ ] 16-30 artifacts: "Ready to Synthesize" stage
  - [ ] 30+ artifacts: "Knowledge Mature" stage
- [ ] Stage-based guidance implemented:
  - [ ] Different message per stage
  - [ ] Actionable suggestions ("Try: Generate...")
- [ ] Last activity timestamp displays:
  - [ ] Uses relative time format ("Active today", "Last active 2 days ago")

#### Visual Requirements
- [ ] Card matches design specification (see MISSING_FEATURES.md lines 21-35)
- [ ] Subject emoji/icon displays
- [ ] Stage badge shows correct icon (●, ◆, ★)
- [ ] Stage badge has appropriate color
- [ ] Guidance message clearly visible
- [ ] Last activity with clock emoji
- [ ] "View details" link styled correctly
- [ ] Card positioned at top of sidebar (before search)

#### Interaction Requirements
- [ ] "View details" button clickable
- [ ] Hover states work
- [ ] Card is responsive

#### Testing Requirements
- [ ] Manual testing with different artifact counts:
  - [ ] 0 artifacts → "Exploring" stage
  - [ ] 10 artifacts → "Building Knowledge" stage
  - [ ] 20 artifacts → "Ready to Synthesize" stage
  - [ ] 35 artifacts → "Knowledge Mature" stage
- [ ] Stage transitions work correctly
- [ ] Timestamp updates correctly
- [ ] No console errors

#### Documentation Requirements
- [ ] Git commit describes feature
- [ ] Component added to SUBCOMPONENTS.md (move from "Missing" to "Existing")
- [ ] CURRENT_STATUS.md updated
- [ ] MISSING_FEATURES.md status updated to ✅

---

### Task 2.2: Build RecentInsightsCard

**Acceptance Criteria:**

#### Functional Requirements
- [ ] Component created: `RecentInsightsCard.tsx`
- [ ] Props interface matches specification:
  ```typescript
  interface RecentInsightsCardProps {
    insights: KeyDiscovery[];
    limit?: number;
    onInsightClick?: (insightId: string) => void;
    onViewAll?: () => void;
  }
  ```
- [ ] Shows up to 5 most recent insights (or limit prop)
- [ ] Insights sorted by createdAt (newest first)
- [ ] New badge logic implemented:
  - [ ] Shows "NEW" badge if insight < 2 hours old
  - [ ] Badge has glow animation
- [ ] Topic tag displays for each insight
- [ ] Relative timestamps display ("2 hours ago")
- [ ] Text truncation implemented (2 lines max)

#### Visual Requirements
- [ ] Card matches design specification (see MISSING_FEATURES.md lines 86-105)
- [ ] Section header: "RECENT INSIGHTS"
- [ ] Each insight has 💡 icon
- [ ] Topic tags styled with badge
- [ ] "View all" link at bottom with count
- [ ] Card positioned below SubjectOverviewCard

#### Interaction Requirements
- [ ] Click insight → Calls `onInsightClick` callback
- [ ] Click "View all" → Calls `onViewAll` callback
- [ ] Hover states work on insights
- [ ] Tooltips show full text on hover (if truncated)

#### Testing Requirements
- [ ] Manual testing:
  - [ ] Add new insights → Appear at top
  - [ ] New insights show NEW badge
  - [ ] Badge disappears after 2 hours
  - [ ] Topic tags match parent topics
  - [ ] Timestamps are relative
  - [ ] "View all" link shows correct count
- [ ] Test with 0 insights → Card doesn't render
- [ ] Test with 3 insights → All 3 show
- [ ] Test with 10 insights → Only 5 show
- [ ] No console errors

#### Documentation Requirements
- [ ] Git commit describes feature
- [ ] Component added to SUBCOMPONENTS.md
- [ ] CURRENT_STATUS.md updated
- [ ] MISSING_FEATURES.md status updated to ✅

---

### Task 2.3: Enhanced Streaming Animations

**Acceptance Criteria:**

#### Functional Requirements
- [ ] Staging area UI implemented at top of sidebar
- [ ] New content appears in staging first
- [ ] Organization indicator shows during AI processing:
  - [ ] Text: "Organizing knowledge..."
  - [ ] Pulse animation on loading icon
- [ ] Content flows from staging to appropriate topic
- [ ] State management for staging content implemented

#### Visual Requirements
- [ ] Staging items have distinct styling
- [ ] "NEW:" prefix on staged content
- [ ] "[Organizing...] ⏳" text displays
- [ ] Flow animation smooth (60fps)
- [ ] No visual jank or layout shift

#### Animation Requirements
- [ ] Staging appear animation (fade in from top)
- [ ] Flow-to-topic animation (fade out + position transition)
- [ ] Organization indicator pulse animation
- [ ] All animations complete in < 500ms
- [ ] Animations use GPU acceleration (transform, opacity only)

#### Testing Requirements
- [ ] Manual testing during live conversation:
  - [ ] Send message that creates new artifacts
  - [ ] Verify staging area shows new content
  - [ ] Verify "Organizing..." indicator appears
  - [ ] Verify content flows to topics when themes updated
  - [ ] Verify smooth animations throughout
- [ ] Test with rapid updates (multiple artifacts quickly)
- [ ] Test with slow network (simulate delay)
- [ ] No console errors
- [ ] No layout thrashing

#### Performance Requirements
- [ ] Animations maintain 60fps
- [ ] No dropped frames during flow animation
- [ ] Memory usage doesn't spike
- [ ] CPU usage acceptable during animations

#### Documentation Requirements
- [ ] Git commit describes enhancement
- [ ] CSS keyframes documented with comments
- [ ] MISSING_FEATURES.md updated
- [ ] Animation patterns documented in SUBCOMPONENTS.md

---

## ✅ Phase 3: Testing & Documentation

### Task 3.1: Add Unit Tests

**Acceptance Criteria:**

#### Test Files Created
- [ ] `tests/unit/components/KnowledgeSidebar/utils.test.ts`
- [ ] `tests/unit/components/KnowledgeSidebar/SubjectOverviewCard.test.tsx`
- [ ] `tests/unit/components/KnowledgeSidebar/RecentInsightsCard.test.tsx`

#### Utility Function Tests
- [ ] `filterActiveThemes`:
  - [ ] Removes themes with < 2 artifacts (large collections)
  - [ ] Allows single-artifact themes (small collections)
  - [ ] Filters "Archived" theme
  - [ ] Removes overly specific themes
  - [ ] Deduplicates case-insensitive themes
- [ ] `sortArtifacts`:
  - [ ] Pinned items first (knowledge view)
  - [ ] Then by date (newest first)
  - [ ] No pinned sorting in archived view
- [ ] `separateArtifacts`:
  - [ ] Correctly splits active vs superseded
- [ ] `mapThemeArtifacts`:
  - [ ] Maps artifact IDs to full objects
  - [ ] Filters out missing artifacts
- [ ] `highlightMatch`:
  - [ ] Wraps matches in <mark> tags
  - [ ] Handles regex special characters
- [ ] `filterArtifactsBySearch`:
  - [ ] Case-insensitive search
  - [ ] Empty query returns all

#### SubjectOverviewCard Tests
- [ ] Expertise stage calculation:
  - [ ] 0-5 artifacts → Exploring
  - [ ] 6-15 artifacts → Building Knowledge
  - [ ] 16-30 artifacts → Ready to Synthesize
  - [ ] 30+ artifacts → Knowledge Mature
- [ ] Stage guidance changes by artifact count
- [ ] Last activity timestamp formats correctly
- [ ] Props validation works

#### RecentInsightsCard Tests
- [ ] Shows up to limit (default 5)
- [ ] Sorts by createdAt descending
- [ ] New badge logic (< 2 hours)
- [ ] Topic tags display
- [ ] Truncation works
- [ ] "View all" count correct

#### Test Quality Requirements
- [ ] All tests pass: `npm test` exits with code 0
- [ ] Coverage > 80% for new components
- [ ] Coverage > 90% for utils.ts
- [ ] No skipped tests (`.skip`)
- [ ] No console.error during tests
- [ ] Tests run in < 5 seconds

#### Documentation Requirements
- [ ] Git commit with test summary
- [ ] Test files have clear describe/it blocks
- [ ] Complex test logic has comments

---

### Task 3.2: Update Documentation

**Acceptance Criteria:**

#### CURRENT_STATUS.md Updates
- [ ] File inventory updated with new components
- [ ] Line counts updated for all files
- [ ] "Recent commits" section updated
- [ ] "What's Working Well" includes new features
- [ ] Known issues removed if fixed

#### MISSING_FEATURES.md Updates
- [ ] SubjectOverviewCard marked ✅ completed
- [ ] RecentInsightsCard marked ✅ completed
- [ ] Enhanced Streaming marked ✅ completed
- [ ] Refactor tasks marked ✅ completed
- [ ] Summary table updated with new statuses
- [ ] Estimated effort updated (actual vs planned)

#### SUBCOMPONENTS.md Updates
- [ ] SubjectOverviewCard moved to "Existing" section
- [ ] RecentInsightsCard moved to "Existing" section
- [ ] Component specs include actual implementations
- [ ] File size summary updated
- [ ] Missing components section reduced

#### IMPLEMENTATION_PLAN.md Updates
- [ ] Progress checkboxes marked complete
- [ ] Any deviations from plan documented
- [ ] Lessons learned section added (if significant)

#### Quality Requirements
- [ ] No broken internal links
- [ ] No outdated information
- [ ] Consistent formatting throughout
- [ ] Git commit with doc updates

---

## ✅ Overall Phase 1-3 Completion Criteria

**Before declaring Knowledge Sidebar "complete", verify ALL of the following:**

### Code Quality
- [ ] `KnowledgeSidebar.tsx` < 400 lines
- [ ] All subcomponents < 300 lines
- [ ] No deprecated components remain
- [ ] No dead code or commented-out sections
- [ ] No TODO comments for critical functionality
- [ ] ESLint passes with no errors
- [ ] Build succeeds with no warnings
- [ ] TypeScript strict mode enabled

### Functionality
- [ ] All existing features work:
  - [ ] Topics-first organization
  - [ ] Pinned section with topic context
  - [ ] Topic detail drill-down
  - [ ] Search filtering
  - [ ] Archive section with restore
  - [ ] Loading states
  - [ ] Empty states
  - [ ] Collapsible sections
- [ ] All new features work:
  - [ ] SubjectOverviewCard displays and updates
  - [ ] RecentInsightsCard shows latest insights
  - [ ] Streaming animations are smooth
- [ ] No regressions in existing functionality

### Visual & UX
- [ ] All animations smooth (60fps)
- [ ] No layout shifts or jank
- [ ] Responsive design works (desktop, tablet, mobile)
- [ ] Hover states work on all interactive elements
- [ ] Focus states work (keyboard navigation)
- [ ] Color contrast meets WCAG AA standards
- [ ] No visual bugs or glitches

### Performance
- [ ] Initial render < 100ms (20 topics)
- [ ] Search filter < 50ms
- [ ] Animations at 60fps
- [ ] No memory leaks (tested over 5 minutes)
- [ ] Bundle size increase < 10KB

### Testing
- [ ] All unit tests pass
- [ ] Test coverage > 80%
- [ ] Manual testing completed for all features
- [ ] No console errors in normal usage
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Tested with real data (100+ artifacts)

### Documentation
- [ ] All 6 planning docs updated
- [ ] No outdated information
- [ ] Code comments explain non-obvious logic
- [ ] Git commit history clean and descriptive

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (test with VoiceOver/NVDA)
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Color not the only indicator (icons, text too)

---

## 🚫 Non-Goals (Out of Scope for Phase 1-3)

These are explicitly NOT required for declaring Phase 1-3 complete:

- [ ] Progressive disclosure pattern (Phase 4)
- [ ] Enhanced semantic search (Phase 4)
- [ ] Mobile app support
- [ ] Internationalization (i18n)
- [ ] Dark/light theme toggle (uses system preference)
- [ ] Export functionality
- [ ] Real-time collaboration features
- [ ] Backend API integration
- [ ] GraphQL queries
- [ ] Advanced filtering UI

---

## 📋 Pre-Release Checklist

Before merging to main and deploying:

### Final Verification
- [ ] All acceptance criteria above met
- [ ] No known critical bugs
- [ ] No TypeScript `any` types in new code
- [ ] No console.log statements in production code
- [ ] All imports optimized (no unused imports)

### User Testing (if applicable)
- [ ] Demo to 2-3 users
- [ ] Gather feedback on new features
- [ ] Fix any critical issues found

### Deployment Prep
- [ ] Changelog updated with new features
- [ ] Version bumped appropriately (semver)
- [ ] PR description clear and complete
- [ ] Screenshots/GIFs of new features

---

## 📊 Success Metrics

After deployment, track these metrics:

### Adoption
- % of users who see SubjectOverviewCard
- % of users who click RecentInsightsCard
- Time spent in Knowledge Sidebar (before vs after)

### Performance
- Average render time (p50, p95, p99)
- Animation frame rate (min, avg, max)
- Bundle size impact

### Quality
- Number of bug reports (7 days post-launch)
- User satisfaction score
- Support ticket volume

---

## 📚 Related Documentation

- **Overview:** `OVERVIEW.md` - Purpose and architecture
- **Current Status:** `CURRENT_STATUS.md` - What exists now
- **Missing Features:** `MISSING_FEATURES.md` - What to build
- **Subcomponents:** `SUBCOMPONENTS.md` - Component breakdown
- **Implementation Plan:** `IMPLEMENTATION_PLAN.md` - Step-by-step tasks

---

**Last Updated:** 2025-10-07
**Status:** Ready for implementation
**Next Action:** Begin Phase 1, Task 1.1
