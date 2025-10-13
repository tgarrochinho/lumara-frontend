# Memory Architecture Implementation Plan

## 📋 Executive Summary

Transform NexusMind from a RAG-based document system to a memory-based cognitive augmentation tool. This plan provides a step-by-step migration path that preserves existing functionality while fundamentally reimagining the user experience.

---

## 🎯 Implementation Phases

### Phase 0: Foundation & Planning (Day 1-2)
**Goal**: Set up the groundwork without breaking existing functionality

### Phase 1: Data Model Evolution (Day 3-5)
**Goal**: Extend existing models to support memory concepts

### Phase 2: UI Restructure (Day 6-10)
**Goal**: Implement three-panel memory layout

### Phase 3: Memory Mechanics (Day 11-15)
**Goal**: Add memory formation, consolidation, and retrieval

### Phase 4: Polish & Migration (Day 16-20)
**Goal**: Refine UX and migrate existing data

---

## 📝 Phase 0: Foundation & Planning

### Day 1: Project Setup

#### 1. Create Migration Branch
```bash
git checkout -b feature/memory-architecture
```

#### 2. Document Current State
```typescript
// Create planning/migration/CURRENT_STATE.md
- Document all existing features that must be preserved
- List all database tables and their relationships
- Map current UI components to new memory concepts
```

#### 3. Set Up Feature Flags
```typescript
// src/config/featureFlags.ts
export const FEATURES = {
  MEMORY_UI: process.env.VITE_ENABLE_MEMORY_UI === 'true',
  LEGACY_UI: process.env.VITE_ENABLE_LEGACY_UI !== 'false',
  MEMORY_ANIMATIONS: process.env.VITE_ENABLE_MEMORY_ANIMATIONS === 'true',
};
```

### Day 2: Technical Planning

#### 1. Dependency Analysis
```typescript
// Identify what needs to change:
- Types (extend, don't replace)
- Database schema (additive changes only)
- Context providers (new memory context)
- Components (gradual migration)
```

#### 2. Create Type Extensions
```typescript
// src/types/memory.types.ts
import { Artifact, Theme, Message } from '../types';

export interface Memory extends Artifact {
  // Original artifact fields preserved
  memoryType: 'episodic' | 'semantic' | 'procedural';
  strength: number; // 0-100
  lastAccessed: Date;
  accessCount: number;
  consolidationState: 'forming' | 'consolidating' | 'consolidated';
  temporalContext: {
    formed: Date;
    session: string;
    precedingMemory?: string;
    followingMemory?: string;
  };
  associations: string[]; // Related memory IDs
}

export interface WorkingMemory {
  id: string;
  items: MemoryItem[];
  capacity: number; // Default 7
  focusTopic: string;
  sessionStart: Date;
}
```

---

## 🗄️ Phase 1: Data Model Evolution

### Day 3: Database Schema Extension

#### 1. Extend Database Schema (Additive Only!)
```typescript
// src/services/dataService.ts

// Add new tables without removing old ones
class DatabaseService {
  constructor() {
    this.db.version(2).stores({
      // Keep all existing tables
      ...existingTables,

      // Add new memory tables
      memories: '++id, subjectId, memoryType, strength, lastAccessed',
      workingMemory: '++id, subjectId, sessionId, timestamp',
      memoryConnections: '++id, fromMemoryId, toMemoryId, type, strength',
      consolidationQueue: '++id, memoryId, scheduledFor, processed'
    });
  }
}
```

#### 2. Create Memory Service
```typescript
// src/services/memoryService.ts
export class MemoryService {
  // Convert artifacts to memories
  async migrateArtifactToMemory(artifact: Artifact): Promise<Memory> {
    return {
      ...artifact,
      memoryType: this.inferMemoryType(artifact),
      strength: this.calculateInitialStrength(artifact),
      lastAccessed: artifact.updatedAt,
      accessCount: 0,
      consolidationState: 'consolidated',
      temporalContext: {
        formed: artifact.createdAt,
        session: artifact.sessionId,
      },
      associations: []
    };
  }

  private inferMemoryType(artifact: Artifact): MemoryType {
    // Use content analysis to determine type
    if (artifact.content.includes('how to') ||
        artifact.content.includes('steps')) {
      return 'procedural';
    }
    if (artifact.metadata?.timestamp) {
      return 'episodic';
    }
    return 'semantic';
  }
}
```

### Day 4: Memory Formation Pipeline

#### 1. Create Memory Formation Service
```typescript
// src/services/memoryFormationService.ts
export class MemoryFormationService {
  async formMemory(
    content: string,
    context: WorkingMemoryContext
  ): Promise<Memory> {
    // 1. Encode: Extract key information
    const encoded = await this.encode(content);

    // 2. Check for conflicts
    const conflicts = await this.detectConflicts(encoded);

    // 3. Create memory with initial strength
    const memory = await this.createMemory(encoded, context);

    // 4. Schedule consolidation
    await this.scheduleConsolidation(memory);

    return memory;
  }

  private async encode(content: string) {
    // Use existing embedding service
    const embedding = await embeddingService.generateEmbedding(content);
    const keywords = await this.extractKeywords(content);

    return { content, embedding, keywords };
  }
}
```

### Day 5: Memory Retrieval System

#### 1. Implement Memory Retrieval
```typescript
// src/services/memoryRetrievalService.ts
export class MemoryRetrievalService {
  async retrieve(
    query: string,
    workingMemory: WorkingMemory
  ): Promise<Memory[]> {
    // 1. Generate query embedding
    const queryEmbedding = await this.getEmbedding(query);

    // 2. Search across memory types
    const episodic = await this.searchEpisodic(queryEmbedding);
    const semantic = await this.searchSemantic(queryEmbedding);
    const procedural = await this.searchProcedural(query);

    // 3. Rank by relevance and recency
    const ranked = this.rankMemories([
      ...episodic,
      ...semantic,
      ...procedural
    ], workingMemory);

    // 4. Update access patterns
    await this.updateAccessPatterns(ranked);

    return ranked;
  }

  private rankMemories(memories: Memory[], context: WorkingMemory) {
    return memories.sort((a, b) => {
      // Factor in: relevance, strength, recency, context
      const scoreA = this.calculateRetrievalScore(a, context);
      const scoreB = this.calculateRetrievalScore(b, context);
      return scoreB - scoreA;
    });
  }
}
```

---

## 🎨 Phase 2: UI Restructure

### Day 6: Layout Foundation

#### 1. Create Memory Layout Component
```tsx
// src/components/layouts/MemoryLayout.tsx
export const MemoryLayout: React.FC = () => {
  const { MEMORY_UI } = FEATURES;

  if (!MEMORY_UI) {
    return <LegacyLayout />; // Fall back to current UI
  }

  return (
    <div className="memory-layout">
      <WorkingMemoryPanel />
      <ConversationSpace />
      <LongTermMemoryPanel />
    </div>
  );
};
```

#### 2. Working Memory Panel
```tsx
// src/components/memory/WorkingMemoryPanel.tsx
export const WorkingMemoryPanel: React.FC = () => {
  const { workingMemory, addToWorking, clearWorking } = useWorkingMemory();

  return (
    <aside className="working-memory-panel">
      <header>
        <h2>Working Memory</h2>
        <MemoryCapacityIndicator
          current={workingMemory.items.length}
          max={7}
        />
      </header>

      <CurrentFocus focus={workingMemory.focusTopic} />

      <RecentThoughts items={workingMemory.items} />

      <QuickCapture onCapture={addToWorking} />

      <button onClick={clearWorking}>
        Clear Working Memory
      </button>
    </aside>
  );
};
```

### Day 7: Conversation Enhancement

#### 1. Enhanced Message Component
```tsx
// src/components/memory/MemoryAwareMessage.tsx
export const MemoryAwareMessage: React.FC<MessageProps> = ({ message }) => {
  const { memoryMarkers, processingStage } = useMemoryProcessing(message);

  return (
    <div className={`message ${processingStage}`}>
      <MessageContent content={message.content} />

      {memoryMarkers.map(marker => (
        <MemoryMarker
          key={marker.id}
          type={marker.type}
          text={marker.text}
          animation={processingStage}
        />
      ))}

      {processingStage === 'consolidating' && (
        <ConsolidationAnimation
          from="conversation"
          to="long-term"
        />
      )}
    </div>
  );
};
```

### Day 8: Long-Term Memory Panel

#### 1. Tabbed Memory Interface
```tsx
// src/components/memory/LongTermMemoryPanel.tsx
export const LongTermMemoryPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MemoryTab>('episodic');

  return (
    <aside className="long-term-memory-panel">
      <TabBar
        tabs={['episodic', 'semantic', 'procedural', 'prospective']}
        active={activeTab}
        onChange={setActiveTab}
      />

      <TabContent>
        {activeTab === 'episodic' && <EpisodicMemoryView />}
        {activeTab === 'semantic' && <SemanticKnowledgeGraph />}
        {activeTab === 'procedural' && <ProceduresAndMethods />}
        {activeTab === 'prospective' && <IntentionsAndPlans />}
      </TabContent>
    </aside>
  );
};
```

### Day 9: Memory Visualization

#### 1. Memory Graph Component
```tsx
// src/components/memory/MemoryGraph.tsx
import { ForceGraph2D } from 'react-force-graph';

export const MemoryGraph: React.FC = () => {
  const { memories, connections } = useMemoryGraph();

  const graphData = {
    nodes: memories.map(m => ({
      id: m.id,
      name: m.content.slice(0, 50),
      val: m.strength,
      color: getMemoryColor(m.memoryType)
    })),
    links: connections.map(c => ({
      source: c.fromMemoryId,
      target: c.toMemoryId,
      value: c.strength
    }))
  };

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="name"
      nodeColor="color"
      linkWidth={link => link.value}
      onNodeClick={handleMemoryClick}
    />
  );
};
```

### Day 10: Animation System

#### 1. Memory Formation Animations
```tsx
// src/components/animations/MemoryAnimations.tsx
export const MemoryFormationAnimation: React.FC = ({ memory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.3, 1, 0.8],
        scale: [0.95, 1.05, 1]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="forming-memory"
    >
      <MemoryCard memory={memory} state="forming" />
    </motion.div>
  );
};

export const ConsolidationFlow: React.FC = ({ from, to, memory }) => {
  return (
    <motion.div
      initial={{ x: from.x, y: from.y }}
      animate={{ x: to.x, y: to.y }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      onAnimationComplete={() => onConsolidated(memory)}
    >
      <MemoryParticle memory={memory} />
    </motion.div>
  );
};
```

---

## 🧠 Phase 3: Memory Mechanics

### Day 11: Memory Strength Algorithm

#### 1. Implement Forgetting Curve
```typescript
// src/services/memoryStrengthService.ts
export class MemoryStrengthService {
  calculateStrength(memory: Memory): number {
    const daysSinceAccess = this.daysSince(memory.lastAccessed);
    const baseStrength = memory.strength;

    // Ebbinghaus forgetting curve
    const retentionRate = Math.exp(-daysSinceAccess / 7);

    // Factor in access frequency
    const frequencyBonus = Math.log(memory.accessCount + 1) * 10;

    // Calculate final strength
    const strength = Math.min(100,
      baseStrength * retentionRate + frequencyBonus
    );

    return Math.max(0, strength);
  }

  async updateMemoryStrength(memoryId: string) {
    const memory = await this.getMemory(memoryId);
    memory.strength = this.calculateStrength(memory);
    memory.lastAccessed = new Date();
    memory.accessCount++;

    await this.saveMemory(memory);

    // Schedule next review if needed
    if (memory.strength < 30) {
      await this.scheduleSpacedRepetition(memory);
    }
  }
}
```

### Day 12: Consolidation Engine

#### 1. Background Consolidation Process
```typescript
// src/services/consolidationService.ts
export class ConsolidationService {
  async consolidateMemories() {
    // Run every hour
    const pending = await this.getPendingConsolidation();

    for (const item of pending) {
      await this.consolidate(item);
    }
  }

  private async consolidate(item: ConsolidationItem) {
    const memory = await this.getMemory(item.memoryId);

    // 1. Find related memories
    const related = await this.findRelated(memory);

    // 2. Detect patterns
    const patterns = await this.detectPatterns(memory, related);

    // 3. Create/update connections
    await this.updateConnections(memory, related, patterns);

    // 4. Update memory state
    memory.consolidationState = 'consolidated';
    await this.saveMemory(memory);

    // 5. Trigger UI update
    this.notifyUI(memory);
  }
}
```

### Day 13: Contradiction Resolution

#### 1. Enhanced Contradiction Detection
```typescript
// src/services/contradictionService.ts
export class ContradictionService {
  async detectContradictions(
    newMemory: Memory,
    existingMemories: Memory[]
  ): Promise<Contradiction[]> {
    const contradictions: Contradiction[] = [];

    for (const existing of existingMemories) {
      // Semantic similarity check
      const similarity = await this.calculateSimilarity(
        newMemory.embedding,
        existing.embedding
      );

      // Negation detection
      const hasNegation = this.detectNegation(
        newMemory.content,
        existing.content
      );

      if (similarity > 0.8 && hasNegation) {
        contradictions.push({
          newMemory,
          existingMemory: existing,
          confidence: similarity,
          type: 'direct_contradiction'
        });
      }
    }

    return contradictions;
  }
}
```

### Day 14: Retrieval Optimization

#### 1. Context-Aware Retrieval
```typescript
// src/hooks/useMemoryRetrieval.ts
export const useMemoryRetrieval = () => {
  const { workingMemory } = useWorkingMemory();
  const { currentSession } = useSession();

  const retrieveMemories = useCallback(async (query: string) => {
    // Build context vector
    const context = {
      workingMemoryItems: workingMemory.items.map(i => i.id),
      sessionTopic: currentSession.topic,
      recentAccess: getRecentlyAccessedMemories(),
      temporalContext: new Date()
    };

    // Retrieve with context
    const memories = await memoryRetrievalService.retrieve(
      query,
      context
    );

    // Update working memory
    await updateWorkingMemory(memories.slice(0, 3));

    return memories;
  }, [workingMemory, currentSession]);

  return { retrieveMemories };
};
```

### Day 15: Memory Patterns

#### 1. Pattern Recognition
```typescript
// src/services/patternService.ts
export class PatternService {
  async detectPatterns(memories: Memory[]): Promise<Pattern[]> {
    const patterns: Pattern[] = [];

    // Temporal patterns
    const temporal = this.findTemporalPatterns(memories);
    patterns.push(...temporal);

    // Causal patterns
    const causal = this.findCausalPatterns(memories);
    patterns.push(...causal);

    // Conceptual clusters
    const clusters = await this.findConceptualClusters(memories);
    patterns.push(...clusters);

    return patterns;
  }

  private findTemporalPatterns(memories: Memory[]) {
    // Find memories that frequently occur together in time
    const sorted = memories.sort((a, b) =>
      a.temporalContext.formed - b.temporalContext.formed
    );

    // Sliding window analysis
    return this.analyzeSlidingWindow(sorted);
  }
}
```

---

## 🔄 Phase 4: Polish & Migration

### Day 16: Data Migration

#### 1. Migration Script
```typescript
// src/migration/migrateToMemory.ts
export async function migrateToMemoryArchitecture() {
  console.log('Starting migration to memory architecture...');

  // 1. Backup existing data
  await backupDatabase();

  // 2. Migrate artifacts to memories
  const artifacts = await dataService.getAllArtifacts();
  for (const artifact of artifacts) {
    const memory = await memoryService.migrateArtifactToMemory(artifact);
    await dataService.saveMemory(memory);
  }

  // 3. Convert themes to semantic networks
  const themes = await dataService.getAllThemes();
  for (const theme of themes) {
    await createSemanticNetwork(theme);
  }

  // 4. Create initial working memory
  await initializeWorkingMemory();

  console.log('Migration complete!');
}
```

### Day 17: Performance Optimization

#### 1. Implement Virtualization
```tsx
// src/components/memory/VirtualizedMemoryList.tsx
import { VariableSizeList } from 'react-window';

export const VirtualizedMemoryList: React.FC = ({ memories }) => {
  const getItemSize = useCallback((index: number) => {
    const memory = memories[index];
    return memory.expanded ? 200 : 80;
  }, [memories]);

  return (
    <VariableSizeList
      height={window.innerHeight - 100}
      itemCount={memories.length}
      itemSize={getItemSize}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <MemoryCard memory={memories[index]} />
        </div>
      )}
    </VariableSizeList>
  );
};
```

### Day 18: User Preferences

#### 1. Memory Settings
```tsx
// src/components/settings/MemorySettings.tsx
export const MemorySettings: React.FC = () => {
  const [preferences, setPreferences] = useMemoryPreferences();

  return (
    <SettingsPanel title="Memory Preferences">
      <Setting
        label="Working Memory Capacity"
        type="slider"
        min={3}
        max={9}
        value={preferences.workingMemoryCapacity}
        onChange={(v) => updatePreference('workingMemoryCapacity', v)}
      />

      <Setting
        label="Auto-Consolidation"
        type="toggle"
        value={preferences.autoConsolidation}
        onChange={(v) => updatePreference('autoConsolidation', v)}
      />

      <Setting
        label="Memory Decay Rate"
        type="select"
        options={['Slow', 'Normal', 'Fast']}
        value={preferences.decayRate}
        onChange={(v) => updatePreference('decayRate', v)}
      />
    </SettingsPanel>
  );
};
```

### Day 19: Testing & QA

#### 1. Memory Formation Tests
```typescript
// tests/unit/memory-formation.test.ts
describe('Memory Formation', () => {
  it('should create episodic memory from conversation', async () => {
    const message = "I went to the store today at 3pm";
    const memory = await memoryFormationService.formMemory(message);

    expect(memory.memoryType).toBe('episodic');
    expect(memory.temporalContext).toBeDefined();
    expect(memory.strength).toBeGreaterThan(50);
  });

  it('should detect and handle contradictions', async () => {
    const memory1 = await createMemory("Coffee is good for health");
    const memory2 = await createMemory("Coffee is bad for health");

    const contradictions = await detectContradictions(memory2, [memory1]);
    expect(contradictions).toHaveLength(1);
  });
});
```

### Day 20: Documentation & Launch

#### 1. User Guide
```markdown
# Memory Architecture User Guide

## Understanding Your Memory System

### Working Memory (Left Panel)
- Your active thoughts and current focus
- Limited to 7±2 items (like human memory)
- Automatically clears after sessions

### Conversation Space (Center)
- Where memories form from conversations
- Shows real-time memory encoding
- Displays connections to existing knowledge

### Long-Term Memory (Right Panel)
- Your consolidated knowledge base
- Organized by memory type
- Strengthens with use, fades without
```

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Migration script tested on copy of production data
- [ ] Performance benchmarks met
- [ ] User documentation complete
- [ ] Feature flags configured

### Launch Day
- [ ] Enable feature flag for beta users
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Document any issues

### Post-Launch
- [ ] Address user feedback
- [ ] Optimize based on usage patterns
- [ ] Plan next iteration

---

## 📊 Success Metrics

### Technical Metrics
- Migration completes < 5 minutes
- No data loss during migration
- Memory operations < 100ms
- Smooth animations at 60fps

### User Metrics
- 80% understand memory concepts within first session
- 50% increase in knowledge retrieval
- 90% prefer new UI over old
- Reduced cognitive load scores

---

## 🎯 Risk Mitigation

### Rollback Plan
1. Feature flags allow instant revert
2. Database changes are additive (old data preserved)
3. Dual UI support during transition
4. Automated backups before migration

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Performance degradation | Implement aggressive virtualization |
| User confusion | Add interactive tutorial |
| Migration failures | Retry with smaller batches |
| Memory conflicts | Improved resolution UI |

---

## 🔮 Future Roadmap

### Next Features
1. **Memory Palace**: 3D visualization
2. **Shared Memory**: Collaborative knowledge
3. **Memory Coaching**: AI-guided improvement
4. **Advanced Patterns**: Deep learning insights
5. **Memory Export**: Knowledge portability

This implementation plan provides a clear path from the current RAG-based system to a psychologically-grounded memory architecture that will differentiate NexusMind as a true thinking partner.