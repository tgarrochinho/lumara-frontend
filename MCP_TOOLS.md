# MCP Tools Configuration

## Overview

NexusMind uses three MCP servers for enhanced development capabilities:

1. **Playwright MCP** - Full browser automation and E2E testing
2. **Chrome DevTools MCP** - Passive inspection, debugging, and monitoring
3. **Context7 MCP** - Up-to-date library documentation

**Note:** GitHub MCP was removed to save ~106k tokens (52.7% of context budget). Use `gh` CLI via Bash for GitHub operations instead.

---

## 🎭 Playwright MCP Server

**Repository:** https://github.com/modelcontextprotocol/servers/tree/main/src/playwright

This Model Context Protocol server provides full browser automation capabilities using Playwright, enabling Claude to interact with web pages, test user flows, and automate tasks.

---

### 🎯 What It Does

Playwright MCP gives Claude access to:

1. **Browser Control** - Navigate, reload, go back/forward
2. **Element Interaction** - Click, type, hover, drag & drop
3. **Form Automation** - Fill forms, select options, upload files
4. **Page Snapshots** - Capture accessibility tree (better than screenshots)
5. **Screenshots** - Visual capture of pages and elements
6. **Console Monitoring** - Read browser console logs
7. **Network Tracking** - Monitor requests and responses
8. **Multi-Tab Support** - Create, switch, and manage browser tabs
9. **Keyboard Input** - Press keys, keyboard shortcuts
10. **JavaScript Execution** - Evaluate code in browser context

---

### 🚀 Use Cases for NexusMind

#### **1. End-to-End Testing**
Test complete user flows automatically:
- User signup and onboarding
- Chat conversation creation and interaction
- Knowledge base operations
- Report generation workflows

**Example:**
```
"Test the complete chat flow: create conversation, send message, verify response"
"Navigate to /chat and test creating a new idea artifact"
```

#### **2. Form Testing**
Automate form filling and validation:
- Fill multi-step forms
- Test validation rules
- Upload files
- Submit and verify success

**Example:**
```
"Fill out the waitlist form and submit"
"Test form validation by submitting empty fields"
```

#### **3. UI Automation**
Interact with UI elements programmatically:
- Click buttons and links
- Type into input fields
- Select dropdown options
- Drag and drop elements

**Example:**
```
"Click the 'Join Waitlist' button and fill the email field"
"Drag the artifact card to reorder it"
```

#### **4. User Flow Verification**
Test complete user journeys:
- Login → Dashboard → Create → Save workflow
- Multi-page navigation flows
- State persistence across pages
- Error handling and recovery

**Example:**
```
"Navigate through the onboarding flow and verify each step"
"Test the complete report generation flow end-to-end"
```

#### **5. Automated Regression Testing**
Run automated tests before deployments:
- Critical user paths
- Form submissions
- Data persistence
- Navigation flows

**Example:**
```
"Run through all critical user flows and report any errors"
"Test that chat messages persist after page reload"
```

---

### 📝 Best Practices

#### **When to Use Playwright MCP:**

✅ **DO use for:**
- Testing user flows end-to-end
- Clicking buttons and interacting with UI
- Filling forms and submitting data
- Navigating between pages
- Uploading files
- Testing keyboard interactions
- Verifying data persistence
- Automated regression testing

❌ **DON'T use for:**
- Unit testing (use Vitest instead)
- Type checking (use TypeScript)
- Deep DevTools inspection (use Chrome DevTools MCP)
- Performance profiling (use Chrome DevTools MCP)

---

### 🔧 Integration with Development Workflow

#### **1. Feature Development Testing**
```
1. Implement feature locally
2. Start dev server: npm run dev
3. Use Playwright to test the feature:
   - Navigate to feature page
   - Interact with UI elements
   - Verify expected behavior
   - Check console for errors
4. Fix any issues found
5. Commit when tests pass
```

#### **2. Pre-Commit Testing**
```
1. Build app: npm run build
2. Run app: npm run preview
3. Use Playwright to:
   - Test critical user flows
   - Verify forms work correctly
   - Check navigation
   - Test data persistence
4. Commit only after all tests pass
```

#### **3. Debugging User Reports**
```
1. Reproduce user's steps with Playwright
2. Capture screenshots at each step
3. Monitor console for errors
4. Inspect network requests
5. Identify the issue
6. Fix and verify with Playwright
```

---

### 📊 Common Operations

#### **Navigation**
- `browser_navigate` - Go to URL
- `browser_navigate_back` - Go back
- `browser_tabs` - Manage tabs

#### **Interaction**
- `browser_click` - Click elements
- `browser_type` - Type text
- `browser_fill_form` - Fill multiple fields
- `browser_select_option` - Select dropdown options
- `browser_drag` - Drag and drop
- `browser_hover` - Hover over elements
- `browser_press_key` - Press keyboard keys

#### **Inspection**
- `browser_snapshot` - Accessibility tree (preferred)
- `browser_take_screenshot` - Visual capture
- `browser_console_messages` - Read console
- `browser_network_requests` - Monitor network
- `browser_evaluate` - Run JavaScript

#### **File Operations**
- `browser_file_upload` - Upload files

#### **Utilities**
- `browser_wait_for` - Wait for text/time
- `browser_resize` - Resize window
- `browser_handle_dialog` - Handle alerts/confirms

---

### 💡 Tips

#### **For Testing:**
- Use `browser_snapshot` instead of screenshots for better performance
- Wait for elements with `browser_wait_for` before interacting
- Check console after each major action
- Test at multiple viewport sizes with `browser_resize`

#### **For Debugging:**
- Take screenshots at key points in the flow
- Monitor console messages continuously
- Check network requests for API failures
- Use `browser_evaluate` to inspect application state

#### **For Automation:**
- Use `browser_fill_form` for multiple fields at once
- Chain actions in logical sequence
- Verify success after each critical action
- Handle errors gracefully

---

## Chrome DevTools MCP Server

**Repository:** https://github.com/ChromeDevTools/chrome-devtools-mcp

This Model Context Protocol server enables Claude to interact with Chrome DevTools for enhanced development, debugging, and passive monitoring capabilities.

---

### 🎯 What It Does

The Chrome DevTools MCP gives Claude access to:

1. **Screenshots** - Capture visual state of pages/components
2. **Console Logs** - Read browser console output
3. **Network Activity** - Monitor requests/responses
4. **DOM Inspection** - Analyze page structure
5. **Accessibility Tree** - Check accessibility compliance
6. **Performance Metrics** - Measure page performance
7. **JavaScript Execution** - Run code in browser context

---

## 🚀 Use Cases for NexusMind

### **1. Storybook Development**
- Take screenshots of all component states
- Verify responsive design at different breakpoints
- Check accessibility compliance automatically
- Debug component rendering issues

**Example:**
```
"Take a screenshot of the Chat Interface story in Storybook"
"Check the accessibility tree for the Dashboard component"
```

### **2. Visual Regression Testing**
- Capture baseline screenshots of components
- Compare before/after screenshots when making changes
- Detect unintended visual changes

**Example:**
```
"Take screenshots of all button states for visual regression baseline"
```

### **3. Accessibility Auditing**
- Check ARIA labels and roles
- Verify keyboard navigation
- Validate screen reader compatibility

**Example:**
```
"Analyze the accessibility tree for the Message List component"
"Check if all interactive elements have proper ARIA labels"
```

### **4. Performance Debugging**
- Monitor network requests during AI operations
- Check for performance bottlenecks
- Analyze bundle sizes and load times

**Example:**
```
"Monitor network activity while loading the Dashboard"
"Check performance metrics for the chat interface"
```

### **5. Integration Testing**
- Verify end-to-end workflows
- Check console for errors during user flows
- Debug complex interactions

**Example:**
```
"Navigate through subject creation flow and check for console errors"
"Monitor network requests during playbook generation"
```

---

## 📝 Best Practices

### **When to Use Chrome DevTools MCP:**

✅ **DO use for:**
- Visual verification of Storybook components
- Accessibility compliance checks
- Debugging rendering issues
- Performance monitoring
- Console error detection
- Network request debugging

❌ **DON'T use for:**
- Unit testing (use Vitest instead)
- Type checking (use TypeScript)
- Code linting (use ESLint)
- Build verification (use npm scripts)

---

## 🔧 Integration with Development Workflow

### **1. Storybook QA Workflow**
```
1. Make component changes
2. Run Storybook: npm run storybook
3. Ask Claude to screenshot all variants
4. Compare with previous screenshots
5. Check accessibility tree
6. Verify no console errors
```

### **2. Pre-Commit Checklist**
```
1. Build app: npm run build
2. Run app: npm run preview
3. Ask Claude to:
   - Check console for errors
   - Verify key user flows work
   - Take screenshots of main screens
   - Check accessibility compliance
```

### **3. Bug Investigation**
```
1. Reproduce bug in browser
2. Ask Claude to:
   - Capture screenshot of issue
   - Check console for errors
   - Inspect DOM structure
   - Monitor network requests
   - Analyze performance metrics
```

---

## 🎨 Storybook-Specific Usage

### **Component State Verification**
```javascript
// For each story variant, Claude can:
1. Take screenshot
2. Check accessibility
3. Verify no console errors
4. Measure render performance
```

### **Responsive Design Testing**
```javascript
// Claude can test all breakpoints:
- Mobile (375px)
- Tablet (768px)
- Desktop (1024px)
- Large (1440px)
```

### **Accessibility Audit**
```javascript
// For each component, verify:
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast
- Screen reader compatibility
```

---

## 📊 Example Workflows

### **Example 1: New Component Verification**
```
User: "I just created a new Button component story"

Claude with DevTools MCP can:
1. Open Storybook to Button story
2. Take screenshots of all button states:
   - Default, Hover, Active, Disabled
   - Primary, Secondary, Danger variants
   - Small, Medium, Large sizes
3. Check accessibility tree for proper ARIA labels
4. Verify no console errors
5. Measure render performance
6. Report any issues found
```

### **Example 2: Visual Regression Check**
```
User: "Check if my recent changes affected the Dashboard"

Claude with DevTools MCP can:
1. Navigate to Dashboard in Storybook
2. Take screenshot of current state
3. Compare with baseline screenshot (if available)
4. Highlight any visual differences
5. Check for new console errors
6. Verify layout at different breakpoints
```

### **Example 3: Accessibility Compliance**
```
User: "Verify accessibility of the Chat Interface"

Claude with DevTools MCP can:
1. Open Chat Interface story
2. Get accessibility tree
3. Check for:
   - Missing ARIA labels
   - Improper heading hierarchy
   - Missing alt text
   - Color contrast issues
   - Keyboard navigation problems
4. Provide detailed report
5. Suggest fixes
```

---

## 🔍 Debugging Scenarios

### **Scenario: Component Not Rendering**
```
1. Check console for errors
2. Inspect DOM to see what actually rendered
3. Check network tab for failed requests
4. Analyze React DevTools (if available)
```

### **Scenario: Slow Performance**
```
1. Measure performance metrics
2. Check network waterfall
3. Identify slow requests
4. Monitor JavaScript execution time
5. Check for memory leaks
```

### **Scenario: Accessibility Issues**
```
1. Get accessibility tree
2. Check ARIA attributes
3. Verify keyboard navigation
4. Test focus management
5. Check color contrast
```

---

## ⚙️ Configuration

The Chrome DevTools MCP should be configured in your Claude Desktop config:

**Location:** `~/Library/Application Support/Claude/claude_desktop_config.json`

### For Chrome Browser:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-chrome-devtools"]
    }
  }
}
```

### For Arc Browser (NexusMind uses this):
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-chrome-devtools",
        "--chrome-path",
        "/Applications/Arc.app/Contents/MacOS/Arc"
      ]
    }
  }
}
```

**Note:** After changing the config, restart Claude Desktop for changes to take effect.

---

## 🚨 Limitations

1. **Browser Must Be Running** - Chrome must be open with DevTools protocol enabled
2. **Local Development Only** - Works with localhost, not production
3. **Manual Navigation** - Claude can't click buttons or fill forms (yet)
4. **Screenshot Only** - Can't interact with page elements
5. **Performance Impact** - DevTools adds overhead, disable when not needed

---

## 💡 Tips

### **For Storybook Testing:**
- Keep Storybook running in background
- Use isolated stories for better testing
- Name stories clearly for easy navigation
- Document expected states in story descriptions

### **For Debugging:**
- Clear console before asking Claude to check
- Provide context about what you're debugging
- Ask for specific DevTools features (console, network, etc.)
- Save screenshots with descriptive names

### **For Accessibility:**
- Check accessibility tree for all interactive components
- Verify keyboard navigation paths
- Test with screen reader expectations
- Document accessibility features in stories

---

## 📚 Related Documentation

- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Storybook Accessibility Addon](https://storybook.js.org/addons/@storybook/addon-a11y)

---

## 🎯 When to Use This vs Other Tools

| Task | Tool | Why |
|------|------|-----|
| Unit Testing | Vitest | Fast, isolated, code-focused |
| Type Checking | TypeScript | Compile-time safety |
| Linting | ESLint | Code quality, consistency |
| Visual Testing | DevTools MCP | Screenshots, visual verification |
| Accessibility | DevTools MCP | Tree inspection, ARIA validation |
| Performance | DevTools MCP | Real browser metrics |
| E2E Testing | Playwright | Full automation, CI/CD |
| Component Dev | Storybook | Isolated development |
| Debugging | DevTools MCP | Live browser inspection |

---

## ✅ Summary

**Chrome DevTools MCP is valuable for:**
- ✅ Visual verification of Storybook components
- ✅ Accessibility compliance checking
- ✅ Console error detection
- ✅ Performance monitoring
- ✅ Debugging rendering issues
- ✅ Network request inspection

**It complements (not replaces):**
- Unit tests (Vitest)
- Type checking (TypeScript)
- Linting (ESLint)
- E2E tests (Playwright)

**Use it when Claude can help with visual, accessibility, or debugging tasks!**

---

## Context7 MCP Server

**Repository:** https://www.context7.com/

This Model Context Protocol server provides up-to-date library documentation and code examples for any package or framework.

---

## 🎯 What It Does

Context7 MCP gives Claude access to:

1. **Library Documentation** - Current API docs for any package
2. **Code Examples** - Real-world usage patterns
3. **Version-Specific Docs** - Documentation for specific library versions
4. **Multi-Library Support** - React, TypeScript, TensorFlow.js, Vite, etc.

---

## 🚀 Use Cases for NexusMind

### **1. Adding New Dependencies**
- Get current API documentation before integrating
- Check for breaking changes in new versions
- Find recommended usage patterns

**Example:**
```
"How do I use the latest Dexie.js API for transactions?"
"What's the current API for TensorFlow.js Universal Sentence Encoder?"
```

### **2. Debugging Library Issues**
- Check if you're using the correct API
- Find deprecated methods
- Verify expected behavior

**Example:**
```
"Is this the correct way to use Vite's environment variables?"
"What's the proper React 19 pattern for useEffect cleanup?"
```

### **3. Upgrading Dependencies**
- Check migration guides
- Find breaking changes between versions
- Get version-specific documentation

**Example:**
```
"What changed in React Router v7?"
"Show me the migration guide from Vite 4 to Vite 5"
```

### **4. Feature Implementation**
- Find best practices for new features
- Get code examples from documentation
- Verify API compatibility

**Example:**
```
"Show me TensorFlow.js examples for similarity search"
"What's the recommended pattern for Tailwind CSS theming?"
```

---

## 📝 How It Works

### **Step 1: Resolve Library ID**
First, resolve the package name to a Context7-compatible library ID:

```typescript
// Claude calls internally:
mcp__context7__resolve-library-id({ libraryName: "react" })
// Returns: "/facebook/react"
```

### **Step 2: Get Documentation**
Then fetch documentation using the resolved ID:

```typescript
// Claude calls internally:
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/facebook/react",
  topic: "hooks",  // Optional: focus area
  tokens: 5000     // Optional: doc size (default: 5000)
})
```

---

## 🔧 Integration with Development Workflow

### **When Adding Dependencies**
```
1. Research library with Context7
2. Check current API and patterns
3. Add to package.json
4. Implement using up-to-date examples
5. Verify with TypeScript types
```

### **When Debugging Library Code**
```
1. Reproduce issue
2. Ask Claude to check library docs
3. Verify you're using correct API
4. Check for known issues or deprecations
5. Fix implementation
```

### **When Upgrading**
```
1. Check current version: npm list <package>
2. Ask Claude for migration guide
3. Review breaking changes
4. Update code accordingly
5. Test thoroughly
```

---

## 📊 Example Workflows

### **Example 1: Adding New Library**
```
User: "I want to add Zustand for state management"

Claude with Context7 MCP can:
1. Resolve Zustand library ID
2. Get current API documentation
3. Show recommended patterns for React 19
4. Provide type-safe setup examples
5. Show integration with TypeScript
6. Suggest best practices
```

### **Example 2: Debugging TensorFlow.js**
```
User: "My embeddings aren't working correctly"

Claude with Context7 MCP can:
1. Get TensorFlow.js USE documentation
2. Check correct model loading API
3. Verify embedding generation pattern
4. Check for version-specific issues
5. Suggest fixes based on current docs
```

### **Example 3: Upgrading Dependencies**
```
User: "Should we upgrade to Vite 6?"

Claude with Context7 MCP can:
1. Get Vite 6 documentation
2. Check breaking changes from v5
3. Review migration guide
4. Identify code changes needed
5. Suggest upgrade strategy
```

---

## 🎨 Best Practices

### **When to Use Context7 MCP:**

✅ **DO use for:**
- Adding new npm packages
- Checking current library APIs
- Finding code examples
- Debugging library-specific issues
- Migration guides for upgrades
- Verifying deprecated methods

❌ **DON'T use for:**
- Project-specific code documentation
- Internal codebase patterns (use Grep/Read instead)
- General programming questions
- Non-library topics

---

## 💡 Tips

### **For Better Results:**
- Specify version if you need version-specific docs: `/vercel/next.js/v14.3.0`
- Use `topic` parameter to focus on specific features: "hooks", "routing", "api"
- Increase `tokens` parameter for comprehensive docs (max: 10000+)

### **Common Libraries in NexusMind:**
- React: `/facebook/react`
- TypeScript: `/microsoft/typescript`
- Vite: `/vitejs/vite`
- TensorFlow.js: `/tensorflow/tfjs`
- Dexie.js: `/dexie/dexie.js`
- Tailwind CSS: `/tailwindlabs/tailwindcss`

---

## 🎯 When to Use This vs Other Tools

| Task | Tool | Why |
|------|------|-----|
| Check library API | Context7 MCP | Up-to-date docs |
| Read project code | Read/Grep | Local codebase |
| Find usage examples | Context7 MCP | Official examples |
| Check patterns in codebase | Grep/Read | Project-specific |
| Migration guides | Context7 MCP | Official docs |
| Debug library issues | Context7 MCP | Current API reference |

---

## ✅ Summary

**Context7 MCP is valuable for:**
- ✅ Getting current library documentation
- ✅ Finding official code examples
- ✅ Checking for breaking changes
- ✅ Migration guides for upgrades
- ✅ Verifying correct API usage
- ✅ Debugging library-specific issues

**Use it when you need to:**
- Research before adding dependencies
- Debug library integration issues
- Plan dependency upgrades
- Verify you're using current APIs

**Note:** Claude will automatically use Context7 when discussing library-specific features. You don't need to explicitly request it.

---

## 🔄 Playwright vs Chrome DevTools: When to Use What

### Quick Decision Guide

**Need to interact with the page?** → **Playwright MCP**
**Need to inspect without interaction?** → **Chrome DevTools MCP**
**Need both?** → **Use them together!**

---

### Feature Comparison Matrix

| Feature | Playwright MCP | Chrome DevTools MCP |
|---------|----------------|---------------------|
| **Click buttons** | ✅ Full support | ❌ No interaction |
| **Fill forms** | ✅ Full support | ❌ No interaction |
| **Navigate pages** | ✅ Full support | ✅ URL only |
| **Take screenshots** | ✅ Page/element | ✅ Page/element |
| **Console monitoring** | ✅ Full access | ✅ Full access |
| **Network tracking** | ✅ Full access | ✅ Full access |
| **Accessibility tree** | ✅ Via snapshot | ✅ Via DevTools |
| **JavaScript execution** | ✅ Full support | ✅ Full support |
| **File uploads** | ✅ Full support | ❌ No interaction |
| **Keyboard input** | ✅ Full support | ❌ No interaction |
| **Performance metrics** | ⚠️ Basic | ✅ Detailed |
| **DevTools features** | ❌ Limited | ✅ Full access |
| **Multi-tab support** | ✅ Full support | ✅ Via selection |
| **Hover actions** | ✅ Full support | ❌ No interaction |
| **Drag & drop** | ✅ Full support | ❌ No interaction |

---

### Use Case Decision Tree

```
Are you testing a user flow that requires clicking/typing?
├─ YES → Use Playwright MCP
└─ NO → Need to inspect visual state or console?
    ├─ YES → Use Chrome DevTools MCP
    └─ NO → Need performance/network detailed analysis?
        ├─ YES → Use Chrome DevTools MCP
        └─ NO → Use Playwright for general automation
```

---

### Scenario-Based Recommendations

#### **Scenario 1: Testing a Form Submission**
**Best Choice:** Playwright MCP

**Why:** Requires interaction (filling fields, clicking submit)

**Workflow:**
```javascript
1. Navigate to page
2. Fill form fields
3. Click submit button
4. Wait for response
5. Verify success message
```

---

#### **Scenario 2: Debugging Console Errors**
**Best Choice:** Chrome DevTools MCP

**Why:** Passive inspection, no interaction needed

**Workflow:**
```javascript
1. Navigate to page (or page already open)
2. Read console logs
3. Identify error sources
4. Report findings
```

---

#### **Scenario 3: Visual Regression Testing**
**Best Choice:** Both (Playwright for navigation, DevTools for capture)

**Why:** Need to navigate to states, then capture visuals

**Workflow:**
```javascript
1. Playwright: Navigate and interact to reach state
2. Chrome DevTools: Capture high-quality screenshot
3. Compare with baseline
4. Report differences
```

---

#### **Scenario 4: Complete E2E Test**
**Best Choice:** Playwright MCP (primary) + Chrome DevTools (monitoring)

**Why:** Full interaction required, with monitoring

**Workflow:**
```javascript
1. Playwright: Automate entire user flow
2. Chrome DevTools: Monitor console throughout
3. Playwright: Verify UI changes
4. Chrome DevTools: Check network requests
5. Report results
```

---

#### **Scenario 5: Accessibility Audit**
**Best Choice:** Either (depends on interaction needs)

**If no interaction needed:** Chrome DevTools MCP
```javascript
1. Inspect accessibility tree
2. Check ARIA labels
3. Verify semantic HTML
4. Report issues
```

**If interaction needed:** Playwright MCP
```javascript
1. Navigate through interactive elements
2. Test keyboard navigation
3. Capture accessibility snapshot
4. Verify focus management
```

---

#### **Scenario 6: Performance Analysis**
**Best Choice:** Chrome DevTools MCP

**Why:** Deep performance metrics available

**Workflow:**
```javascript
1. Start performance trace
2. Trigger actions (if needed)
3. Collect metrics
4. Analyze bottlenecks
5. Report findings
```

---

### Complementary Usage Patterns

#### **Pattern 1: Test-Then-Inspect**
```
1. Playwright: Execute user flow
2. Chrome DevTools: Inspect resulting state
3. Playwright: Continue based on findings
```

**Example:**
```
"Use Playwright to submit the form, then use DevTools to check the network response"
```

---

#### **Pattern 2: Inspect-Then-Interact**
```
1. Chrome DevTools: Inspect current state
2. Playwright: Interact based on inspection
3. Chrome DevTools: Verify changes
```

**Example:**
```
"Check console for errors first, then use Playwright to reproduce the issue"
```

---

#### **Pattern 3: Parallel Monitoring**
```
1. Chrome DevTools: Start monitoring (console, network)
2. Playwright: Execute test flow
3. Chrome DevTools: Collect monitoring data
4. Analyze combined results
```

**Example:**
```
"Monitor console while running the signup flow with Playwright"
```

---

### Best Practices for Combined Usage

✅ **DO:**
- Use Playwright for all user interactions
- Use Chrome DevTools for deep inspection
- Monitor console with DevTools during Playwright tests
- Capture screenshots with either (choose based on context)
- Use DevTools for performance analysis

❌ **DON'T:**
- Try to interact with pages using Chrome DevTools
- Use Playwright for simple visual inspection
- Duplicate functionality (use the right tool for the job)
- Forget to check console during automated tests

---

### Summary Table: Tool Selection

| Task | Primary Tool | Secondary Tool | Notes |
|------|--------------|----------------|-------|
| Click/Type | Playwright | - | Only Playwright can interact |
| Form Testing | Playwright | DevTools (console) | Monitor for validation errors |
| Navigation | Playwright | - | Full control over browser |
| Screenshots | Either | - | Playwright for during tests |
| Console Logs | Either | - | DevTools for detailed inspection |
| Network | Either | - | DevTools for detailed analysis |
| Performance | DevTools | - | Deep metrics only in DevTools |
| Accessibility | Either | - | Choose based on interaction needs |
| E2E Tests | Playwright | DevTools (monitor) | Combined approach best |
| Visual QA | DevTools | Playwright (setup) | Playwright to reach state |
| User Flows | Playwright | DevTools (verify) | Playwright for automation |

---

### The Golden Rule

**"If you need to DO something → Playwright"**
**"If you need to SEE something → Chrome DevTools"**
**"If you need both → Use them together"**

---

## GitHub Operations (Using `gh` CLI)

**Note:** GitHub MCP server was removed to save ~106k tokens (52.7% of context budget). Use `gh` CLI via Bash for GitHub operations instead.

---

## 🎯 Common GitHub CLI Commands

### **Pull Requests**
```bash
# Create PR
gh pr create --title "Add dark mode" --body "Description here"

# List PRs
gh pr list
gh pr list --state open --label bug

# View PR
gh pr view 42
gh pr view 42 --web  # Open in browser

# Check PR status
gh pr checks 42

# Merge PR
gh pr merge 42 --squash
gh pr merge 42 --merge
gh pr merge 42 --rebase

# Review PR
gh pr review 42 --approve
gh pr review 42 --request-changes --body "Comments here"
gh pr review 42 --comment --body "Looks good"
```

### **Issues**
```bash
# Create issue
gh issue create --title "Bug: Auth fails" --body "Description"

# List issues
gh issue list
gh issue list --label bug --state open

# View issue
gh issue view 15

# Update issue
gh issue edit 15 --add-label in-progress
gh issue close 15
gh issue reopen 15

# Comment on issue
gh issue comment 15 --body "Working on this"
```

### **Workflows**
```bash
# List workflows
gh workflow list

# Run workflow
gh workflow run build.yml

# View workflow runs
gh run list
gh run list --workflow=build.yml

# View run details
gh run view 12345

# View run logs
gh run view 12345 --log

# Rerun workflow
gh run rerun 12345

# Cancel run
gh run cancel 12345
```

### **Branches**
```bash
# List branches
gh api repos/:owner/:repo/branches

# Create branch (use git locally)
git checkout -b feature-branch
git push -u origin feature-branch
```

### **Repository Info**
```bash
# View repo
gh repo view

# Clone repo
gh repo clone owner/repo

# Fork repo
gh repo fork owner/repo
```

---

## 💡 Tips

### **For Pull Requests:**
- Use `--web` flag to open PR in browser
- Use `--draft` flag for draft PRs
- Use `--body-file` to load description from file

### **For Issues:**
- Use `--assignee @me` to assign to yourself
- Use multiple `--label` flags for multiple labels
- Template issues with `--body-file`

### **For Workflows:**
- Use `--log-failed` to only show failed job logs
- Use `--json` for programmatic parsing
- Combine with `jq` for advanced filtering

---

## 🎯 When to Use This vs Other Tools

| Task | Tool | Why |
|------|------|-----|
| Create PR | `gh pr create` | Quick and direct |
| Local commits | `git commit` | Standard git workflow |
| Push to remote | `git push` | Standard git workflow |
| Search code | GitHub web UI | Complex searches easier |
| Read local file | Read tool | Much faster |
| Create issue | `gh issue create` | Quick and direct |
| Check CI status | `gh pr checks` | Real-time status |
| View logs | `gh run view --log` | Full logs available |

---

## ✅ Summary

**Use `gh` CLI for:**
- ✅ Creating and managing PRs
- ✅ Issue tracking and management
- ✅ Workflow triggering and monitoring
- ✅ Viewing CI/CD status
- ✅ Quick repository operations

**Benefits:**
- Lightweight (no token overhead)
- Direct GitHub API access
- Well-documented and stable
- Integrates with standard git workflow

**Installation:**
```bash
# macOS
brew install gh

# Login
gh auth login
```
