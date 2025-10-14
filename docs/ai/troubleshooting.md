# AI System Troubleshooting

This guide helps you diagnose and fix common issues with Lumara's AI system.

## Quick Diagnostics

Run this script to check your AI system health:

```typescript
import { selectProvider, checkProviderAvailability } from '@/lib/ai';
import { isEmbeddingsReady, getEmbeddingInfo } from '@/lib/ai/embeddings';

async function diagnose() {
  console.log('=== AI System Diagnostics ===\n');

  // Check provider availability
  console.log('Checking providers...');
  const availability = await checkProviderAvailability();
  availability.forEach((available, name) => {
    console.log(`  ${name}: ${available ? '✅' : '❌'}`);
  });

  // Check embeddings
  console.log('\nChecking embeddings...');
  const embeddingInfo = getEmbeddingInfo();
  console.log(`  Ready: ${embeddingInfo.isReady ? '✅' : '❌'}`);
  console.log(`  Loading: ${embeddingInfo.isLoading ? '⏳' : '✅'}`);
  console.log(`  Model: ${embeddingInfo.modelName}`);

  // Try to select a provider
  console.log('\nSelecting provider...');
  try {
    const provider = await selectProvider();
    console.log(`  ✅ Selected: ${provider.name}`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}
```

## Chrome AI Issues

### Error: "Chrome AI not available"

**Symptoms:**
- Provider selection fails
- "Chrome AI not available" error message

**Causes & Solutions:**

#### 1. Wrong Chrome Version

**Cause:** Using Chrome Stable instead of Canary/Dev.

**Solution:**
```bash
# Install Chrome Canary (macOS)
brew install --cask google-chrome-canary

# Install Chrome Dev (macOS)
brew install --cask google-chrome-dev

# Or download from:
# https://www.google.com/chrome/canary/
# https://www.google.com/chrome/dev/
```

#### 2. Missing Chrome Flags

**Cause:** Required flags not enabled.

**Solution:**
1. Open `chrome://flags/#optimization-guide-on-device-model`
2. Set to **Enabled**
3. Open `chrome://flags/#prompt-api-for-gemini-nano`
4. Set to **Enabled**
5. Restart Chrome
6. Wait 2-3 minutes for initialization

#### 3. Missing Origin Trial Token

**Cause:** No Origin Trial token in HTML.

**Solution:**
```html
<!-- Add to index.html -->
<meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE">
```

Get token at: https://developer.chrome.com/origintrials

Register for: **Built-in AI**

#### 4. Model Not Downloaded

**Cause:** Gemini Nano model not downloaded yet.

**Check:**
1. Open `chrome://components`
2. Find "Optimization Guide On Device Model"
3. Check status

**Solutions:**
- **Status: "Not downloaded"** → Click "Check for update"
- **Status: "Downloading"** → Wait (can take 5-10 minutes)
- **Status: "Ready"** → Should work now

**Troubleshooting download issues:**
```bash
# Clear Chrome's component cache
# Close Chrome completely, then:

# macOS
rm -rf ~/Library/Application\ Support/Google/Chrome\ Canary/OptGuideOnDeviceModel

# Windows
rd /s /q "%LOCALAPPDATA%\Google\Chrome SxS\User Data\OptGuideOnDeviceModel"

# Linux
rm -rf ~/.config/google-chrome-unstable/OptGuideOnDeviceModel
```

### Error: "Model needs to be downloaded"

**Symptoms:**
- Health check returns "after-download"
- Chat attempts fail

**Solution:**
```typescript
// Wait for model download
const provider = new ChromeAIProvider();

while (true) {
  const health = await provider.healthCheck();

  if (health.status === 'ready') {
    await provider.initialize();
    break;
  }

  if (health.status === 'initializing') {
    console.log('Waiting for model download...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    continue;
  }

  throw new Error('Model download failed');
}
```

### Error: "Origin Trial expired"

**Symptoms:**
- Was working, now broken
- Console shows Origin Trial warnings

**Solution:**
1. Check token expiration date
2. Register for new token
3. Update `index.html` with new token
4. Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

## Embedding Issues

### Error: "Failed to load embedding model"

**Symptoms:**
- Embedding generation fails
- Model download errors

**Causes & Solutions:**

#### 1. Network Issues

**Solution:**
```typescript
// Check internet connection
fetch('https://huggingface.co')
  .then(() => console.log('✅ Can reach Hugging Face'))
  .catch(() => console.log('❌ Network issue'));

// Try manual initialization with retry
import { initializeEmbeddings } from '@/lib/ai/embeddings';

await initializeEmbeddings((progress, message) => {
  console.log(`${progress}%: ${message}`);
});
```

#### 2. Insufficient Storage

**Cause:** Not enough disk space for model (~22MB).

**Check:**
```typescript
if ('storage' in navigator && 'estimate' in navigator.storage) {
  const estimate = await navigator.storage.estimate();
  const available = estimate.quota - estimate.usage;
  console.log(`Available: ${(available / 1024 / 1024).toFixed(2)} MB`);

  if (available < 30 * 1024 * 1024) { // 30MB
    console.warn('⚠️ Low storage space');
  }
}
```

**Solution:**
- Clear browser cache
- Remove unused browser data
- Free up disk space

#### 3. CORS/CDN Issues

**Cause:** Can't download from Hugging Face CDN.

**Solution:**
```typescript
// Check CDN access
fetch('https://cdn-lfs.huggingface.co/repos/96/00/9600004d2514765dd2b9711cd4ce0d5dbb6a52e6cc07a67664834b549b3b4cfc/onnx/model.onnx')
  .then(r => console.log('✅ CDN accessible'))
  .catch(e => console.log('❌ CDN blocked:', e));
```

If blocked by firewall/proxy:
- Use VPN
- Configure proxy settings
- Contact IT department

### Embeddings Are Slow (>100ms)

**Symptoms:**
- First embedding takes >30 seconds
- Subsequent embeddings take >100ms

**Diagnosis:**
```typescript
import { embeddingCache } from '@/lib/ai/embeddings';

// Check cache stats
const stats = await embeddingCache.getStats();
console.log('Cache size:', stats.size);
console.log('Hit rate:', stats.hits / (stats.hits + stats.misses));

// Measure embedding speed
const start = performance.now();
const embedding = await generateEmbedding('Test text');
const duration = performance.now() - start;
console.log(`Duration: ${duration.toFixed(1)}ms`);
```

**Solutions:**

1. **First load slow (expected):**
   - Model downloads once (~20s)
   - Subsequent loads are fast
   - Solution: Preload on app start

2. **Cache not working:**
   ```typescript
   // Force cache clear and rebuild
   await embeddingCache.clear();
   await embeddingCache.initialize();
   ```

3. **CPU throttling:**
   - Close other tabs
   - Check browser task manager (Shift+Esc)
   - Disable browser extensions

4. **Memory pressure:**
   ```typescript
   // Check memory usage
   if (performance.memory) {
     const used = performance.memory.usedJSHeapSize / 1024 / 1024;
     console.log(`Memory used: ${used.toFixed(2)} MB`);
   }
   ```

### Error: "IndexedDB unavailable"

**Symptoms:**
- Persistent caching not working
- Errors about IndexedDB

**Causes:**
- Private/Incognito mode (IndexedDB disabled)
- Browser storage quota exceeded
- Corrupted database

**Solutions:**

1. **Check if in private mode:**
   ```typescript
   // IndexedDB available?
   if (!window.indexedDB) {
     console.error('IndexedDB not available (private mode?)');
   }
   ```

2. **Clear corrupted database:**
   ```typescript
   // Delete and recreate
   await window.indexedDB.deleteDatabase('lumara-embeddings');
   await embeddingCache.initialize();
   ```

3. **Check storage quota:**
   ```typescript
   const estimate = await navigator.storage.estimate();
   console.log('Quota:', estimate.quota);
   console.log('Usage:', estimate.usage);
   ```

## Provider Issues

### Error: "No AI provider available"

**Symptoms:**
- `selectProvider()` throws error
- All providers fail initialization

**Diagnosis:**
```typescript
import { checkProviderAvailability } from '@/lib/ai';

const availability = await checkProviderAvailability();
console.log('Available providers:', availability);
```

**Solutions:**

1. **Chrome AI issues:** See "Chrome AI Issues" section above

2. **No API keys configured:**
   ```typescript
   // Check if API keys are set
   const geminiKey = localStorage.getItem('gemini-api-key');
   const openaiKey = localStorage.getItem('openai-api-key');

   if (!geminiKey && !openaiKey) {
     console.log('No API keys configured');
   }
   ```

3. **Network issues (for cloud providers):**
   ```bash
   # Test API connectivity
   curl https://generativelanguage.googleapis.com/v1/models
   curl https://api.openai.com/v1/models
   ```

### Provider Initialization Hangs

**Symptoms:**
- `initialize()` never resolves
- Browser freezes

**Solution:**
```typescript
// Add timeout wrapper
async function initWithTimeout(provider, config, timeoutMs = 30000) {
  return Promise.race([
    provider.initialize(config),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Initialization timeout')), timeoutMs)
    ),
  ]);
}

try {
  await initWithTimeout(provider, config);
} catch (error) {
  console.error('Provider init failed or timed out:', error);
}
```

### Provider Health Check Always Returns "error"

**Symptoms:**
- Health check fails consistently
- Provider seems unavailable

**Diagnosis:**
```typescript
// Check detailed error
const health = await provider.healthCheck();
console.log('Health status:', health);
console.log('Message:', health.message);

// Try manual check
try {
  await provider.initialize(config);
  console.log('✅ Manual init succeeded');
} catch (error) {
  console.log('❌ Manual init failed:', error);
}
```

**Solutions:**
- Check API key validity
- Verify network connectivity
- Check API rate limits
- Review error message for specifics

## Performance Issues

### High Memory Usage (>500MB)

**Symptoms:**
- Browser uses excessive memory
- Tab becomes sluggish

**Diagnosis:**
```typescript
// Memory snapshot
if (performance.memory) {
  console.log('Heap size:', performance.memory.totalJSHeapSize / 1024 / 1024, 'MB');
  console.log('Heap used:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');
  console.log('Heap limit:', performance.memory.jsHeapSizeLimit / 1024 / 1024, 'MB');
}

// Cache size
const cacheSize = await embeddingCache.getTotalSize();
console.log('Cached embeddings:', cacheSize);
```

**Solutions:**

1. **Clear cache periodically:**
   ```typescript
   // Clear old entries
   await embeddingCache.clear();

   // Or just memory cache
   embeddingCache.size(); // Check size first
   ```

2. **Limit batch sizes:**
   ```typescript
   // ❌ Bad - too many at once
   await generateBatchEmbeddings(allMemories); // 10,000 items

   // ✅ Good - process in chunks
   const CHUNK_SIZE = 100;
   for (let i = 0; i < allMemories.length; i += CHUNK_SIZE) {
     const chunk = allMemories.slice(i, i + CHUNK_SIZE);
     await generateBatchEmbeddings(chunk);
   }
   ```

3. **Dispose unused providers:**
   ```typescript
   // Clean up when done
   await provider.dispose();
   ```

### Chat Responses Are Slow (>5s)

**Diagnosis:**
```typescript
const start = performance.now();
const response = await provider.chat('Hello');
const duration = performance.now() - start;
console.log(`Chat took ${duration.toFixed(0)}ms`);
```

**Expected times:**
- Chrome AI: 1-2 seconds
- Cloud APIs: 2-5 seconds
- Local LLM: 5-30 seconds (depends on hardware)

**Solutions:**

1. **Network latency (cloud providers):**
   - Check internet speed
   - Try different API regions
   - Use local provider instead

2. **Chrome AI slow:**
   - Ensure model fully downloaded
   - Close other tabs
   - Restart Chrome

3. **Local LLM slow:**
   - Use smaller model
   - Reduce max_tokens
   - Upgrade hardware

## Debug Mode

Enable detailed logging:

```typescript
// Enable debug mode
localStorage.setItem('lumara-debug-ai', 'true');

// Set log level
localStorage.setItem('lumara-log-level', 'verbose');

// Now all AI operations will log details
```

Disable debug mode:
```typescript
localStorage.removeItem('lumara-debug-ai');
```

## Common Error Messages

### "Text must be a non-empty string"

**Cause:** Invalid input to embedding function.

**Solution:**
```typescript
// ❌ Bad
await generateEmbedding('');
await generateEmbedding(null);
await generateEmbedding(undefined);

// ✅ Good
if (text && typeof text === 'string' && text.trim()) {
  await generateEmbedding(text);
}
```

### "Provider is not initialized"

**Cause:** Using provider before calling `initialize()`.

**Solution:**
```typescript
// ❌ Bad
const provider = new ChromeAIProvider();
await provider.chat('Hello'); // Error!

// ✅ Good
const provider = new ChromeAIProvider();
await provider.initialize();
await provider.chat('Hello');

// ✅ Better - use registry
const provider = await selectProvider('chrome-ai');
await provider.chat('Hello');
```

### "Failed to fetch"

**Cause:** Network error or CORS issue.

**Solution:**
- Check internet connection
- Verify API endpoint
- Check CORS configuration (for local servers)
- Try in regular (non-private) browsing mode

## Performance Monitoring

Track AI system performance:

```typescript
// Performance observer
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('embedding')) {
      console.log(`${entry.name}: ${entry.duration.toFixed(1)}ms`);
    }
  }
});

observer.observe({ entryTypes: ['measure'] });

// Then in your code:
performance.mark('embedding-start');
const embedding = await generateEmbedding(text);
performance.mark('embedding-end');
performance.measure('embedding-generation', 'embedding-start', 'embedding-end');
```

## Browser DevTools

### Check Chrome AI Status

1. Open DevTools (F12)
2. Console tab
3. Run:
```javascript
await window.ai?.canCreateTextSession()
```

Expected: `"readily"` (ready to use)

### Monitor Network Requests

1. Open DevTools → Network tab
2. Filter: "XHR" or "Fetch"
3. Look for:
   - Hugging Face CDN (model downloads)
   - API requests (cloud providers)
   - Errors (red)

### Check Storage Usage

1. DevTools → Application tab
2. Storage section
3. Check:
   - IndexedDB → `lumara-embeddings`
   - Local Storage → API keys
   - Cache Storage → Model files

## Getting Help

If none of these solutions work:

1. **Check GitHub Issues:** https://github.com/yourusername/lumara/issues
2. **Search documentation:** All docs in `docs/ai/`
3. **Enable debug mode:** See "Debug Mode" section
4. **Collect diagnostics:** Run diagnostic script above
5. **Create issue:** Include:
   - Error message
   - Browser version
   - OS version
   - Diagnostic output
   - Steps to reproduce

## Known Issues

### Chrome AI

- **Issue:** Not available in Chrome Stable yet
  - **Workaround:** Use Chrome Canary/Dev
  - **ETA:** Chrome 128+ (stable)

- **Issue:** Model download can fail on slow connections
  - **Workaround:** Use WiFi, retry, or wait
  - **ETA:** Chrome team working on retry logic

- **Issue:** Embeddings not supported
  - **Workaround:** Use Transformers.js (already integrated)
  - **ETA:** Unknown

### Transformers.js

- **Issue:** First load slow (~20s)
  - **Workaround:** Preload on app start
  - **No fix planned:** This is model download time

- **Issue:** Large models not supported in browser
  - **Workaround:** Use smaller models (MiniLM-L6-v2)
  - **No fix planned:** Browser memory constraints

## Version Compatibility

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Chrome Canary/Dev | 127 | Latest |
| Node.js | 18.0.0 | 20.x |
| Transformers.js | 2.6.0 | Latest |
| TypeScript | 5.0.0 | Latest |

## Related Documentation

- [Architecture](./architecture.md) - System design and decisions
- [README](./README.md) - Getting started and API reference
- [Provider Guide](./provider-guide.md) - Adding new providers
- [Examples](./examples/) - Code examples

---

**Last updated:** 2025-10-14
**Version:** 1.0.0
