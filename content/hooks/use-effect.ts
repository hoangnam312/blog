import type { Article } from '@/lib/types'

const article: Article = {
  slug: 'use-effect',
  title: 'useEffect Hook',
  description:
    'Hiểu cách useEffect đồng bộ component với hệ thống bên ngoài, dependency array, cleanup function và các pitfall thường gặp.',
  category: 'hooks',
  publishedAt: '2024-01-22',
  levels: [
    {
      badge: 'Cơ bản',
      explanation: `## useEffect là gì?

\`useEffect\` cho phép bạn **đồng bộ** component với các hệ thống bên ngoài — API, DOM trực tiếp, subscriptions, timers, v.v.

### Dependency array

- **Không truyền** → chạy sau mỗi render.
- **\`[]\`** → chỉ chạy một lần sau lần render đầu (mount).
- **\`[a, b]\`** → chạy lại khi \`a\` hoặc \`b\` thay đổi.

### Cleanup function

Trả về một hàm từ effect để React gọi khi component **unmount** hoặc trước lần chạy tiếp theo. Dùng để huỷ subscription, clearInterval, clearTimeout, v.v.`,
      code: `import { useState, useEffect } from 'react'

export default function DataFetcher({ userId }: { userId: number }) {
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setUser(data)
      })

    return () => {
      cancelled = true // cleanup: ignore stale response
    }
  }, [userId]) // re-run khi userId thay đổi

  if (!user) return <p>Loading…</p>
  return <p>Hello, {user.name}</p>
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
    return () => clearInterval(id); // cleanup
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
      explanation: `## Stale closure và dependencies đúng

### Stale closure

Effect "đóng gói" (closes over) các biến tại thời điểm render. Nếu bạn không khai báo đủ dependency, effect sẽ dùng **giá trị cũ** của biến từ lần render trước — đây là stale closure.

ESLint rule \`react-hooks/exhaustive-deps\` giúp phát hiện vấn đề này.

### Tránh infinite loop

Nếu effect cập nhật state và state đó nằm trong dependency array, bạn sẽ tạo vòng lặp vô hạn. Giải pháp: dùng **functional update** để loại bỏ dependency không cần thiết.`,
      code: `// ❌ Stale closure: count luôn là 0
useEffect(() => {
  const id = setInterval(() => {
    console.log(count) // luôn log 0!
    setCount(count + 1)
  }, 1000)
  return () => clearInterval(id)
}, []) // thiếu count trong deps

// ✅ Functional update — không cần count trong deps
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1) // luôn dùng giá trị mới nhất
  }, 1000)
  return () => clearInterval(id)
}, []) // deps rỗng là đúng vì không đọc count trực tiếp

// ❌ Infinite loop
useEffect(() => {
  setData([...data, newItem]) // thay đổi data → re-run → lặp vô hạn
}, [data])

// ✅ Dùng functional update
useEffect(() => {
  setData(prev => [...prev, newItem])
}, [newItem]) // chỉ re-run khi newItem thay đổi`,
      language: 'tsx',
      showLivePreview: false,
    },
    {
      badge: 'Nâng cao',
      explanation: `## AbortController và StrictMode

### AbortController

Khi fetch data trong useEffect, component có thể unmount trước khi request hoàn thành. Dùng \`AbortController\` để **huỷ request** thực sự thay vì chỉ bỏ qua kết quả.

### Tại sao effect chạy hai lần trong StrictMode?

React 18 StrictMode chạy effect **hai lần** trong development để phát hiện các side effect không được cleanup đúng. Đây là tính năng cố ý — nếu app của bạn bị lỗi, có nghĩa là cleanup function chưa đúng.

Production build sẽ chạy effect **một lần** như thường.`,
      code: `useEffect(() => {
  const controller = new AbortController()

  async function fetchUser() {
    try {
      const res = await fetch(\`/api/users/\${userId}\`, {
        signal: controller.signal,
      })
      const data = await res.json()
      setUser(data)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('Failed to fetch')
    }
  }

  fetchUser()

  return () => controller.abort() // huỷ request khi unmount
}, [userId])

// StrictMode: effect chạy 2 lần trong dev
// Mount → run effect
// "Unmount" (ảo) → run cleanup
// Remount → run effect lại
// → Cleanup phải hoàn tác mọi thứ effect đã làm`,
      language: 'tsx',
      showLivePreview: false,
    },
  ],
}

export default article
