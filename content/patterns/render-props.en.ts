import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'render-props',
  title: 'Render Props Pattern',
  description:
    'A technique for sharing logic between components by passing a render function as a prop, and when to use custom hooks instead.',
  category: 'patterns',
  publishedAt: '2024-02-12',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## What are Render Props?

**Render Props** is a pattern that passes a **function** as a prop so the parent component decides **what to render**, while the child component provides the **data or logic**.

### Basic syntax

\`\`\`jsx
<DataProvider render={(data) => <DisplayComponent data={data} />} />
\`\`\`

The prop doesn't have to be named \`render\`. Many libraries use \`children\` as a function (function as children):

\`\`\`jsx
<DataProvider>
  {(data) => <DisplayComponent data={data} />}
</DataProvider>
\`\`\`

### Advantages

- Reuse logic without HOC.
- Flexible — the consumer has full control over output.`,
      code: `import { useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

function MouseTracker({
  render,
}: {
  render: (pos: MousePosition) => React.ReactNode
}) {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 })

  return (
    <div
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
      style={{ height: '200px', background: '#f3f4f6' }}
    >
      {render(pos)}
    </div>
  )
}

// Usage:
<MouseTracker
  render={({ x, y }) => (
    <p>🖱️ Position: ({x}, {y})</p>
  )}
/>`,
      language: 'tsx',
      showLivePreview: true,
      sandpackCode: `import { useState } from "react";

function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      style={{
        height: "200px",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        cursor: "crosshair",
        userSelect: "none",
      }}
    >
      {render(pos)}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Move your mouse inside the box</h2>
      <MouseTracker
        render={({ x, y }) => (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "2rem" }}>🖱️</p>
            <p>x: <strong>{x}</strong> | y: <strong>{y}</strong></p>
          </div>
        )}
      />
    </div>
  );
}`,
    },
    {
      badge: 'Trung cấp',
      explanation: `## Render Props vs Custom Hook

Today, **Custom Hooks** are generally a better choice than render props because the code is more concise and doesn't add nesting to JSX.

### When to use render props?

- Render logic depends on a **DOM element** (e.g., IntersectionObserver needs a ref).
- Need to support class components (can't use hooks).
- Logic depends on the component tree (e.g., context, portal).

### When to use a custom hook?

- Pure JavaScript logic (state, events, timer, fetch).
- Want to reuse in many places without changing the JSX structure.
- Want easier testing.`,
      code: `// ── Same logic, two implementations ──

// 1️⃣ Render props
function MouseTrackerRP({ render }: {
  render: (pos: { x: number; y: number }) => React.ReactNode
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  )
}

// Using render props — adds a layer of nesting
function App1() {
  return (
    <MouseTrackerRP
      render={({ x, y }) => <p>{x}, {y}</p>}
    />
  )
}

// 2️⃣ Custom hook — much simpler
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    el.addEventListener('mousemove', e =>
      setPos({ x: e.clientX, y: e.clientY })
    )
  }, [])
  return { pos, ref }
}

// Using custom hook — flat, easy to read
function App2() {
  const { pos, ref } = useMousePosition()
  return (
    <div ref={ref}>
      <p>{pos.x}, {pos.y}</p>
    </div>
  )
}`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## Performance pitfall and useCallback

### Problem: new function on every render

When passing an inline function to a render prop, every parent re-render creates a **new function**. If the child component uses \`React.memo\`, it still re-renders because the prop (the function) has a new reference.

### Solution: useCallback

Use \`useCallback\` to keep the function reference stable, avoiding unnecessary re-renders of the child component.

### When is it actually needed?

Only optimize after measuring and confirming a performance issue. Premature optimization makes code more complex with no clear benefit.`,
      code: `import { useState, useCallback, memo } from 'react'

// ❌ Every App render creates a new render function
// → MouseTracker re-renders even though logic hasn't changed
function BadApp() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MouseTracker
        render={({ x, y }) => <p>{x}, {y}</p>} // new function every render!
      />
    </>
  )
}

// ✅ Use useCallback to keep reference stable
function GoodApp() {
  const [count, setCount] = useState(0)

  const renderPos = useCallback(
    ({ x, y }: { x: number; y: number }) => <p>{x}, {y}</p>,
    [] // no dependency → function never changes
  )

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MouseTracker render={renderPos} /> {/* stable reference */}
    </>
  )
}

// Only need memo if render prop is actually expensive
const MouseTracker = memo(function MouseTracker({ render }: {
  render: (pos: { x: number; y: number }) => React.ReactNode
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  )
})`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
