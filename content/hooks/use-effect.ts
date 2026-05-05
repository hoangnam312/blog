import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'use-effect',
  title: 'useEffect Hook',
  description:
    'Tổng hợp toàn bộ kiến thức về useEffect — từ cơ chế hoạt động, cleanup, dependency array đến race condition và các pattern nâng cao.',
  category: 'hooks',
  publishedAt: '2024-01-22',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## 1. Vấn đề nó giải quyết

React component là **pure function** — nhận input (props/state) và trả về UI. Nhưng thực tế app cần làm nhiều thứ nằm ngoài việc render UI:

- Gọi API fetch data
- Subscribe WebSocket / event listener
- Đồng bộ với thư viện bên ngoài (chart, map, player...)
- Set \`document.title\`
- \`setTimeout\` / \`setInterval\`

Những thứ này gọi là **side effects** — tác động ra ngoài render cycle. Nếu nhét thẳng vào render body:

\`\`\`code
function Component() {
  fetch('/api/users') // ❌ chạy mỗi lần render → gọi API liên tục vô hạn
  return <div>...</div>
}
\`\`\`

\`useEffect\` giải quyết bằng cách **tách side effect ra khỏi render**, chạy sau khi React đã cập nhật DOM xong.

---

## 2. Cơ chế hoạt động

\`\`\`code
useEffect(() => {
  // 1. Effect chạy sau khi render

  return () => {
    // 2. Cleanup chạy trước lần effect tiếp theo, hoặc khi unmount
  }
}, [dependencies]) // 3. Chỉ chạy lại khi dependency thay đổi
\`\`\`

**Thứ tự thực thi:**

\`\`\`
Mount:
  Render → Cập nhật DOM → useEffect chạy

Update (dependency thay đổi):
  Render → Cập nhật DOM → Cleanup effect cũ → useEffect chạy lại

Unmount:
  Cleanup effect chạy lần cuối
\`\`\`

---

## 3. Ba dạng dependency array

\`\`\`code
// 1. Không có array — chạy sau MỖI lần render
useEffect(() => {
  console.log('render')
})

// 2. Array rỗng [] — chỉ chạy 1 lần lúc mount
useEffect(() => {
  console.log('mounted')
}, [])

// 3. Có dependency — chạy khi dependency thay đổi
useEffect(() => {
  console.log('userId thay đổi:', userId)
}, [userId])
\`\`\`

---

## 4. Cleanup — phần hay bị bỏ qua nhất

**Vấn đề:** Nếu không cleanup, side effect tiếp tục chạy dù component đã unmount → **memory leak**, **race condition**, **lỗi "setState on unmounted component"**.

\`\`\`code
// ❌ Không cleanup event listener
useEffect(() => {
  window.addEventListener('resize', handleResize)
}, [])

// ✅ Cleanup đúng
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
\`\`\`

\`\`\`code
// ❌ Không cleanup subscription
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
// ❌ Không cleanup interval — memory leak
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
    return () => clearInterval(id) // cleanup khi running đổi hoặc unmount
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
      explanation: `## 5. Dependency array — nguồn gốc của 80% bug useEffect

### Thiếu dependency

\`\`\`code
const [userId, setUserId] = useState(1)

// ❌ Thiếu userId → effect không chạy lại khi userId đổi
useEffect(() => {
  fetchUser(userId)
}, [])

// ✅
useEffect(() => {
  fetchUser(userId)
}, [userId])
\`\`\`

### Thừa dependency — object/function tạo mới mỗi render

\`\`\`code
// ❌ options là object mới mỗi render → effect chạy liên tục → infinite loop
const options = { method: 'GET', headers: {} }

useEffect(() => {
  fetchData(options)
}, [options])

// ✅ Chuyển vào trong effect
useEffect(() => {
  const options = { method: 'GET', headers: {} }
  fetchData(options)
}, [])

// ✅ Hoặc dùng useMemo để ổn định reference
const options = useMemo(() => ({ method: 'GET' }), [])
\`\`\`

### Bật eslint exhaustive-deps

\`\`\`code
// eslint-plugin-react-hooks cảnh báo khi thiếu dependency
// Safety net quan trọng nhất khi làm việc với useEffect
// "react-hooks/exhaustive-deps": "warn"
\`\`\`

---

## 6. Closure trong useEffect

### Vấn đề

useEffect cũng là một hàm — nó **capture (đóng gói) toàn bộ giá trị** của props/state tại thời điểm nó được tạo ra. Đây là cùng cơ chế stale closure đã gặp ở useState, nhưng trong useEffect nó **nguy hiểm hơn** vì effect thường chạy sau một khoảng thời gian.

\`\`\`code
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Effect này được tạo lúc mount, capture count = 0
    const id = setInterval(() => {
      console.log(count) // ❌ luôn in ra 0, dù count đã tăng
      setCount(count + 1) // ❌ 0 + 1 = 1 mãi mãi, không tăng tiếp
    }, 1000)

    return () => clearInterval(id)
  }, []) // [] → effect không chạy lại → count bị freeze = 0
}
\`\`\`

**Tại sao nguy hiểm hơn useState?**

Với useState, stale closure chỉ xảy ra trong các hàm async ngắn (\`setTimeout\`). Với useEffect, stale closure tồn tại **suốt vòng đời của effect** — có thể là hàng phút nếu dùng \`setInterval\`, WebSocket, hay subscription.

### Fix 1: Functional update — khi chỉ cần update state

\`\`\`code
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1) // ✅ không cần đọc count từ closure
  }, 1000)
  return () => clearInterval(id)
}, [])
\`\`\`

### Fix 2: Thêm vào dependency — effect tự chạy lại khi giá trị đổi

\`\`\`code
useEffect(() => {
  const id = setInterval(() => {
    console.log(count) // ✅ count luôn mới nhất
  }, 1000)
  return () => clearInterval(id)
}, [count]) // mỗi khi count đổi: clearInterval cũ → tạo interval mới
\`\`\`

> **Lưu ý:** Cách này tạo và hủy interval mỗi lần count thay đổi. Với interval ngắn hoặc dependency thay đổi liên tục thì không nên dùng.

### Fix 3: useRef làm "escape hatch" — đọc giá trị mới nhất mà không re-subscribe

\`\`\`code
function Counter() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  // Sync ref mỗi khi count thay đổi
  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    const id = setInterval(() => {
      console.log(countRef.current) // ✅ luôn là giá trị mới nhất
      setCount(countRef.current + 1) // ✅
    }, 1000)
    return () => clearInterval(id)
  }, []) // [] — chỉ tạo interval 1 lần, không bị recreate
}
\`\`\`

### Fix 4: useEffectEvent (React 19) — tách "event logic" ra khỏi dependency

\`\`\`code
import { experimental_useEffectEvent as useEffectEvent } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  // Luôn đọc count mới nhất, không bị stale
  const onTick = useEffectEvent(() => {
    setCount(count + 1)
  })

  useEffect(() => {
    const id = setInterval(onTick, 1000)
    return () => clearInterval(id)
  }, []) // ✅ không cần count trong dependency
}
\`\`\`

### Tình huống closure phức tạp — nhiều giá trị stale cùng lúc

\`\`\`code
function ChatRoom({ roomId, userId }) {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')

  // ❌ roomId, userId, filter đều có thể stale
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
  }, []) // thiếu roomId, userId, filter
\`\`\`

\`\`\`code
  // ✅ Kết hợp dependency + functional update + ref
  const filterRef = useRef(filter)
  useEffect(() => { filterRef.current = filter }, [filter])

  useEffect(() => {
    const socket = io()
    socket.on('message', (msg) => {
      if (msg.roomId === roomId && msg.userId !== userId) {
        // Đọc filter từ ref — không cần thêm vào dependency
        if (filterRef.current === 'all' || msg.type === filterRef.current) {
          setMessages(prev => [...prev, msg])
        }
      }
    })
    return () => socket.disconnect()
  }, [roomId, userId]) // chỉ reconnect khi room/user đổi
}
\`\`\`

### Fix theo thứ tự ưu tiên

\`\`\`
1. Functional update (prev =>)      — đơn giản nhất, khi chỉ cần update
2. Thêm vào dependency array        — khi ít dependency, có thể cleanup
3. useRef làm escape hatch           — khi không muốn re-subscribe
4. useEffectEvent (React 19)         — tách event logic, không cần dependency
\`\`\`

---

## 8. Các lỗi thường gặp khác

\`\`\`code
// ❌ 1. Async function trực tiếp — useEffect không nhận async function
useEffect(async () => {
  const data = await fetch(...)
}, [])

// ✅ Wrap trong async function bên trong
useEffect(() => {
  async function load() {
    const data = await fetch(...)
    setData(data)
  }
  load()
}, [])

// ❌ 2. setState trong effect không có dependency → infinite loop
useEffect(() => {
  setCount(count + 1)
})

// ❌ 3. Quên cleanup khi unmount → setState on unmounted component
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
      code: `// ❌ Stale closure — count bị freeze = 0
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1) // count = 0 mãi, không tăng
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

// ✅ Fix 2: thêm vào dependency
useEffect(() => {
  fetchUser(userId)
}, [userId])`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## 7. Race Condition trong useEffect

### Vấn đề

Race condition xảy ra khi **nhiều async operation chạy song song**, và response về **không theo thứ tự mong đợi** — response cũ đè lên response mới.

\`\`\`
userId = 1  →  fetch('/api/users/1')  — mất 500ms
userId = 2  →  fetch('/api/users/2')  — mất 100ms

Thứ tự response về:
  users/2 về trước  → setUser(user2)  ✅
  users/1 về sau    → setUser(user1)  ❌ đè lên user2
  → UI hiển thị user1 nhưng userId đang là 2
\`\`\`

\`\`\`code
// ❌ Race condition — không cancel request cũ
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data)) // response cũ có thể về sau response mới
  }, [userId])
}
\`\`\`

### Fix 1: AbortController — cancel request khi dependency thay đổi

\`\`\`code
// ✅ Cancel request cũ trước khi tạo request mới
useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then(res => {
      if (!res.ok) throw new Error('Failed')
      return res.json()
    })
    .then(data => setUser(data))
    .catch(err => {
      if (err.name === 'AbortError') return // bị cancel → bỏ qua
      setError(err.message)
    })

  return () => controller.abort() // cleanup = cancel request đang chạy
}, [userId])

// Khi userId đổi:
//   1. Cleanup chạy → controller.abort() → request cũ bị cancel
//   2. Effect mới chạy → tạo controller mới → request mới
\`\`\`

> **Lưu ý:** \`AbortController\` chỉ cancel \`fetch\`. Nếu dùng \`axios\` thì dùng \`AbortController\` qua \`axios.CancelToken\` hoặc option \`signal\`.

### Fix 2: Boolean flag — khi không thể dùng AbortController

\`\`\`code
// ✅ Dùng khi dùng thư viện không support AbortController
useEffect(() => {
  let isCancelled = false

  async function load() {
    try {
      const data = await fetchUser(userId)
      if (!isCancelled) setUser(data) // chỉ set nếu chưa bị cancel
    } catch (err) {
      if (!isCancelled) setError(err.message)
    }
  }

  load()
  return () => { isCancelled = true }
}, [userId])
\`\`\`

### Fix 3: Race condition với parallel requests

\`\`\`code
// ❌ 2 fetch song song, update riêng lẻ → UI có thể render state không nhất quán
useEffect(() => {
  fetchUser(userId).then(setUser)
  fetchPosts(userId).then(setPosts)
  // posts về trước user → render posts nhưng user = null → crash
}, [userId])

// ✅ Đợi cả 2 xong rồi update cùng lúc
useEffect(() => {
  const controller = new AbortController()

  Promise.all([
    fetchUser(userId, { signal: controller.signal }),
    fetchPosts(userId, { signal: controller.signal })
  ]).then(([userData, postsData]) => {
    setUser(userData)   // React 18 tự batch 2 setState này
    setPosts(postsData) // → chỉ render 1 lần
  }).catch(err => {
    if (err.name !== 'AbortError') setError(err.message)
  })

  return () => controller.abort()
}, [userId])
\`\`\`

### Fix 4: Race condition với sequential requests

\`\`\`code
// Tình huống: request sau phụ thuộc kết quả request trước
// ❌ userId đổi giữa chừng → fetchOrders chạy với accountId cũ
useEffect(() => {
  fetchUser(userId).then(user => {
    fetchOrders(user.accountId).then(setOrders)
  })
}, [userId])

// ✅ Check isCancelled sau mỗi await
useEffect(() => {
  let isCancelled = false

  async function load() {
    const user = await fetchUser(userId)
    if (isCancelled) return // check sau mỗi async step

    const orders = await fetchOrders(user.accountId)
    if (isCancelled) return

    setOrders(orders)
  }

  load()
  return () => { isCancelled = true }
}, [userId])
\`\`\`

### Fix 5: Dùng React Query / SWR — giải pháp toàn diện

\`\`\`code
// ✅ React Query handle race condition, loading, error, cache, retry tự động
import { useQuery } from '@tanstack/react-query'

function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: ({ signal }) =>
      fetch(\`/api/users/\${userId}\`, { signal }).then(r => r.json())
    // AbortController được React Query tự inject vào queryFn
  })
}
\`\`\`

### So sánh các fix race condition

| | AbortController | isCancelled flag | React Query |
|---|---|---|---|
| **Thực sự cancel request** | ✅ | ❌ (request vẫn chạy) | ✅ |
| **Dễ dùng** | Trung bình | Dễ | Rất dễ |
| **Hỗ trợ sequential** | Cần kết hợp | ✅ tự nhiên | ✅ |
| **Cache / retry** | ❌ | ❌ | ✅ |
| **Khi nào dùng** | fetch thuần | axios cũ, custom | Dự án thật |

---

## 9. Function trong dependency array

### Vấn đề — function là object, mỗi render tạo reference mới

\`\`\`code
function Component() {
  // fetchData được tạo mới mỗi lần render → reference mới mỗi lần
  function fetchData() {
    return fetch(\`/api/users/\${userId}\`)
  }

  useEffect(() => {
    fetchData()
  }, [fetchData]) // ❌ fetchData mới mỗi render → effect chạy sau mỗi render → infinite loop
}
\`\`\`

Nếu **không khai báo** vào dependency:

\`\`\`code
useEffect(() => {
  fetchData() // ❌ stale closure — fetchData capture userId tại lúc tạo
}, [])        // userId đổi nhưng fetchData cũ vẫn dùng userId cũ
\`\`\`

Hai hướng đều có vấn đề. Có 4 cách giải quyết:

---

### Fix 1: Chuyển function vào trong effect — đơn giản nhất

\`\`\`code
// ✅ Function nằm trong effect → không cần khai báo dependency
// → eslint không cảnh báo, không stale closure
useEffect(() => {
  async function fetchData() {
    const data = await fetch(\`/api/users/\${userId}\`).then(r => r.json())
    setUser(data)
  }
  fetchData()
}, [userId]) // chỉ cần khai báo userId
\`\`\`

> **Đây là cách ưu tiên nhất** khi function chỉ dùng trong effect đó.

---

### Fix 2: useCallback — ổn định reference của function

\`\`\`code
// ✅ useCallback giữ nguyên reference nếu dependency không đổi
const fetchData = useCallback(async () => {
  const data = await fetch(\`/api/users/\${userId}\`).then(r => r.json())
  setUser(data)
}, [userId]) // fetchData chỉ thay đổi khi userId thay đổi

useEffect(() => {
  fetchData()
}, [fetchData]) // ✅ fetchData ổn định → effect không chạy liên tục
\`\`\`

> **Khi nào dùng useCallback?** Khi function cần dùng ở nhiều nơi (nhiều effect, truyền xuống component con), không chỉ trong 1 effect duy nhất.

---

### Fix 3: Chuyển function ra ngoài component — nếu không phụ thuộc state/props

\`\`\`code
// Function không dùng state/props → không bị stale, reference ổn định
async function fetchUser(userId) {
  return fetch(\`/api/users/\${userId}\`).then(r => r.json())
}

function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId]) // ✅ fetchUser là constant, không cần khai báo
}
\`\`\`

---

### Fix 4: useRef — khi function thay đổi thường xuyên nhưng không muốn trigger effect

\`\`\`code
// Ví dụ: callback từ props thay đổi mỗi render
function Component({ onDataLoad }) {
  const onDataLoadRef = useRef(onDataLoad)
  useEffect(() => {
    onDataLoadRef.current = onDataLoad
  }, [onDataLoad])

  useEffect(() => {
    fetchData().then(data => {
      onDataLoadRef.current(data) // ✅ luôn gọi callback mới nhất
    })
  }, []) // không cần onDataLoad trong dependency
}
\`\`\`

---

### Tóm tắt — Function trong dependency

\`\`\`
Function trong dependency array:
├── Khai báo vào → reference mới mỗi render → infinite loop
└── Không khai báo → stale closure

Fix theo thứ tự ưu tiên:
  1. Chuyển function vào trong effect       — đơn giản, không cần useCallback
  2. Kéo function ra ngoài component        — nếu không dùng state/props
  3. useCallback                            — function dùng ở nhiều nơi
  4. useRef                                 — callback từ props hay đổi
\`\`\`

---

## 10. Strict Mode và Double Invoke

### Strict Mode làm gì?

Trong development, React **Strict Mode** cố tình chạy effect **2 lần liên tiếp** ngay khi mount:

\`\`\`
Mount → Effect chạy → Cleanup → Effect chạy lại
\`\`\`

Mục đích: **phát hiện side effect không được cleanup đúng cách**. Nếu app hoạt động sai khi effect chạy 2 lần → đó là bug thật, không phải do Strict Mode.

\`\`\`code
// Strict Mode bật mặc định trong Create React App và Next.js
<React.StrictMode>
  <App />
</React.StrictMode>
\`\`\`

---

### Biểu hiện thường thấy

\`\`\`code
// ❌ Không cleanup — log 2 lần, connect 2 lần, fetch 2 lần
useEffect(() => {
  console.log('connected')
  const socket = io()
  socket.connect()
}, [])

// Strict Mode: "connected" xuất hiện 2 lần trong console
// → Không phải bug của Strict Mode, mà là bug thật: thiếu disconnect
\`\`\`

\`\`\`code
// ✅ Cleanup đúng → Strict Mode chạy 2 lần vẫn đúng
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
// → Kết quả cuối giống nhau: 1 connection active
\`\`\`

---

### Các tình huống hay bị ảnh hưởng

**API call bị gọi 2 lần:**

**Animation chạy 2 lần:**

**Third-party library khởi tạo 2 lần:**

---

### Strict Mode như một công cụ kiểm tra

\`\`\`
Strict Mode double invoke là tính năng, không phải bug.

Nếu app bị lỗi khi effect chạy 2 lần:
├── Effect tạo resource mà không cleanup               → thêm cleanup
├── Effect gọi API mà không cancel                     → dùng AbortController
└── Effect thay đổi state khiến cho output không nhất quán  → xem lại logic
\`\`\`

> **Rule of thumb:** Effect đúng phải **nhất quán** — chạy 1 lần hay 2 lần kết quả cuối cùng như nhau.

---

## 11. You Might Not Need an Effect

Đây là một trong những điều React docs nhấn mạnh nhất: **useEffect thường bị dùng sai chỗ**. Nhiều tình huống tưởng cần effect nhưng thực ra không cần.

---

### Tình huống 1: Tính toán từ state/props — dùng derived value

\`\`\`code
// ❌ Dùng effect để sync derived state
const [firstName, setFirstName] = useState('Nam')
const [lastName, setLastName] = useState('Nguyen')
const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(\`\${firstName} \${lastName}\`) // thừa hoàn toàn
}, [firstName, lastName])

// ✅ Tính thẳng trong render — không cần effect, không cần state thêm
const fullName = \`\${firstName} \${lastName}\`
\`\`\`

---

### Tình huống 2: Reset state khi props thay đổi — dùng key

\`\`\`code
// ❌ Effect để reset form khi userId thay đổi
function ProfileForm({ userId }) {
  const [name, setName] = useState('')

  useEffect(() => {
    setName('') // reset khi userId đổi
  }, [userId])
}

// ✅ Dùng key — React tự unmount & remount, state tự reset
function ProfilePage({ userId }) {
  return <ProfileForm key={userId} userId={userId} />
}
\`\`\`

---

### Tình huống 3: Xử lý event — dùng event handler

\`\`\`code
// ❌ Effect để theo dõi hành động của user
const [submitted, setSubmitted] = useState(false)

useEffect(() => {
  if (submitted) {
    sendAnalytics('form_submitted') // đây là reaction với event, không phải sync
    setSubmitted(false)
  }
}, [submitted])

// ✅ Xử lý thẳng trong event handler
function handleSubmit() {
  sendAnalytics('form_submitted') // ✅ rõ ràng, đơn giản hơn nhiều
  submitForm()
}
\`\`\`

---

### Tình huống 4: Fetch data dựa trên user action — event handler

\`\`\`code
// ❌ Effect để fetch khi search query thay đổi do user gõ
const [query, setQuery] = useState('')

useEffect(() => {
  if (query) fetchResults(query).then(setResults)
}, [query])

// Vẫn chấp nhận được với debounce, nhưng cân nhắc:
// ✅ Với React Query, fetch thẳng trong event hoặc dùng enabled flag
const { data } = useQuery({
  queryKey: ['search', query],
  queryFn: () => fetchResults(query),
  enabled: query.length > 0 // chỉ fetch khi có query
})
\`\`\`

---

### Tình huống 5: Gửi request khi submit — event handler

\`\`\`code
// ❌ Effect để gửi form
const [shouldSubmit, setShouldSubmit] = useState(false)

useEffect(() => {
  if (shouldSubmit) {
    submitForm(formData)
    setShouldSubmit(false)
  }
}, [shouldSubmit])

// ✅ Gửi thẳng trong handler
async function handleSubmit(e) {
  e.preventDefault()
  await submitForm(formData)
}
\`\`\`

---

### Tình huống 6: Subscribe external store — dùng useSyncExternalStore

\`\`\`code
// ❌ Dùng effect để subscribe store bên ngoài
const [windowWidth, setWindowWidth] = useState(window.innerWidth)

useEffect(() => {
  const handler = () => setWindowWidth(window.innerWidth)
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])

// ✅ useSyncExternalStore — built-in cho use case này
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

### Bảng tổng hợp — Cần effect hay không?

| Tình huống | Dùng Effect? | Thay bằng |
|---|---|---|
| Tính từ state/props | ❌ | Derived value trong render |
| Reset state khi prop đổi | ❌ | \`key\` prop |
| Xử lý user event | ❌ | Event handler |
| Fetch khi submit | ❌ | Event handler |
| Fetch khi mount / prop đổi | ✅ | Effect hoặc React Query |
| Subscribe external store | ⚠️ | \`useSyncExternalStore\` tốt hơn |
| Sync với DOM / thư viện ngoài | ✅ | Effect |
| Timer / interval | ✅ | Effect + cleanup |
| WebSocket / real-time | ✅ | Effect + cleanup |

---

## 12. Tóm tắt mental model

\`\`\`
useEffect là "cầu nối" giữa React và thế giới bên ngoài

Câu hỏi trước khi dùng:
├── Tính được từ state/props?               → Derived value, không cần effect
├── React với user event?                   → Event handler, không cần effect
├── Reset state khi prop đổi?               → key prop, không cần effect
├── Cần sync với thứ gì bên ngoài React?    → useEffect ✅
├── Dependency array:
│   ├── []         → chỉ mount/unmount
│   ├── [a, b]     → sync khi a hoặc b thay đổi
│   └── không có   → sau mỗi render (hiếm khi cần)
├── Dùng function trong effect?
│   ├── Chỉ dùng trong effect    → chuyển function vào trong effect
│   ├── Dùng nhiều nơi           → useCallback
│   └── Không dùng state/props   → kéo ra ngoài component
├── Tạo resource (listener, timer, request)?  → phải có cleanup
├── Có async operation?                       → coi chừng race condition
│   ├── fetch thuần    → AbortController
│   ├── custom promise → isCancelled flag
│   └── dự án thật     → React Query / SWR
├── Đọc state trong effect?                   → coi chừng stale closure
│   ├── Chỉ update state       → functional update (prev =>)
│   ├── Cần đọc nhiều giá trị  → useRef escape hatch
│   └── Phụ thuộc nhiều giá trị → thêm đúng dependency
└── Effect chạy 2 lần (Strict Mode)?
    → Đây là bug thật, không phải do Strict Mode
    → Thêm cleanup để idempotent
\`\`\`

\`\`\`
useEffect là "cầu nối" giữa React và thế giới bên ngoài

Câu hỏi trước khi dùng:
├── Cần sync với thứ gì bên ngoài React?     → useEffect
├── Dependency array:
│   ├── []         → chỉ mount/unmount
│   ├── [a, b]     → sync khi a hoặc b thay đổi
│   └── không có   → sau mỗi render (hiếm khi cần)
├── Tạo resource (listener, timer, request)?  → phải có cleanup
├── Có async operation?                       → coi chừng race condition
│   ├── fetch thuần    → AbortController
│   ├── custom promise → isCancelled flag
│   └── dự án thật     → React Query / SWR
└── Đọc state trong effect?                   → coi chừng stale closure
    ├── Chỉ update state    → functional update (prev =>)
    ├── Cần đọc nhiều giá trị → useRef escape hatch
    └── Phụ thuộc nhiều giá trị → thêm đúng dependency
\`\`\``,
      code: `// AbortController — fix race condition chuẩn
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
// Khi userId đổi:
//   1. controller.abort() → request cũ bị cancel
//   2. Effect mới chạy → request mới`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
