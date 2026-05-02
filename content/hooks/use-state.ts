import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'use-state',
  title: 'useState Hook',
  description:
    'Tìm hiểu cách useState lưu trữ và cập nhật state cục bộ trong React, từ cú pháp cơ bản đến các pattern nâng cao.',
  category: 'hooks',
  publishedAt: '2024-01-15',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## useState là gì?

\`useState\` là hook cơ bản nhất trong React, cho phép bạn thêm **state cục bộ** vào function component.

### Cú pháp

\`\`\`
const [value, setValue] = useState(initialValue)
\`\`\`

- **value** — giá trị state hiện tại.
- **setValue** — hàm dùng để cập nhật state. Khi gọi, React sẽ re-render component.
- **initialValue** — giá trị khởi tạo (chỉ dùng lần đầu render).

### Khi nào React re-render?

React so sánh giá trị cũ và mới bằng \`Object.is\`. Nếu bằng nhau, component **không** re-render.`,
      code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}`,
      language: 'tsx',
      showLivePreview: true,
      sandpackCode: `import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", padding: "2rem" }}>
      <h2 style={{ fontSize: "3rem", margin: "0 0 1rem" }}>{count}</h2>
      <button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: "8px", padding: "8px 16px", cursor: "pointer" }}
      >
        +1
      </button>
      <button
        onClick={() => setCount(c => c - 1)}
        style={{ marginRight: "8px", padding: "8px 16px", cursor: "pointer" }}
      >
        -1
      </button>
      <button
        onClick={() => setCount(0)}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        Reset
      </button>
    </div>
  );
}`,
    },
    {
      badge: 'Trung cấp',
      explanation: `## Functional update và Lazy initializer

### Functional update

Khi state mới phụ thuộc vào state cũ, hãy dùng **functional update** thay vì đọc state trực tiếp. Điều này đảm bảo bạn luôn làm việc với giá trị mới nhất, tránh stale closure.

### Lazy initializer

Nếu initial value tốn kém để tính, truyền một **hàm** (không phải giá trị) vào useState. React chỉ gọi hàm này **một lần** khi mount.

### Pitfall với object state

Setter của useState **không merge** tự động như \`this.setState\` trong class component. Bạn phải spread state cũ thủ công khi cập nhật object.`,
      code: `// ❌ Có thể dùng giá trị cũ (stale closure)
setCount(count + 1)

// ✅ Luôn dùng giá trị mới nhất
setCount(prev => prev + 1)

// Lazy initializer — hàm chỉ chạy một lần
const [items, setItems] = useState(() => {
  return JSON.parse(localStorage.getItem('items') ?? '[]')
})

// Object state — phải spread thủ công
const [user, setUser] = useState({ name: 'Alice', age: 25 })

// ❌ Xóa field "age"
setUser({ name: 'Bob' })

// ✅ Giữ lại tất cả fields
setUser(prev => ({ ...prev, name: 'Bob' }))`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## State batching, derived state và useReducer

### Automatic Batching (React 18+)

React 18 tự động **batch** tất cả state update trong một event handler thành một lần re-render, kể cả trong \`setTimeout\`, \`fetch\` callback, và native event listener.

### Derived state anti-pattern

Đừng tạo state từ state khác — đây là nguồn gốc của nhiều bug. Nếu một giá trị có thể **tính được** từ props hoặc state hiện tại, hãy tính trực tiếp trong render.

### Khi nào dùng useReducer thay vì useState?

- State có nhiều sub-values liên quan đến nhau.
- Logic update phức tạp hoặc có nhiều actions.
- Cần test logic state độc lập với UI.`,
      code: `// React 18 batching — chỉ 1 lần re-render
function handleClick() {
  setA(1)  // không re-render ngay
  setB(2)  // không re-render ngay
  // React batch cả hai → 1 lần re-render
}

// ❌ Derived state anti-pattern
function BadComponent({ items }: { items: string[] }) {
  // Bug: count không tự đồng bộ khi items thay đổi
  const [count, setCount] = useState(items.length)
  return <p>{count}</p>
}

// ✅ Tính trực tiếp trong render
function GoodComponent({ items }: { items: string[] }) {
  const count = items.length // luôn đồng bộ
  return <p>{count}</p>
}

// ✅ Dùng useReducer cho state phức tạp
type Action = { type: 'increment' } | { type: 'reset' }

function reducer(state: number, action: Action) {
  switch (action.type) {
    case 'increment': return state + 1
    case 'reset':     return 0
  }
}

const [count, dispatch] = useReducer(reducer, 0)
dispatch({ type: 'increment' })`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
