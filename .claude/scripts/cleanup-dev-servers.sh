#!/bin/bash
# Cleanup orphaned dev servers
# Usage: bash .claude/scripts/cleanup-dev-servers.sh

set -e

echo "🧹 Cleaning up orphaned dev servers..."
echo ""

# Count processes before
BEFORE=$(ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l | tr -d ' ')
echo "📊 Found $BEFORE dev server processes running"

if [ "$BEFORE" -eq 0 ]; then
  echo "✅ No dev servers to clean up!"
  exit 0
fi

echo ""
echo "🔍 Listing processes to be killed:"
ps aux | grep -E "[v]ite|[n]pm run dev" | head -10
echo ""

# Kill Vite processes
echo "Killing Vite processes..."
if pkill -f "vite" 2>/dev/null; then
  echo "✓ Killed Vite processes"
else
  echo "ℹ️  No Vite processes found"
fi

# Kill npm run dev
echo "Killing npm dev processes..."
if pkill -f "npm run dev" 2>/dev/null; then
  echo "✓ Killed npm dev processes"
else
  echo "ℹ️  No npm dev processes found"
fi

# Kill anything on port 5173
echo "Freeing port 5173..."
if lsof -ti:5173 > /dev/null 2>&1; then
  lsof -ti:5173 | xargs kill -9 2>/dev/null || true
  echo "✓ Freed port 5173"
else
  echo "✓ Port 5173 already free"
fi

# Wait a moment for processes to die
sleep 1

# Count processes after
AFTER=$(ps aux | grep -E "[v]ite|[n]pm run dev" | wc -l | tr -d ' ')
CLEANED=$((BEFORE - AFTER))

echo ""
echo "✅ Cleanup complete!"
echo "   Processes before: $BEFORE"
echo "   Processes after:  $AFTER"
echo "   Removed:          $CLEANED"

if [ "$AFTER" -gt 0 ]; then
  echo ""
  echo "⚠️  Warning: $AFTER processes still running"
  echo "   Run again or manually kill with: pkill -9 -f vite"
fi

# Check memory
echo ""
echo "📊 System memory status:"
if command -v vm_stat &> /dev/null; then
  # macOS
  vm_stat | grep -E "Pages (free|active)" | head -2
elif command -v free &> /dev/null; then
  # Linux
  free -h | grep Mem
else
  echo "   (Memory stats not available)"
fi

echo ""
echo "✨ Done! System should be running smoothly now."
