# Custom Embeddings Examples

Advanced examples for working with embeddings in Lumara.

## Semantic Search

### Basic Similarity Search

```typescript
import { generateEmbedding } from '@/lib/ai/embeddings';
import { cosineSimilarity } from '@/lib/ai/utils/vector-math';

interface Memory {
  id: string;
  text: string;
  embedding: number[];
}

async function findSimilarMemories(
  query: string,
  memories: Memory[],
  topK = 5
): Promise<Array<{ memory: Memory; score: number }>> {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarity scores
  const scores = memories.map((memory) => ({
    memory,
    score: cosineSimilarity(queryEmbedding, memory.embedding),
  }));

  // Sort by similarity and return top K
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Usage
const results = await findSimilarMemories(
  'machine learning projects',
  allMemories,
  10
);

results.forEach(({ memory, score }) => {
  console.log(`${score.toFixed(3)}: ${memory.text}`);
});
```

### Semantic Search with Threshold

```typescript
import { generateEmbedding } from '@/lib/ai/embeddings';
import { findSimilarItems } from '@/lib/ai/utils/similarity';

async function searchWithThreshold(
  query: string,
  memories: Array<{ text: string; embedding: number[] }>,
  minSimilarity = 0.7
) {
  const queryEmbedding = await generateEmbedding(query);

  const results = findSimilarItems(
    queryEmbedding,
    memories.map(m => m.embedding),
    memories.length,
    minSimilarity
  );

  return results.map(result => ({
    text: memories[result.index].text,
    similarity: result.similarity,
  }));
}

// Usage - only return highly relevant results
const relevant = await searchWithThreshold(
  'typescript best practices',
  memories,
  0.75 // 75% similarity minimum
);
```

## Duplicate Detection

### Find Duplicate Memories

```typescript
import { generateEmbedding } from '@/lib/ai/embeddings';
import { findSimilarGroups } from '@/lib/ai/utils/similarity';

async function findDuplicates(
  texts: string[],
  threshold = 0.9 // 90% similarity = likely duplicate
): Promise<Array<string[]>> {
  // Generate embeddings for all texts
  const embeddings = await generateBatchEmbeddings(texts);

  // Find similar groups
  const groups = findSimilarGroups(embeddings, threshold);

  // Map back to original texts
  return groups.map(group =>
    group.map(index => texts[index])
  );
}

// Usage
const duplicateGroups = await findDuplicates([
  'Buy milk',
  'Remember to buy milk',
  'Get milk from store',
  'Call mom',
]);

// Result: [['Buy milk', 'Remember to buy milk', 'Get milk from store']]
```

### Prevent Duplicate Memories

```typescript
import { generateEmbedding } from '@/lib/ai/embeddings';
import { cosineSimilarity } from '@/lib/ai/utils/vector-math';

async function isDuplicate(
  newText: string,
  existingMemories: Array<{ text: string; embedding: number[] }>,
  threshold = 0.85
): Promise<boolean> {
  const newEmbedding = await generateEmbedding(newText);

  // Check if any existing memory is too similar
  return existingMemories.some(memory =>
    cosineSimilarity(newEmbedding, memory.embedding) >= threshold
  );
}

// Usage - check before saving
if (await isDuplicate(userInput, existingMemories)) {
  console.log('This memory already exists!');
} else {
  await saveMemory(userInput);
}
```

## Clustering

### Group Similar Memories

```typescript
import { generateBatchEmbeddings } from '@/lib/ai/embeddings';
import { cosineSimilarity } from '@/lib/ai/utils/vector-math';

interface Cluster {
  center: number[];
  items: Array<{ text: string; embedding: number[] }>;
}

async function clusterMemories(
  texts: string[],
  numClusters = 5
): Promise<Cluster[]> {
  // Generate embeddings
  const embeddings = await generateBatchEmbeddings(texts);

  // Simple K-means clustering
  const clusters: Cluster[] = [];

  // Initialize clusters with random centers
  for (let i = 0; i < numClusters; i++) {
    const randomIndex = Math.floor(Math.random() * embeddings.length);
    clusters.push({
      center: [...embeddings[randomIndex]],
      items: [],
    });
  }

  // Iterate until convergence
  for (let iteration = 0; iteration < 10; iteration++) {
    // Clear cluster items
    clusters.forEach(c => c.items = []);

    // Assign items to nearest cluster
    embeddings.forEach((embedding, i) => {
      let maxSimilarity = -1;
      let bestCluster = 0;

      clusters.forEach((cluster, j) => {
        const similarity = cosineSimilarity(embedding, cluster.center);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          bestCluster = j;
        }
      });

      clusters[bestCluster].items.push({
        text: texts[i],
        embedding,
      });
    });

    // Update cluster centers (mean of items)
    clusters.forEach(cluster => {
      if (cluster.items.length === 0) return;

      const dimensions = cluster.items[0].embedding.length;
      const newCenter = new Array(dimensions).fill(0);

      cluster.items.forEach(item => {
        item.embedding.forEach((val, i) => {
          newCenter[i] += val / cluster.items.length;
        });
      });

      cluster.center = newCenter;
    });
  }

  return clusters.filter(c => c.items.length > 0);
}

// Usage
const clusters = await clusterMemories(allMemoryTexts, 5);

clusters.forEach((cluster, i) => {
  console.log(`\nCluster ${i + 1} (${cluster.items.length} items):`);
  cluster.items.slice(0, 3).forEach(item => {
    console.log(`  - ${item.text}`);
  });
});
```

## Contradiction Detection

### Detect Contradictory Memories

```typescript
import { detectContradiction } from '@/lib/ai/utils/contradiction';
import { selectProvider } from '@/lib/ai';

async function findContradictions(
  newMemory: string,
  existingMemories: Array<{ id: string; text: string; embedding: number[] }>,
  threshold = 0.7
): Promise<Array<{ memory: typeof existingMemories[0]; isContradiction: boolean; explanation: string }>> {
  const provider = await selectProvider();
  const newEmbedding = await generateEmbedding(newMemory);

  const contradictions = [];

  for (const memory of existingMemories) {
    const result = await detectContradiction(
      newMemory,
      newEmbedding,
      memory.text,
      memory.embedding,
      provider,
      threshold
    );

    if (result.isContradiction) {
      contradictions.push({
        memory,
        isContradiction: true,
        explanation: result.explanation || 'No explanation provided',
      });
    }
  }

  return contradictions;
}

// Usage
const contradictions = await findContradictions(
  'I love coffee',
  existingMemories,
  0.7
);

if (contradictions.length > 0) {
  console.log('⚠️ Found contradictions:');
  contradictions.forEach(({ memory, explanation }) => {
    console.log(`\nContradicts: "${memory.text}"`);
    console.log(`Reason: ${explanation}`);
  });
}
```

### Resolve Contradictions

```typescript
import { detectContradiction } from '@/lib/ai/utils/contradiction';

async function resolveContradiction(
  memory1: string,
  memory2: string,
  embedding1: number[],
  embedding2: number[]
) {
  const provider = await selectProvider();

  const result = await detectContradiction(
    memory1,
    embedding1,
    memory2,
    embedding2,
    provider
  );

  if (!result.isContradiction) {
    return { resolved: true, action: 'keep-both' };
  }

  // Ask AI for resolution suggestion
  const prompt = `
These two statements contradict each other:
1. "${memory1}"
2. "${memory2}"

Contradiction: ${result.explanation}

How should we resolve this? Options:
A) Keep statement 1, discard statement 2
B) Keep statement 2, discard statement 1
C) Merge both into a new statement
D) Keep both with a note about the contradiction

Respond with just the letter (A, B, C, or D) and a brief explanation.
  `;

  const suggestion = await provider.chat(prompt);

  return {
    resolved: false,
    contradiction: result.explanation,
    suggestion,
  };
}
```

## Advanced Similarity

### Multi-Query Search

```typescript
import { generateBatchEmbeddings } from '@/lib/ai/embeddings';
import { cosineSimilarity } from '@/lib/ai/utils/vector-math';

async function multiQuerySearch(
  queries: string[],
  memories: Array<{ text: string; embedding: number[] }>
): Promise<Array<{ text: string; maxScore: number; matchingQueries: string[] }>> {
  // Generate embeddings for all queries
  const queryEmbeddings = await generateBatchEmbeddings(queries);

  // Score each memory against all queries
  const results = memories.map(memory => {
    const scores = queryEmbeddings.map((queryEmb, i) => ({
      query: queries[i],
      score: cosineSimilarity(queryEmb, memory.embedding),
    }));

    const maxScore = Math.max(...scores.map(s => s.score));
    const matchingQueries = scores
      .filter(s => s.score >= 0.7)
      .map(s => s.query);

    return {
      text: memory.text,
      maxScore,
      matchingQueries,
    };
  });

  return results
    .filter(r => r.matchingQueries.length > 0)
    .sort((a, b) => b.maxScore - a.maxScore);
}

// Usage - search with multiple related queries
const results = await multiQuerySearch(
  [
    'machine learning',
    'AI projects',
    'neural networks',
  ],
  memories
);
```

### Weighted Search

```typescript
interface WeightedQuery {
  text: string;
  weight: number; // 0-1
}

async function weightedSearch(
  queries: WeightedQuery[],
  memories: Array<{ text: string; embedding: number[] }>
): Promise<Array<{ text: string; score: number }>> {
  // Generate embeddings
  const queryEmbeddings = await generateBatchEmbeddings(
    queries.map(q => q.text)
  );

  // Calculate weighted scores
  const results = memories.map(memory => {
    let totalScore = 0;
    let totalWeight = 0;

    queryEmbeddings.forEach((queryEmb, i) => {
      const similarity = cosineSimilarity(queryEmb, memory.embedding);
      const weight = queries[i].weight;
      totalScore += similarity * weight;
      totalWeight += weight;
    });

    return {
      text: memory.text,
      score: totalScore / totalWeight,
    };
  });

  return results
    .sort((a, b) => b.score - a.score)
    .filter(r => r.score >= 0.5);
}

// Usage - prioritize certain aspects
const results = await weightedSearch(
  [
    { text: 'typescript', weight: 0.5 },
    { text: 'best practices', weight: 0.3 },
    { text: 'testing', weight: 0.2 },
  ],
  memories
);
```

## Performance Optimization

### Batch Processing with Progress

```typescript
import { generateBatchEmbeddings } from '@/lib/ai/embeddings';

async function processLargeDataset(
  texts: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<number[][]> {
  const BATCH_SIZE = 50;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const embeddings = await generateBatchEmbeddings(batch);

    results.push(...embeddings);

    // Report progress
    onProgress?.(Math.min(i + BATCH_SIZE, texts.length), texts.length);

    // Small delay to prevent overwhelming the browser
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  return results;
}

// Usage
const embeddings = await processLargeDataset(
  allTexts,
  (completed, total) => {
    console.log(`Progress: ${completed}/${total} (${(completed / total * 100).toFixed(1)}%)`);
  }
);
```

### Caching Strategy

```typescript
import { embeddingCache } from '@/lib/ai/embeddings';

class SmartEmbeddingCache {
  private memoryCache = new Map<string, number[]>();

  async getOrGenerate(text: string): Promise<number[]> {
    // 1. Check in-memory cache (fastest)
    if (this.memoryCache.has(text)) {
      return this.memoryCache.get(text)!;
    }

    // 2. Check IndexedDB cache (fast)
    const cached = await embeddingCache.get(text);
    if (cached) {
      this.memoryCache.set(text, cached);
      return cached;
    }

    // 3. Generate new embedding (slow)
    const embedding = await generateEmbedding(text);

    // Cache at both levels
    this.memoryCache.set(text, embedding);
    await embeddingCache.set(text, embedding);

    return embedding;
  }

  async preload(texts: string[]): Promise<void> {
    // Load from IndexedDB into memory
    for (const text of texts) {
      const cached = await embeddingCache.get(text);
      if (cached) {
        this.memoryCache.set(text, cached);
      }
    }
  }

  clear(): void {
    this.memoryCache.clear();
  }
}

// Usage
const cache = new SmartEmbeddingCache();

// Preload frequently used embeddings
await cache.preload(frequentlyUsedTexts);

// Fast access
const embedding = await cache.getOrGenerate('Some text');
```

## Vector Operations

### Embedding Arithmetic

```typescript
import { cosineSimilarity } from '@/lib/ai/utils/vector-math';

function addVectors(a: number[], b: number[]): number[] {
  return a.map((val, i) => val + b[i]);
}

function subtractVectors(a: number[], b: number[]): number[] {
  return a.map((val, i) => val - b[i]);
}

function normalizeVector(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return vec.map(val => val / magnitude);
}

// Example: Find concept relationships
// "king" - "man" + "woman" ≈ "queen"
async function analogySearch(
  positive: string[],
  negative: string[],
  candidates: Array<{ text: string; embedding: number[] }>
): Promise<string> {
  // Generate embeddings
  const positiveEmbs = await generateBatchEmbeddings(positive);
  const negativeEmbs = await generateBatchEmbeddings(negative);

  // Compute target vector: sum(positive) - sum(negative)
  let target = new Array(384).fill(0);

  positiveEmbs.forEach(emb => {
    target = addVectors(target, emb);
  });

  negativeEmbs.forEach(emb => {
    target = subtractVectors(target, emb);
  });

  target = normalizeVector(target);

  // Find closest candidate
  let maxSim = -1;
  let best = candidates[0].text;

  candidates.forEach(candidate => {
    const sim = cosineSimilarity(target, candidate.embedding);
    if (sim > maxSim) {
      maxSim = sim;
      best = candidate.text;
    }
  });

  return best;
}
```

## Real-World Examples

### Smart Memory Organization

```typescript
import { generateBatchEmbeddings } from '@/lib/ai/embeddings';
import { findSimilarGroups } from '@/lib/ai/utils/similarity';

async function organizeMemories(
  memories: Array<{ id: string; text: string }>
) {
  console.log('Organizing memories...');

  // Generate embeddings
  const texts = memories.map(m => m.text);
  const embeddings = await generateBatchEmbeddings(texts);

  // Find related groups
  const groups = findSimilarGroups(embeddings, 0.7);

  // Create organized structure
  const organized = groups.map(group => ({
    theme: '...', // Could use AI to generate theme
    memories: group.map(i => memories[i]),
  }));

  return organized;
}
```

### Context-Aware Suggestions

```typescript
async function suggestRelatedMemories(
  currentContext: string,
  memories: Array<{ text: string; embedding: number[] }>,
  limit = 5
) {
  // Generate context embedding
  const contextEmbedding = await generateEmbedding(currentContext);

  // Find most relevant memories
  const scores = memories.map(memory => ({
    memory,
    relevance: cosineSimilarity(contextEmbedding, memory.embedding),
  }));

  return scores
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map(s => s.memory);
}

// Usage in chat
const currentContext = `User is working on: ${currentTask}`;
const relevant = await suggestRelatedMemories(currentContext, allMemories);

console.log('💡 Related memories:');
relevant.forEach(m => console.log(`  - ${m.text}`));
```

## See Also

- [Basic Usage](./basic-usage.md) - Getting started with embeddings
- [Architecture](../architecture.md) - How the embedding system works
- [README](../README.md) - Complete API reference
