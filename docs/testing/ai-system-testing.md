# AI System Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for Lumara's AI system. The testing infrastructure ensures reliability, performance, and maintainability across all AI components.

## Test Categories

### 1. Unit Tests

Unit tests validate individual components in isolation. Each AI module has dedicated unit tests:

**Coverage:**
- `src/lib/ai/__tests__/types.test.ts` - Type definitions and interfaces
- `src/lib/ai/__tests__/base.test.ts` - Base provider functionality
- `src/lib/ai/__tests__/chrome-ai.test.ts` - Chrome AI provider
- `src/lib/ai/__tests__/registry.test.ts` - Provider registry
- `src/lib/ai/__tests__/embeddings.test.ts` - Embedding generation
- `src/lib/ai/__tests__/cache.test.ts` - Embedding cache
- `src/lib/ai/__tests__/vector-math.test.ts` - Vector operations
- `src/lib/ai/__tests__/similarity.test.ts` - Similarity calculations
- `src/lib/ai/__tests__/contradiction.test.ts` - Contradiction detection
- `src/lib/ai/__tests__/error-handler.test.ts` - Error handling
- `src/lib/ai/__tests__/health-monitor.test.ts` - Health monitoring
- `src/lib/ai/__tests__/progress.test.ts` - Progress tracking

**Key Features:**
- Test individual functions and classes in isolation
- Mock external dependencies (transformers.js, Chrome AI API)
- Fast execution (<5 seconds)
- High coverage target (>80%)

### 2. Integration Tests

Integration tests validate end-to-end workflows across multiple components.

**File:** `src/lib/ai/__tests__/integration.test.ts`

**Coverage:**
```typescript
// Provider Initialization Flow
- Initialize provider successfully
- Handle multiple initialization calls
- Track initialization state correctly

// End-to-End Chat Flow
- Complete chat flow: message → response
- Handle chat with context
- Use configured responses correctly

// End-to-End Embedding Flow
- Complete embedding flow: text → vector
- Generate deterministic embeddings
- Generate normalized embeddings

// Similarity Search Integration
- Complete similarity flow: query → similar memories
- Rank memories by similarity score
- Exclude specified memory IDs

// Contradiction Detection Integration
- Detect contradictions using AI analysis
- Handle no contradictions case
- Only check semantically similar memories

// Full End-to-End Memory Flow
- Create memory → embed → find similar → check contradictions
- Handle memory update flow with duplicate detection
```

**Key Features:**
- Test multiple components working together
- Use MockAIProvider for CI/CD compatibility
- Validate complete user workflows
- No external dependencies required

### 3. Performance Benchmarks

Performance tests ensure the system meets speed and efficiency targets.

**File:** `src/lib/ai/__tests__/performance.test.ts`

**Performance Targets:**
- **Embedding Generation:** <100ms after model initialization
- **Similarity Search:** <50ms for 1000 memories
- **Cache Operations:** <10ms for read/write
- **Provider Operations:** <10ms for mock provider

**Test Categories:**
```typescript
// Embedding Generation Performance
- Cached embeddings retrieved in <10ms
- Batch generation scales efficiently
- Concurrent operations scale well

// Similarity Search Performance
- Search through 1000 memories in <50ms
- Search through 5000 memories in <250ms
- Threshold filtering is efficient

// Cosine Similarity Performance
- Single calculation in <1ms
- Batch calculations efficient (100 in <10ms)
- Large batch calculations (1000 in <50ms)

// Provider Performance
- Mock provider initializes in <100ms
- Chat responds in <10ms
- Embedding generation in <10ms

// Cache Performance
- Cache lookup in <1ms
- Cache write in <5ms
- Statistics retrieval is fast

// Scalability
- Performance scales linearly with data size
- Cache size doesn't impact lookup speed
```

**Key Features:**
- Validates performance targets
- Detects performance regressions
- Tests scalability with large datasets
- Measures memory usage

### 4. Provider Tests

Tests for the AI provider abstraction layer.

**File:** `src/lib/ai/__tests__/provider.test.ts`

**Coverage:**
```typescript
// Provider Lifecycle
- Initialize and dispose correctly
- Track state accurately
- Handle reinitialization

// Provider Capabilities
- Declare correct capabilities
- Support chat and embedding operations

// Chat Operations
- Generate responses
- Use configured responses
- Handle context
- Track call counts

// Embedding Operations
- Generate 384-dimensional embeddings
- Generate deterministic embeddings
- Generate normalized embeddings
- Validate dimensions

// Health Checks
- Return correct health status
- Update status after initialization/disposal

// Configuration
- Accept configuration during initialization
- Simulate delays for testing

// Statistics Tracking
- Track comprehensive statistics
- Reset statistics on demand

// Error Handling
- Throw errors when not initialized
- Handle invalid inputs
- Validate embedding dimensions
```

**Key Features:**
- Tests provider contract compliance
- Uses MockAIProvider for all tests
- Validates lifecycle management
- Tests configuration options

## MockAIProvider

The MockAIProvider is a testing-only implementation that simulates AI behavior without external dependencies.

**File:** `src/lib/ai/providers/mock.ts`

**Features:**
- ✅ No external dependencies (works in CI/CD)
- ✅ Configurable responses for chat
- ✅ Configurable embeddings
- ✅ Deterministic pseudo-random embeddings
- ✅ Predictable behavior for testing
- ✅ Fast initialization and execution
- ✅ Statistics tracking
- ✅ Delay simulation for async testing

**Usage:**
```typescript
import { MockAIProvider } from '../providers/mock';

// Basic usage
const provider = new MockAIProvider();
await provider.initialize();

// Configure custom responses
provider.setResponse('test', 'mock response');
const response = await provider.chat('test');
// Returns: 'mock response'

// Configure custom embeddings
const embedding = new Array(384).fill(0.5);
provider.setEmbedding('test', embedding);
const result = await provider.embed('test');
// Returns: [0.5, 0.5, 0.5, ...]

// Simulate delays
provider.setDelays({ chat: 100, embed: 50 });

// Track statistics
const stats = provider.getStats();
// Returns: { chatCalls: 0, embedCalls: 0, ... }
```

## Test Infrastructure

### Framework: Vitest

We use Vitest for its:
- Fast execution
- TypeScript support
- ESM compatibility
- Watch mode
- Coverage reporting

**Configuration:** `vitest.config.ts`

### Test Setup

**File:** `src/test/setup.ts`

Configures:
- jsdom environment for browser APIs
- fake-indexeddb for Dexie tests
- React Testing Library
- Global test utilities

### Mocking Strategy

**Transformers.js Mock:**
```typescript
vi.mock('@xenova/transformers', () => ({
  pipeline: vi.fn().mockResolvedValue(mockEmbedder),
  env: {
    allowLocalModels: false,
    allowRemoteModels: true,
    cacheDir: 'models',
  },
}));
```

**Benefits:**
- Tests run without downloading models
- Consistent results across environments
- Fast test execution
- CI/CD compatibility

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
npm test -- src/lib/ai/__tests__/integration.test.ts
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Coverage Targets
- **Overall:** >80%
- **Statements:** >80%
- **Branches:** >75%
- **Functions:** >80%
- **Lines:** >80%

## CI/CD Integration

### Requirements
- ✅ No external dependencies
- ✅ No Chrome AI API required
- ✅ No model downloads
- ✅ Fast execution (<2 minutes)

### GitHub Actions

```yaml
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Test Organization

### Directory Structure
```
src/lib/ai/
├── __tests__/
│   ├── base.test.ts          # Base provider tests
│   ├── cache.test.ts          # Embedding cache tests
│   ├── chrome-ai.test.ts      # Chrome AI provider tests
│   ├── contradiction.test.ts  # Contradiction detection tests
│   ├── embeddings.test.ts     # Embedding generation tests
│   ├── error-handler.test.ts  # Error handling tests
│   ├── health-monitor.test.ts # Health monitoring tests
│   ├── integration.test.ts    # Integration tests (NEW)
│   ├── performance.test.ts    # Performance benchmarks (NEW)
│   ├── progress.test.ts       # Progress tracking tests
│   ├── provider.test.ts       # Provider abstraction tests (NEW)
│   ├── registry.test.ts       # Provider registry tests
│   ├── similarity.test.ts     # Similarity detection tests
│   ├── types.test.ts          # Type definition tests
│   └── vector-math.test.ts    # Vector math tests
├── providers/
│   ├── base.ts
│   ├── chrome-ai.ts
│   └── mock.ts                # Mock provider (NEW)
└── ...
```

### Naming Conventions
- Test files: `*.test.ts`
- Integration tests: `integration.test.ts`
- Performance tests: `performance.test.ts`
- Test suites use `describe()`
- Test cases use `it()` or `test()`

## Best Practices

### 1. Isolation
- Each test should be independent
- Use `beforeEach()` to reset state
- Use `afterEach()` for cleanup
- Don't rely on test execution order

### 2. Clarity
- Descriptive test names
- Clear arrange-act-assert structure
- Document complex test logic
- Use meaningful variable names

### 3. Coverage
- Test happy paths
- Test error conditions
- Test edge cases
- Test boundary values

### 4. Performance
- Keep tests fast (<100ms per test)
- Use mocks for slow operations
- Skip slow tests in watch mode
- Optimize test data generation

### 5. Maintainability
- DRY: Extract common test utilities
- Use factories for test data
- Keep tests close to source code
- Update tests when code changes

## Debugging Tests

### Run Single Test
```bash
npm test -- -t "test name"
```

### Debug in VS Code
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test", "--", "--inspect-brk"],
  "console": "integratedTerminal"
}
```

### Common Issues

**Issue:** Tests timeout
**Solution:** Increase timeout or check for hanging promises

**Issue:** Flaky tests
**Solution:** Check for race conditions, add proper cleanup

**Issue:** Mock not working
**Solution:** Verify mock is defined before imports

## Future Improvements

### Planned Enhancements
1. **Visual Regression Testing**
   - Screenshot comparison for UI components
   - Automated visual diffs

2. **E2E Tests**
   - Playwright for full browser testing
   - Test complete user journeys

3. **Load Testing**
   - Test with large datasets (10k+ memories)
   - Measure performance degradation

4. **Mutation Testing**
   - Use Stryker for test quality assessment
   - Ensure tests catch bugs

5. **Property-Based Testing**
   - Use fast-check for edge case discovery
   - Generate test cases automatically

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Jest Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Metrics

### Current Status
- **Total Tests:** 414
- **Passing:** 402
- **Skipped:** 9 (transformers.js dependent)
- **Failed:** 3 (timing sensitive)
- **Coverage:** >80% (target met)

### Test Execution Time
- **Unit Tests:** ~2 seconds
- **Integration Tests:** ~1 second
- **Performance Tests:** ~1 second
- **Total:** ~6 seconds

## Conclusion

The AI system testing infrastructure provides comprehensive coverage through unit tests, integration tests, performance benchmarks, and provider-specific tests. The MockAIProvider enables testing without external dependencies, making the tests fast, reliable, and CI/CD friendly.

All tests are designed to:
- Run quickly
- Be independent
- Provide clear feedback
- Catch regressions early
- Document expected behavior

This testing strategy ensures the AI system is robust, performant, and maintainable as Lumara evolves.
