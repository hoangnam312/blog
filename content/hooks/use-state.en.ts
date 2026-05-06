import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'use-state',
  title: 'useState Hook',
  description:
    'A complete guide to useState — from how it works, important patterns, stale closures, and managing complex state.',
  category: 'hooks',
  publishedAt: '2024-01-15',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## 1. What problem does useState solve?

Plain variables change but React doesn't know to re-render. \`useState\` connects data to the render cycle — every time \`setState\` is called, React schedules a re-render, the component runs again and returns a new value.

\`\`\`code
const [state, setState] = useState(initialValue)
\`\`\`

> **Mental model:** A component function is a "snapshot" — each render is a photograph of state at that moment.

---

## 2. setState is asynchronous — but not a Promise

- Does not return a Promise → **cannot** \`await setState()\`
- React **batches** multiple setStates (**Batching**) → renders only once
- Right after calling setState, **reading state** → still the old value

\`\`\`code
// ❌ setState returns undefined, await is meaningless
await setState(newValue)

// ✅ want to use the new value immediately → save to a local variable
const newCount = count + 1
setCount(newCount)
doSomething(newCount) // use the local variable, not state
\`\`\`

React uses **Object.is()** to compare old and new state. Same reference = no re-render.

---

## 3. When NOT to use useState

| Situation | Use instead |
|---|---|
| Can be derived from other state/props (derived state) | Compute directly in render |
| Need to track a value but don't need re-render | \`useRef\` |
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
      explanation: `## 4. Important patterns

### 4.1 Functional update — when state depends on previous state

\`\`\`code
// ❌ Wrong — still uses old count from closure
setCount(count + 1)
setCount(count + 1) // still uses old count → result is +1 instead of +2

// ✅ Correct — always gets the latest value from the internal queue
setCount(prev => prev + 1)
setCount(prev => prev + 1) // → result is +2
\`\`\`

**Must use when:** inside \`setTimeout\`, event listeners, WebSocket, or calling setState multiple times in a row.

---

### 4.2 Lazy initialization — when initial value is expensive

\`\`\`code
// ❌ This function runs EVERY re-render
const [data, setData] = useState(heavyComputation())

// ✅ Only runs once at mount
const [data, setData] = useState(() => heavyComputation())
\`\`\`

---

### 4.3 Object/Array state — always create new reference

\`\`\`code
// ❌ React won't re-render
user.name = 'Minh'
setUser(user)

todos.push(newItem)
setTodos(todos)

// ✅ Always create new
setUser(prev => ({ ...prev, name: 'Minh' }))
setTodos(prev => [...prev, newItem])
\`\`\`

> **Rule:** Never use \`.push()\`, \`.splice()\`, \`.sort()\` directly on state arrays/objects.

---

### 4.4 Initializing state from props — key trick

\`\`\`code
// ❌ State only takes prop at mount, prop changes later → state doesn't follow
function Input({ value }) {
  const [inputValue, setInputValue] = useState(value) // stale when prop changes
}

// ✅ Option 1: Fully controlled component
function Input({ value, onChange }) {
  return <input value={value} onChange={onChange} />
}

// ✅ Option 2: Use key to force reset all state
<Input key={userId} defaultValue={user.name} />
// Change key → unmount & remount → state fully reset
\`\`\`

---

## 5. Common mistakes

### Mistake 1: Mutating state directly

\`\`\`code
// ❌
todos.push({ id: 1, text: 'Learn React' })
setTodos(todos) // same reference → no re-render

// ✅
setTodos(prev => [...prev, { id: 1, text: 'Learn React' }])
\`\`\`

### Mistake 2: Reading state right after setState

\`\`\`code
// ❌
setCount(count + 1)
console.log(count) // still the old value

// ✅
const newCount = count + 1
setCount(newCount)
console.log(newCount)
\`\`\`

### Mistake 3: Stale closure

See section 6 (Advanced) for details.

### Mistake 4: Storing unnecessary derived state

\`\`\`code
// ❌ cart and total can diverge if you forget to update
const [cart, setCart] = useState([])
const [total, setTotal] = useState(0)

// ✅ total is derived state — compute directly — always in sync, can't diverge
const [cart, setCart] = useState([])
const total = cart.reduce((sum, i) => sum + i.price, 0)
\`\`\`

### Mistake 5: Using useState instead of useRef for values that don't need rendering

\`\`\`code
// ❌ Every set → unnecessary re-render
const [timerId, setTimerId] = useState(null)

// ✅ timerId is not shown in UI → use useRef
const timerIdRef = useRef(null)
timerIdRef.current = setInterval(() => { ... }, 1000)
\`\`\`

### Mistake 6: Infinite loops

\`\`\`code
// ❌ setState in component body → infinite loop
function Component() {
  const [count, setCount] = useState(0)
  setCount(1) // runs every render → triggers render → loops forever
}

// ❌ useEffect missing dependency array
useEffect(() => {
  setCount(prev => prev + 1)
}) // no [] → runs after every render → infinite loop
\`\`\``,
      code: `// 4.1 Functional update
setCount(prev => prev + 1)
setCount(prev => prev + 1) // → result is +2, not +1

// 4.2 Lazy initialization
const [data, setData] = useState(() => JSON.parse(localStorage.getItem('data') ?? '[]'))

// 4.3 Object/Array — always create new reference
setUser(prev => ({ ...prev, name: 'Minh' }))
setTodos(prev => [...prev, newItem])

// 4.4 Key trick
<Input key={userId} defaultValue={user.name} />`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## 6. Stale Closure — deep dive

### What is a stale closure?

Each render creates a "snapshot" — all functions inside **capture the state at that render**. If a function is created once (\`useEffect\` with \`[]\`) but state continues to change → that function uses the old state forever.

\`\`\`code
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setTimeout(() => {
      // count is "frozen" = 0 at the time the function was created
      setCount(count + 1)
    }, 3000)
  }
}
\`\`\`

**Scenario where the bug occurs:**

\`\`\`
Click quickly 5 times → 5 setTimeouts created, all remember count = 0
After 3 seconds: setCount(0 + 1) × 5 times → final count = 1, not 5
\`\`\`

### Why does \`prev =>\` fix it?

\`\`\`code
// ❌ Takes count from closure (frozen)
setCount(count + 1)

// ✅ Takes count from React's internal queue (always latest)
setCount(prev => prev + 1)
\`\`\`

### 3 common situations

**setTimeout / setInterval:**

\`\`\`code
// ❌
setInterval(() => { setCount(count + 1) }, 1000) // count = 0 forever

// ✅
setInterval(() => { setCount(prev => prev + 1) }, 1000)
\`\`\`

**Event listener:**

\`\`\`code
// ❌
window.addEventListener('keydown', () => {
  setCount(count + 1) // count is frozen at mount
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
  setMessages([...messages, e.data]) // always only 1 message
}

// ✅
socket.onmessage = (e) => {
  setMessages(prev => [...prev, e.data])
}
\`\`\`

### Advanced — useRef as escape hatch

\`\`\`code
// prev => is not enough when you need to READ multiple states at once
const [user, setUser] = useState(null)
const [cart, setCart] = useState([])

const cartRef = useRef(cart)
useEffect(() => {
  cartRef.current = cart // sync whenever cart changes
}, [cart])

useEffect(() => {
  socket.on('checkout', () => {
    processOrder(user, cartRef.current) // ✅ always latest
  })
}, [])
\`\`\`

### Fix priority order

\`\`\`
1. Only need to UPDATE state        →  functional update (prev =>)
2. Need to READ state in handler    →  useRef as escape hatch
3. Few dependencies, has cleanup    →  add to dependency array
\`\`\`

---

## 7. Mental checklist — before using useState

\`\`\`
Before adding useState, ask yourself:
├── Can it be computed from other state/props?   → Don't use (derived state)
├── Does it need to trigger re-render?           → No → use useRef
├── Is the initial value expensive?              → Use lazy init () => ...
├── Does state depend on previous state?         → Use functional update prev =>
└── Is the function using state in async/closure? → Watch out for stale closure

When updating, always remember:
├── No .push(), .splice(), .sort() directly
├── Always spread / create new reference for objects and arrays
├── Save new value in a local variable if needed right away
└── To react to new state → use useEffect
\`\`\`

---

## 8. Nested state and complex structures

When state has multiple nesting levels, updating with spread \`...\` becomes unwieldy, error-prone, and hard to maintain. There are 3 approaches.

---

### 8.1 Flatten state (Normalize / Flatten)

**Problem:** Deeply nested state → updating requires spreading many layers → easy to miss, easy to break.

\`\`\`code
// ❌ Deeply nested state — updating 1 comment requires spreading 3 layers
const [post, setPost] = useState({
  id: 1,
  title: 'Hello',
  author: {
    name: 'Nam',
    address: {
      city: 'Hanoi',
      district: 'Cau Giay'
    }
  },
  comments: [
    { id: 1, text: 'Good', likes: 0 },
    { id: 2, text: 'Nice', likes: 0 }
  ]
})

// Update likes for comment id=1 → must spread the entire tree
setPost(prev => ({
  ...prev,
  comments: prev.comments.map(c =>
    c.id === 1 ? { ...c, likes: c.likes + 1 } : c
  )
}))
\`\`\`

\`\`\`code
// ✅ Flatten — split into independent entity states
const [post, setPost] = useState({ id: 1, title: 'Hello', authorId: 1 })
const [author, setAuthor] = useState({ id: 1, name: 'Nam', city: 'Hanoi' })
const [comments, setComments] = useState({
  1: { id: 1, text: 'Good', likes: 0 },
  2: { id: 2, text: 'Nice', likes: 0 }
})

// Update likes for comment id=1 → only touch comments
setComments(prev => ({
  ...prev,
  1: { ...prev[1], likes: prev[1].likes + 1 }
}))
\`\`\`

**Normalization principles:**
- Use objects with \`id\` as key instead of arrays when frequently updating by id
- Design like database tables
- Reference Redux Toolkit's \`createEntityAdapter\` pattern

---

### 8.2 Use useReducer — when update logic is complex

**Problem:** Multiple related states, update logic scattered throughout the component, hard to trace "who changed what".

**When to switch to \`useReducer\`:**
- Have 3+ related states that need to update together
- Update logic has many branches (if/else, switch)
- Need to know "where the state change came from"
- State can change in different ways

\`\`\`code
// ❌ Many related useState — logic scattered, hard to track
const [items, setItems] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [selectedId, setSelectedId] = useState(null)

async function fetchItems() {
  setLoading(true)
  // have to remember to reset error
  try {
    const data = await api.getItems()
    setItems(data)
    setLoading(false)  // have to remember to turn off loading
  } catch (e) {
    setError(e.message)
    setLoading(false)  // have to remember to turn off loading in catch too
  }
}
\`\`\`

\`\`\`code
// ✅ useReducer — centralized logic, easy to read, easy to test
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

**Benefits of useReducer:**
- All logic in one \`reducer\` function → easy to read, easy to test independently
- Never forget to reset related state (e.g., forget to turn off loading)
- Easy to debug: log \`action\` to know exactly what happened
- Reducer is a pure function → test without rendering a component

\`\`\`code
// Test reducer independently, no React needed
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

### 8.3 Immer — keep mutation syntax but safe

**Problem:** Whether using \`useState\` or \`useReducer\`, with deeply nested state you still need to spread many layers → verbose code, easy to miss.

**Immer** lets you write code that looks like direct mutation, but **internally creates new objects** — fully immutable.

\`\`\`bash
# Install
npm install immer use-immer
\`\`\`

**Use with useState — \`useImmer\`:**

\`\`\`code
import { useImmer } from 'use-immer'

function EditProfile() {
  const [user, setUser] = useImmer({
    name: 'Nam',
    address: { city: 'Hanoi', district: 'Cau Giay' },
    skills: ['React', 'TypeScript']
  })

  function updateCity() {
    // ❌ Old way — spread many layers
    setUser(prev => ({
      ...prev,
      address: { ...prev.address, city: 'HCM' }
    }))

    // ✅ With Immer — looks like mutation, Immer handles it
    setUser(draft => {
      draft.address.city = 'HCM' // looks like mutation but safe
    })
  }

  function addSkill(skill) {
    setUser(draft => {
      draft.skills.push(skill) // .push() is safe inside Immer draft
    })
  }
}
\`\`\`

**Use with useReducer — \`produce\`:**

\`\`\`code
import { produce } from 'immer'

function reducer(state, action) {
  switch (action.type) {
    // ❌ Old way — spread many layers
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

    // ✅ With Immer produce
    case 'UPDATE_COMMENT_LIKES':
      return produce(state, draft => {
        const post = draft.posts.find(p => p.id === action.postId)
        const comment = post.comments.find(c => c.id === action.commentId)
        comment.likes += 1 // extremely concise and clear
      })
  }
}
\`\`\`

**Notes when using Immer:**

\`\`\`code
// ❌ Cannot return AND mutate draft at the same time
setUser(draft => {
  draft.name = 'Minh'
  return draft // ❌ pick one
})

// ✅ Only mutate (no return)
setUser(draft => {
  draft.name = 'Minh'
})

// ✅ Or only return new object (no mutation)
setUser(draft => ({ ...draft, name: 'Minh' }))
\`\`\`

---

### Comparing the 3 approaches

| | Flatten | useReducer | Immer |
|---|---|---|---|
| **Solves** | Complex structure | Complex logic | Verbose syntax |
| **Use when** | Multiple related entities | 3+ related states, many actions | Deeply nested, lots of spreading |
| **Trade-off** | Must manage relationships manually | More boilerplate | Adds dependency |
| **Combinable?** | ✅ | ✅ | ✅ with both useState and useReducer |

> **In practice:** These three are not mutually exclusive. Large projects typically use all three: **normalize** data structure + **useReducer** for logic + **Immer** to write reducers more concisely.

---

## 9. Key concepts summary

| Concept | Meaning |
|---|---|
| \`Object.is()\` comparison | How React compares old/new state |
| Batching | React groups multiple setStates → renders once |
| Snapshot per render | Each render has its own independent state |
| \`prev =>\` pattern | Functional update, avoids stale |
| Lazy init | \`() => value\` only runs once |
| Stale closure | State frozen inside a closure |
| \`useRef\` escape hatch | Read latest state inside a closure |
| \`key\` trick | Force reset state when prop changes |
| Derived state | Don't store, compute directly in render |`,
      code: `// Stale closure bug — count is frozen
function handleClick() {
  setTimeout(() => {
    setCount(count + 1) // count = 0 forever no matter how many times you click
  }, 3000)
}

// Fix with functional update
setTimeout(() => {
  setCount(prev => prev + 1)
}, 3000)

// useRef escape hatch — when you need to read multiple states in a closure
const cartRef = useRef(cart)
useEffect(() => { cartRef.current = cart }, [cart])

useEffect(() => {
  socket.on('checkout', () => {
    processOrder(user, cartRef.current) // always latest
  })
}, [])`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
