import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'compound-component',
  title: 'Compound Component Pattern',
  description:
    'A pattern for building complex components by breaking them into sub-components that share state implicitly through Context.',
  category: 'patterns',
  publishedAt: '2024-02-05',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## What is a Compound Component?

**Compound Component** is a pattern that lets you create a group of components that **work together** to build complex UI, while hiding internal logic.

Core idea: the parent component manages state and shares it with sub-components via **React Context**, without prop drilling.

### Classic example

\`<select>\` and \`<option>\` in HTML are compound components: \`<option>\` automatically knows which \`<select>\` it belongs to and accesses state (the selected value) automatically.

### Advantages

- Flexible API — consumers arrange sub-components themselves.
- Separation of concerns — each sub-component does one thing.
- No prop drilling.`,
      code: `import { createContext, useContext, useState } from 'react'

const TabsContext = createContext<{
  active: string
  setActive: (id: string) => void
} | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Must be used inside <Tabs>')
  return ctx
}

function Tabs({ children, defaultTab }: {
  children: React.ReactNode
  defaultTab: string
}) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

function Tab({ id, label }: { id: string; label: string }) {
  const { active, setActive } = useTabs()
  return (
    <button
      onClick={() => setActive(id)}
      aria-selected={active === id}
      style={{ fontWeight: active === id ? 'bold' : 'normal' }}
    >
      {label}
    </button>
  )
}

function Panel({ id, children }: { id: string; children: React.ReactNode }) {
  const { active } = useTabs()
  if (active !== id) return null
  return <div role="tabpanel">{children}</div>
}

Tabs.Tab = Tab
Tabs.Panel = Panel

// Usage:
// <Tabs defaultTab="a">
//   <Tabs.Tab id="a" label="Tab A" />
//   <Tabs.Tab id="b" label="Tab B" />
//   <Tabs.Panel id="a">Content A</Tabs.Panel>
//   <Tabs.Panel id="b">Content B</Tabs.Panel>
// </Tabs>`,
      language: 'tsx',
      showLivePreview: true,
      sandpackCode: `import { createContext, useContext, useState } from "react";

const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function Tab({ id, label }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(id)}
      style={{
        marginRight: "8px",
        padding: "8px 16px",
        cursor: "pointer",
        borderBottom: active === id ? "2px solid #6366f1" : "2px solid transparent",
        background: "none",
        border: "none",
        borderBottom: active === id ? "2px solid #6366f1" : "2px solid transparent",
        fontWeight: active === id ? "bold" : "normal",
        color: active === id ? "#6366f1" : "inherit",
      }}
    >
      {label}
    </button>
  );
}

function Panel({ id, children }) {
  const { active } = useContext(TabsContext);
  if (active !== id) return null;
  return (
    <div style={{ padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px", marginTop: "8px" }}>
      {children}
    </div>
  );
}

Tabs.Tab = Tab;
Tabs.Panel = Panel;

export default function App() {
  return (
    <Tabs defaultTab="hooks">
      <div style={{ borderBottom: "1px solid #e5e7eb", marginBottom: "8px" }}>
        <Tabs.Tab id="hooks" label="Hooks" />
        <Tabs.Tab id="patterns" label="Patterns" />
        <Tabs.Tab id="perf" label="Performance" />
      </div>
      <Tabs.Panel id="hooks">
        <h3>React Hooks</h3>
        <p>useState, useEffect, useContext, useReducer...</p>
      </Tabs.Panel>
      <Tabs.Panel id="patterns">
        <h3>React Patterns</h3>
        <p>Compound Components, Render Props, HOC...</p>
      </Tabs.Panel>
      <Tabs.Panel id="perf">
        <h3>Performance</h3>
        <p>useMemo, useCallback, React.memo...</p>
      </Tabs.Panel>
    </Tabs>
  );
}`,
    },
    {
      badge: 'Trung cấp',
      explanation: `## Flexible composition and dot notation

### Dot notation

Attaching sub-components to the parent component using **dot notation** (\`Tabs.Tab\`, \`Tabs.Panel\`) provides:
- Better autocompletion in the IDE.
- Encapsulated API — no need to export many separate components.
- Makes the relationship between components clear.

### Flexible composition

Consumers decide how to arrange sub-components. They can add \`<div>\`, \`<section>\` around them without affecting logic.

### Children validation

Use \`Children.map\` or check \`displayName\` to validate children if tighter control is needed.`,
      code: `// Accordion built with compound pattern
const AccordionContext = createContext<{
  openId: string | null
  toggle: (id: string) => void
} | null>(null)

function Accordion({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) =>
    setOpenId(prev => (prev === id ? null : id))
  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="divide-y border rounded-lg">{children}</div>
    </AccordionContext.Provider>
  )
}

function Item({ id, title, children }: {
  id: string
  title: string
  children: React.ReactNode
}) {
  const ctx = useContext(AccordionContext)!
  const isOpen = ctx.openId === id
  return (
    <div>
      <button
        onClick={() => ctx.toggle(id)}
        aria-expanded={isOpen}
        aria-controls={\`panel-\${id}\`}
        className="w-full text-left px-4 py-3 font-medium"
      >
        {title}
      </button>
      {isOpen && (
        <div id={\`panel-\${id}\`} className="px-4 pb-3">
          {children}
        </div>
      )}
    </div>
  )
}

Accordion.Item = Item

// <Accordion>
//   <Accordion.Item id="1" title="Title 1">Content 1</Accordion.Item>
//   <Accordion.Item id="2" title="Title 2">Content 2</Accordion.Item>
// </Accordion>`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## Controlled vs Uncontrolled Compound Components

### Uncontrolled (default)

State is managed **inside** the compound component. Consumers don't need to worry about state.

### Controlled

Consumers pass \`value\` and \`onChange\` from the outside to **fully control** state. This pattern is useful when you need:
- Sync state with a form library.
- Save state to the URL.
- Controlled from the parent.

Technique: accept both \`value\` (controlled) and \`defaultValue\` (uncontrolled), and use a \`useControllableState\` hook to handle both.`,
      code: `// Controlled Tabs — state managed from outside
function Tabs({
  value,
  onValueChange,
  defaultValue,
  children,
}: {
  value?: string
  onValueChange?: (v: string) => void
  defaultValue?: string
  children: React.ReactNode
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  // If value is passed → controlled mode
  const isControlled = value !== undefined
  const activeTab = isControlled ? value : internalValue

  const setActive = (id: string) => {
    if (!isControlled) setInternalValue(id)
    onValueChange?.(id) // always notify parent
  }

  return (
    <TabsContext.Provider value={{ active: activeTab, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}

// Controlled usage:
function App() {
  const [tab, setTab] = useState('home')
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <Tabs.Tab id="home" label="Home" />
      <Tabs.Tab id="about" label="About" />
      <Tabs.Panel id="home">Home content</Tabs.Panel>
      <Tabs.Panel id="about">About content</Tabs.Panel>
    </Tabs>
  )
}`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
