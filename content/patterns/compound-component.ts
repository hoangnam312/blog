import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'compound-component',
  title: 'Compound Component Pattern',
  description:
    'Pattern xây dựng component phức tạp bằng cách chia nhỏ thành các sub-component chia sẻ state ngầm qua Context.',
  category: 'patterns',
  publishedAt: '2024-02-05',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## Compound Component là gì?

**Compound Component** là pattern cho phép bạn tạo một nhóm component **cùng làm việc với nhau** để xây dựng UI phức tạp, trong khi ẩn đi logic nội bộ.

Ý tưởng cốt lõi: component cha quản lý state và chia sẻ nó với các sub-component qua **React Context**, mà không cần prop drilling.

### Ví dụ điển hình

\`<select>\` và \`<option>\` trong HTML là compound component: \`<option>\` tự biết nó nằm trong \`<select>\` nào và truy cập state (giá trị được chọn) tự động.

### Ưu điểm

- API linh hoạt — người dùng tự sắp xếp sub-component.
- Tách biệt trách nhiệm — mỗi sub-component làm một việc.
- Không cần prop drilling.`,
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

// Sử dụng:
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
      explanation: `## Flexible composition và dot notation

### Dot notation

Gắn sub-component vào parent component dùng **dot notation** (\`Tabs.Tab\`, \`Tabs.Panel\`) giúp:
- Autocompletion tốt hơn trong IDE.
- Gói gọn API — không cần export nhiều component riêng lẻ.
- Làm rõ sự liên quan giữa các component.

### Flexible composition

Người dùng tự quyết định cách sắp xếp sub-component. Họ có thể thêm \`<div>\`, \`<section>\` xung quanh mà không ảnh hưởng đến logic.

### Children validation

Dùng \`Children.map\` hoặc check \`displayName\` để validate children nếu cần kiểm soát chặt chẽ hơn.`,
      code: `// Accordion built với compound pattern
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
//   <Accordion.Item id="1" title="Tiêu đề 1">Nội dung 1</Accordion.Item>
//   <Accordion.Item id="2" title="Tiêu đề 2">Nội dung 2</Accordion.Item>
// </Accordion>`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## Controlled vs Uncontrolled Compound Components

### Uncontrolled (default)

State được quản lý **bên trong** compound component. Người dùng không cần quan tâm đến state.

### Controlled

Người dùng truyền \`value\` và \`onChange\` từ bên ngoài để **kiểm soát hoàn toàn** state. Pattern này hữu ích khi cần:
- Đồng bộ state với form library.
- Lưu state vào URL.
- Controlled từ parent.

Kỹ thuật: nhận cả \`value\` (controlled) lẫn \`defaultValue\` (uncontrolled), và dùng \`useControllableState\` hook để xử lý cả hai.`,
      code: `// Controlled Tabs — state quản lý từ bên ngoài
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

  // Nếu truyền value → controlled mode
  const isControlled = value !== undefined
  const activeTab = isControlled ? value : internalValue

  const setActive = (id: string) => {
    if (!isControlled) setInternalValue(id)
    onValueChange?.(id) // luôn thông báo parent
  }

  return (
    <TabsContext.Provider value={{ active: activeTab, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}

// Sử dụng controlled:
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
