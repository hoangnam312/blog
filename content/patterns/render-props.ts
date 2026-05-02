import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'render-props',
  title: 'Render Props Pattern',
  description:
    'Kỹ thuật chia sẻ logic giữa các component bằng cách truyền hàm render như một prop, và khi nào nên dùng custom hook thay thế.',
  category: 'patterns',
  publishedAt: '2024-02-12',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## Render Props là gì?

**Render Props** là pattern truyền một **hàm** như prop để component cha quyết định **render cái gì**, còn component con cung cấp **data hoặc logic**.

### Cú pháp cơ bản

\`\`\`jsx
<DataProvider render={(data) => <DisplayComponent data={data} />} />
\`\`\`

Prop không nhất thiết phải tên là \`render\`. Nhiều library dùng \`children\` như một hàm (function as children):

\`\`\`jsx
<DataProvider>
  {(data) => <DisplayComponent data={data} />}
</DataProvider>
\`\`\`

### Ưu điểm

- Tái sử dụng logic mà không cần HOC.
- Linh hoạt — người dùng toàn quyền kiểm soát output.`,
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

// Sử dụng:
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

Ngày nay, **Custom Hook** thường là lựa chọn tốt hơn render props vì code ngắn gọn hơn và không thêm nesting vào JSX.

### Khi nào dùng render props?

- Cần render logic phụ thuộc vào **DOM element** (e.g., IntersectionObserver cần ref).
- Cần hỗ trợ class component (không dùng hooks được).
- Logic phụ thuộc vào component tree (e.g., context, portal).

### Khi nào dùng custom hook?

- Logic thuần JavaScript (state, event, timer, fetch).
- Muốn sử dụng trong nhiều nơi mà không thay đổi JSX structure.
- Muốn dễ test hơn.`,
      code: `// ── Cùng logic, hai cách triển khai ──

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

// Dùng render props — thêm một lớp nesting
function App1() {
  return (
    <MouseTrackerRP
      render={({ x, y }) => <p>{x}, {y}</p>}
    />
  )
}

// 2️⃣ Custom hook — đơn giản hơn nhiều
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

// Dùng custom hook — flat, dễ đọc
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
      explanation: `## Performance pitfall và useCallback

### Vấn đề: new function mỗi lần render

Khi truyền hàm inline vào render prop, mỗi lần parent re-render sẽ tạo ra một **hàm mới**. Nếu component con dùng \`React.memo\`, nó vẫn re-render vì prop (hàm) thay đổi reference.

### Giải pháp: useCallback

Dùng \`useCallback\` để giữ ổn định reference của hàm, tránh re-render không cần thiết cho component con.

### Khi nào thực sự cần?

Chỉ tối ưu khi đã đo lường và xác nhận có vấn đề performance. Premature optimization làm code phức tạp hơn mà không có lợi ích rõ ràng.`,
      code: `import { useState, useCallback, memo } from 'react'

// ❌ Mỗi render của App tạo hàm render mới
// → MouseTracker re-render dù logic không đổi
function BadApp() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MouseTracker
        render={({ x, y }) => <p>{x}, {y}</p>} // hàm mới mỗi render!
      />
    </>
  )
}

// ✅ Dùng useCallback để giữ reference ổn định
function GoodApp() {
  const [count, setCount] = useState(0)

  const renderPos = useCallback(
    ({ x, y }: { x: number; y: number }) => <p>{x}, {y}</p>,
    [] // không có dependency → hàm không bao giờ thay đổi
  )

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MouseTracker render={renderPos} /> {/* reference ổn định */}
    </>
  )
}

// Chỉ cần memo nếu render prop thực sự tốn kém
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
