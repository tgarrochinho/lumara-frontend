# Chat UI Component Specifications

**Created:** 2025-10-18
**Status:** Detailed Implementation Guide
**Purpose:** Component-by-component specifications for building the chat-first UI

*This document provides detailed specifications for each UI component in priority order, with exact measurements, behaviors, and code examples.*

---

## 🎯 Stage-by-Stage User Journey
*How the interface evolves with the user*

### Stage 1: First Impression (0-5 minutes)

**What Users See:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│                    🌱                                   │
│            Your garden awaits                           │
│                                                         │
│     Plant your first thought and watch                 │
│         understanding grow                              │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Share a thought, ask a question...             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Design Elements:**
- Centered, breathing animation on seed emoji (scale 0.95-1.05)
- Soft gradient background with subtle particle effects
- Input field has gentle glow animation to draw attention
- No overwhelming UI elements, just the invitation to begin

### Stage 2: First Interaction (5-60 seconds)

**User Types Message → Thinking Animation Appears:**
```
You: I prefer morning meetings for deep work

💭 Analyzing your thought...
   └─ 🔍 Creating your first memory...
      └─ ✨ Setting initial confidence...
         └─ 🌱 Memory planted!

Lumara: I've captured that preference! You prefer morning meetings
        for deep work. This is your first memory, so I've set an
        initial confidence of 60% - it will grow stronger as you
        validate it through experience.

        [Memory Card: Glowing softly with 60% confidence bar]
```

**Key Moments:**
1. Thinking animation creates anticipation
2. Memory formation has subtle particle effect
3. First memory card has special "first memory" glow
4. Celebration is subtle but noticeable

### Stage 3: Building Understanding (First Session)

**Interface Reveals Complexity Gradually:**
```
After 3-5 memories:
- Heatmap sparkline appears at top (ultra-minimal)
- Confidence variations become visible
- First contradiction triggers aurora effect

After 10+ memories:
- Smart scrollbar shows milestone markers
- Working memory indicator appears (3/7)
- Quick capture shortcuts mentioned in hint
```

### Stage 4: Mature Usage (Returning User)

**Full Interface Active:**
```
┌─────────────────────────────────────────────────────────┐
│ [═══════] Memory Activity · 127 memories · 3 pending   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ March 15, 2025                                         │
│ ✓ Breakthrough · 📈 +25% confidence                    │
│ ─────────────────────────────────────────────          │
│                                                         │
│ [Previous messages with rich widgets]                  │
│                                                         │
│ You: How has my understanding of standups evolved?     │
│                                                         │
│ 💭 Thinking...                                         │
│    → Analyzing evolution across 4 months               │
│    → Found 6 key transitions                           │
│    → Generating timeline visualization                 │
│                                                         │
│ Lumara: Your understanding has evolved significantly:  │
│                                                         │
│ [Interactive Evolution Timeline Widget]                │
│ [Team Perspective Comparison]                          │
│ [Confidence Calibration Notice]                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ! Contradiction detected...                     │  │
│  └─────────────────────────────────────────────────┘  │
│                          ↑                             │
│                  [Smart scrollbar with milestones]     │
└─────────────────────────────────────────────────────────┘
```

---

## 📐 Component Specifications

### 1. Chat Container

```typescript
interface ChatContainerProps {
  className?: string;
  children: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  className = '',
  children
}) => {
  return (
    <div className={`
      chat-container
      ${className}
      min-h-screen
      bg-gradient-to-b
      from-lumara-deep-purple
      to-lumara-purple-dark
      relative
      overflow-hidden
    `}>
      {/* Background effects layer */}
      <div className="aurora-background-layer" />
      <div className="particle-layer" />

      {/* Content layer */}
      <div className="
        relative
        z-10
        max-w-3xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        h-full
      ">
        {children}
      </div>
    </div>
  );
};
```

**Specifications:**
- Max width: 768px (3xl) for optimal reading
- Padding: 16px mobile, 24px tablet, 32px desktop
- Background: Deep purple gradient with noise texture
- Z-layering: Background effects → Content → Overlays

### 2. Message Input Component

```typescript
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  quickCaptureMode?: QuickCaptureMode;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSubmit,
  isProcessing,
  quickCaptureMode
}) => {
  return (
    <div className="message-input-container">
      {/* Quick capture indicator */}
      {quickCaptureMode && (
        <div className="quick-capture-indicator">
          <span className="icon">{quickCaptureMode.icon}</span>
          <span className="label">{quickCaptureMode.label}</span>
        </div>
      )}

      {/* Main input */}
      <textarea
        className={`
          message-input
          ${isProcessing ? 'processing' : ''}
          ${quickCaptureMode ? 'has-mode' : ''}
        `}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={
          quickCaptureMode
            ? quickCaptureMode.placeholder
            : "Share a thought, ask a question..."
        }
        rows={1}
        disabled={isProcessing}
      />

      {/* Submit button */}
      <button
        className="submit-button"
        onClick={onSubmit}
        disabled={isProcessing || !value.trim()}
      >
        {isProcessing ? <LoadingSpinner /> : <SendIcon />}
      </button>
    </div>
  );
};
```

**Specifications:**
- Height: Auto-expanding, min 56px, max 120px
- Border radius: 24px
- Padding: 16px horizontal, 14px vertical
- Font size: 16px (prevents iOS zoom)
- Line height: 1.5
- Transitions: All properties 300ms ease
- Focus state: Aurora glow effect
- Processing state: Shimmer animation

### 3. Thinking Process Component

```typescript
interface ThinkingStep {
  id: string;
  icon: string;
  text: string;
  status: 'pending' | 'processing' | 'complete';
  duration?: number;
  details?: string;
}

const ThinkingProcess: React.FC<{ steps: ThinkingStep[] }> = ({ steps }) => {
  return (
    <div className="thinking-process">
      <div className="thinking-header">
        <span className="thinking-icon">💭</span>
        <span className="thinking-label">Thinking...</span>
      </div>

      <div className="thinking-steps">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`thinking-step ${step.status}`}
            style={{
              animationDelay: `${index * 200}ms`,
              opacity: step.status === 'pending' ? 0.4 : 1
            }}
          >
            <span className="step-icon">{step.icon}</span>
            <span className="step-text">{step.text}</span>
            {step.status === 'processing' && (
              <span className="processing-dots">...</span>
            )}
            {step.status === 'complete' && step.duration && (
              <span className="step-duration">{step.duration}ms</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Animation Sequence:**
```css
@keyframes thinking-step-enter {
  0% {
    transform: translateX(-10px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.thinking-step {
  animation: thinking-step-enter 0.3s ease forwards;
  margin-left: calc(var(--depth) * 20px);
}

.processing-dots {
  animation: dots-pulse 1.4s infinite;
}

@keyframes dots-pulse {
  0%, 60%, 100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
}
```

### 4. Memory Card Component

```typescript
interface MemoryCardProps {
  memory: {
    id: string;
    content: string;
    type: 'episodic' | 'semantic' | 'procedural';
    confidence: number;
    created: Date;
    lastTested?: Date;
    contradictions?: string[];
  };
  variant?: 'inline' | 'detailed' | 'compact';
  onNavigate?: () => void;
  onTest?: () => void;
  onEdit?: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  variant = 'inline',
  onNavigate,
  onTest,
  onEdit
}) => {
  const confidenceColor = getConfidenceColor(memory.confidence);
  const growthStage = getGrowthStage(memory);

  return (
    <div className={`memory-card ${variant} ${growthStage}`}>
      {/* Confidence glow effect */}
      <div
        className="confidence-glow"
        style={{
          background: `linear-gradient(90deg, ${confidenceColor}00, ${confidenceColor}20)`,
          width: `${memory.confidence}%`
        }}
      />

      {/* Content */}
      <div className="memory-content">
        <div className="memory-header">
          <span className="memory-icon">{getMemoryIcon(memory.type)}</span>
          <span className="memory-type">{memory.type}</span>
          {memory.contradictions?.length > 0 && (
            <span className="contradiction-indicator">⚡</span>
          )}
        </div>

        <div className="memory-text">{memory.content}</div>

        <div className="memory-footer">
          <ConfidenceBar value={memory.confidence} />

          {variant === 'detailed' && (
            <div className="memory-actions">
              <button onClick={onTest} className="action-button">
                Test recall
              </button>
              <button onClick={onNavigate} className="action-button">
                View source
              </button>
              <button onClick={onEdit} className="action-button">
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Growth stage indicator */}
      <div className="growth-indicator">
        <GrowthIcon stage={growthStage} animated />
      </div>
    </div>
  );
};
```

**Visual Specifications:**
- Border radius: 12px
- Padding: 12px (compact), 16px (inline), 20px (detailed)
- Border: 1px solid with confidence-based color
- Background: Semi-transparent with backdrop blur
- Hover state: Slight scale (1.02) and glow intensification
- Click feedback: Scale 0.98 for 100ms

### 5. Aurora Contradiction Effect

```typescript
class AuroraEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: AuroraParticle[] = [];
  private gradient: CanvasGradient;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.setupCanvas();
    this.createGradient();
    this.animate();
  }

  private createGradient() {
    this.gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    this.gradient.addColorStop(0, '#86efac');
    this.gradient.addColorStop(0.25, '#93c5fd');
    this.gradient.addColorStop(0.5, '#c084fc');
    this.gradient.addColorStop(0.75, '#f0abfc');
    this.gradient.addColorStop(1, '#86efac');
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw flowing aurora waves
    this.ctx.fillStyle = this.gradient;
    this.ctx.globalAlpha = 0.3;

    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      const offset = Date.now() * 0.001 + i * Math.PI * 0.5;

      for (let x = 0; x <= this.canvas.width; x += 5) {
        const y = Math.sin(x * 0.01 + offset) * 20 + this.canvas.height / 2;
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.lineTo(this.canvas.width, this.canvas.height);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.fill();
    }

    // Animate particles
    this.updateParticles();

    requestAnimationFrame(this.animate);
  };

  private updateParticles() {
    // Add new particles
    if (Math.random() < 0.1) {
      this.particles.push(new AuroraParticle(this.canvas));
    }

    // Update and draw particles
    this.particles = this.particles.filter(particle => {
      particle.update();
      particle.draw(this.ctx);
      return particle.alive;
    });
  }
}
```

### 6. Heatmap Component

```typescript
interface HeatmapProps {
  data: ActivityDay[];
  view: 'minimal' | 'expanded';
  period: 'week' | 'month' | 'year';
  onDayClick: (day: ActivityDay) => void;
  onToggleView: () => void;
}

const Heatmap: React.FC<HeatmapProps> = ({
  data,
  view,
  period,
  onDayClick,
  onToggleView
}) => {
  if (view === 'minimal') {
    return (
      <div
        className="heatmap-minimal"
        onClick={onToggleView}
        role="button"
        aria-label="Expand memory activity view"
      >
        <div className="heatmap-sparkline">
          {data.slice(-7).map((day, index) => (
            <div
              key={day.date.toISOString()}
              className="sparkline-bar"
              style={{
                height: `${day.intensity * 100}%`,
                background: getIntensityColor(day.intensity)
              }}
            />
          ))}
        </div>
        <div className="heatmap-hint">
          {data[data.length - 1].milestones.length} activities today
        </div>
      </div>
    );
  }

  return (
    <div className="heatmap-expanded">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Memory Activity</h3>
        <div className="heatmap-controls">
          <PeriodSelector value={period} />
          <button onClick={onToggleView} className="minimize-button">
            <MinimizeIcon />
          </button>
        </div>
      </div>

      <div className="heatmap-grid">
        {/* Render GitHub-style contribution grid */}
        {renderHeatmapGrid(data, period)}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <div className="legend-blocks">
          {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
            <div
              key={intensity}
              className="legend-block"
              style={{ background: getIntensityColor(intensity) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
```

### 7. Evolution Timeline Widget

```typescript
interface EvolutionTimelineProps {
  topic: string;
  evolutions: EvolutionPoint[];
  onPointClick: (point: EvolutionPoint) => void;
}

const EvolutionTimeline: React.FC<EvolutionTimelineProps> = ({
  topic,
  evolutions,
  onPointClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // D3.js animation for smooth path drawing
    const svg = d3.select(svgRef.current);
    const line = d3.line<EvolutionPoint>()
      .x((d, i) => (i / (evolutions.length - 1)) * 100 + '%')
      .y(d => `${100 - d.confidence}%`)
      .curve(d3.curveCatmullRom);

    const path = svg.select('.evolution-path')
      .datum(evolutions)
      .attr('d', line);

    const totalLength = path.node()?.getTotalLength() || 0;

    path
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
  }, [evolutions]);

  return (
    <div className="evolution-timeline-widget">
      <div className="timeline-header">
        <h3 className="timeline-title">
          Evolution: {topic}
        </h3>
        <span className="timeline-period">
          {formatPeriod(evolutions)}
        </span>
      </div>

      <svg
        ref={svgRef}
        className="timeline-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Confidence gradient background */}
        <defs>
          <linearGradient id="confidence-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#confidence-gradient)" />

        {/* Evolution path */}
        <path className="evolution-path" />

        {/* Evolution points */}
        {evolutions.map((point, index) => (
          <g key={point.id} className="evolution-point-group">
            <circle
              className="evolution-point"
              cx={`${(index / (evolutions.length - 1)) * 100}%`}
              cy={`${100 - point.confidence}%`}
              r="6"
              onClick={() => onPointClick(point)}
            />
            <text
              x={`${(index / (evolutions.length - 1)) * 100}%`}
              y="95%"
              className="evolution-label"
              textAnchor="middle"
            >
              {formatDate(point.date)}
            </text>
          </g>
        ))}
      </svg>

      {/* Point details on hover */}
      <div className="timeline-details">
        {/* Details appear here on hover */}
      </div>
    </div>
  );
};
```

---

## 🎬 Animation Specifications

### Entrance Animations

```css
/* Fade in from bottom */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in with bounce */
@keyframes scale-in-bounce {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  60% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Slide in from right */
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Continuous Animations

```css
/* Gentle breathing for empty states */
@keyframes breathing {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* Aurora flow for contradictions */
@keyframes aurora-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Shimmer for loading states */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### Micro-interactions

```css
/* Button press feedback */
.button:active {
  transform: scale(0.98);
  transition: transform 100ms ease;
}

/* Card hover lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease;
}

/* Icon rotation on action */
.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Base styles for mobile (<640px) */
.component {
  padding: 12px;
  font-size: 14px;
}

/* Small tablets (640px+) */
@media (min-width: 640px) {
  .component {
    padding: 16px;
    font-size: 15px;
  }
}

/* Tablets (768px+) */
@media (min-width: 768px) {
  .component {
    padding: 20px;
    font-size: 16px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .component {
    padding: 24px;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Wide screens (1280px+) */
@media (min-width: 1280px) {
  .component {
    max-width: 896px;
  }
}
```

---

## ✨ Polish Details

### Focus States
Every interactive element must have clear focus indication for accessibility:

```css
/* Custom focus ring */
:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(26, 15, 46, 1),
    0 0 0 4px rgba(147, 197, 253, 0.5);
}

/* Remove focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Loading States
Never leave users wondering:

```css
/* Skeleton screens for content */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}
```

### Error Recovery
Graceful degradation:

```typescript
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundaryComponent
      fallback={
        <div className="error-fallback">
          <span className="error-icon">🌸</span>
          <h2>Something unexpected happened</h2>
          <p>Your memories are safe. Let's try refreshing.</p>
          <button onClick={() => window.location.reload()}>
            Refresh garden
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundaryComponent>
  );
};
```

---

**Implementation Note:** Start with Priority 1 components (chat input, messages, thinking) and progressively add sophistication. Each component should be beautiful even in isolation.