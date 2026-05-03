import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'use-state',
  title: 'useState Hook',
  description:
    'Tổng hợp toàn bộ kiến thức về useState — từ cơ chế hoạt động, các pattern quan trọng đến stale closure và quản lý state phức tạp.',
  category: 'hooks',
  publishedAt: '2024-01-15',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## 1. useState giải quyết vấn đề gì?

Plain variables thay đổi nhưng React không biết để re-render. \`useState\` kết nối dữ liệu với render cycle — mỗi lần \`setState\` gọi, React schedule re-render, component chạy lại và trả về giá trị mới.

\`\`\`code
const [state, setState] = useState(initialValue)
\`\`\`

> **Mental model:** Component function là một "snapshot" — mỗi lần render là một lần chụp ảnh state tại thời điểm đó.

---

## 2. setState là bất đồng bộ — nhưng không phải Promise

- Không trả về Promise → **không thể** \`await setState()\`
- React **gom** nhiều setState lại (**Batching**) → render 1 lần duy nhất
- Gọi xong setState, **đọc lại state ngay** → vẫn là giá trị cũ

\`\`\`code
// ❌ setState trả về undefined, await vô nghĩa
await setState(newValue)

// ✅ muốn dùng giá trị mới ngay → lưu vào biến local
const newCount = count + 1
setCount(newCount)
doSomething(newCount) // dùng biến local, không phải state
\`\`\`

React dùng **Object.is()** để so sánh state cũ và mới. Cùng reference = không re-render.

---

## 3. Khi nào KHÔNG dùng useState

| Trường hợp | Thay thế bằng |
|---|---|
| Tính được từ state/prop khác (derived state) | Tính thẳng trong render |
| Cần track giá trị nhưng không cần re-render | \`useRef\` |
| Server data / async data fetching | React Query / SWR |`,
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
      explanation: `## 4. Các pattern quan trọng

### 4.1 Functional update — khi state phụ thuộc state trước

\`\`\`code
// ❌ Sai — vẫn dùng count cũ từ closure
setCount(count + 1)
setCount(count + 1) // vẫn dùng count cũ → kết quả +1 thay vì +2

// ✅ Đúng — luôn lấy giá trị mới nhất từ queue nội bộ
setCount(prev => prev + 1)
setCount(prev => prev + 1) // → kết quả +2
\`\`\`

**Bắt buộc dùng khi:** trong \`setTimeout\`, event listener, WebSocket, hoặc gọi setState nhiều lần liên tiếp.

---

### 4.2 Lazy initialization — khi initial value tốn kém

\`\`\`code
// ❌ Hàm này chạy MỌI lần re-render
const [data, setData] = useState(heavyComputation())

// ✅ Chỉ chạy 1 lần duy nhất lúc mount
const [data, setData] = useState(() => heavyComputation())
\`\`\`

---

### 4.3 Object/Array state — luôn tạo reference mới

\`\`\`code
// ❌ React không re-render
user.name = 'Minh'
setUser(user)

todos.push(newItem)
setTodos(todos)

// ✅ Luôn tạo mới
setUser(prev => ({ ...prev, name: 'Minh' }))
setTodos(prev => [...prev, newItem])
\`\`\`

> **Rule:** Không bao giờ dùng \`.push()\`, \`.splice()\`, \`.sort()\` trực tiếp trên state array/object.

---

### 4.4 Init state từ prop — key trick

\`\`\`code
// ❌ State chỉ nhận prop lúc mount, prop đổi sau → state không đổi theo
function Input({ value }) {
  const [inputValue, setInputValue] = useState(value) // stale khi prop thay đổi
}

// ✅ Cách 1: Fully controlled component
function Input({ value, onChange }) {
  return <input value={value} onChange={onChange} />
}

// ✅ Cách 2: Dùng key để force reset toàn bộ state
<Input key={userId} defaultValue={user.name} />
// Đổi key → unmount & remount → state reset hoàn toàn
\`\`\`

---

## 5. Lỗi thường gặp

### Lỗi 1: Mutate state trực tiếp

\`\`\`code
// ❌
todos.push({ id: 1, text: 'Learn React' })
setTodos(todos) // cùng reference → không re-render

// ✅
setTodos(prev => [...prev, { id: 1, text: 'Learn React' }])
\`\`\`

### Lỗi 2: Đọc state ngay sau khi setState

\`\`\`code
// ❌
setCount(count + 1)
console.log(count) // vẫn là giá trị cũ

// ✅
const newCount = count + 1
setCount(newCount)
console.log(newCount)
\`\`\`

### Lỗi 3: Stale closure

Xem mục 6 (Nâng cao) để hiểu chi tiết.

### Lỗi 4: Lưu derived state không cần thiết

\`\`\`code
// ❌ cart và total có thể lệch nhau nếu quên update
const [cart, setCart] = useState([])
const [total, setTotal] = useState(0)

// ✅ total là derived state — tính thẳng — luôn đồng bộ, không thể lệch
const [cart, setCart] = useState([])
const total = cart.reduce((sum, i) => sum + i.price, 0)
\`\`\`

### Lỗi 5: Dùng useState thay vì useRef cho giá trị không cần render

\`\`\`code
// ❌ Mỗi lần set → re-render không cần thiết
const [timerId, setTimerId] = useState(null)

// ✅ timerId không hiển thị ra UI → dùng useRef
const timerIdRef = useRef(null)
timerIdRef.current = setInterval(() => { ... }, 1000)
\`\`\`

### Lỗi 6: Vòng lặp vô hạn

\`\`\`code
// ❌ setState trong component body → infinite loop
function Component() {
  const [count, setCount] = useState(0)
  setCount(1) // chạy mỗi lần render → trigger render → lặp vô tận
}

// ❌ useEffect thiếu dependency array
useEffect(() => {
  setCount(prev => prev + 1)
}) // không có [] → chạy sau mỗi render → infinite loop
\`\`\``,
      code: `// 4.1 Functional update
setCount(prev => prev + 1)
setCount(prev => prev + 1) // → kết quả +2, không phải +1

// 4.2 Lazy initialization
const [data, setData] = useState(() => JSON.parse(localStorage.getItem('data') ?? '[]'))

// 4.3 Object/Array — luôn tạo reference mới
setUser(prev => ({ ...prev, name: 'Minh' }))
setTodos(prev => [...prev, newItem])

// 4.4 Key trick
<Input key={userId} defaultValue={user.name} />`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## 6. Stale Closure — đào sâu

### Stale closure là gì?

Mỗi lần render tạo ra một "snapshot" — tất cả hàm bên trong **capture state tại thời điểm render đó**. Nếu hàm được tạo 1 lần (\`useEffect\` với \`[]\`) nhưng state tiếp tục thay đổi → hàm đó dùng state cũ mãi mãi.

\`\`\`code
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setTimeout(() => {
      // count bị "đóng băng" = 0 tại thời điểm hàm được tạo
      setCount(count + 1)
    }, 3000)
  }
}
\`\`\`

**Kịch bản xảy ra bug:**

\`\`\`
Click nhanh 5 lần → 5 setTimeout được tạo, tất cả nhớ count = 0
Sau 3 giây: setCount(0 + 1) × 5 lần → count cuối = 1, không phải 5
\`\`\`

### Tại sao \`prev =>\` giải quyết được?

\`\`\`code
// ❌ Lấy count từ closure (bị freeze)
setCount(count + 1)

// ✅ Lấy count từ React internal queue (luôn mới nhất)
setCount(prev => prev + 1)
\`\`\`

### 3 tình huống phổ biến

**setTimeout / setInterval:**

\`\`\`code
// ❌
setInterval(() => { setCount(count + 1) }, 1000) // count = 0 mãi

// ✅
setInterval(() => { setCount(prev => prev + 1) }, 1000)
\`\`\`

**Event listener:**

\`\`\`code
// ❌
window.addEventListener('keydown', () => {
  setCount(count + 1) // count bị freeze lúc mount
})

// ✅
window.addEventListener('keydown', () => {
  setCount(prev => prev + 1)
})
\`\`\`

**WebSocket / subscription:**

\`\`\`code
// ❌
socket.onmessage = (e) => {
  setMessages([...messages, e.data]) // luôn chỉ có 1 tin nhắn
}

// ✅
socket.onmessage = (e) => {
  setMessages(prev => [...prev, e.data])
}
\`\`\`

### Advanced — useRef làm escape hatch

\`\`\`code
// prev => không đủ khi cần ĐỌC nhiều state cùng lúc
const [user, setUser] = useState(null)
const [cart, setCart] = useState([])

const cartRef = useRef(cart)
useEffect(() => {
  cartRef.current = cart // sync mỗi khi cart thay đổi
}, [cart])

useEffect(() => {
  socket.on('checkout', () => {
    processOrder(user, cartRef.current) // ✅ luôn mới nhất
  })
}, [])
\`\`\`

### Fix theo thứ tự ưu tiên

\`\`\`
1. Chỉ cần UPDATE state        →  functional update (prev =>)
2. Cần ĐỌC state trong handler →  useRef làm escape hatch
3. Dependency ít, có cleanup   →  thêm vào dependency array
\`\`\`

---

## 7. Mental checklist — trước khi dùng useState

\`\`\`
Trước khi thêm useState, tự hỏi:
├── Tính được từ state/prop khác không?   → Đừng dùng (derived state)
├── Có cần trigger re-render không?        → Không → dùng useRef
├── Initial value có tốn kém không?        → Dùng lazy init () => ...
├── State phụ thuộc state trước không?    → Dùng functional update prev =>
└── Hàm dùng state trong async/closure?  → Coi chừng stale closure

Khi update, luôn nhớ:
├── Không .push(), .splice(), .sort() trực tiếp
├── Luôn spread / tạo reference mới với object và array
├── Lưu giá trị mới vào biến local nếu cần dùng ngay
└── Muốn react với state mới → dùng useEffect
\`\`\`

---

## 8. State lồng nhau và cấu trúc phức tạp

Khi state có nhiều tầng lồng nhau, việc update bằng spread \`...\` trở nên cồng kềnh, dễ sai, và khó maintain. Có 3 hướng giải quyết.

---

### 8.1 Làm phẳng state (Normalize / Flatten)

**Vấn đề:** State lồng sâu → update phải spread nhiều tầng → dễ miss, dễ sai.

\`\`\`code
// ❌ State lồng sâu — update 1 comment cần spread 3 tầng
const [post, setPost] = useState({
  id: 1,
  title: 'Hello',
  author: {
    name: 'Nam',
    address: {
      city: 'Hà Nội',
      district: 'Cầu Giấy'
    }
  },
  comments: [
    { id: 1, text: 'Good', likes: 0 },
    { id: 2, text: 'Nice', likes: 0 }
  ]
})

// Update likes của comment id=1 → phải spread toàn bộ cây
setPost(prev => ({
  ...prev,
  comments: prev.comments.map(c =>
    c.id === 1 ? { ...c, likes: c.likes + 1 } : c
  )
}))
\`\`\`

\`\`\`code
// ✅ Làm phẳng — tách thành các state độc lập theo entity
const [post, setPost] = useState({ id: 1, title: 'Hello', authorId: 1 })
const [author, setAuthor] = useState({ id: 1, name: 'Nam', city: 'Hà Nội' })
const [comments, setComments] = useState({
  1: { id: 1, text: 'Good', likes: 0 },
  2: { id: 2, text: 'Nice', likes: 0 }
})

// Update likes của comment id=1 → chỉ động vào comments
setComments(prev => ({
  ...prev,
  1: { ...prev[1], likes: prev[1].likes + 1 }
}))
\`\`\`

**Nguyên tắc normalize:**
- Dùng object với key là \`id\` thay vì array khi cần update theo id thường xuyên
- Thiết kế giống cách database thiết kế table
- Tham khảo pattern của Redux Toolkit's \`createEntityAdapter\`

---

### 8.2 Dùng useReducer — khi logic update phức tạp

**Vấn đề:** Nhiều state liên quan nhau, logic update phân tán khắp nơi trong component, khó trace được "ai thay đổi cái gì".

**Khi nào nên chuyển sang \`useReducer\`:**
- Có 3+ state liên quan nhau phải update cùng lúc
- Logic update có nhiều nhánh điều kiện (if/else, switch)
- Cần biết "state thay đổi từ đâu"
- State có thể thay đổi hiện tại theo nhiều cách khác nhau

\`\`\`code
// ❌ Nhiều useState liên quan — logic phân tán, khó track
const [items, setItems] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [selectedId, setSelectedId] = useState(null)

async function fetchItems() {
  setLoading(true)
  // phải nhớ reset error
  try {
    const data = await api.getItems()
    setItems(data)
    setLoading(false)  // phải nhớ tắt loading
  } catch (e) {
    setError(e.message)
    setLoading(false)  // phải nhớ tắt loading ở cả catch
  }
}
\`\`\`

\`\`\`code
// ✅ useReducer — logic tập trung, dễ đọc, dễ test
const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedId: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SELECT_ITEM':
      return { ...state, selectedId: action.payload }
    default:
      return state
  }
}

function ItemList() {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function fetchItems() {
    dispatch({ type: 'FETCH_START' })
    try {
      const data = await api.getItems()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (e) {
      dispatch({ type: 'FETCH_ERROR', payload: e.message })
    }
  }
}
\`\`\`

**Lợi ích của useReducer:**
- Toàn bộ logic nằm trong 1 hàm \`reducer\` → dễ đọc, dễ test độc lập
- Không bao giờ quên reset state liên quan (ví dụ: quên tắt loading)
- Dễ debug: log \`action\` là biết chính xác điều gì xảy ra
- Reducer là pure function → test không cần render component

\`\`\`code
// Test reducer độc lập, không cần React
it('FETCH_SUCCESS sets items and stops loading', () => {
  const state = reducer(
    { loading: true, items: [], error: null },
    { type: 'FETCH_SUCCESS', payload: [{ id: 1 }] }
  )
  expect(state.loading).toBe(false)
  expect(state.items).toHaveLength(1)
})
\`\`\`

---

### 8.3 Immer — giữ cú pháp mutation nhưng an toàn

**Vấn đề:** Dù dùng \`useState\` hay \`useReducer\`, với state lồng sâu vẫn phải spread nhiều tầng → code dài, dễ miss.

**Immer** cho phép viết code trông như đang mutate trực tiếp, nhưng **bên trong nó tự tạo object mới** — immutable hoàn toàn.

\`\`\`bash
# Cài đặt
npm install immer use-immer
\`\`\`

**Dùng với useState — \`useImmer\`:**

\`\`\`code
import { useImmer } from 'use-immer'

function EditProfile() {
  const [user, setUser] = useImmer({
    name: 'Nam',
    address: { city: 'Hà Nội', district: 'Cầu Giấy' },
    skills: ['React', 'TypeScript']
  })

  function updateCity() {
    // ❌ Cách cũ — spread nhiều tầng
    setUser(prev => ({
      ...prev,
      address: { ...prev.address, city: 'HCM' }
    }))

    // ✅ Với Immer — trông như mutation, Immer tự xử lý
    setUser(draft => {
      draft.address.city = 'HCM' // trông như mutate nhưng an toàn
    })
  }

  function addSkill(skill) {
    setUser(draft => {
      draft.skills.push(skill) // .push() an toàn trong Immer draft
    })
  }
}
\`\`\`

**Dùng với useReducer — \`produce\`:**

\`\`\`code
import { produce } from 'immer'

function reducer(state, action) {
  switch (action.type) {
    // ❌ Cách cũ — spread nhiều tầng
    case 'UPDATE_COMMENT_LIKES_OLD':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.postId
            ? {
                ...post,
                comments: post.comments.map(c =>
                  c.id === action.commentId
                    ? { ...c, likes: c.likes + 1 }
                    : c
                )
              }
            : post
        )
      }

    // ✅ Với Immer produce
    case 'UPDATE_COMMENT_LIKES':
      return produce(state, draft => {
        const post = draft.posts.find(p => p.id === action.postId)
        const comment = post.comments.find(c => c.id === action.commentId)
        comment.likes += 1 // cực kỳ gọn và rõ ý định
      })
  }
}
\`\`\`

**Lưu ý khi dùng Immer:**

\`\`\`code
// ❌ Không được return VÀ mutate draft cùng lúc
setUser(draft => {
  draft.name = 'Minh'
  return draft // ❌ chọn 1 trong 2
})

// ✅ Chỉ mutate (không return)
setUser(draft => {
  draft.name = 'Minh'
})

// ✅ Hoặc chỉ return object mới (không mutate)
setUser(draft => ({ ...draft, name: 'Minh' }))
\`\`\`

---

### So sánh 3 hướng

| | Làm phẳng | useReducer | Immer |
|---|---|---|---|
| **Giải quyết** | Structure phức tạp | Logic phức tạp | Syntax cồng kềnh |
| **Khi dùng** | Nhiều entity liên quan | 3+ state liên quan, nhiều action | State lồng sâu, spread nhiều tầng |
| **Trade-off** | Phải tự quản lý relationship | Boilerplate nhiều hơn | Thêm dependency |
| **Kết hợp được không?** | ✅ | ✅ | ✅ với cả useState lẫn useReducer |

> **Thực tế:** Ba cái này không loại trừ nhau. Dự án lớn thường dùng cả 3: **normalize** data structure + **useReducer** cho logic + **Immer** để viết reducer gọn hơn.

---

## 9. Key concepts tóm gọn

| Concept | Ý nghĩa |
|---|---|
| \`Object.is()\` comparison | React so sánh state cũ/mới bằng cách này |
| Batching | React gom nhiều setState → render 1 lần |
| Snapshot per render | Mỗi render có state riêng, độc lập |
| \`prev =>\` pattern | Functional update, tránh stale |
| Lazy init | \`() => value\` chỉ chạy 1 lần |
| Stale closure | State bị đóng băng trong closure |
| \`useRef\` escape hatch | Đọc state mới nhất trong closure |
| \`key\` trick | Force reset state khi prop thay đổi |
| Derived state | Đừng lưu, tính thẳng trong render |`,
      code: `// Stale closure bug — count bị đóng băng
function handleClick() {
  setTimeout(() => {
    setCount(count + 1) // count = 0 mãi dù click nhiều lần
  }, 3000)
}

// Fix với functional update
setTimeout(() => {
  setCount(prev => prev + 1)
}, 3000)

// useRef escape hatch — khi cần đọc nhiều state trong closure
const cartRef = useRef(cart)
useEffect(() => { cartRef.current = cart }, [cart])

useEffect(() => {
  socket.on('checkout', () => {
    processOrder(user, cartRef.current) // luôn mới nhất
  })
}, [])`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
