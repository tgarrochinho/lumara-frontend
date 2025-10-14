# Parallel Execution Safeguards

**Created:** 2025-10-14
**Issue:** AI Foundation Setup epic spawned 20+ orphaned dev servers (80GB+ RAM usage)
**Status:** Resolved + Prevention measures documented

---

## 🚨 Critical Issue: Dev Server Accumulation

### What Happened
During the AI Foundation Setup epic (10 parallel agents across 3 waves), approximately 20 Vite dev servers were started but never terminated, each consuming ~4GB RAM:

- **Wave 1 (2 agents):** 2 dev servers orphaned
- **Wave 2 (4 agents):** 4 dev servers orphaned
- **Wave 3 (4 agents):** 4 dev servers orphaned
- **Plus retries/restarts:** Additional orphaned processes
- **Total:** ~20 processes × 4GB = **~80GB RAM consumed**
- **Impact:** System near-crash, memory exhaustion

### Root Cause
Agents started `npm run dev` in background for testing/verification but:
1. Never killed the processes when done
2. Processes accumulated across parallel waves
3. No cleanup mechanism in place
4. Tests don't actually need dev servers running

---

## ✅ Prevention Rules

### Rule 1: Agents Should NOT Start Dev Servers

**Default behavior:** Agents should write code and run tests WITHOUT starting dev servers.

```bash
# ✅ ALLOWED in agents:
npm test              # Run tests (no dev server needed)
npm run build         # Verify code compiles
npm run type-check    # TypeScript validation
npm run lint          # Linting

# ❌ FORBIDDEN in agents:
npm run dev           # DO NOT START DEV SERVERS
npm start             # DO NOT START DEV SERVERS
vite                  # DO NOT START DEV SERVERS
```

**Rationale:**
- Tests run in Node.js via Vitest (no browser needed)
- Build validates code without server
- Dev servers are for manual UI testing only
- Parallel agents = parallel dev servers = memory disaster

### Rule 2: If Dev Server Is Absolutely Needed

If an agent truly needs a running dev server (rare):

**Option A: Use Existing Server**
```bash
# Check if dev server already running:
lsof -ti:5173 > /dev/null 2>&1 && echo "Server running" || echo "Start server first"

# If not running, user should start ONE before epic-start
npm run dev &
```

**Option B: Start + Auto-Kill**
```bash
# Start dev server with cleanup trap
npm run dev &
DEV_PID=$!

# ... do work ...

# ALWAYS kill at end:
kill $DEV_PID 2>/dev/null
```

**Option C: Use Temporary Port**
```bash
# Use unique port per agent to avoid conflicts
PORT=5174 npm run dev &
DEV_PID=$!
# ... work ...
kill $DEV_PID
```

### Rule 3: Epic-Level Cleanup

Add cleanup to epic completion:

```bash
# At END of epic (after all agents done):
echo "Cleaning up orphaned processes..."
pkill -f "vite" || true
pkill -f "npm run dev" || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "Cleanup complete"
```

---

## 🛡️ Safeguards Implemented

### 1. Documentation (This File)
- Clear rules for agents
- Explicit "DO NOT" warnings
- Cleanup commands documented

### 2. Epic Template Update

Add to `.claude/epics/TEMPLATE.md`:

```markdown
## ⚠️ Parallel Execution Warnings

**DO NOT start dev servers in parallel agents:**
- Use `npm test` instead of `npm run dev`
- Dev servers are for manual testing only
- Agents write code; users test UI

**If you need a dev server:**
- Start ONE before epic-start
- Share it across all agents
- Kill it after epic completes
```

### 3. Agent Instructions

When spawning agents, include:

```
IMPORTANT: Do not start dev servers (npm run dev).
Run tests with: npm test
Validate with: npm run build
```

### 4. Cleanup Script

Create `.claude/scripts/cleanup-dev-servers.sh`:

```bash
#!/bin/bash
# Cleanup orphaned dev servers

echo "🧹 Cleaning up orphaned dev servers..."

# Count processes before
BEFORE=$(ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l)
echo "Found $BEFORE dev server processes"

# Kill Vite processes
pkill -f "vite" 2>/dev/null && echo "✓ Killed Vite processes"

# Kill npm run dev
pkill -f "npm run dev" 2>/dev/null && echo "✓ Killed npm dev processes"

# Kill anything on port 5173
if lsof -ti:5173 > /dev/null 2>&1; then
  lsof -ti:5173 | xargs kill -9 2>/dev/null
  echo "✓ Freed port 5173"
fi

# Count processes after
AFTER=$(ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l)
CLEANED=$((BEFORE - AFTER))

echo "✅ Cleanup complete: Removed $CLEANED processes"

# Check memory
echo ""
echo "📊 System memory:"
vm_stat | grep -E "Pages (free|active|inactive|wired)" || free -h
```

Usage:
```bash
# After epic completes or if system slows down:
bash .claude/scripts/cleanup-dev-servers.sh
```

---

## 📋 Manual Cleanup Commands

If you notice system slowdown during parallel execution:

### Quick Cleanup
```bash
pkill -f "vite" && echo "Vite processes killed"
```

### Full Cleanup
```bash
# 1. List all dev processes
ps aux | grep -E "vite|node.*dev" | grep -v grep

# 2. Count them
ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l

# 3. Kill all
pkill -f "vite"
pkill -f "npm run dev"

# 4. Free the port
lsof -ti:5173 | xargs kill -9 2>/dev/null

# 5. Verify
ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l  # Should be 0
lsof -ti:5173 || echo "Port free"  # Should be free
```

### Check Memory Usage
```bash
# macOS:
ps aux | grep -E "[v]ite|[n]pm" | awk '{sum+=$4} END {print sum "% memory"}'

# Linux:
ps aux | grep -E "[v]ite|[n]pm" | awk '{sum+=$6} END {print sum/1024 " MB"}'
```

---

## 🎯 Testing Without Dev Servers

### How Tests Work
```typescript
// Vitest runs tests in Node.js, NOT in a browser
// No dev server needed!

import { describe, it, expect } from 'vitest';
import { myFunction } from './myFile';

describe('MyFunction', () => {
  it('works without dev server', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### Running Tests
```bash
# Run all tests (no dev server needed):
npm test

# Run tests for specific file:
npm test -- src/lib/ai/__tests__/provider.test.ts

# Run tests with coverage:
npm test -- --coverage

# Run tests in watch mode:
npm test -- --watch
```

### When You DO Need Dev Server

**Manual UI Testing Only:**
```bash
# Start dev server in a separate terminal:
npm run dev

# Then in another terminal, run tests or development work
# When done, Ctrl+C to stop the dev server
```

**MCP Browser Testing:**
```bash
# Start dev server first:
npm run dev

# Then use Playwright/Chrome DevTools MCP:
# - Navigate to http://localhost:5173
# - Click through UI
# - Test user flows

# When done, Ctrl+C to stop
```

---

## 🔍 Monitoring During Parallel Execution

### Check for Accumulation
```bash
# During epic execution, periodically check:
watch -n 30 'ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l'

# Alert if > 2 processes:
COUNT=$(ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l)
if [ $COUNT -gt 2 ]; then
  echo "⚠️  WARNING: $COUNT dev servers running!"
  echo "Run: pkill -f vite"
fi
```

### Memory Monitoring
```bash
# Check total memory usage:
# macOS:
top -l 1 | grep PhysMem

# Linux:
free -h
```

---

## 📚 Related Documentation

- `.claude/docs/MCP_TOOLS.md` - When to use browser testing (requires dev server)
- `.claude/epics/TEMPLATE.md` - Epic creation template with warnings
- `.claude/scripts/cleanup-dev-servers.sh` - Automated cleanup script

---

## ✅ Checklist for Future Epics

**Before epic-start:**
- [ ] Ensure agents know NOT to start dev servers
- [ ] If UI testing needed, start ONE shared dev server
- [ ] Set up monitoring for process accumulation

**During epic:**
- [ ] Monitor process count periodically
- [ ] If >5 dev servers, run cleanup
- [ ] Watch system memory usage

**After epic:**
- [ ] Run cleanup script
- [ ] Verify port 5173 is free
- [ ] Check no orphaned processes remain

**Recovery if it happens again:**
```bash
bash .claude/scripts/cleanup-dev-servers.sh
```

---

## 🐛 Reporting Issues

If agents continue starting dev servers despite these safeguards:

1. **Document the behavior:**
   ```bash
   ps aux | grep -E "vite|npm" > agent-processes.txt
   ```

2. **Create issue in CCPM repo:**
   - Title: "Agents starting dev servers during parallel execution"
   - Body: Include process list, epic name, agent IDs
   - Label: bug, parallel-execution

3. **Workaround:**
   - Kill processes immediately when noticed
   - Complete epic with manual cleanup

---

**Status:** ✅ Safeguards documented and cleanup script created
**Next Review:** After next parallel epic execution
**Last Incident:** 2025-10-14 (AI Foundation Setup epic)
