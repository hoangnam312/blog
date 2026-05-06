import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'use-effect',
  title: 'useEffect Hook',
  description:
    'A complete guide to useEffect — from how it works, cleanup, dependency array, to race conditions and advanced patterns.',
  category: 'hooks',
  publishedAt: '2024-01-22',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## 1. The problem it solves

React components are **pure functions** — they receive input (props/state) and return UI. But real apps need to do many things outside of rendering UI:

- Calling APIs to fetch data
- Subscribing to WebSocket / event listeners
- Syncing with external libraries (chart, map, player...)
- Setting \`document.title\`
- \`setTimeout\` / \`setInterval\`

These are called **side effects** — actions that reach outside the render cycle. If placed directly in the render body:

\`\`\`code
function Component() {
  fetch('/api/users') // ❌ runs every render → calls API continuously forever
  return <div>...</div>
}
\`\`\`

\`useEffect\` solves this by **separating side effects from the render**, running after React has finished updating the DOM.

---

## 2. How it works

\`\`\`code
useEffect(() => {
  // 1. Effect runs after render

  return () => {
    // 2. Cleanup runs before the next effect, or when unmounting
  }
}, [dependencies]) // 3. Only re-runs when dependency changes
\`\`\`

**Execution order:**

\`\`\`
Mount:
  Render → Update DOM → useEffect runs

Update (dependency changes):
  Render → Update DOM → Cleanup old effect → useEffect runs again

Unmount:
  Cleanup effect runs one last time
\`\`\`

---

## 3. Three forms of dependency array

\`\`\`code
// 1. No array — runs after EVERY render
useEffect(() => {
  console.log('render')
})

// 2. Empty array [] — only runs once at mount
useEffect(() => {
  console.log('mounted')
}, [])

// 3. With dependency — runs when dependency changes
useEffect(() => {
  console.log('userId changed:', userId)
}, [userId])
\`\`\`

---

## 4. Cleanup — the most commonly overlooked part

**Problem:** Without cleanup, side effects continue running even after the component unmounts → **memory leak**, **race condition**, **"setState on unmounted component" error**.

\`\`\`code
// ❌ No cleanup for event listener
useEffect(() => {
  window.addEventListener('resize', handleResize)
}, [])

// ✅ Proper cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
\`\`\`

\`\`\`code
// ❌ No cleanup for subscription
useEffect(() => {
  const socket = io('ws://...')
  socket.on('message', handleMessage)
}, [])

// ✅
useEffect(() => {
  const socket = io('ws://...')
  socket.on('message', handleMessage)
  return () => socket.disconnect()
}, [])
\`\`\`

\`\`\`code
// ❌ No cleanup for interval — memory leak
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000)
}, [])

// ✅
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000)
  return () => clearInterval(id)
}, [])
\`\`\``,
      code: `import { useState, useEffect } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id) // cleanup when running changes or unmount
  }, [running])

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning(r => !r)}>
        {running ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => { setRunning(false); setSeconds(0) }}>Reset</button>
    </div>
  )
}`,
      language: 'tsx',
      showLivePreview: true,
      sandpackCode: `import { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", padding: "2rem" }}>
      <h2 style={{ fontSize: "3rem", margin: "0 0 1rem" }}>{seconds}s</h2>
      <button
        onClick={() => setRunning(r => !r)}
        style={{ marginRight: "8px", padding: "8px 16px", cursor: "pointer" }}
      >
        {running ? "Pause" : "Start"}
      </button>
      <button
        onClick={() => { setRunning(false); setSeconds(0); }}
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
      explanation: `## 5. Dependency array — the source of 80% of useEffect bugs

### Missing dependency

\`\`\`code
const [userId, setUserId] = useState(1)

// ❌ Missing userId → effect doesn't re-run when userId changes
useEffect(() => {
  fetchUser(userId)
}, [])

// ✅
useEffect(() => {
  fetchUser(userId)
}, [userId])
\`\`\`

### Excess dependency — object/function created on every render

\`\`\`code
// ❌ options is a new object every render → effect runs continuously → infinite loop
const options = { method: 'GET', headers: {} }

useEffect(() => {
  fetchData(options)
}, [options])

// ✅ Move inside the effect
useEffect(() => {
  const options = { method: 'GET', headers: {} }
  fetchData(options)
}, [])

// ✅ Or use useMemo to stabilize the reference
const options = useMemo(() => ({ method: 'GET' }), [])
\`\`\`

### Enable eslint exhaustive-deps

\`\`\`code
// eslint-plugin-react-hooks warns about missing dependencies
// The most important safety net when working with useEffect
// "react-hooks/exhaustive-deps": "warn"
\`\`\`

---

## 6. Closure in useEffect

### Problem

useEffect is also a function — it **captures all values** of props/state at the moment it is created. This is the same stale closure mechanism seen in useState, but in useEffect it is **more dangerous** because effects typically run after a delay.

\`\`\`code
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Effect created at mount, captures count = 0
    const id = setInterval(() => {
      console.log(count) // ❌ always prints 0, even though count has increased
      setCount(count + 1) // ❌ 0 + 1 = 1 forever, doesn't keep incrementing
    }, 1000)

    return () => clearInterval(id)
  }, []) // [] → effect doesn't re-run → count is frozen = 0
}
\`\`\`

**Why is it more dangerous than useState?**

With useState, stale closures only occur in short async functions (\`setTimeout\`). With useEffect, stale closures persist **for the lifetime of the effect** — potentially minutes if using \`setInterval\`, WebSocket, or subscriptions.

### Fix 1: Functional update — when only state needs updating

\`\`\`code
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1) // ✅ no need to read count from closure
  }, 1000)
  return () => clearInterval(id)
}, [])
\`\`\`

### Fix 2: Add to dependency — effect re-runs when value changes

\`\`\`code
useEffect(() => {
  const id = setInterval(() => {
    console.log(count) // ✅ count is always latest
  }, 1000)
  return () => clearInterval(id)
}, [count]) // each time count changes: clear old interval → create new interval
\`\`\`

> **Note:** This approach creates and destroys the interval each time count changes. Not recommended for short intervals or frequently-changing dependencies.

### Fix 3: useRef as "escape hatch" — read latest value without re-subscribing

\`\`\`code
function Counter() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  // Sync ref whenever count changes
  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    const id = setInterval(() => {
      console.log(countRef.current) // ✅ always the latest value
      setCount(countRef.current + 1) // ✅
    }, 1000)
    return () => clearInterval(id)
  }, []) // [] — only creates interval once, not recreated
}
\`\`\`

### Fix 4: useEffectEvent (React 19) — separate "event logic" from dependencies

\`\`\`code
import { experimental_useEffectEvent as useEffectEvent } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  // Always reads latest count, not stale
  const onTick = useEffectEvent(() => {
    setCount(count + 1)
  })

  useEffect(() => {
    const id = setInterval(onTick, 1000)
    return () => clearInterval(id)
  }, []) // ✅ no need for count in dependency
}
\`\`\`

### Complex closure scenario — multiple stale values at once

\`\`\`code
function ChatRoom({ roomId, userId }) {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')

  // ❌ roomId, userId, filter can all be stale
  useEffect(() => {
    const socket = io()
    socket.on('message', (msg) => {
      if (msg.roomId === roomId && msg.userId !== userId) {
        if (filter === 'all' || msg.type === filter) {
          setMessages(prev => [...prev, msg])
        }
      }
    })
    return () => socket.disconnect()
  }, []) // missing roomId, userId, filter
\`\`\`

\`\`\`code
  // ✅ Combine dependency + functional update + ref
  const filterRef = useRef(filter)
  useEffect(() => { filterRef.current = filter }, [filter])

  useEffect(() => {
    const socket = io()
    socket.on('message', (msg) => {
      if (msg.roomId === roomId && msg.userId !== userId) {
        // Read filter from ref — no need to add to dependency
        if (filterRef.current === 'all' || msg.type === filterRef.current) {
          setMessages(prev => [...prev, msg])
        }
      }
    })
    return () => socket.disconnect()
  }, [roomId, userId]) // only reconnect when room/user changes
}
\`\`\`

### Fix priority order

\`\`\`
1. Functional update (prev =>)        — simplest, when only updating
2. Add to dependency array            — when few dependencies, can cleanup
3. useRef as escape hatch             — when you don't want to re-subscribe
4. useEffectEvent (React 19)          — separate event logic, no dependency needed
\`\`\`

---

## 8. Other common mistakes

\`\`\`code
// ❌ 1. Async function directly — useEffect doesn't accept async functions
useEffect(async () => {
  const data = await fetch(...)
}, [])

// ✅ Wrap in async function inside
useEffect(() => {
  async function load() {
    const data = await fetch(...)
    setData(data)
  }
  load()
}, [])

// ❌ 2. setState in effect without dependency → infinite loop
useEffect(() => {
  setCount(count + 1)
})

// ❌ 3. Forget cleanup when unmounting → setState on unmounted component
useEffect(() => {
  fetchData().then(data => setData(data))
}, [])

// ✅
useEffect(() => {
  let isCancelled = false
  fetchData().then(data => {
    if (!isCancelled) setData(data)
  })
  return () => { isCancelled = true }
}, [])
\`\`\``,
      code: `// ❌ Stale closure — count is frozen = 0
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1) // count = 0 forever, doesn't increment
  }, 1000)
  return () => clearInterval(id)
}, [])

// ✅ Fix 1: functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)
  return () => clearInterval(id)
}, [])

// ✅ Fix 2: add to dependency
useEffect(() => {
  fetchUser(userId)
}, [userId])`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## 7. Race Condition in useEffect

### Problem

A race condition occurs when **multiple async operations run in parallel**, and responses arrive **out of expected order** — an older response overwrites a newer one.

\`\`\`
userId = 1  →  fetch('/api/users/1')  — takes 500ms
userId = 2  →  fetch('/api/users/2')  — takes 100ms

Response order:
  users/2 arrives first  → setUser(user2)  ✅
  users/1 arrives later  → setUser(user1)  ❌ overwrites user2
  → UI shows user1 but userId is 2
\`\`\`

\`\`\`code
// ❌ Race condition — not cancelling old request
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data)) // old response may arrive after new response
  }, [userId])
}
\`\`\`

### Fix 1: AbortController — cancel request when dependency changes

\`\`\`code
// ✅ Cancel old request before making new one
useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then(res => {
      if (!res.ok) throw new Error('Failed')
      return res.json()
    })
    .then(data => setUser(data))
    .catch(err => {
      if (err.name === 'AbortError') return // was cancelled → ignore
      setError(err.message)
    })

  return () => controller.abort() // cleanup = cancel running request
}, [userId])

// When userId changes:
//   1. Cleanup runs → controller.abort() → old request is cancelled
//   2. New effect runs → new controller → new request
\`\`\`

> **Note:** \`AbortController\` only cancels \`fetch\`. For \`axios\`, use \`AbortController\` via \`axios.CancelToken\` or the \`signal\` option.

### Fix 2: Boolean flag — when AbortController cannot be used

\`\`\`code
// ✅ Use when library doesn't support AbortController
useEffect(() => {
  let isCancelled = false

  async function load() {
    try {
      const data = await fetchUser(userId)
      if (!isCancelled) setUser(data) // only set if not cancelled
    } catch (err) {
      if (!isCancelled) setError(err.message)
    }
  }

  load()
  return () => { isCancelled = true }
}, [userId])
\`\`\`

### Fix 3: Race condition with parallel requests

\`\`\`code
// ❌ 2 fetches in parallel, updating separately → UI may render inconsistent state
useEffect(() => {
  fetchUser(userId).then(setUser)
  fetchPosts(userId).then(setPosts)
  // posts arrive before user → render posts but user = null → crash
}, [userId])

// ✅ Wait for both to finish then update together
useEffect(() => {
  const controller = new AbortController()

  Promise.all([
    fetchUser(userId, { signal: controller.signal }),
    fetchPosts(userId, { signal: controller.signal })
  ]).then(([userData, postsData]) => {
    setUser(userData)   // React 18 auto-batches these 2 setStates
    setPosts(postsData) // → only renders once
  }).catch(err => {
    if (err.name !== 'AbortError') setError(err.message)
  })

  return () => controller.abort()
}, [userId])
\`\`\`

### Fix 4: Race condition with sequential requests

\`\`\`code
// Situation: next request depends on result of previous request
// ❌ userId changes mid-way → fetchOrders runs with old accountId
useEffect(() => {
  fetchUser(userId).then(user => {
    fetchOrders(user.accountId).then(setOrders)
  })
}, [userId])

// ✅ Check isCancelled after each await
useEffect(() => {
  let isCancelled = false

  async function load() {
    const user = await fetchUser(userId)
    if (isCancelled) return // check after each async step

    const orders = await fetchOrders(user.accountId)
    if (isCancelled) return

    setOrders(orders)
  }

  load()
  return () => { isCancelled = true }
}, [userId])
\`\`\`

### Fix 5: Use React Query / SWR — comprehensive solution

\`\`\`code
// ✅ React Query handles race conditions, loading, error, cache, retry automatically
import { useQuery } from '@tanstack/react-query'

function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: ({ signal }) =>
      fetch(\`/api/users/\${userId}\`, { signal }).then(r => r.json())
    // AbortController is automatically injected into queryFn by React Query
  })
}
\`\`\`

### Comparing race condition fixes

| | AbortController | isCancelled flag | React Query |
|---|---|---|---|
| **Actually cancels request** | ✅ | ❌ (request still runs) | ✅ |
| **Ease of use** | Medium | Easy | Very easy |
| **Sequential support** | Needs combination | ✅ natural | ✅ |
| **Cache / retry** | ❌ | ❌ | ✅ |
| **When to use** | Pure fetch | Old axios, custom | Real projects |

---

## 9. Functions in dependency array

### Problem — functions are objects, each render creates a new reference

\`\`\`code
function Component() {
  // fetchData is created anew each render → new reference each time
  function fetchData() {
    return fetch(\`/api/users/\${userId}\`)
  }

  useEffect(() => {
    fetchData()
  }, [fetchData]) // ❌ fetchData is new every render → effect runs after every render → infinite loop
}
\`\`\`

If **not declared** in dependency:

\`\`\`code
useEffect(() => {
  fetchData() // ❌ stale closure — fetchData captured userId at creation
}, [])        // userId changes but old fetchData still uses old userId
\`\`\`

Both directions have problems. There are 4 solutions:

---

### Fix 1: Move function inside the effect — simplest

\`\`\`code
// ✅ Function inside effect → no need to declare as dependency
// → no eslint warning, no stale closure
useEffect(() => {
  async function fetchData() {
    const data = await fetch(\`/api/users/\${userId}\`).then(r => r.json())
    setUser(data)
  }
  fetchData()
}, [userId]) // only need to declare userId
\`\`\`

> **This is the most preferred approach** when the function is only used in that effect.

---

### Fix 2: useCallback — stabilize function reference

\`\`\`code
// ✅ useCallback keeps the same reference if dependency hasn't changed
const fetchData = useCallback(async () => {
  const data = await fetch(\`/api/users/\${userId}\`).then(r => r.json())
  setUser(data)
}, [userId]) // fetchData only changes when userId changes

useEffect(() => {
  fetchData()
}, [fetchData]) // ✅ fetchData is stable → effect doesn't run continuously
\`\`\`

> **When to use useCallback?** When the function needs to be used in multiple places (multiple effects, passed to child components), not just one effect.

---

### Fix 3: Move function outside component — if it doesn't depend on state/props

\`\`\`code
// Function doesn't use state/props → not stale, stable reference
async function fetchUser(userId) {
  return fetch(\`/api/users/\${userId}\`).then(r => r.json())
}

function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId]) // ✅ fetchUser is a constant, no need to declare
}
\`\`\`

---

### Fix 4: useRef — when function changes frequently but you don't want to trigger effect

\`\`\`code
// Example: callback from props that changes every render
function Component({ onDataLoad }) {
  const onDataLoadRef = useRef(onDataLoad)
  useEffect(() => {
    onDataLoadRef.current = onDataLoad
  }, [onDataLoad])

  useEffect(() => {
    fetchData().then(data => {
      onDataLoadRef.current(data) // ✅ always calls the latest callback
    })
  }, []) // no need for onDataLoad in dependency
}
\`\`\`

---

### Summary — Functions in dependency

\`\`\`
Function in dependency array:
├── Declare it → new reference every render → infinite loop
└── Don't declare → stale closure

Fix priority order:
  1. Move function inside the effect      — simple, no useCallback needed
  2. Pull function outside component      — if it doesn't use state/props
  3. useCallback                          — function used in multiple places
  4. useRef                               — callback from props that changes often
\`\`\`

---

## 10. Strict Mode and Double Invoke

### What does Strict Mode do?

In development, React **Strict Mode** intentionally runs effects **twice in a row** right at mount:

\`\`\`
Mount → Effect runs → Cleanup → Effect runs again
\`\`\`

Purpose: **detect side effects that are not properly cleaned up**. If the app behaves incorrectly when the effect runs twice → that is a real bug, not caused by Strict Mode.

\`\`\`code
// Strict Mode is enabled by default in Create React App and Next.js
<React.StrictMode>
  <App />
</React.StrictMode>
\`\`\`

---

### Common symptoms

\`\`\`code
// ❌ No cleanup — logs twice, connects twice, fetches twice
useEffect(() => {
  console.log('connected')
  const socket = io()
  socket.connect()
}, [])

// Strict Mode: "connected" appears twice in console
// → Not a Strict Mode bug, but a real bug: missing disconnect
\`\`\`

\`\`\`code
// ✅ Proper cleanup → Strict Mode running twice still works
useEffect(() => {
  console.log('connected')
  const socket = io()
  socket.connect()
  return () => {
    console.log('disconnected')
    socket.disconnect()
  }
}, [])

// Strict Mode: connect → disconnect → connect
// Production: connect
// → Same final result: 1 active connection
\`\`\`

---

### Scenarios commonly affected

**API called twice:**

**Animation runs twice:**

**Third-party library initialized twice:**

---

### Strict Mode as a testing tool

\`\`\`
Strict Mode double invoke is a feature, not a bug.

If app breaks when effect runs twice:
├── Effect creates resource without cleanup              → add cleanup
├── Effect calls API without cancelling                 → use AbortController
└── Effect changes state making output inconsistent      → review the logic
\`\`\`

> **Rule of thumb:** A correct effect must be **idempotent** — running once or twice should produce the same final result.

---

## 11. You Might Not Need an Effect

This is one of the things the React docs emphasize most: **useEffect is often misused**. Many situations seem to need an effect but actually don't.

---

### Situation 1: Computing from state/props — use derived value

\`\`\`code
// ❌ Using effect to sync derived state
const [firstName, setFirstName] = useState('Nam')
const [lastName, setLastName] = useState('Nguyen')
const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(\`\${firstName} \${lastName}\`) // completely unnecessary
}, [firstName, lastName])

// ✅ Compute directly in render — no effect needed, no extra state
const fullName = \`\${firstName} \${lastName}\`
\`\`\`

---

### Situation 2: Reset state when props change — use key

\`\`\`code
// ❌ Effect to reset form when userId changes
function ProfileForm({ userId }) {
  const [name, setName] = useState('')

  useEffect(() => {
    setName('') // reset when userId changes
  }, [userId])
}

// ✅ Use key — React auto-unmounts & remounts, state resets itself
function ProfilePage({ userId }) {
  return <ProfileForm key={userId} userId={userId} />
}
\`\`\`

---

### Situation 3: Handling events — use event handler

\`\`\`code
// ❌ Effect to track user actions
const [submitted, setSubmitted] = useState(false)

useEffect(() => {
  if (submitted) {
    sendAnalytics('form_submitted') // this is a reaction to an event, not a sync
    setSubmitted(false)
  }
}, [submitted])

// ✅ Handle directly in event handler
function handleSubmit() {
  sendAnalytics('form_submitted') // ✅ clear, much simpler
  submitForm()
}
\`\`\`

---

### Situation 4: Fetch data based on user action — event handler

\`\`\`code
// ❌ Effect to fetch when search query changes as user types
const [query, setQuery] = useState('')

useEffect(() => {
  if (query) fetchResults(query).then(setResults)
}, [query])

// Still acceptable with debounce, but consider:
// ✅ With React Query, fetch directly in event or use enabled flag
const { data } = useQuery({
  queryKey: ['search', query],
  queryFn: () => fetchResults(query),
  enabled: query.length > 0 // only fetch when there's a query
})
\`\`\`

---

### Situation 5: Submit request on submit — event handler

\`\`\`code
// ❌ Effect to submit form
const [shouldSubmit, setShouldSubmit] = useState(false)

useEffect(() => {
  if (shouldSubmit) {
    submitForm(formData)
    setShouldSubmit(false)
  }
}, [shouldSubmit])

// ✅ Send directly in handler
async function handleSubmit(e) {
  e.preventDefault()
  await submitForm(formData)
}
\`\`\`

---

### Situation 6: Subscribe to external store — use useSyncExternalStore

\`\`\`code
// ❌ Using effect to subscribe to external store
const [windowWidth, setWindowWidth] = useState(window.innerWidth)

useEffect(() => {
  const handler = () => setWindowWidth(window.innerWidth)
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])

// ✅ useSyncExternalStore — built-in for this use case
import { useSyncExternalStore } from 'react'

const windowWidth = useSyncExternalStore(
  (cb) => {
    window.addEventListener('resize', cb)
    return () => window.removeEventListener('resize', cb)
  },
  () => window.innerWidth
)
\`\`\`

---

### Summary table — Need effect or not?

| Situation | Use Effect? | Replace with |
|---|---|---|
| Compute from state/props | ❌ | Derived value in render |
| Reset state when prop changes | ❌ | \`key\` prop |
| Handle user event | ❌ | Event handler |
| Fetch on submit | ❌ | Event handler |
| Fetch on mount / prop change | ✅ | Effect or React Query |
| Subscribe to external store | ⚠️ | \`useSyncExternalStore\` is better |
| Sync with DOM / external library | ✅ | Effect |
| Timer / interval | ✅ | Effect + cleanup |
| WebSocket / real-time | ✅ | Effect + cleanup |

---

## 12. Mental model summary

\`\`\`
useEffect is the "bridge" between React and the outside world

Questions before using:
├── Can it be computed from state/props?             → Derived value, no effect needed
├── Reacting to a user event?                        → Event handler, no effect needed
├── Resetting state when prop changes?               → key prop, no effect needed
├── Need to sync with something outside React?       → useEffect ✅
├── Dependency array:
│   ├── []         → only mount/unmount
│   ├── [a, b]     → sync when a or b changes
│   └── none       → after every render (rarely needed)
├── Using function in effect?
│   ├── Only used in this effect    → move function inside effect
│   ├── Used in multiple places     → useCallback
│   └── Doesn't use state/props     → pull outside component
├── Creating resource (listener, timer, request)?  → must have cleanup
├── Has async operation?                            → watch for race condition
│   ├── pure fetch      → AbortController
│   ├── custom promise  → isCancelled flag
│   └── real project    → React Query / SWR
├── Reading state in effect?                        → watch for stale closure
│   ├── Only updating state        → functional update (prev =>)
│   ├── Need to read multiple values  → useRef escape hatch
│   └── Depends on many values     → add correct dependencies
└── Effect runs twice (Strict Mode)?
    → This is a real bug, not caused by Strict Mode
    → Add cleanup to make it idempotent
\`\`\`

\`\`\`
useEffect is the "bridge" between React and the outside world

Questions before using:
├── Need to sync with something outside React?       → useEffect
├── Dependency array:
│   ├── []         → only mount/unmount
│   ├── [a, b]     → sync when a or b changes
│   └── none       → after every render (rarely needed)
├── Creating resource (listener, timer, request)?  → must have cleanup
├── Has async operation?                            → watch for race condition
│   ├── pure fetch      → AbortController
│   ├── custom promise  → isCancelled flag
│   └── real project    → React Query / SWR
└── Reading state in effect?                        → watch for stale closure
    ├── Only updating state       → functional update (prev =>)
    ├── Need to read multiple values  → useRef escape hatch
    └── Depends on many values    → add correct dependencies
\`\`\``,
      code: `// AbortController — standard race condition fix
useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => {
      if (err.name === 'AbortError') return
      setError(err.message)
    })

  return () => controller.abort()
}, [userId])
// When userId changes:
//   1. controller.abort() → old request is cancelled
//   2. New effect runs → new request`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
