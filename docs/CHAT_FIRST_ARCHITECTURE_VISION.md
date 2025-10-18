# Chat-First Architecture Vision

**Created:** 2025-10-16
**Updated:** 2025-10-18 - Complete metacognitive intelligence layer, collaborative features, provenance tracking
**Status:** Vision Document - Complete with Metacognitive Features
**Purpose:** Define the chat-only interface architecture with full metacognitive intelligence, replacing the planned 3-panel UI with a conversational, thinking-visible, self-aware experience.

## 🆕 Major Enhancements (Oct 18)

Based on latest requirements and missing elements from previous vision, this document now includes:

1. **Metacognitive Intelligence Layer** - Thinking pattern analysis, bias detection, calibration training
2. **Causality & Decision Tracking** - Complete evidence chains for confidence changes with impact analysis
3. **Collaborative Intelligence** - Team knowledge synthesis, perspective layers, collective patterns
4. **Knowledge Provenance System** - Origin tracking, influence mapping, attribution analysis
5. **Adaptive Interaction Modes** - Thinking styles detection, quick capture shortcuts, smart spaces
6. **Multiple "Aha!" Moments** - Progressive revelation journey designed into the experience
7. **Full-Screen Navigation System** - Immersive detail views with seamless transitions
8. **Smart Context Panels** - Dynamic assistance during knowledge sharing
9. **Confidence Calibration Training** - Help users become better at self-assessment

---

## 🎯 Executive Summary

Transform Lumara from a **traditional 3-panel layout** into a **metacognitive chat interface** that helps users think better, not just remember more:

**Core Intelligence Features:**
- **Metacognitive awareness** - Tracks thinking patterns, detects biases, provides calibration feedback
- **Deterministic AI reasoning** - Consistent, predictable thinking steps build trust through transparency
- **Causality tracking** - Every belief change linked to triggering evidence with impact cascade
- **Collaborative synthesis** - Team perspectives, consensus building, collective intelligence
- **Knowledge provenance** - Complete origin stories and influence maps for every belief
- **Adaptive interaction** - Adjusts to user's thinking style (analytical/intuitive/pragmatic/theoretical)

**Visual & Navigation:**
- **Memory Activity Heatmap** - GitHub-style visualization showing meaningful milestones, not just counts
- **Enhanced Scrollbar** - Activity overlay with content type indicators (📋 📖 ⚡ 💡)
- **Temporal Navigation** - Click any widget/memory to "time travel" to source conversation
- **Full-screen details** - Immersive views for complex content without cramped panels
- **Smart context panels** - Dynamic assistance appears during knowledge entry/questioning

**Interaction Modes:**
- **Quick capture shortcuts** - `!` for contradictions, `+/-` for confidence, `?` for testing
- **Memory spaces** - Contextual organization (work/personal/team/archive)
- **Progressive disclosure** - Beginners get buttons, experts use slash commands
- **Multiple "aha!" moments** - Designed progression of discoveries throughout usage

**Key Insights:**
1. **Metacognitive partner** - Beyond memory, it helps users understand HOW they think and improve
2. **Presentation + intelligence** - Psychology algorithms enhanced with pattern recognition & coaching
3. **Temporal over spatial** - Time-based navigation replaces sidebars, everything flows through chat
4. **Calibration focus** - Helps users become better at self-assessment and confidence accuracy

---

## 🌟 Core Principles

### 1. **Default to Conversation**
Everything starts as a natural language interaction. Users don't browse, filter, or search manually—they ask and the AI responds.

### 2. **Thinking Visibility**
Users see the AI's reasoning process:
- "Searching semantic embeddings..."
- "Found 3 relevant memories (45%, 16%, 4% match)"
- "Ranking by similarity..."
- "No relevant memories found - asking for permission"

### 3. **Progressive Disclosure**
Information revealed in layers:
- Default: Brief answers
- One click: Detailed view
- Expandable: Full context, evolution history

### 4. **Deterministic Thinking**
AI reasoning follows consistent, well-defined steps:
- Same process every time (predictable, not variable)
- Intermediate results shown via specialized widgets
- Quick action buttons for common operations (no commands needed)

### 5. **Temporal Navigation**
Bidirectional links between widgets and conversation history:
- Click any evolution point → scroll to that conversation
- Click any memory reference → jump to when it was created
- Visual highlight shows context around the moment
- Load older messages automatically if needed

### 6. **Respectful Proactivity**
AI can interrupt, but only when:
- **Critical**: Dangerous contradictions, safety issues
- **Important**: Useful patterns, consolidation needs
- **Passive**: Minor insights available on-demand

### 7. **Full-Screen Detail Views**
Complex content uses the entire chat window for immersive exploration:
- Click any playbook, guide, or detailed content → full-screen view
- Chat slides left, detail slides in from right
- Back button preserves exact scroll position
- No side panels needed - everything uses full viewport
- Rich formatting and navigation within detail views

### 8. **Metacognitive Awareness**
AI helps users understand their own thinking patterns:
- Tracks cognitive biases (overconfidence, confirmation, recency)
- Provides calibration feedback on prediction accuracy
- Identifies learning style and adapts presentation
- Coaches improvement in weak areas
- Shows thinking patterns across domains

---

## 🧠 Metacognitive Intelligence Layer

### Core Metacognitive Features

#### 1. **Thinking Pattern Analysis**
System tracks and reveals user's cognitive patterns:

```typescript
interface MetacognitiveProfile {
  thinkingPatterns: {
    overconfidenceBias: {
      domains: Map<string, BiasMetrics>;
      severity: number; // 0-1 scale
      improvement: TrendLine;
    };
    confirmationBias: BiasMetrics;
    recencyBias: BiasMetrics;
    dunningKrugerZones: Domain[]; // Where they don't know what they don't know
  };

  learningStyle: {
    primary: 'visual' | 'verbal' | 'kinesthetic' | 'analytical';
    comprehensionPatterns: {
      bestTimeOfDay: TimeRange;
      optimalSessionLength: Duration;
      consolidationRate: number;
    };
  };
}
```

**In Chat:**
```
💭 Thinking Process...
→ Analyzing your response pattern
→ Detecting possible overconfidence (similar claims had 45% success)
→ Suggesting evidence check

AI: I notice you're very confident about this approach. Your past
    predictions in system architecture with 90%+ confidence
    succeeded 45% of the time.

    🧠 Metacognitive Insight: You tend to overestimate technical
    solutions before implementation. Your estimates become accurate
    after one prototype.
```

#### 2. **Causality & Decision Tracking**
Every belief change is tracked with complete evidence chains:

```typescript
interface BeliefEvolution {
  belief: Memory;
  confidenceHistory: Array<{
    timestamp: Date;
    oldConfidence: number;
    newConfidence: number;
    trigger: CausalityTrigger;
    evidence: Evidence[];
    userReasoning?: string; // Optional journal entry
    impact: Impact[];
  }>;
}
```

**Evidence Chain Visualization:**
```
📍 Origin: "Microservices always better" (Jan, 40% from article)
└─ Reinforced: AWS workshop (→ 60%)
   └─ Validated: First project success (→ 85%)
      └─ Challenged: Monolith faster for small team (→ 72%)
         └─ Current: "Context-dependent choice" (72%)

Attribution:
• 45% personal experience
• 25% team insights
• 30% external sources
```

#### 3. **Collaborative Intelligence**
Team knowledge synthesis with perspective layers:

```
┌─────────────────────────────────────────────────┐
│ Team Perspective: REST API Design              │
├─────────────────────────────────────────────────┤
│ Consensus (4 members)                          │
│ ████████░░ 76% average confidence              │
│                                                  │
│ You:    ████████░░ 80% "Clean and simple"     │
│ Sarah:  █████████░ 85% "Well documented"       │
│ Mike:   ██████░░░░ 60% "Needs versioning"      │
│ Lisa:   ████████░░ 78% "Good for now"          │
│                                                  │
│ 🔍 Key Divergence: Mike sees scaling issues    │
│ 💡 Collective Intelligence: Issues at 50+ endpoints│
└─────────────────────────────────────────────────┘
```

#### 4. **Knowledge Provenance**
Complete origin tracking for every belief:

```typescript
interface KnowledgeProvenance {
  origin: {
    type: 'experience' | 'learned' | 'told' | 'read' | 'observed';
    source: Source;
    timestamp: Date;
    initialConfidence: number;
  };

  influenceMap: {
    primaryInfluences: Memory[];
    secondaryInfluences: Memory[];
    contradictions: Memory[];
  };
}
```

---

## 🎭 Adaptive Interaction Modes

### Thinking Style Adaptation
System detects and adapts to user's cognitive style:

```typescript
enum ThinkingStyle {
  ANALYTICAL = 'analytical',   // Wants proof, logic chains
  INTUITIVE = 'intuitive',     // Patterns, connections
  PRAGMATIC = 'pragmatic',     // What works, practical
  THEORETICAL = 'theoretical'  // Why it works, principles
}
```

**Adaptive Responses:**
- **Analytical**: Shows data, statistics, evidence chains
- **Intuitive**: Emphasizes patterns, feelings, connections
- **Pragmatic**: Focuses on ROI, practical steps, outcomes
- **Theoretical**: Explains principles, frameworks, theory

### Quick Capture Modes
Friction-free input without conversation:

```
! Quick Contradiction
  !gym Morning workouts drain energy

+ Strengthen Belief
  +microservices Another successful deployment

- Weaken Belief
  -agile Sprint planning took 4 hours

? Question/Test
  ?tdd Does TDD really save time?

@ Evidence Drop
  @standups https://article-about-standups.com

# Tag thought
  #insight Coffee after 2pm disrupts sleep

~ Rough idea
  ~maybe Team morale linked to deploy frequency
```

### Memory Spaces
Contextual organization within chat:

```typescript
interface MemorySpace {
  name: string;
  type: 'project' | 'domain' | 'personal' | 'team' | 'archive';
  context: {
    confidenceBaseline?: number;
    allowContradictions?: boolean;
    autoArchiveAfter?: Duration;
  };
}
```

**Space Switching:**
```
You: /space work
AI: Switched to Work space (847 memories, 4 team members)

You: /space personal
AI: Switched to Personal space (234 memories, private)
```

---

## 🎯 The Multiple "Aha!" Moments Journey

### Progressive Discovery Design
The experience is designed with multiple revelation moments:

**Moment 1: "It caught my contradiction!" (Minute 5)**
- User realizes AI remembers and connects across time

**Moment 2: "It knows my confidence is off!" (Day 3)**
- Discovery that accuracy is being tracked and patterns found

**Moment 3: "It sees patterns I missed!" (Week 2)**
- Non-obvious connections revealed (best decisions on Tuesday mornings)

**Moment 4: "My beliefs actually evolved!" (Month 1)**
- Evolution timeline shows intellectual growth journey

**Moment 5: "My team sees differently!" (Month 2)**
- Collective intelligence reveals unvoiced concerns

**Moment 6: "It prevented a mistake!" (Month 3)**
- Pattern recognition helps avoid repeating past failures

---

## 🎨 Visual Design Language: Luminosity & Aurora

### Why "Lumara"? The Name Grounds the Visual Metaphors

The name **Lumara** (Luma + Aura) isn't arbitrary—it describes the core visual language that makes confidence tangible and contradictions beautiful in the chat-first interface.

### Core Visual Metaphors

#### 1. **Luminosity = Confidence**
Memory cards, widgets, and UI elements use brightness to show confidence levels:

```
Dim (20% confidence)     → Subtle glow, muted colors
Glowing (60% confidence) → Moderate brightness, clear colors
Radiant (95% confidence) → Strong glow, vibrant colors
```

**Why this works:**
- More intuitive than numbers or progress bars
- Emotional connection (bright = trustworthy, positive)
- Glanceable - confidence is visible at a distance
- Universal metaphor - light = understanding/clarity

**Where applied:**
- Memory cards in conversation
- Confidence indicators in widgets
- Timeline milestones
- Search result relevance

#### 2. **Aurora = Contradictions**
When contradictions are detected, aurora-colored effects make conflicts feel like opportunities:

```
Aurora Animation:
- Flowing gradients (greens, blues, purples, pinks)
- Gentle wave patterns
- Highlights both conflicting memories
- Beautiful, not alarming
```

**Why this works:**
- Grabs attention without being aggressive
- Makes contradiction discovery feel like a breakthrough
- Unique visual signature (no one else does this)
- Reframes conflict as beautiful possibility

**Where applied:**
- Contradiction notifications
- Memory comparison widgets
- Resolution success animations
- Pattern discovery highlights

#### 3. **Lumara Color Palette**

Based on the aurora effect spectrum, consistently applied throughout:

```css
/* Luminosity levels (confidence) */
--lumara-dim: #4a5568;      /* Low confidence */
--lumara-glow: #fbbf24;     /* Medium confidence */
--lumara-bright: #fde047;   /* High confidence */
--lumara-radiant: #ffffff;  /* Maximum confidence */

/* Aurora effects (contradictions, discoveries) */
--lumara-aurora-green: #86efac;
--lumara-aurora-blue: #93c5fd;
--lumara-aurora-purple: #c084fc;
--lumara-aurora-pink: #f0abfc;

/* Memory growth stages */
--lumara-seed: #6366f1;     /* New memory */
--lumara-sprout: #10b981;   /* Forming */
--lumara-plant: #14b8a6;    /* Established */
--lumara-tree: #3b82f6;     /* Mature */
```

#### 4. **Growth Through Light**

Visual progression shows memories strengthening over time:

```
New Memory:
│ Dim seed of light (just created)
│
After Testing:
│ ✓ Glow strengthens (confidence increasing)
│
Validated:
│ ✨ Radiant, stable light (high confidence)
│
With Connections:
│ 🌈 Aurora halo (rich context, resolved contradictions)
```

### Design Language in Practice

#### Memory Cards in Chat
```
┌─────────────────────────────────────┐
│ 💡 Memory: React hooks pattern      │ ← Memory type icon
│ ████████░░ 78% confident            │ ← Luminosity bar
│ "useState for local, Context for    │
│  global state management"           │
│ ⚠️ Aurora: Contradicts Zustand pref │ ← Aurora indicator
│ [View evolution] [Test again]       │
└─────────────────────────────────────┘
   └──── Glowing border brightness based on confidence
```

#### Contradiction Detection Animation
```
1. Aurora wave flows from conflicting memories
2. Gradient pulses (green → blue → purple)
3. Both memories highlighted with aurora glow
4. Comparison widget appears with aurora header
5. Resolution creates success aurora burst
```

#### Activity Heatmap
```
Luminosity-based intensity on GitHub-style graph:
│ [░] Low activity     → Dim squares
│ [▓] Medium activity  → Glowing squares
│ [█] High activity    → Radiant squares
│
Aurora overlay for breakthrough moments:
│ ✨ Aurora glow on milestone days
```

### Why This Visual Language Matters

1. **Makes Abstract Concrete**
   - Confidence is hard to visualize → Brightness is intuitive
   - Contradictions feel negative → Auroras make them beautiful

2. **Unique Visual Signature**
   - No other app uses luminosity for confidence
   - Aurora effects for contradictions are distinctive
   - Instantly recognizable brand

3. **Emotional Connection**
   - Light = positive, growth, understanding
   - Auroras = wonder, discovery, possibility
   - Counters anxiety around contradiction/uncertainty

4. **Scalable System**
   - Works for any UI element that shows confidence
   - Aurora effects work for any "special moment"
   - Color palette provides consistent design DNA

### Implementation Principles

1. **Subtle by Default**
   - Light effects should enhance, not distract
   - Aurora animations are smooth, not jarring
   - Dark mode friendly (light stands out beautifully)

2. **Meaningful Motion**
   - Glow strengthens when confidence increases
   - Aurora flows when contradictions are found
   - Particles for success moments
   - No animation without semantic meaning

3. **Accessibility First**
   - Luminosity paired with text percentages
   - Aurora effects paired with icons/text
   - Color-blind friendly palette
   - Reduced motion option available

---

## 📊 Comparison with Existing Plans

### ✅ **What Stays (Backend Logic)**

| Component | From Waves | Status |
|-----------|-----------|--------|
| AI Provider System | Wave 0.2 | ✅ Use as-is |
| Embeddings (384-dim) | Wave 0.2 | ✅ Use as-is |
| Semantic Search | Wave 0.2 | ✅ Use as-is |
| Memory Data Model | Wave 3 | ✅ Use as-is |
| Episodic/Semantic/Procedural | Wave 3 | ✅ Use as-is |
| Working Memory Logic | Wave 3 | ✅ Use as-is |
| Consolidation Algorithm | Wave 4 | ✅ Use as-is |
| Forgetting Curve (Ebbinghaus) | Wave 4 | ✅ Use as-is |
| Spaced Repetition | Wave 4 | ✅ Use as-is |
| Confidence Scoring | Wave 2 | ✅ Use as-is |
| Contradiction Detection | Wave 0.2 | ✅ Use as-is |
| Evolution Tracking | Wave 2 | ✅ Use as-is |
| Playbook Generation | Wave 5 | ✅ Use as-is |
| Pattern Discovery | Wave 5 | ✅ Use as-is |

### ⚠️ **What Changes (UI Presentation)**

| Original Plan | Chat-First Adaptation |
|---------------|----------------------|
| **3-Panel Layout** | Single chat column |
| **Working Memory Sidebar** | Hidden, shown via `/memory` or auto-prompts |
| **Memory Browsing Tabs** | Conversational queries + widgets |
| **Evolution Timeline View** | Embedded timeline widget in chat |
| **Stats Dashboard** | `/stats` command shows widget |
| **Contradiction Side-by-Side** | Comparison widget in chat |
| **Permanent Navigation** | Slash commands + contextual suggestions |

### 🆕 **What's New (Enhancements)**

| Feature | Description | Value |
|---------|-------------|-------|
| **Thinking Process** | Visible AI reasoning before responses | Transparency, trust |
| **Memory Activity Heatmap** | GitHub-style visualization of memory patterns over time | Temporal awareness, navigation |
| **Enhanced Scrollbar** | Activity overlay showing memory density at different times | Visual navigation, context |
| **Temporal Navigation** | Click any widget/memory → jump to source conversation | Replaces spatial browsing |
| **Psychology-Based Insights** | Activity patterns reveal consolidation, forgetting risk | Actionable intelligence |
| **Contextual Testing Reminders** | "Haven't tested in 47 days - still true?" | Proactive quality |
| **Conversational Consolidation** | AI asks permission when working memory full | User control |
| **Event-Based Intentions** | "Remind me when I discuss X" | Smart reminders |
| **Inline Action Buttons** | `[Generate playbook] [Review contradictions]` | Quick actions |

---

## 🧠 Memory Type Coverage

Complete audit against cognitive psychology:

### ✅ **Fully Covered (3/6)**

#### 1. **Episodic Memory**
**Psychology**: Personal experiences with time/place context
**Original Plan**: Timeline view in sidebar tab
**Chat-First**: Conversational query → Timeline widget embedded in response

```
User: How did my understanding of standups evolve?

💭 Thinking...
→ Analyzing 4 interpretations over 3 months
→ Detecting evolution pattern

AI: Your standup understanding evolved through 4 phases:

[Evolution Timeline Widget - Interactive]
```

#### 2. **Semantic Memory**
**Psychology**: General facts/knowledge without context
**Original Plan**: Themes/Concepts tab
**Chat-First**: Retrieved via semantic search, shown with confidence

```
User: What do I know about team management?

💭 Thinking...
→ Searching semantic embeddings...
→ Found 47 memories matching "team management"
→ Too many for inline display

AI: You have extensive knowledge (47 memories):
• Standups (12, 80% avg confidence)
• Code reviews (8, 90% avg confidence)

[Generate playbook] [Show top 5] [Narrow topic]
```

#### 3. **Procedural Memory**
**Psychology**: How-to knowledge, skills
**Original Plan**: Playbooks/Methods section
**Chat-First**: On-demand playbook generation shown in chat

```
User: /playbook team-meetings

💭 Thinking...
→ Gathering high-confidence knowledge (>80%)
→ Organizing into actionable steps
→ Generated playbook: "Effective Team Meetings"

AI: Here's your personalized playbook:

[Playbook Preview Widget - Expandable]
```

### ✅ **Partially Covered (2/6)**

#### 4. **Working Memory**
**Psychology**: Temporary holding (7±2 items), active processing
**Original Plan**: Sidebar showing "Working Memory (6/7)"
**Chat-First**: Hidden by default, shown when needed

**Backend**: ✅ Fully implemented (capacity tracking, consolidation)
**UI Changes**:
- Hidden until relevant
- `/memory` command shows current state
- Auto-prompts when at capacity (7/7)
- Shown in thinking when making consolidation decisions

```
💭 Thinking...
→ Working memory: 7/7 (at capacity)
→ Suggesting consolidation

AI: You've been exploring a lot! I'm holding 7 active
thoughts. Should I consolidate some into long-term knowledge?

[Yes, consolidate] [Keep going] [Show working memory]
```

#### 5. **Prospective Memory**
**Psychology**: Remembering to do things in the future
**Original Plan**: "Intentions & Tasks" tab in sidebar
**Chat-First**: Conversational reminders + event triggers

**Backend**: ✅ Data model already designed
**UI Changes**:
- `/intentions` command shows active reminders
- Time-based: "Remind me next week"
- Event-based: "When I discuss X, remind me Y"
- Shown proactively in relevant conversations

```
User: When I plan meetings, remind me I prefer mornings

💭 Thinking...
→ Creating event-triggered reminder
→ Trigger keywords: ["meeting", "schedule", "plan"]

AI: Got it. Next time we discuss meetings or scheduling,
I'll remind you about your morning preference.

✓ Event reminder set

---

[Later, during a meeting discussion]

📌 Reminder: You prefer morning meetings for better focus.
```

### ❌ **Not Covered (Correctly Excluded)**

#### 6. **Sensory Memory**
**Psychology**: Ultra-short-term (milliseconds), sensory impressions
**Original Plan**: "Not directly implemented (could be typing indicators)"
**Chat-First**: Skip - not applicable for text interface

**Rationale**: Sensory memory handles raw perceptual input before conscious processing. In a text chat, this would only apply to typing indicators or raw input capture, which adds complexity without value.

---

## 🧩 New Components Architecture

### Core System Architecture
```typescript
interface LumaraCore {
  // Chat & Memory
  chat: ChatInterface;
  memory: MemorySystem;

  // NEW: Metacognitive Layer
  metacognition: {
    patterns: PatternEngine;
    calibration: CalibrationSystem;
    coaching: CoachingEngine;
    biasDetection: BiasAnalyzer;
  };

  // NEW: Collaboration Layer
  collaboration: {
    spaces: SpaceManager;
    perspectives: PerspectiveEngine;
    consensus: ConsensusCalculator;
    collective: CollectiveIntelligence;
  };

  // NEW: Provenance Layer
  provenance: {
    chains: EvidenceChainBuilder;
    attribution: AttributionTracker;
    influence: InfluenceMapper;
    causality: CausalityTracker;
  };

  // NEW: Adaptive Layer
  adaptation: {
    style: ThinkingStyleDetector;
    capture: QuickCaptureParser;
    presentation: AdaptiveRenderer;
    spaces: MemorySpaceManager;
  };
}
```

### 1. **ThinkingProcess Component**
Shows AI reasoning before responses with deterministic, well-defined steps.

```tsx
interface ThinkingProcessProps {
  steps: ThinkingStep[];
  widgets?: ThinkingWidget[];    // Structured intermediate results
  metacognitive?: MetacognitiveInsight[];  // Pattern detections
  collapsible?: boolean;
}

interface ThinkingStep {
  action: string;          // "Searching embeddings"
  result?: string;         // "Found 3 matches"
  widget?: ReactNode;      // Optional widget for complex results
  duration?: number;       // ms
  confidence?: number;     // AI's confidence in this step
  bias?: BiasWarning;      // Detected bias in reasoning
}

interface ThinkingWidget {
  type: 'memory-results' | 'comparison' | 'stats-preview' |
        'action-buttons' | 'pattern-detection' | 'team-perspective' |
        'calibration-warning' | 'provenance-chain';
  data: any;
  interactive?: boolean;
}
```

**Example with Widget** (includes temporal navigation):
```
💭 Thinking...
→ Detected question pattern
→ Searching semantic embeddings...
→ Found 3 relevant memories

┌─────────────────────────────────────────────────┐
│ 📚 Memory Matches                               │
├─────────────────────────────────────────────────┤
│ • TypeScript preference (45% match) [📅 View]  │
│ • Big Bang Theory (16% match) [📅 View]        │
│ • Continental grip (4% match) [📅 View]        │
└─────────────────────────────────────────────────┘

→ Using top match

AI: You enjoy coding in TypeScript.
```

**Note**: Each "View" link jumps to the conversation where that memory was created, with highlight effect.

**Quick Action Buttons**:
Thinking can include immediate action buttons without requiring slash commands:
```
💭 Thinking...
→ Found 12 memories about "team management"
→ Too many for inline display

[Generate playbook] [Show top 5] [Narrow topic]
```

### 2. **CommandPalette Component**
Slash command system for power users.

```tsx
interface CommandPaletteProps {
  trigger: string;         // "/"
  commands: Command[];
  hintText: string;       // "Type / for commands"
}

interface Command {
  name: string;           // "stats"
  description: string;    // "Knowledge base health"
  category: string;       // "Analysis"
  handler: (args: string[]) => Promise<void>;
}
```

**Available Commands**:
```
/stats              Knowledge base health report
/memory             View working memory state
/playbook [topic]   Generate living playbook
/contradictions     List unresolved conflicts
/search [query]     Deep semantic search
/intentions         View active reminders
/export             Export knowledge (JSON/Markdown)
/delete [filter]    Bulk delete with confirmation
```

**Discovery**:
- Placeholder hint: "Type / for commands"
- Onboarding tutorial on first use
- `/help` shows all commands

### 3. **Visual Widgets**

#### EvolutionTimelineWidget
```tsx
interface EvolutionTimelineWidgetProps {
  topic: string;
  evolution: EvolutionPoint[];
  onNavigateToPoint?: (point: EvolutionPoint) => void;
}

interface EvolutionPoint {
  date: Date;
  understanding: string;
  confidence: number;
  trigger?: string;         // What caused the change
  superseded?: boolean;     // Old understanding
  messageId?: string;       // Link back to conversation
  memoryId: string;         // Source memory
}
```

**Interactive Behavior**:
```tsx
// Hover shows tooltip with summary
<EvolutionPoint
  onMouseEnter={() => showTooltip(point)}
  onMouseLeave={hideTooltip}
  onClick={() => navigateToConversation(point.messageId)}
  role="button"
  aria-label={`Evolution point: ${point.understanding} (${point.confidence}% confident)`}
>
  <Tooltip visible={hoveredPoint === point}>
    <strong>{formatDate(point.date)}</strong>
    <p>"{point.understanding}"</p>
    <p>{point.confidence}% confident</p>
    {point.trigger && <p>Triggered by: {point.trigger}</p>}
    <small>Click to view conversation →</small>
  </Tooltip>
</EvolutionPoint>

// Click navigates back to that conversation
function navigateToConversation(messageId: string) {
  // Scroll to the message in chat history
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);

  if (messageElement) {
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Highlight briefly
    messageElement.classList.add('highlight-flash');
    setTimeout(() => {
      messageElement.classList.remove('highlight-flash');
    }, 2000);
  } else {
    // Message not in current view - load older messages
    loadMessagesUntil(messageId).then(() => {
      navigateToConversation(messageId);
    });
  }
}
```

**Renders as**:
```
┌─────────────────────────────────────────────────┐
│ 📈 Understanding Evolution: Standups            │
├─────────────────────────────────────────────────┤
│                                                  │
│  30%     45%        70%           85%           │
│   ●───────●──────────●─────────────●──→        │
│  Jan    Feb       Mar          Apr             │
│   │      │          │             │             │
│  "Waste  "Maybe    "15-min     "Co-located     │
│  time"   helpful"   works"      teams"         │
│                                                  │
│  [Hover any point for details]                  │
│  [Click to jump to that conversation]           │
│                                                  │
│  Trigger events:                                │
│  → Team feedback (Feb)                          │
│  → Successful experiment (Mar)                  │
│  → Remote comparison (Apr)                      │
│                                                  │
│  [View details] [Export evolution]              │
└─────────────────────────────────────────────────┘

[When hovering on Mar point:]
┌──────────────────────┐
│ March 15, 2025       │
│ "15-min standups     │
│ work best"           │
│                      │
│ 70% confident        │
│                      │
│ Triggered by:        │
│ Successful experiment│
│                      │
│ Click to view → ___  │
└──────────────────────┘
```

**CSS for highlight effect**:
```css
/* Smooth highlight flash when navigating to message */
@keyframes highlight-flash {
  0% {
    background-color: rgba(59, 130, 246, 0.2);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  }
  100% {
    background-color: transparent;
    box-shadow: none;
  }
}

.highlight-flash {
  animation: highlight-flash 2s ease-out;
  scroll-margin: 100px; /* Space from top when scrolled into view */
}
```

#### ContradictionComparisonWidget
```tsx
interface ContradictionComparisonWidgetProps {
  earlier: {
    content: string;
    confidence: number;
    date: Date;
    context?: string;
    messageId?: string;       // Link to conversation
    memoryId: string;
  };
  current: {
    content: string;
    confidence: number;
    context?: string;
    messageId?: string;       // Link to conversation
    memoryId: string;
  };
  onResolve: (resolution: Resolution) => void;
  onNavigateToMemory?: (messageId: string) => void;
}

type Resolution =
  | 'both-true'           // Context-dependent
  | 'replace'             // New supersedes old
  | 'keep-original'       // Reject new
  | 'merge';              // Create nuanced view
```

**Renders as** (with temporal navigation):
```
┌─────────────────────────────────────────────────┐
│ ⚡ Contradiction Resolution                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  EARLIER (3 weeks ago)  │  NOW                  │
│  70% confident          │  60% confident        │
│  [📅 View conversation] │  [📅 View conversation]│
│  ─────────────────────  │  ──────────────────── │
│  "Async updates work    │  "Daily standups      │
│  better than standups"  │  are essential"       │
│                         │                        │
│  Context: Remote team   │  Context: Co-located  │
│  Status updates         │  Blocker resolution   │
│                                                  │
├─────────────────────────────────────────────────┤
│  How should we resolve this?                    │
│                                                  │
│  [Both true - different contexts]               │
│  [New replaces old]                             │
│  [Keep original]                                │
│  [Help me understand the nuance]                │
└─────────────────────────────────────────────────┘
```

**Interactive behavior**: Click "View conversation" to jump to when that understanding was formed, with context highlighted.

#### StatsWidget
For `/stats` command.

```tsx
interface StatsWidgetProps {
  totalMemories: number;
  breakdown: { type: string; count: number }[];
  confidenceDistribution: { range: string; count: number; percent: number }[];
  activeTopics: { topic: string; interactions: number }[];
  needsAttention: {
    unresolved: number;
    untested: number;
    stale: number;
  };
}
```

**Renders as**:
```
┌─────────────────────────────────────────────────┐
│ 📊 Knowledge Base Health Report                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Total Memories: 127                            │
│  ├─ 42 Experiences (📅)                         │
│  ├─ 53 Knowledge (🧠)                           │
│  └─ 32 Methods (📋)                             │
│                                                  │
│  Confidence Distribution:                       │
│  ████████░░ High (>80%): 28 (22%)              │
│  ███████████████░░░░░ Med (50-80%): 67 (53%)  │
│  ███████░░░░ Low (<50%): 32 (25%)             │
│                                                  │
│  Most Active (30 days):                         │
│  1. Team management (23 interactions)           │
│  2. Code quality (15 interactions)              │
│  3. Work-life balance (8 interactions)          │
│                                                  │
│  ⚠️ Needs Attention:                            │
│  • 3 unresolved contradictions                  │
│  • 12 untested knowledge points                 │
│  • 8 stale memories (90+ days)                  │
│                                                  │
│  [Resolve contradictions] [Test knowledge]      │
└─────────────────────────────────────────────────┘
```

### 4. **MemoryActivityHeatmap Component**
GitHub-style contribution graph showing temporal memory patterns.

```tsx
interface MemoryActivityHeatmapProps {
  period: 'week' | 'month' | 'quarter' | 'year' | 'all';
  topic?: string;  // Filter by specific topic
  onDateClick: (date: Date) => void;
  onExpand: () => void;
}

interface ActivityDay {
  date: Date;
  milestones: Milestone[];  // Important moments, not counts
  confidenceChanges: ConfidenceChange[];
  consolidations: ConsolidationEvent[];
  contradictions: ContradictionEvent[];
  messages: Message[];
}

interface Milestone {
  type: 'first-success' | 'breakthrough' | 'pattern-discovery' | 'skill-mastery';
  icon: string;  // ✓ 🎯 💡 🏆
  description: string;  // "First successful standup experiment"
  relatedMemoryId: string;
  messageId: string;
}

interface ConfidenceChange {
  topic: string;
  from: number;
  to: number;
  direction: 'increase' | 'decrease';
  icon: '📈' | '📉';
}

interface ConsolidationEvent {
  count: number;
  topics: string[];
  icon: '🔄';
}

interface ContradictionEvent {
  type: 'resolved' | 'detected';
  topic: string;
  icon: '⚡' | '⚠️';
}
```

**Visual Layout** (Chat flows top→bottom, scroll down = forward in time):
```
┌─────────────────────────────────────────────────────────────┐
│ [≡] Lumara              [Memory Activity ▼] [Last Year ▼]  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🧠 Key milestones  •  12 topics  •  ⚠️ 3 need review   │ │
│ │ ┌─ Jan ─┬─ Feb ─┬─ Mar ─┬─ Apr ─┬─ May ─┬─ Jun ─┐    │ │
│ │ │░▓█░░░█│█░▓░░░█│░░░▓█░░│▓█░░░░▓│░░░█░░░│█▓░░░░█│    │ │
│ │ │░░░▓░░░│░▓░░█░░│▓░░░░░█│░░░▓█░░│▓█░░░░▓│░░░█░░░│    │ │
│ │ │░░░░░█░│░░░░░▓░│░█░░░░░│░░░░░░█│░░░▓░░░│░▓░░░░░│    │ │
│ │ └───────┴───────┴───────┴───────┴───────┴───────┘      │ │
│ │ Less ░░ ▓▓ ██ More (darkness = milestone importance)   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ January 5 (oldest messages, scroll up to here)          │ │
│ │ ✓ Started learning TypeScript                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ User: I'm learning TypeScript...                          ░ │
│ AI: Great! [Memory created]                               ░ │
│                                                            │ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ March 15 • ✓ First success • 📈 Boost • ⚡ Resolved    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ User: I tried the 15-minute standup...                    ▓ │
│ AI: Excellent! [Confidence: 60% → 85%]                    █ │
│                                                            │ │
│ ┌─────────────────────────────────────────────────────────┐ ▓
│ │ June 20 (newest messages, scroll down to here)          │ █
│ │ 🏆 Skill mastery achieved                               │ │
│ └─────────────────────────────────────────────────────────┘ │
│ User: Today's standup was perfect...                      ▓ │
│ AI: You've mastered this! [95% confidence]                ▓ │
│                                                            ▼ │
│ [Input: Type your message...]                               │
└─────────────────────────────────────────────────────────────┘
  ↑ Scrollbar shows milestones (not counts)
  Hover: Rich overview with checkmarks & icons

**Always-Visible State** (default, always present):
```tsx
<header className="fixed top-0 w-full z-50">
  {/* Ultra-minimal always-visible activity indicator */}
  <div className="h-2 bg-gray-100">
    <ActivitySparkline days={7} height={8} />
  </div>

  {/* Condensed heatmap (sticky, expandable) */}
  <div className="bg-white border-b shadow-sm">
    <div className="flex items-center gap-4 px-4 py-2">
      {/* Expand button */}
      <button onClick={expand}>
        Memory Activity ▼
      </button>

      {/* Mini 7-day heatmap with milestone icons */}
      <div className="flex gap-0.5">
        {last7Days.map(day => (
          <div className="relative">
            <div
              className={`w-2 h-4 ${getIntensityColor(day)}`}
              onMouseEnter={() => showTooltip(day)}
              onClick={() => jumpToDate(day.date)}
            />
            {/* Icon for generated content */}
            {day.hasGeneratedContent && (
              <div className="absolute -top-1 -right-1 w-3 h-3">
                {day.contentIcon} {/* 📋 for playbook, etc */}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <span className="text-xs">127 memories</span>
      <span className="text-xs">12 topics</span>
      {needsAttention > 0 && (
        <span className="text-xs text-orange-600">⚠️ 3</span>
      )}

      {/* Period selector */}
      <Select value={period}>
        <option>Week</option>
        <option>Month</option>
        <option>Year</option>
      </Select>
    </div>
  </div>
</header>
```

**Expanded State** (on demand):
```tsx
<div className="px-4 py-3 bg-gray-50">
  <div className="flex items-center justify-between mb-3">
    <h3>🧠 Memory Activity</h3>

    {/* Period selector */}
    <SegmentedControl>
      <Option>Week</Option>
      <Option>Month</Option>
      <Option>Year</Option>
      <Option>All Time</Option>
    </SegmentedControl>

    {/* Topic filter */}
    <TopicSelector placeholder="Filter by topic..." />

    <button onClick={collapse}>▲</button>
  </div>

  {/* GitHub-style contribution graph */}
  <ContributionGraph
    data={activityDays}
    onDayClick={jumpToDate}
  />

  {/* Legend */}
  <div className="flex items-center gap-2 mt-3 text-xs">
    <span>Less</span>
    <div className="flex gap-1">
      <div className="w-3 h-3 bg-gray-100" />
      <div className="w-3 h-3 bg-green-200" />
      <div className="w-3 h-3 bg-green-400" />
      <div className="w-3 h-3 bg-green-600" />
      <div className="w-3 h-3 bg-green-800" />
    </div>
    <span>More</span>
  </div>

  {/* Psychology insights */}
  {insights.length > 0 && (
    <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
      💡 {insights[0].text}
    </div>
  )}
</div>
```

**Interactive Behavior**:
- **Hover on dot**: Rich overview tooltip showing meaningful moments (not counts)
- **Click on dot**: Scroll to that date in conversation (with highlight, scroll down = forward in time)
- **Topic filter**: Re-color graph for specific topic only
- **Period change**: Load more historical data

**Hover Tooltip** (milestone-focused, not count-focused):
```
┌─────────────────────────────────────────┐
│ March 15, 2025                          │
├─────────────────────────────────────────┤
│ ✓ First successful standup experiment  │
│ 📈 Confidence boost: 60% → 85%          │
│ ⚡ Resolved team sync contradiction     │
│ 🔄 3 memories consolidated              │
│                                         │
│ Click to view conversation →           │
└─────────────────────────────────────────┘
```

Instead of: "March 15: 5 memories created" ❌
Show: Key milestones and important checkmarks ✅

**Milestone-Based Intensity** (not volume-based):
```tsx
function getIntensityColor(day: ActivityDay): string {
  let intensity = 0;

  // Important milestones (weighted by type)
  day.milestones.forEach(m => {
    switch (m.type) {
      case 'breakthrough': intensity += 0.4; break;  // Most important
      case 'skill-mastery': intensity += 0.3; break;
      case 'first-success': intensity += 0.2; break;
      case 'pattern-discovery': intensity += 0.15; break;
    }
  });

  // Significant confidence changes (>20% change)
  day.confidenceChanges.forEach(c => {
    const changeMagnitude = Math.abs(c.to - c.from);
    if (changeMagnitude >= 20) {
      intensity += 0.3;
    } else if (changeMagnitude >= 10) {
      intensity += 0.15;
    }
  });

  // Consolidation events (knowledge formation)
  if (day.consolidations.length > 0) {
    intensity += 0.2;
  }

  // Contradiction resolution (cognitive work)
  day.contradictions.forEach(c => {
    if (c.type === 'resolved') {
      intensity += 0.25;  // Resolving = important
    } else {
      intensity += 0.05;  // Detecting = minor
    }
  });

  // Cap at 1.0
  intensity = Math.min(1, intensity);

  // Return color based on milestone importance (not volume)
  if (intensity === 0) return 'bg-gray-100';  // No milestones
  if (intensity < 0.3) return 'bg-green-200';  // Minor events
  if (intensity < 0.6) return 'bg-green-400';  // Moderate importance
  if (intensity < 0.8) return 'bg-green-600';  // Important milestones
  return 'bg-green-800';  // Critical breakthroughs
}
```

**Example intensity scoring**:
- Day with 50 memories but no milestones → Light gray (low intensity) ✗
- Day with 2 memories but breakthrough + contradiction resolved → Dark green (high intensity) ✓

**Milestone Detection** (algorithmic, not manual):
```tsx
// Automatically detect milestones as they happen
function detectMilestone(event: MemoryEvent): Milestone | null {
  // First success in a topic
  if (event.type === 'practice-success' && event.attemptNumber === 1) {
    return {
      type: 'first-success',
      icon: '✓',
      description: `First successful ${event.topic}`,
      relatedMemoryId: event.memoryId,
      messageId: event.messageId,
    };
  }

  // Breakthrough: Confidence jumps >30% in one event
  if (event.type === 'confidence-change') {
    const increase = event.newConfidence - event.oldConfidence;
    if (increase >= 30) {
      return {
        type: 'breakthrough',
        icon: '🎯',
        description: `Breakthrough in ${event.topic} (+${increase}%)`,
        relatedMemoryId: event.memoryId,
        messageId: event.messageId,
      };
    }
  }

  // Skill mastery: 5+ successful practices with 90%+ confidence
  if (event.successfulPractices >= 5 && event.confidence >= 90) {
    return {
      type: 'skill-mastery',
      icon: '🏆',
      description: `Mastered ${event.topic}`,
      relatedMemoryId: event.memoryId,
      messageId: event.messageId,
    };
  }

  // Pattern discovery: AI identifies recurring theme across 3+ memories
  if (event.type === 'pattern-detected' && event.occurrences >= 3) {
    return {
      type: 'pattern-discovery',
      icon: '💡',
      description: `Discovered pattern: ${event.pattern}`,
      relatedMemoryId: event.memoryId,
      messageId: event.messageId,
    };
  }

  return null;  // Not a milestone-worthy event
}
```

**Result**: Heatmap and scrollbar automatically highlight **meaningful moments** instead of just showing activity volume.

### 5. **EnhancedScrollbar Component**
Custom scrollbar with activity overlay showing memory density.

```tsx
interface EnhancedScrollbarProps {
  messages: Message[];
  activityData: ActivityDay[];
  containerRef: RefObject<HTMLDivElement>;
}

interface ActivitySegment {
  id: string;
  topPercent: number;
  heightPercent: number;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  confidenceChanges: ConfidenceChange[];
  consolidations: ConsolidationEvent[];
  contradictions: ContradictionEvent[];
  intensity: number;  // 0-1 scale (based on milestone importance, not count)
}
```

**Visual** (Chat flows top→bottom, oldest at top, newest at bottom):
```
┌─┐ ← January (oldest, scroll up to here)
│░│
│▓│ ← Dark = important milestones
│█│
│░│ ← Light = minor activity
│▓│
│█│ ← Thumb overlaid on top
│░│
│▓│
└─┘ ← December (newest, scroll down to here)

Hover on March segment →
┌──────────────────────────────────┐
│ March 10-15, 2025                │
├──────────────────────────────────┤
│ ✓ First successful standup       │
│ 📈 Team management: 60% → 85%    │
│ ⚡ Resolved async vs sync conflict│
│ 🔄 2 consolidated                │
│                                  │
│ Click to jump →                  │
└──────────────────────────────────┘

Click → Scrolls to March 10 conversation
```

**Implementation**:
```tsx
function EnhancedScrollbar({ messages, activityData, containerRef }: Props) {
  const [hoveredSegment, setHoveredSegment] = useState<ActivitySegment | null>(null);

  // Calculate segments by grouping messages by time period
  const segments = useMemo(() => {
    return calculateActivitySegments(messages, activityData);
  }, [messages, activityData]);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-3 group">
      {/* Activity overlay (behind thumb) */}
      <div className="absolute inset-0 bg-gray-100 rounded-full">
        {segments.map(segment => (
          <div
            key={segment.id}
            className={`absolute w-full ${getIntensityColor(segment.intensity)}`}
            style={{
              top: `${segment.topPercent}%`,
              height: `${segment.heightPercent}%`,
            }}
            onMouseEnter={() => setHoveredSegment(segment)}
            onMouseLeave={() => setHoveredSegment(null)}
            onClick={() => scrollToSegment(segment)}
          />
        ))}

        {/* Scroll thumb (on top) */}
        <div
          className="absolute w-full bg-gray-600 rounded-full opacity-50 hover:opacity-100"
          style={{
            top: `${thumbTopPercent}%`,
            height: `${thumbHeightPercent}%`,
          }}
        />
      </div>

      {/* Hover tooltip - rich overview */}
      {hoveredSegment && (
        <Tooltip position="left" className="max-w-xs">
          <strong>{formatDateRange(hoveredSegment.startDate, hoveredSegment.endDate)}</strong>

          {/* Milestones (max 3) */}
          {hoveredSegment.milestones.slice(0, 3).map(milestone => (
            <div key={milestone.id} className="flex items-start gap-2 mt-2">
              <span>{milestone.icon}</span>
              <span className="text-sm">{milestone.description}</span>
            </div>
          ))}

          {/* Confidence changes */}
          {hoveredSegment.confidenceChanges.map(change => (
            <div key={change.topic} className="flex items-center gap-2 mt-1 text-sm">
              <span>{change.icon}</span>
              <span>{change.topic}: {change.from}% → {change.to}%</span>
            </div>
          ))}

          {/* Consolidations */}
          {hoveredSegment.consolidations.length > 0 && (
            <div className="flex items-center gap-2 mt-1 text-sm text-blue-600">
              <span>🔄</span>
              <span>{hoveredSegment.consolidations.length} consolidated</span>
            </div>
          )}

          {/* Contradictions */}
          {hoveredSegment.contradictions.map(c => (
            <div key={c.topic} className="flex items-center gap-2 mt-1 text-sm">
              <span>{c.icon}</span>
              <span>{c.type === 'resolved' ? 'Resolved' : 'Detected'}: {c.topic}</span>
            </div>
          ))}

          <small className="block mt-2 text-gray-500">Click to jump →</small>
        </Tooltip>
      )}
    </div>
  );
}

// Group messages into time-based segments
function calculateActivitySegments(
  messages: Message[],
  activityData: ActivityDay[]
): ActivitySegment[] {
  // Group by week (or day/month depending on view)
  const groups = groupMessagesByTimePeriod(messages, 'week');

  return groups.map(group => {
    const memoryMessages = group.messages.filter(
      m => m.relatedMemories && m.relatedMemories.length > 0
    );

    return {
      id: group.id,
      topPercent: (group.startIndex / messages.length) * 100,
      heightPercent: ((group.endIndex - group.startIndex) / messages.length) * 100,
      startDate: group.startDate,
      endDate: group.endDate,
      memoryCount: memoryMessages.reduce(
        (sum, m) => sum + (m.relatedMemories?.length || 0), 0
      ),
      consolidations: group.messages.filter(
        m => m.type === 'consolidation'
      ).length,
      intensity: calculateIntensity(memoryMessages.length),
    };
  });
}
```

### 6. **SmartDateHeader Component**
Contextual date separators showing milestone summary (not counts).

```tsx
interface SmartDateHeaderProps {
  date: Date;
  milestones: Milestone[];  // Show actual achievements
  confidenceChanges: ConfidenceChange[];
  consolidations: ConsolidationEvent[];
  contradictions: ContradictionEvent[];
  onJumpToHeatmap: () => void;
}
```

**Renders as** (milestone icons, not numbers):
```
┌─────────────────────────────────────────────────────────────────┐
│ March 15, 2025                                                  │
│ ✓ First success • 📈 Confidence boost • ⚡ Resolved • View → │
└─────────────────────────────────────────────────────────────────┘
```

**Not this** ❌:
```
March 15, 2025
3 memories • 1 consolidated
```

**But this** ✓:
```
March 15, 2025
✓ First successful standup • 📈 +25% confidence • ⚡ Resolved async vs sync
```

**Implementation**:
```tsx
function SmartDateHeader({
  date,
  milestones,
  confidenceChanges,
  consolidations,
  contradictions,
  onJumpToHeatmap
}: Props) {
  const isToday = isDateToday(date);
  const isYesterday = isDateYesterday(date);

  // Show max 3 items to avoid clutter
  const displayItems: React.ReactNode[] = [];

  // Add top milestones (max 2)
  milestones.slice(0, 2).forEach(m => {
    displayItems.push(
      <span key={m.id} className="flex items-center gap-1 text-sm">
        <span>{m.icon}</span>
        <span>{m.description}</span>
      </span>
    );
  });

  // Add confidence changes (max 1)
  if (confidenceChanges.length > 0) {
    const change = confidenceChanges[0];
    displayItems.push(
      <span key={change.topic} className="flex items-center gap-1 text-sm">
        <span>{change.icon}</span>
        <span>{change.from}% → {change.to}%</span>
      </span>
    );
  }

  // Add resolved contradictions
  const resolved = contradictions.filter(c => c.type === 'resolved');
  if (resolved.length > 0 && displayItems.length < 3) {
    displayItems.push(
      <span key="contradiction" className="flex items-center gap-1 text-sm">
        <span>⚡</span>
        <span>Resolved {resolved[0].topic}</span>
      </span>
    );
  }

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b px-4 py-2 my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">
            {isToday ? 'Today' : isYesterday ? 'Yesterday' : formatDate(date)}
          </h4>

          {/* Show milestone icons, not badge counts */}
          {displayItems.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-gray-400">•</span>}
              {item}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={onJumpToHeatmap}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          View in timeline →
        </button>
      </div>
    </div>
  );
}
```

### 7. **WorkingMemoryIndicator Component**
Shows current working memory capacity (7±2 Miller's Law).

```tsx
interface WorkingMemoryIndicatorProps {
  activeThoughts: WorkingMemoryItem[];
  capacity: number;  // Default: 7
  onViewAll: () => void;
  onConsolidate: (items: WorkingMemoryItem[]) => void;
}

interface WorkingMemoryItem {
  id: string;
  content: string;
  created: Date;
  age: number;  // Minutes since created
  relatedMemoryId?: string;
}
```

**Visual States**:

**Condensed** (in header, next to heatmap):
```
┌─────────────────────────────────────────────────┐
│ [Memory Activity ▼] [Working Memory: 6/7 ▼]   │
└─────────────────────────────────────────────────┘
```

**Expanded** (dropdown):
```
┌─────────────────────────────────────────────────┐
│ 🧠 Working Memory (6/7)                         │
├─────────────────────────────────────────────────┤
│ • TypeScript preference (2m ago)                │
│ • Standup timing insight (5m ago)               │
│ • Team sync contradiction (8m ago)              │
│ • Code review process (12m ago)                 │
│ • Meeting preference (15m ago)                  │
│ • Focus time strategy (20m ago)                 │
│                                                  │
│ [Consolidate all] [View details]                │
└─────────────────────────────────────────────────┘
```

**At capacity** (7/7, proactive prompt):
```
💭 Thinking...
→ Working memory: 7/7 (at capacity)
→ Need to consolidate before accepting new information

AI: You've been exploring a lot! I'm holding 7 active thoughts.
Should I consolidate some into long-term knowledge?

[Suggested consolidations]
• "Team management practices" (3 items)
• "TypeScript preferences" (2 items)
• "Communication patterns" (2 items)

[Yes, consolidate] [Review manually] [Keep going]
```

### 8. **SpacedRepetitionWidget Component**
Testing interface and forgetting curve visualization.

```tsx
interface SpacedRepetitionWidgetProps {
  memory: Memory;
  testHistory: TestAttempt[];
  nextTestDate: Date;
  retentionPrediction: number;  // 0-1 scale
  onTest: (result: TestResult) => void;
}

interface TestAttempt {
  date: Date;
  result: 'success' | 'partial' | 'failure';
  timeToRecall: number;  // seconds
  confidence: number;  // before test
  newConfidence: number;  // after test
}
```

**Forgetting Curve Visualization**:
```
┌──────────────────────────────────────────────────┐
│ 📉 Retention Curve: "15-min standups effective" │
├──────────────────────────────────────────────────┤
│                                                   │
│ 100%┤●────●────●────●───●──●─●●                 │
│     │                      ↓                      │
│  75%┤                      ●  ← You are here     │
│     │                        ↘                    │
│  50%┤                         ●─ Predicted       │
│     │                                             │
│  25%┤                                             │
│     └──────────────────────────────────────────  │
│      0d   7d   14d  21d  28d 35d (Today)  60d    │
│                                                   │
│ Last tested: 35 days ago                         │
│ Next test: Today (retention dropping)            │
│                                                   │
│ [Test now] [Schedule for later]                  │
└──────────────────────────────────────────────────┘
```

**Testing Interface**:
```tsx
// User: /test team-management
// Or click "Test now" in forgetting curve

[Testing Widget - Interactive]
┌──────────────────────────────────────────────────┐
│ 🎯 Knowledge Test: Team Management               │
├──────────────────────────────────────────────────┤
│ Q1: What's your preferred standup format?        │
│ ┌──────────────────────────────────────────────┐│
│ │ [Your answer here...]                        ││
│ └──────────────────────────────────────────────┘│
│                                                   │
│ Q2: Why do 15-minute time limits work?           │
│ ┌──────────────────────────────────────────────┐│
│ │ [Your answer here...]                        ││
│ └──────────────────────────────────────────────┘│
│                                                   │
│ Q3: How do you handle blockers in standups?      │
│ ┌──────────────────────────────────────────────┐│
│ │ [Your answer here...]                        ││
│ └──────────────────────────────────────────────┘│
│                                                   │
│ [Submit answers]                                  │
└──────────────────────────────────────────────────┘

// After submission
[Results Widget]
┌──────────────────────────────────────────────────┐
│ 📊 Test Results                                   │
├──────────────────────────────────────────────────┤
│ 2/3 correct (67%)                                │
│                                                   │
│ ✓ Q1: Correct! (15-minute time-boxed)           │
│ ✓ Q2: Correct! (Keeps team focused)             │
│ ✗ Q3: Partial recall (mentioned parking lot      │
│       but forgot the 2-minute rule)              │
│                                                   │
│ 📈 Confidence adjusted: 75% → 70%                │
│ 📅 Next test: 14 days (May 1)                    │
│                                                   │
│ [Review answers] [Done]                           │
└──────────────────────────────────────────────────┘
```

### 9. **PatternDiscoveryWidget Component**
Surfaces AI-detected patterns from Wave 5 backend.

```tsx
interface PatternDiscoveryWidgetProps {
  pattern: DetectedPattern;
  onSaveAsGuideline: () => void;
  onDismiss: () => void;
  onExplore: () => void;
}

interface DetectedPattern {
  id: string;
  type: 'preference' | 'habit' | 'constraint' | 'correlation';
  description: string;
  confidence: number;
  supportingMemories: Memory[];
  context?: string;
  actionable?: string;  // Suggested guideline
}
```

**Proactive Pattern Notification**:
```
💭 Thinking...
→ Analyzing conversation history
→ Pattern detected across 5 memories
→ High confidence (85%)

AI: I noticed a pattern in how you communicate:

[Pattern Widget]
┌─────────────────────────────────────────────────┐
│ 💡 Communication Pattern Discovered             │
├─────────────────────────────────────────────────┤
│ Pattern: Context-dependent communication style  │
│ Confidence: 85% (based on 5 examples)           │
│                                                  │
│ Status updates:                                  │
│ ✓ Prefer async (Slack, email)                   │
│   - Less interruption                            │
│   - Written record                               │
│                                                  │
│ Problem solving:                                 │
│ ✓ Prefer sync (Zoom, huddle)                    │
│   - Real-time collaboration                      │
│   - Faster resolution                            │
│                                                  │
│ Supporting evidence:                             │
│ • "Slack works for daily updates" (Mar 12)      │
│ • "Called quick Zoom for bug" (Mar 15)          │
│ • "Prefer email for status" (Apr 2)             │
│ • "Screen share solved issue" (Apr 8)           │
│ • "Async standup notes work" (Apr 20)           │
│                                                  │
│ [Save as guideline] [View all] [Dismiss]        │
└─────────────────────────────────────────────────┘
```

**Pattern Types**:
- **Preference**: "You prefer X over Y in Z context"
- **Habit**: "You tend to do X when Y happens"
- **Constraint**: "You avoid X because Y"
- **Correlation**: "X often leads to Y in your experience"

### 10. **MemoryEditMode Component**
Inline editing for memory cards.

```tsx
interface MemoryEditModeProps {
  memory: Memory;
  onSave: (updated: Partial<Memory>) => void;
  onCancel: () => void;
  onDelete: () => void;
}
```

**Edit Mode** (click any memory card):
```
┌─────────────────────────────────────────────────┐
│ ✏️ Edit Memory                                   │
├─────────────────────────────────────────────────┤
│ Content:                                         │
│ ┌──────────────────────────────────────────────┐│
│ │ User prefers 15-minute standup time limits   ││
│ │ for co-located teams to maintain focus       ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ Type: [Procedural ▼]                            │
│                                                  │
│ Tags:                                            │
│ [team-management] [standup] [+ Add tag]         │
│                                                  │
│ Confidence: [85%] ──●────────── (manual adjust) │
│                                                  │
│ Source: March 15, 2025 conversation             │
│ [📅 View source conversation]                   │
│                                                  │
│ [Save] [Cancel] [Delete memory]                 │
└─────────────────────────────────────────────────┘
```

### 11. **BulkManagementMode Component**
Batch operations for power users.

```tsx
interface BulkManagementModeProps {
  memories: Memory[];
  onExit: () => void;
}
```

**Management Mode UI**:
```
User: /manage memories

[Bulk Management Mode]
┌─────────────────────────────────────────────────┐
│ 🗂️ Memory Management                            │
├─────────────────────────────────────────────────┤
│ [Search: ____________] [Filter: All ▼] [Sort ▼]│
│                                                  │
│ Filters:                                         │
│ [Type: All ▼] [Tags: All ▼] [Confidence: All ▼]│
│                                                  │
│ Results: 47 memories                             │
│ ┌──────────────────────────────────────────────┐│
│ │ [✓] TypeScript preference (Semantic)         ││
│ │     Tags: programming, typescript            ││
│ │     85% confident • Last tested: 10 days ago ││
│ │                                              ││
│ │ [ ] Big Bang Theory (Episodic)               ││
│ │     Tags: tv, entertainment                  ││
│ │     60% confident • Never tested             ││
│ │                                              ││
│ │ [✓] 15-min standups (Procedural)             ││
│ │     Tags: team-management, standup           ││
│ │     90% confident • Last tested: 2 days ago  ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ Selected: 2 memories                             │
│ [Delete (2)] [Edit tags] [Export] [Merge]       │
│                                                  │
│ [Exit management mode]                           │
└─────────────────────────────────────────────────┘
```

**Bulk Actions**:
- **Delete**: Confirm before deleting multiple
- **Edit tags**: Add/remove tags from selection
- **Export**: JSON, Markdown, or CSV
- **Merge**: Combine related memories into one

### 12. **OnboardingFlow Component**
Interactive tutorial for first-time users (addresses cold start problem).

```tsx
interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  milestone?: boolean;  // Celebrate completion
  skippable?: boolean;
}
```

**Step 1: Welcome & Demo**
```
┌─────────────────────────────────────────────────┐
│ Welcome to Lumara! 👋                           │
├─────────────────────────────────────────────────┤
│ Your AI memory companion that helps you think   │
│ more clearly by remembering what matters.       │
│                                                  │
│ Let me show you how it works:                   │
│                                                  │
│ [Interactive Demo Chat]                          │
│ ┌──────────────────────────────────────────────┐│
│ │ You: I prefer morning meetings for deep work ││
│ │                                              ││
│ │ Lumara: 💭 Extracting memory...              ││
│ │         → Type: Preference                   ││
│ │         → Confidence: High                   ││
│ │                                              ││
│ │         Great! I'll remember your morning   ││
│ │         meeting preference.                  ││
│ │                                              ││
│ │         ✓ Memory saved                       ││
│ └──────────────────────────────────────────────┘│
│                                                  │
│ [Next: Try it yourself →]                       │
│ [Skip tutorial]                                  │
└─────────────────────────────────────────────────┘
```

**Step 2: First Memory Creation**
```
┌─────────────────────────────────────────────────┐
│ Tell me something you'd like to remember        │
├─────────────────────────────────────────────────┤
│ This could be:                                   │
│ • A work preference ("I prefer async updates")  │
│ • A learning insight ("TypeScript types help")  │
│ • A team dynamic ("Daily standups work well")   │
│                                                  │
│ Suggestions to get started:                     │
│ [My work preferences]                            │
│ [Learning goals]                                 │
│ [Team practices]                                 │
│ [Personal workflows]                             │
│                                                  │
│ Or type your own:                                │
│ ┌──────────────────────────────────────────────┐│
│ │ [Start typing...]                            ││
│ └──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘

// After first memory saved
┌─────────────────────────────────────────────────┐
│ 🎉 First Memory Created!                        │
├─────────────────────────────────────────────────┤
│ You just created your first memory. I'll help   │
│ you build on this over time.                     │
│                                                  │
│ What happens next:                               │
│ ✓ I'll remember this for you                    │
│ ✓ You can test your recall later                │
│ ✓ I'll help track how your understanding evolves│
│                                                  │
│ [Continue →]                                     │
└─────────────────────────────────────────────────┘
```

**Step 3: Ask a Question**
```
┌─────────────────────────────────────────────────┐
│ Now try asking me something                     │
├─────────────────────────────────────────────────┤
│ I'll search your memories to answer questions.   │
│                                                  │
│ Try asking:                                      │
│ "What do I know about team meetings?"            │
│                                                  │
│ ┌──────────────────────────────────────────────┐│
│ │ [Type your question...]                      ││
│ └──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘

// After asking
┌─────────────────────────────────────────────────┐
│ See how I searched and found your memory? 🔍    │
├─────────────────────────────────────────────────┤
│ The "thinking" section shows my reasoning        │
│ process. You can always see how I find answers.  │
│                                                  │
│ [Continue →]                                     │
└─────────────────────────────────────────────────┘
```

**Step 4: Discover Commands**
```
┌─────────────────────────────────────────────────┐
│ Power Features                                   │
├─────────────────────────────────────────────────┤
│ Type / to see available commands:                │
│                                                  │
│ Essential commands:                              │
│ • /stats - See your knowledge health             │
│ • /playbook [topic] - Generate a guide          │
│ • /test [topic] - Test your recall              │
│                                                  │
│ But you don't need to memorize these!            │
│ I'll suggest actions when relevant.              │
│                                                  │
│ [Show me /stats] [Finish tutorial]              │
└─────────────────────────────────────────────────┘
```

**Step 5: Complete**
```
┌─────────────────────────────────────────────────┐
│ You're all set! 🚀                               │
├─────────────────────────────────────────────────┤
│ You've learned:                                  │
│ ✓ How to create memories                         │
│ ✓ How to ask questions                           │
│ ✓ How thinking visibility works                  │
│ ✓ Where to find power commands                   │
│                                                  │
│ What's next:                                     │
│ • Keep chatting naturally                        │
│ • I'll extract memories automatically            │
│ • Your knowledge base will grow over time        │
│                                                  │
│ [Start using Lumara]                             │
└─────────────────────────────────────────────────┘
```

### 13. **QuickActionButtons Component**
Provides immediate actions without requiring slash commands.

```tsx
interface QuickActionButtonsProps {
  actions: QuickAction[];
  context?: string;          // What triggered these suggestions
}

interface QuickAction {
  label: string;             // "Generate playbook"
  icon?: string;             // "📋"
  handler: () => Promise<void>;
  description?: string;      // Tooltip text
}
```

**Use Cases**:
- **Too many results**: `[Generate playbook] [Show top 5] [Narrow topic]`
- **Contradictions found**: `[Both true] [New replaces old] [Keep original]`
- **Working memory full**: `[Yes, consolidate] [Show memory] [Keep as-is]`
- **Stale memory**: `[Yes, test it] [Still valid] [Update knowledge]`

**Benefits**:
- Discoverability - no need to know commands
- Contextual - only relevant actions shown
- Faster - one click instead of typing
- Progressive disclosure - expert users can still use `/` commands

### 14. **FullScreenDetailView Component** 🆕
Provides immersive full-screen views for complex content.

```tsx
interface FullScreenDetailViewProps {
  type: 'playbook' | 'memory-detail' | 'evolution-history' | 'contradiction-resolution' | 'guide';
  enterAnimation: 'slide-right' | 'expand' | 'fade';
  content: ReactNode;
  sourceMessageId: string; // For return navigation
  scrollPosition: number; // Preserve exact position
  backNavigation: {
    label: string;
    returnsToMessageId: string;
  };
}

interface NavigationState {
  mode: 'chat' | 'detail';
  detailView?: {
    type: string;
    data: any;
    sourceMessageId: string;
    scrollPosition: number;
  };
  history: NavigationEntry[]; // Support browser back button
}
```

**Example - Playbook Detail View**:
```tsx
<FullScreenView>
  <Header>
    <BackButton onClick={returnToChat}>← Back to chat</BackButton>
    <Title>{playbook.title}</Title>
    <Actions>
      <ShareButton />
      <ExportButton />
      <EditButton />
    </Actions>
  </Header>

  <Content>
    <TableOfContents />
    <MainContent>
      {playbook.sections.map(section => (
        <Section key={section.id}>
          <SectionTitle>{section.title}</SectionTitle>
          <SectionContent>{section.content}</SectionContent>
          <RelatedMemories>{section.sources}</RelatedMemories>
        </Section>
      ))}
    </MainContent>
    <Sidebar>
      <ConfidenceScore />
      <LastUpdated />
      <TestResults />
    </Sidebar>
  </Content>
</FullScreenView>
```

**Transition Animations**:
```css
.chat-to-detail {
  animation: slide-left 0.3s ease-out;
}

.detail-enter {
  animation: slide-in-right 0.3s ease-out;
}

.detail-to-chat {
  animation: slide-right 0.3s ease-out;
}

@keyframes slide-left {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

**Use Cases**:
- Viewing generated playbooks and guides
- Exploring evolution history in detail
- Reading comprehensive memory details
- Resolving contradictions with full context
- Browsing pattern discoveries

**Benefits**:
- Immersive reading experience
- No cramped side panels
- Rich formatting and navigation
- Seamless transition with preserved scroll position

### 15. **EnhancedScrollbar Component** 🆕
Smart scrollbar with activity overlay and content type indicators.

```tsx
interface EnhancedScrollbarProps {
  // Visual indicators for generated content
  milestones: Array<{
    position: number; // % from top
    type: 'playbook' | 'memory' | 'contradiction' | 'breakthrough' | 'guide' | 'pattern';
    icon: string; // 📋 📝 ⚡ 💡 📖 🔍
    tooltip: string;
    messageId: string;
  }>;

  // Density visualization
  densityMap: number[]; // Memory density per segment

  // Current view indicator
  viewport: {
    start: number;
    end: number;
    highlight: boolean;
  };
}
```

### 16. **MetacognitiveInsightWidget Component** 🆕
Shows thinking pattern insights and coaching.

```tsx
interface MetacognitiveInsightWidgetProps {
  insight: {
    type: 'bias-detection' | 'pattern-found' | 'calibration-issue' | 'learning-style';
    title: string;
    description: string;
    evidence: Evidence[];
    recommendation?: string;
    severity?: 'info' | 'warning' | 'critical';
  };
  onDismiss: () => void;
  onLearnMore: () => void;
}
```

**Renders as:**
```
┌─────────────────────────────────────────────────┐
│ 🧠 Metacognitive Insight                        │
├─────────────────────────────────────────────────┤
│ Pattern: Overconfidence in technical domains    │
│                                                  │
│ Your 90%+ confidence predictions succeed 45%    │
│ of the time when dealing with:                  │
│ • System architecture                            │
│ • Timeline estimates                             │
│ • Performance optimization                       │
│                                                  │
│ Recommendation: Add "needs prototype" flag      │
│ when confidence > 85% in these areas.           │
│                                                  │
│ [Adjust my defaults] [Learn more] [Dismiss]     │
└─────────────────────────────────────────────────┘
```

### 17. **CalibrationTrainingWidget Component** 🆕
Interactive confidence calibration exercises.

```tsx
interface CalibrationTrainingWidgetProps {
  history: CalibrationHistory;
  currentExercise?: CalibrationExercise;
  onComplete: (result: CalibrationResult) => void;
}
```

**Monthly Calibration Report:**
```
┌─────────────────────────────────────────────────┐
│ 📊 Your Confidence Calibration                  │
├─────────────────────────────────────────────────┤
│ Your Predictions vs Reality:                    │
│                                                  │
│ 90-100% confident → 72% accurate ⚠️             │
│ 70-89% confident → 68% accurate ✓              │
│ 50-69% confident → 61% accurate ✓              │
│ 30-49% confident → 38% accurate ✓              │
│                                                  │
│ Suggestion: When you feel 90%+ confident,       │
│ consider dropping to 75% by default.           │
│                                                  │
│ Best calibrated: People skills (±5%)           │
│ Needs work: Technical predictions (±23%)        │
│                                                  │
│ [Start calibration exercise] [See examples]     │
└─────────────────────────────────────────────────┘
```

### 18. **TeamPerspectiveWidget Component** 🆕
Shows collective intelligence and team divergence.

```tsx
interface TeamPerspectiveWidgetProps {
  topic: string;
  perspectives: UserPerspective[];
  consensus: number;
  divergence: DivergencePoint[];
  collectiveInsight?: string;
}
```

### 19. **ProvenanceVisualizationWidget Component** 🆕
Shows complete origin story and influence map.

```tsx
interface ProvenanceVisualizationWidgetProps {
  belief: Memory;
  chain: EvidenceChain;
  influences: InfluenceMap;
  attribution: AttributionBreakdown;
}
```

**Renders as:**
```
📍 Origin Point (Jan 2024)
└─ Read: Martin Fowler article (40% confidence)
   └─ Reinforced: AWS workshop (→ 60%)
      └─ Validated: First project (→ 85%)
         └─ Challenged: Team feedback (→ 72%)
            └─ Current: Context-dependent (72%)

Influence Network:
[Article: 30%] → [Your Experience: 45%] ← [Team: 25%]
                           ↓
                  [Current Belief: 72%]

[View full chain] [Export provenance]
```

### 20. **QuickCaptureIndicator Component** 🆕
Visual feedback for quick capture shortcuts.

```tsx
interface QuickCaptureIndicatorProps {
  type: '!' | '+' | '-' | '?' | '@' | '#' | '~';
  content: string;
  status: 'capturing' | 'processing' | 'complete';
  result?: CaptureResult;
}
```

**Visual Feedback:**
```
You: !gym Morning workouts drain energy

[Toast notification]
⚡ Contradiction captured
Previous: "Morning exercise energizes" (75%)
New: "Morning workouts drain" (pending)
[Resolve now] [Process later] [✓]
```

**Visual Design**:
```css
/* Enhanced scrollbar with milestone markers */
.enhanced-scrollbar {
  position: fixed;
  right: 0;
  top: 0;
  width: 12px;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(var(--density-color), var(--density-1)),
    rgba(var(--density-color), var(--density-2)),
    /* ... density gradient based on memory activity ... */
  );
}

.scrollbar-milestone {
  position: absolute;
  right: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.scrollbar-milestone:hover {
  transform: scale(1.2);
}

/* Content type icons */
.milestone-playbook { content: '📋'; }
.milestone-guide { content: '📖'; }
.milestone-contradiction { content: '⚡'; }
.milestone-breakthrough { content: '💡'; }
.milestone-pattern { content: '🔍'; }
.milestone-memory { content: '🧠'; }
```

**Interactive Behavior**:
- Hover on icon → show tooltip with content preview
- Click on icon → smooth scroll to that content
- Density gradient shows memory activity levels
- Current viewport highlighted

---

## 🕐 Temporal Navigation Pattern

**Problem**: Without sidebars/tabs, how do users explore their knowledge base?

**Solution**: Time-based navigation instead of spatial navigation.

### **Core Concept**
Every memory is linked to the conversation where it was created. Clicking on any memory reference (in widgets, thinking results, or AI responses) scrolls back to that moment in conversation history with visual highlight.

### **Implementation**

```tsx
// 1. Track message IDs when creating memories
interface Memory {
  id: string;
  content: string;
  type: 'episodic' | 'semantic' | 'procedural';
  sourceMessageId?: string;  // Link back to conversation
  createdAt: Date;
  // ... other fields
}

// 2. Navigation utility
function navigateToConversation(messageId: string) {
  const element = document.querySelector(`[data-message-id="${messageId}"]`);

  if (element) {
    // Message is already loaded
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('highlight-flash');

    setTimeout(() => {
      element.classList.remove('highlight-flash');
    }, 2000);
  } else {
    // Message is not in view - load conversation history
    loadMessagesContaining(messageId).then(() => {
      navigateToConversation(messageId); // Retry after load
    });
  }
}

// 3. Add to all widget components
<MemoryCard
  memory={memory}
  onClick={() => navigateToConversation(memory.sourceMessageId)}
  role="button"
  aria-label={`View conversation where this was created`}
/>

// 4. Hover tooltips show preview
<Tooltip>
  <p><strong>{formatDate(memory.createdAt)}</strong></p>
  <p className="text-sm text-gray-600">
    {conversationPreview(memory.sourceMessageId)}
  </p>
  <small>Click to view full conversation →</small>
</Tooltip>
```

### **Where This Applies**

| Widget/Component | Clickable Element | Navigation Target |
|------------------|-------------------|-------------------|
| **Evolution Timeline** | Each dot/point | Conversation when understanding changed |
| **Contradiction Comparison** | "View conversation" links | When each conflicting memory was created |
| **Memory Results (Thinking)** | "View" link next to each match | Source conversation |
| **Stats Widget** | Topic names (e.g., "Team management (23)") | Most recent conversation about that topic |
| **Playbook Insights** | Each bullet point | Conversation that led to that insight |
| **Memory Cards** | Entire card | Source conversation |

### **Benefits**

1. **Replaces spatial navigation**: Instead of browsing a sidebar list, you travel through time in the conversation
2. **Context preserved**: See the full conversation context, not just isolated facts
3. **Natural discovery**: Exploring feels like reminiscing, not searching
4. **Mobile-friendly**: No need for split views or panels
5. **Respects chat-first**: Everything stays in the conversation flow

### **User Experience Example**

```
User: "How has my understanding of standups evolved?"

💭 Thinking...
→ Found 4 interpretations of "standups" over 3 months
→ Generating evolution timeline

AI: Your standup understanding evolved through 4 phases:

[Evolution Timeline Widget]
  Jan ● → Feb ● → Mar ● → Apr ●
  30%     45%      70%      85%

*User hovers on March point*

[Tooltip appears]
March 15, 2025
"15-min standups work best"
70% confident

Triggered by: Successful experiment
Click to view conversation →

*User clicks*

[Screen smoothly scrolls up to March conversation]
[Message flashes with blue highlight]

[March 15, 2025, 10:23 AM]
User: I tried the 15-minute time limit today

AI: Great! How did it go?

User: Really well! Team stayed focused and we covered everything

💭 Thinking...
→ Recording practice event
→ Updating confidence: 60% → 70%

[✓ Memory updated: "15-min standups effective"]
```

### **Technical Considerations**

**Message Persistence**: Need to keep message history in IndexedDB, not just memory state:
```tsx
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedMemories?: string[];  // Memory IDs created/updated in this message
}

// Store in Dexie
db.messages.add({
  id: generateId(),
  role: 'user',
  content: userInput,
  timestamp: new Date(),
  relatedMemories: []
});
```

**Infinite scroll performance**: Load messages in chunks of 50:
```tsx
const [loadedMessageRange, setLoadedMessageRange] = useState({
  start: Math.max(0, totalMessages - 50),
  end: totalMessages
});

// When scrolling to old message
async function loadMessagesContaining(messageId: string) {
  const message = await db.messages.get(messageId);
  const messageIndex = await db.messages
    .orderBy('timestamp')
    .toArray()
    .then(msgs => msgs.findIndex(m => m.id === messageId));

  // Load chunk around this message
  setLoadedMessageRange({
    start: Math.max(0, messageIndex - 25),
    end: Math.min(totalMessages, messageIndex + 25)
  });
}
```

**Highlight timing**: 2-second fade matches user's "orientation time" - enough to find context without being distracting.

---

## 🆕 New Feature Enhancements

### 1. **Contextual Stale Memory Reminders**

**Problem**: Existing plans have spaced repetition in background. Users might miss reminders.

**Solution**: Surface reminders during relevant conversations.

```typescript
// When retrieving memories for a question
const shouldSuggestTest = (memory: Memory) => {
  const daysSinceTest = daysBetween(memory.lastTested, now);
  const confidenceLevel = memory.confidence;

  // High confidence but untested = decay risk
  if (confidenceLevel > 70 && daysSinceTest > 30) return true;

  // Medium confidence and old = needs validation
  if (confidenceLevel < 70 && daysSinceTest > 14) return true;

  return false;
};
```

**User Experience**:
```
User: I'm planning tomorrow's standup

💭 Thinking...
→ Searching memories about "standup"
→ Found "15-min standups work best" (85% confident)
→ Last tested: 47 days ago
→ Suggesting retest

AI: You believe 15-minute standups work best (85% confident).

⏰ Reminder: You haven't tested this in 47 days.
Your confidence might be outdated. Want to plan
a quick test at tomorrow's standup?

[Yes, remind me to track it] [Confidence still valid]
```

**Trigger Types**:
- **Outdated**: "Last tested X days ago"
- **Untested**: "You've never actually tested this"
- **Contradicted**: "Your last 3 tests failed - confidence too high?"

### 2. **Conversational Test Tracking**

**Problem**: Original plans have test tracking UI forms. Chat-only needs conversational flow.

**Solution**: AI detects practice events and asks about outcomes.

```typescript
// Detect practice mentions
const PRACTICE_PATTERNS = [
  /tried.*again/i,
  /tested.*today/i,
  /practiced.*this/i,
  /applied.*yesterday/i,
];

// When detected
if (isPracticeEvent(userMessage)) {
  await recordPracticeAttempt(relatedMemory);
  askForOutcome(); // "How did it go?"
}
```

**User Experience**:
```
User: I tried the 15-minute standup again today

💭 Thinking...
→ Detected practice event
→ Matching to knowledge: "15-min standups effective"
→ Recording test attempt

AI: Great! I'll record this practice. How did it go?

User: It worked really well

💭 Thinking...
→ Recording: Success
→ Test count: 14 → 15 successful
→ Confidence: 75% → 80%

AI: Excellent! Your confidence in "15-minute standups"
increased to 80% (15 successful tests).
```

### 3. **Proactive Consolidation Prompts**

**Problem**: Original plans auto-consolidate silently. Users may not understand what happened.

**Solution**: Show consolidation in thinking, ask permission.

```typescript
// When working memory reaches capacity
if (workingMemory.items.length >= 7) {
  suggestConsolidation();
}
```

**User Experience**:
```
[After extended discussion on multiple topics]

💭 Thinking...
→ Working memory: 7/7 (at capacity)
→ Detecting consolidation opportunity
→ Can merge 3 items into knowledge: "Standup best practices"

AI: You've been exploring a lot! I'm tracking 7 active
thoughts in working memory. Should I consolidate some
into long-term knowledge so we can keep going?

Proposed consolidation:
  • "15-min time limits"
  • "Clear agendas"
  • "Team size matters"
  → Merge into "Effective standup practices"

[Yes, consolidate] [Show working memory] [Keep as-is]
```

### 4. **Event-Based Intentions**

**Problem**: Original prospective memory is time-based only.

**Solution**: Add event-based triggers (keyword matching).

```typescript
interface ProspectiveMemory {
  type: 'intention';
  triggerType: 'time' | 'event';

  // Time-based
  triggerDate?: Date;

  // Event-based
  triggerKeywords?: string[];  // ["meeting", "schedule"]
  triggerContext?: string;     // Description

  content: string;             // What to remember
  completed: boolean;
}
```

**User Experience**:
```
User: When I plan meetings, remind me I prefer mornings

💭 Thinking...
→ Creating event-triggered reminder
→ Trigger keywords: ["meeting", "schedule", "plan"]
→ Content: "User prefers morning meetings"

AI: Got it. Next time we discuss meetings or scheduling,
I'll remind you about your morning preference.

✓ Event reminder set

---

[Later, in a different conversation]

User: Let's schedule the team sync

💭 Thinking...
→ Detected trigger: "schedule"
→ Active reminder found

📌 Reminder: You prefer morning meetings for better focus.

AI: Great! For the team sync, would morning work?
```

### 5. **Smart Context During Knowledge Sharing** 🆕

**Problem**: When users are sharing knowledge or asking questions, relevant context should be visible.

**Solution**: Dynamic context panel appears during thinking process.

```tsx
interface SmartContextPanel {
  mode: 'knowledge-entry' | 'question-asking' | 'exploration';
  visibility: 'collapsed' | 'sidebar' | 'overlay';

  panels: {
    relatedMemories?: Memory[];
    potentialContradictions?: Contradiction[];
    suggestedConnections?: Connection[];
    confidenceLevels?: ConfidenceScore[];
    activeContext?: WorkingMemoryItem[];
  };
}
```

**User Experience - Knowledge Entry**:
```
User: I've been learning about async programming and realized
      that promises aren't always better than callbacks...

💭 Thinking...
→ Detecting knowledge sharing
→ Showing contextual sidebar

┌─ Contextual Intelligence ─────┐
│ 📚 Related Memories (3)        │
│ • "Async/await simplifies..."  │
│ • "Callbacks for simple..."    │
│ • "Promise chains can..."      │
│                                │
│ ⚡ Potential Contradiction     │
│ Earlier: "Always use promises" │
│ Now: "Not always better"       │
│ [Resolve this →]               │
│                                │
│ 🔗 Suggested Connections       │
│ • Error handling patterns      │
│ • Performance considerations   │
│                                │
│ 📊 Confidence Analysis         │
│ Current statement: 65%         │
│ (Needs validation)             │
└────────────────────────────────┘

AI: Interesting insight! This contradicts your earlier belief...
```

**User Experience - Question Asking**:
```
User: What's my approach to error handling in async code?

💭 Thinking...
→ Searching relevant memories
→ Showing context panel

┌─ Memory Context ──────────────┐
│ 📚 Found 8 related memories   │
│                               │
│ High Confidence (>80%):       │
│ • Try-catch with async/await  │
│ • .catch() for promises       │
│                               │
│ Medium Confidence (50-80%):   │
│ • Error boundaries in React   │
│ • Global error handlers       │
│                               │
│ Untested (<50%):             │
│ • Retry mechanisms           │
│ • Circuit breakers           │
│                               │
│ 📅 Last tested: 23 days ago  │
│ [Test knowledge →]            │
└───────────────────────────────┘

AI: Based on your experience, you prefer...
```

**Implementation**:
```tsx
// Dynamic panel that appears during thinking
function SmartContextPanel({ mode, content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show when relevant
  if (!hasRelevantContext(content)) return null;

  return (
    <div className={`
      fixed right-4 top-20
      ${isExpanded ? 'w-80' : 'w-12'}
      transition-all duration-300
      bg-white shadow-lg rounded-lg
      border border-gray-200
    `}>
      {isExpanded ? (
        <ExpandedContext {...content} />
      ) : (
        <CollapsedIndicator
          onClick={() => setIsExpanded(true)}
          count={content.totalItems}
        />
      )}
    </div>
  );
}
```

**Benefits**:
- Context-aware assistance during knowledge entry
- Proactive contradiction detection
- Confidence visualization
- Connection suggestions
- Non-intrusive (appears only when relevant)

---

## 📐 Implementation Phases

### **Phase 0: Full-Screen Navigation System** (1 week) 🆕
**Goal**: Build the foundation for immersive detail views with seamless navigation

**Tasks**:
1. Create `NavigationState` management system
2. Build `FullScreenDetailView` component framework
3. Implement slide transition animations (chat ↔ detail)
4. Create back button with scroll position preservation
5. Add browser back button support (history API)
6. Build detail view templates for:
   - Playbook detail view
   - Memory detail view
   - Evolution history view
   - Contradiction resolution view
   - Pattern discovery view
7. Implement `EnhancedScrollbar` with milestone icons
8. Add content type indicators (📋 📖 ⚡ 💡 🔍)
9. Test navigation flow with mock data
10. Add loading states for detail view transitions

**Success**:
- Smooth transitions between chat and detail views
- Back button preserves exact scroll position
- Rich, immersive detail views for all content types
- Smart scroll shows generated content icons
- No side panels - full viewport utilization

---

### **Phase 0.5: Onboarding & Cold Start** (3-4 days)
**Goal**: Address cold start problem and guide first-time users

**Tasks**:
1. Create `OnboardingFlow` component with 5 interactive steps
2. Build interactive demo chat (simulated conversation)
3. Design first memory creation flow with suggestions
4. Add celebration milestone for first save
5. Create guided question-asking experience
6. Build command discovery interface
7. Implement skip/restart functionality
8. Store onboarding state in localStorage
9. Add "Show tutorial again" option in settings

**Success**:
- New users understand how Lumara works
- First memory created within 2 minutes
- Users discover key features (thinking, commands, questions)
- No empty-chat confusion

---

### **Phase 1: Thinking Visibility** (1 week)
**Goal**: Add deterministic thinking component with widget support

**Tasks**:
1. Create `ThinkingProcess` component with deterministic steps
2. Create `ThinkingWidget` system for intermediate results
3. Hook into `useConversation` to capture reasoning steps
4. Show semantic search process with memory match widget
5. Display embedding scores in structured format
6. Reveal memory ranking logic
7. Add collapsible/expandable thinking sections
8. Add temporal navigation (click widget elements to jump to conversations)

**Success**: Users see consistent AI reasoning with structured widgets before all responses

---

### **Phase 1.5: Memory Activity Visualization** (3-4 days)
**Goal**: Add temporal awareness layer with always-visible heatmap

**Tasks**:
1. Create `MemoryActivityHeatmap` component (always-visible + expanded states)
2. Add ultra-minimal activity sparkline (always present)
3. Implement GitHub-style `ContributionGraph` widget
4. Add `SmartDateHeader` components in chat
5. Implement milestone-based intensity calculation (not volume-based)
6. Add milestone detection algorithm (breakthroughs, mastery, etc.)
7. Create rich hover tooltips showing milestones/achievements
8. Implement click-to-jump navigation from heatmap dots
9. Add period selector (week/month/year/all)
10. Add topic filter functionality
11. Implement infinite scroll for historical data loading

**Success**:
- Users see temporal memory patterns focused on milestones
- Scrollbar reveals important moments, not just activity volume
- Clicking any date jumps to that conversation
- Milestones (breakthroughs, resolutions) visually highlighted

---

### **Phase 1.75: Testing & Working Memory UX** (4-5 days) 🆕
**Goal**: Surface spaced repetition and working memory visibility

**Tasks**:
1. Create `WorkingMemoryIndicator` component (condensed + dropdown)
2. Add working memory capacity tracking (7±2 items)
3. Build consolidation prompt UI when at capacity
4. Create `SpacedRepetitionWidget` component
5. Implement forgetting curve visualization (Ebbinghaus)
6. Build interactive testing interface with questions
7. Add test results widget with confidence adjustment
8. Create manual "Test now" button for memories
9. Implement test history tracking
10. Add contextual testing reminders in conversation
11. Build test scheduling system

**Success**:
- Users can see what's in "working memory"
- Testing is accessible via `/test` or "Test now" buttons
- Forgetting curve shows retention prediction
- Confidence adjusts based on test results

---

### **Phase 2: Quick Actions & Commands** (1 week)
**Goal**: Add contextual actions and slash command infrastructure

**Tasks**:
1. Create `QuickActionButtons` component
2. Implement contextual action suggestions (shown during thinking)
3. Create `CommandPalette` component for power users
4. Implement command parser
5. Add core commands:
   - `/stats` - Knowledge health
   - `/memory` - Working memory state
   - `/playbook [topic]` - Generate guide
   - `/search [query]` - Deep search
   - `/contradictions` - View conflicts
   - `/intentions` - Active reminders
6. Add command autocomplete
7. Add `/help` documentation

**Success**: Users can perform actions via contextual buttons OR slash commands

---

### **Phase 3: Visual Widgets & Metacognitive Features** (2.5 weeks)
**Goal**: Embed complex visualizations and metacognitive intelligence in chat

**Core Widgets**:
1. `EvolutionTimelineWidget` (interactive timeline with temporal navigation)
2. `ContradictionComparisonWidget` (side-by-side with "View conversation" links)
3. `StatsWidget` (health dashboard)
4. `PlaybookPreviewCard` (expandable guide)
5. `PatternDiscoveryWidget` (AI-detected patterns from Wave 5)
6. `MemoryEditMode` (inline editing for memory cards)
7. `BulkManagementMode` (batch operations UI)

**Metacognitive Widgets**:
8. `MetacognitiveInsightWidget` (bias detection, pattern insights)
9. `CalibrationTrainingWidget` (confidence accuracy exercises)
10. `TeamPerspectiveWidget` (collective intelligence views)
11. `ProvenanceVisualizationWidget` (origin stories, influence maps)
12. `QuickCaptureIndicator` (visual feedback for shortcuts)

**Infrastructure**:
13. Implement metacognitive pattern detection engine
14. Add causality tracking system
15. Build collaborative intelligence layer
16. Create provenance tracking system
17. Add thinking style detection
18. Implement quick capture parser
19. Make all widgets collapsible/expandable
20. Add widget-specific actions
21. Implement widget state persistence

**Success**: Complex data shown beautifully, metacognitive insights surfaced, team perspectives visible

---

### **Phase 4: Remove Sidebars** (3 days)
**Goal**: Transition to pure chat UI

**Tasks**:
1. Remove left sidebar (working memory)
2. Remove right sidebar/tabs (memory browsing)
3. Add minimal header (optional badges)
4. Update responsive breakpoints
5. Test mobile layout

**Success**: Clean single-column chat interface

---

### **Phase 5: Proactive Intelligence** (1 week)
**Goal**: Implement contextual suggestions

**Tasks**:
1. Stale memory detection during retrieval
2. Conversational test tracking
3. Consolidation prompts at capacity
4. Event-based intention triggers
5. Tiered interruption system (critical/medium/low)
6. Discovery notification badges

**Success**: AI proactively helps without being annoying

---

### **Phase 6: Backend Integration** (1 week)
**Goal**: Connect to existing psychology algorithms

**Tasks**:
1. Wire forgetting curve calculation (Wave 4)
2. Integrate spaced repetition scheduler (Wave 4)
3. Connect consolidation engine (Wave 3-4)
4. Hook evolution tracking (Wave 2)
5. Link confidence scoring (Wave 2)
6. Test all memory types

**Success**: Full psychology-based memory system working

---

### **Phase 7: Polish & Testing** (3 days)
**Goal**: Refinement and validation

**Tasks**:
1. Verbosity tuning
2. Widget interaction polish
3. Command discoverability
4. Mobile optimization
5. User testing
6. Performance optimization

**Success**: Production-ready chat interface

---

## 🎨 Design Decisions Summary

Answers to key questions from planning session:

| Question | Decision | Rationale |
|----------|----------|-----------|
| **Header visibility** | Hidden by default, badges show on notifications | Clean UI, notifications draw attention |
| **Thinking display** | Deterministic (same steps every time) | Predictable, trustworthy, not variable |
| **Intermediate results** | Structured widgets, not raw text | Enhanced UX, scannable, interactive |
| **Quick actions** | Contextual buttons in thinking + slash commands | Discoverability for new users, power for experts |
| **Widget interactivity** | Mixed: Some interactive, some static | Depends on use case (timeline = interactive, stats = static) |
| **Command discovery** | Buttons first, slash commands for power users | Progressive disclosure, not overwhelming |
| **Mobile adaptation** | Same UI with responsive breakpoints | Single column already mobile-friendly |
| **Working memory indicator** | Hidden, shown via `/memory` or auto-prompts | Not always relevant, reduces clutter |
| **Evolution display** | Text timeline by default, visual widget on demand | Progressive disclosure |
| **Contradiction resolution** | Comparison widget in chat | Better than text-only side-by-side |
| **Resolved contradictions** | Show latest truth, evolution on demand | Quick answers, context available |
| **"Too many results" threshold** | 10-20 items, then suggest playbook/filter | Prevents overwhelming user |
| **Proactive interruptions** | Tiered: critical (interrupt), medium (pause), low (passive) | Respects conversation flow |
| **Bulk operations** | Conversational with confirmation | Slower but safer |
| **Temporal navigation** | Click any widget element to jump to source conversation | Replaces spatial browsing (sidebars) with time-based navigation |
| **Widget interactivity** | Hover = tooltip summary, Click = navigate to conversation | Natural exploration without leaving chat |

---

## 🔄 Migration Strategy

### **From Current Implementation**

```
Current Structure:              New Structure:
├─ ChatInterface.tsx      →    ├─ ChatInterface.tsx (enhanced)
├─ MemoryList.tsx         →    ├─ navigation/
├─ Sidebar.tsx            →    │  ├─ NavigationState.tsx 🆕
└─ Tabs.tsx               →    │  ├─ FullScreenDetailView.tsx 🆕
                                │  └─ TransitionAnimations.tsx 🆕
                                ├─ metacognition/ 🆕
                                │  ├─ PatternEngine.tsx
                                │  ├─ CalibrationSystem.tsx
                                │  ├─ CoachingEngine.tsx
                                │  ├─ BiasDetector.tsx
                                │  └─ ThinkingStyleAdapter.tsx
                                ├─ collaboration/ 🆕
                                │  ├─ TeamPerspectives.tsx
                                │  ├─ ConsensusCalculator.tsx
                                │  ├─ CollectiveIntelligence.tsx
                                │  └─ SpaceManager.tsx
                                ├─ provenance/ 🆕
                                │  ├─ EvidenceChainBuilder.tsx
                                │  ├─ CausalityTracker.tsx
                                │  ├─ InfluenceMapper.tsx
                                │  └─ AttributionTracker.tsx
                                ├─ OnboardingFlow.tsx 🆕
                                ├─ MemoryActivityHeatmap.tsx 🆕
                                ├─ EnhancedScrollbar.tsx 🆕
                                ├─ SmartContextPanel.tsx 🆕
                                ├─ SmartDateHeader.tsx
                                ├─ WorkingMemoryIndicator.tsx 🆕
                                ├─ ThinkingProcess.tsx
                                ├─ CommandPalette.tsx
                                ├─ QuickActionButtons.tsx
                                ├─ QuickCaptureParser.tsx 🆕
                                ├─ widgets/
                                │  ├─ EvolutionTimeline.tsx
                                │  ├─ ContradictionComparison.tsx
                                │  ├─ StatsWidget.tsx
                                │  ├─ PlaybookPreview.tsx
                                │  ├─ PlaybookDetailView.tsx 🆕
                                │  ├─ MemoryDetailView.tsx 🆕
                                │  ├─ ContributionGraph.tsx
                                │  ├─ SpacedRepetitionWidget.tsx 🆕
                                │  ├─ PatternDiscoveryWidget.tsx 🆕
                                │  ├─ MemoryEditMode.tsx 🆕
                                │  ├─ BulkManagementMode.tsx 🆕
                                │  ├─ MetacognitiveInsightWidget.tsx 🆕
                                │  ├─ CalibrationTrainingWidget.tsx 🆕
                                │  ├─ TeamPerspectiveWidget.tsx 🆕
                                │  ├─ ProvenanceVisualizationWidget.tsx 🆕
                                │  └─ ThinkingWidget.tsx (base)
                                └─ ProactiveIntelligence.tsx
```

### **Code Reuse**

**✅ Keep (Backend)**:
- All AI logic (providers, embeddings, search) from `src/lib/ai/`
- All database logic (Dexie, CRUD) from `src/lib/db/`
- Memory extraction from `src/lib/ai/memory-extraction.ts`
- Contradiction detection (Wave 0.2)
- Evolution tracking (Wave 2)

**❌ Replace (UI)**:
- Sidebar components
- Tab navigation
- Memory list views
- Panel layouts

### **Feature Flags**

```typescript
// For A/B testing
const UI_MODE = import.meta.env.VITE_UI_MODE || 'chat-first';

if (UI_MODE === 'chat-first') {
  // New chat-only interface
  return <ChatInterface />;
} else {
  // Legacy 3-panel interface
  return <ThreePanelLayout />;
}
```

### **Rollback Plan**

1. Keep 3-panel UI code in separate branch
2. A/B test with 10% of users
3. Monitor engagement metrics
4. If chat-first fails, revert with one deployment
5. Gather feedback for improvements

---

## 🚨 Risks & Mitigations

### **Risk 1: Memory Discovery**
**Problem**: Users can't browse all memories
**Impact**: May forget what they've stored
**Mitigation**:
- Excellent semantic search (already exists)
- Playbook generation for overviews
- `/search` command for deep dives
- Proactive AI suggestions

### **Risk 2: Cognitive Load**
**Problem**: Everything in chat could get overwhelming
**Impact**: Long conversations become cluttered
**Mitigation**:
- Smart pagination (max 5 items inline)
- "Too many results" → playbook suggestion
- Collapsible widgets
- Clear conversation separation

### **Risk 3: Command Discoverability**
**Problem**: `/` commands hidden until typed
**Impact**: Users may not find power features
**Mitigation**:
- Onboarding tutorial
- Placeholder hint: "Type / for commands"
- Contextual AI suggestions: `[Try /playbook]`
- `/help` always available

### **Risk 4: Performance**
**Problem**: Long chat history with widgets
**Impact**: Slow scrolling, memory leaks
**Mitigation**:
- Virtualized scrolling (react-window)
- Lazy-load widgets
- Pagination of old messages
- Unload off-screen widgets

### **Risk 5: Mobile Usability**
**Problem**: Widgets may not fit narrow viewports
**Impact**: Poor mobile experience
**Mitigation**:
- Responsive widget breakpoints
- Simplified mobile widgets
- Swipe gestures for widget actions
- Thorough mobile testing

---

## 📊 Success Metrics

### **Adoption Metrics**
- % of users trying `/` commands
- Average commands per session
- Widget interaction rate
- Verbosity preference distribution

### **Engagement Metrics**
- Time spent in chat vs old browsing
- Messages per session
- Memory creation rate
- Testing/validation frequency

### **Quality Metrics**
- Contradiction resolution rate
- Memory consolidation rate
- Stale memory reduction
- Confidence score growth

### **Satisfaction Metrics**
- User feedback scores
- Feature request themes
- Bug report frequency
- Retention rate

---

## ❓ Open Questions

For future consideration:

1. **Quick Actions Menu**: Should non-expert users have a visual menu (☰) in addition to slash commands?
   - **Update**: Quick action buttons provide this without a menu

2. **Memory Organization**: Without folders/tags UI, how do users categorize memories?
   - **Resolved**: Memory spaces + semantic search + auto-tagging + quick capture modes

3. **Memory Editing**: What's the UX for editing a memory found via search?
   - **Resolved**: MemoryEditMode component provides inline editing in chat

4. **Conversation History**: Do users need to see past chat sessions?
   - **Resolved**: Temporal navigation through heatmap and scrollbar provides this

5. **Export Format**: What formats for `/export`?
   - **Current thinking**: JSON (backup), Markdown (reading), CSV (analysis), PDF (sharing)

6. **Team Features**: How does chat-only work for shared knowledge bases?
   - **Resolved**: TeamPerspectiveWidget + collaborative intelligence layer handles this

**New Open Questions:**

7. **Calibration Frequency**: How often should calibration exercises appear? Weekly? Monthly?

8. **Bias Intervention**: When should the system intervene about detected biases? Threshold?

9. **Privacy in Teams**: How to handle private thoughts in shared spaces?

10. **Metacognitive Onboarding**: Should pattern detection start immediately or after baseline data?

---

## 📚 References

### **Related Documents**
- `WAVE_ROADMAP.md` - Original implementation plan (Waves 1-5)
- `MEMORY_ARCHITECTURE.md` - 3-panel UI design (being replaced)
- `MEMORY_PSYCHOLOGY_ARCHITECTURE.md` - Psychology foundations (kept)
- `MEMORY_IMPLEMENTATION_PLAN.md` - Backend algorithms (reused)
- `PRODUCT_DEFINITION_COMPLETE.md` - Product vision (aligned)
- `UI_UX_SPECIFICATIONS.md` - Original UI specs (reference)

### **Key Insights Preserved**
1. All 6 memory types audited and addressed
2. Psychology-based algorithms remain intact
3. Chat-only is presentation layer change
4. New enhancements complement existing plans
5. Phased implementation allows validation

---

## 📊 Gap Analysis Summary

### **What Was Missing (Before This Update)**

| Gap | Impact | Status |
|-----|--------|--------|
| Onboarding & Cold Start | 🔴 Critical | ✅ Added Phase 0.5 |
| Spaced Repetition UI | 🔴 Critical | ✅ Added Phase 1.75 |
| Working Memory Visibility | 🟡 Medium | ✅ Added Phase 1.75 |
| Pattern Discovery Surfacing | 🟡 Medium | ✅ Added to Phase 3 |
| Memory Editing | 🟡 Medium | ✅ Added to Phase 3 |
| Bulk Management | 🟡 Medium | ✅ Added to Phase 3 |
| Forgetting Curve Viz | 🟡 Medium | ✅ Added Phase 1.75 |

### **Coverage Now**

| Aspect | Before | After | Complete? |
|--------|--------|-------|-----------|
| **Backend (Waves 0-5)** | 100% | 100% | ✅ Yes |
| **Core Psychology** | 100% | 100% | ✅ Yes |
| **UX Components** | 70% | 95% | ✅ Nearly complete |
| **Onboarding** | 0% | 100% | ✅ Fully designed |
| **Testing/Spaced Rep** | 30% | 100% | ✅ Fully designed |
| **Pattern Discovery** | 0% | 100% | ✅ Fully designed |

### **Timeline Comparison**

| Version | Duration | Completeness | Features |
|---------|----------|--------------|----------|
| Original (before gaps) | 6.5 weeks | 70% complete | Basic memory & UI |
| Updated (gaps filled) | 8 weeks | 95% complete | + Testing, patterns, editing |
| **Complete Metacognitive** | **10-11 weeks** | **100% complete** | + Full metacognition, collaboration, provenance |

---

## ✅ Next Steps

1. **Review this vision** with team/stakeholders
2. **Get approval** for chat-first direction
3. **Start Phase 0.5** (Onboarding) - CRITICAL FIRST STEP
4. **User test** each phase before proceeding
5. **Iterate** based on feedback

**Recommended Start**: Phase 0.5 (Onboarding) should be completed BEFORE building other features to ensure new users aren't confused by empty chat.

---

**Document Maintenance:**
- Update after each phase completion
- Record new decisions here
- Link to implementation PRs
- Track open questions resolution

**Version History:**
- 2025-10-16: Initial vision document
- 2025-10-17: Updated for deterministic thinking + widget-based intermediate results + quick action buttons
- 2025-10-17: Added temporal navigation pattern (hover tooltips + click-to-navigate to source conversations)
- 2025-10-17: Added Memory Activity Heatmap, Enhanced Scrollbar, and Smart Date Headers for temporal awareness
- 2025-10-17: **CRITICAL UPDATE** - Changed from volume-based (counts) to **milestone-based** (meaningful moments with icons/checkmarks). Hover shows rich overview with achievements, not numbers. Clarified chat flows top→bottom (oldest at top, newest at bottom, scroll down = forward in time).
- 2025-10-17: **COMPREHENSIVE UPDATE** - Added all missing critical features:
  - ✅ Phase 0.5: OnboardingFlow component (addresses cold start problem)
  - ✅ Phase 1.75: WorkingMemoryIndicator + SpacedRepetitionWidget (surfaced testing UX)
  - ✅ Phase 3: PatternDiscoveryWidget (surfaces Wave 5 AI patterns)
  - ✅ Phase 3: MemoryEditMode + BulkManagementMode (editing & batch operations)
  - Updated timeline: 6.5 weeks → 8 weeks (95% complete coverage vs 70%)
  - Added gap analysis summary showing what was missing and how it's now addressed
- 2025-10-18: **METACOGNITIVE TRANSFORMATION** - Complete vision with metacognitive intelligence:
  - ✅ Added Metacognitive Intelligence Layer (pattern analysis, bias detection, calibration)
  - ✅ Added Causality & Decision Tracking (evidence chains, impact analysis, attribution)
  - ✅ Added Collaborative Intelligence (team perspectives, collective patterns, consensus)
  - ✅ Added Knowledge Provenance System (origin tracking, influence mapping)
  - ✅ Added Adaptive Interaction Modes (thinking styles, quick capture, memory spaces)
  - ✅ Added Multiple "Aha!" Moments design (progressive discovery journey)
  - ✅ Added 5 new metacognitive widgets (insights, calibration, team, provenance, capture)
  - ✅ Expanded Phase 3 to include full metacognitive infrastructure
  - ✅ Updated architecture with 4 new system layers (metacognition, collaboration, provenance, adaptation)
  - Updated timeline: 8 weeks → 10-11 weeks (100% complete vision)
  - Transformed from memory system to true metacognitive partner

**Last Updated:** 2025-10-18
**Next Review:** After Phase 0 completion (navigation system)
**Completeness:** 100% (complete metacognitive vision)
