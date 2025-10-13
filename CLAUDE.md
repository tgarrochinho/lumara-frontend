# Claude Code Configuration for Lumara

## Project Overview
Lumara is a metacognitive AI partner designed to help users think more clearly through personalized memory management and reflective interactions. Built with modern web technologies.

## MCP Tools Available

This project has three MCP (Model Context Protocol) servers configured for enhanced development capabilities:

### 1. **Playwright MCP** - Full Browser Automation
Use for:
- Testing user flows end-to-end
- Clicking buttons and interacting with UI
- Filling forms and submitting data
- Navigating between pages
- Automated regression testing

**Example usage:**
```
"Navigate to http://localhost:5173 and test the memory creation flow"
"Fill out the signup form and submit it"
```

### 2. **Chrome DevTools MCP** - Passive Inspection
Use for:
- Taking screenshots without interaction
- Checking console errors
- Accessibility tree inspection
- Performance monitoring
- Visual verification

**Example usage:**
```
"Take a screenshot of the current page"
"Check the console for any errors"
"Analyze the accessibility tree for the navigation component"
```

### 3. **Context7 MCP** - Library Documentation
Use for:
- Getting up-to-date library documentation
- Checking for breaking changes when upgrading
- Finding official code examples
- Verifying correct API usage

**Example usage:**
```
"Show me the latest React 19 hooks API"
"What's the migration guide for Vite 6?"
```

## Quick Decision Guide

**Need to interact (click/type)?** → Use Playwright MCP
**Need to inspect without interaction?** → Use Chrome DevTools MCP
**Need library documentation?** → Use Context7 MCP
**Need both interaction and inspection?** → Use them together!

## Detailed Documentation

For comprehensive documentation on each MCP server, including:
- Complete feature lists
- Use case examples
- Best practices
- Workflow integration patterns
- Comparison matrices

See **[MCP_TOOLS.md](./MCP_TOOLS.md)** for the full guide.

## Configuration

MCP servers are configured in `.claude/settings.local.json`:
- **Enabled servers:** chrome-devtools, playwright, context7
- **Permissions:** Pre-approved for common operations
- **Auto-enable:** All project MCP servers enabled by default

## Development Workflow

### Testing a Feature
1. Implement the feature
2. Start dev server: `npm run dev`
3. Use Playwright to test the feature interactively
4. Check console with Chrome DevTools for errors
5. Fix any issues found
6. Commit when tests pass

### Debugging
1. Reproduce the issue
2. Use Chrome DevTools to inspect console and network
3. Use Playwright to automate reproduction steps
4. Add debug logs and trace execution
5. Fix the root cause
6. Verify with automated test

### Before Committing
1. Build: `npm run build`
2. Test critical flows with Playwright
3. Check console for errors with Chrome DevTools
4. Verify no accessibility issues
5. Commit only when everything passes

## Best Practices

### ✅ DO:
- Test features yourself using MCP tools
- Check browser console with DevTools before claiming "done"
- Use Playwright for all user interaction testing
- Monitor console during automated tests
- Use Context7 when adding new dependencies

### ❌ DON'T:
- Ask user to test when you can verify with MCP tools
- Say "it should work" without verification
- Skip browser testing for UI features
- Forget to check console errors
- Guess at library APIs without checking Context7

## GitHub Operations

Use `gh` CLI via Bash for GitHub operations:
```bash
# Create PR
gh pr create --title "Add feature" --body "Description"

# List and check PRs
gh pr list
gh pr checks <number>

# Create issues
gh issue create --title "Bug report" --body "Details"
```

## Quick Reference

**Start development:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Run tests:**
```bash
npm test
```

**Check types:**
```bash
npm run type-check
```

## Need Help?

- Check [MCP_TOOLS.md](./MCP_TOOLS.md) for detailed MCP documentation
- See `.claude/` directory for project-specific configurations
- Explore `planning/` directory for product specifications and decisions
