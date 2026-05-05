import type { PrinciplesPost } from '@/lib/types'

const ccp: PrinciplesPost = {
  slug: 'ccp',
  title: 'CCP — Common Component Principles',
  description:
    'Bộ 8 tiêu chí thiết kế dành riêng cho Common Component trong hệ thống React, lấy cảm hứng từ OOP.',
  publishedAt: '2026-05-05',
  origin: `Xây dựng common component về bản chất giống OOP ở **tư tưởng**:

| Khái niệm OOP | Tương đương React |
|---|---|
| Class | Component |
| Method | Props / Callbacks |
| Interface | Prop Types / API |
| Inheritance | Composition |

Tuy nhiên React *bắt buộc* bạn đi theo hướng **Composition (thành phần) hơn là Inheritance (kế thừa)** ngay từ đầu — đây vừa là điểm giống, vừa là điểm tiến hóa so với OOP kinh điển.`,
  principles: [
    {
      number: 1,
      name: 'Encapsulation',
      tagline: 'Bên ngoài không cần biết bên trong',
      oopOrigin: '✅ Trực tiếp',
      explanation:
        'Internal state và logic xử lý phải được giấu đi. Người dùng component chỉ tương tác qua props như một public interface.',
      violationSign:
        'Phải đọc source mới dùng được, hoặc phải truyền quá nhiều props nội bộ ra ngoài.',
      language: 'tsx',
      summaryQuestion: 'Caller có phải biết internal logic không?',
      badCode: `// Lộ internal state ra ngoài, caller phải tự quản lý
const Dropdown = ({ isOpen, setIsOpen, selectedIndex, setSelectedIndex, options }) => {
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && options.map((opt, i) => (
        <div
          key={opt.value}
          className={i === selectedIndex ? 'selected' : ''}
          onClick={() => { setSelectedIndex(i); setIsOpen(false) }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  )
}

// Caller phải tự giữ state
const [isOpen, setIsOpen] = useState(false)
const [selectedIndex, setSelectedIndex] = useState(-1)
<Dropdown
  isOpen={isOpen}
  setIsOpen={setIsOpen}
  selectedIndex={selectedIndex}
  setSelectedIndex={setSelectedIndex}
  options={options}
/>`,
      goodCode: `// Internal state được đóng gói, caller chỉ cần biết value
const Dropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex(o => o.value === value)
  )

  const handleSelect = (option, index) => {
    setSelectedIndex(index)
    setIsOpen(false)
    onChange?.(option.value)
  }

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>Toggle</button>
      {isOpen && options.map((opt, i) => (
        <div
          key={opt.value}
          className={i === selectedIndex ? 'selected' : ''}
          onClick={() => handleSelect(opt, i)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  )
}

// Caller chỉ cần quan tâm value
<Dropdown options={options} value={selected} onChange={setSelected} />`,
    },
    {
      number: 2,
      name: 'Single Responsibility',
      tagline: 'Một component, một việc',
      oopOrigin: '✅ Trực tiếp (SOLID)',
      explanation: 'Component chỉ giải quyết một vấn đề UI/UX cụ thể.',
      violationSign:
        'Tên component có chữ "And", hoặc component vừa fetch data vừa render vừa xử lý logic nghiệp vụ.',
      language: 'tsx',
      summaryQuestion: 'Component đang làm mấy việc?',
      badCode: `// Một component làm quá nhiều thứ
const UserProfileAndSettings = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`).then(r => r.json()).then(setUser)
    fetch(\`/api/settings/\${userId}\`).then(r => r.json()).then(setSettings)
  }, [userId])

  const handleSave = async () => {
    await fetch(\`/api/settings/\${userId}\`, { method: 'PUT', body: JSON.stringify(settings) })
    await fetch(\`/api/users/\${userId}\`, { method: 'PUT', body: JSON.stringify(user) })
  }

  return (
    <div>
      <h1>{user?.name}</h1>
      <img src={user?.avatar} />
      <input
        value={settings?.theme}
        onChange={e => setSettings({ ...settings, theme: e.target.value })}
      />
      <button onClick={handleSave}>Save All</button>
    </div>
  )
}`,
      goodCode: `// Tách theo đúng trách nhiệm
const Avatar = ({ src, alt, size = 'md' }) => (
  <img src={src} alt={alt} className={\`avatar avatar--\${size}\`} />
)

const UserProfile = ({ name, avatar }) => (
  <div className="user-profile">
    <Avatar src={avatar} alt={name} />
    <h1>{name}</h1>
  </div>
)

const ThemeSelector = ({ value, onChange }) => (
  <select value={value} onChange={e => onChange(e.target.value)}>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
)

// Composition ở tầng page/feature
const SettingsPage = ({ userId }) => {
  const { user } = useUser(userId)
  const { settings, save } = useSettings(userId)

  return (
    <div>
      <UserProfile name={user.name} avatar={user.avatar} />
      <ThemeSelector value={settings.theme} onChange={theme => save({ theme })} />
    </div>
  )
}`,
    },
    {
      number: 3,
      name: 'Stable Interface',
      tagline: 'Props như một contract',
      oopOrigin: '✅ Trực tiếp',
      explanation:
        'Props phải rõ ràng, có type đầy đủ, tên tự mô tả. Một khi đã publish, thay đổi breaking phải có deprecation warning.',
      violationSign:
        'Props tên là data, config, options không rõ nghĩa. Thay đổi props mà không báo trước.',
      language: 'tsx',
      summaryQuestion: 'Props có tự mô tả được không?',
      badCode: `// Props mơ hồ, không tự mô tả
interface BadButtonProps {
  data: any
  config: object
  handler: Function
  type2: string
  flag: boolean
}

const Button = ({ data, config, handler, type2, flag }: BadButtonProps) => {
  return (
    <button
      style={config as React.CSSProperties}
      disabled={flag}
      onClick={() => handler(data)}
      type={type2 as React.ButtonHTMLAttributes<HTMLButtonElement>['type']}
    >
      {data.label}
    </button>
  )
}`,
      goodCode: `// Props rõ ràng, typed đầy đủ, tự mô tả
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={\`btn btn--\${variant} btn--\${size}\`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}`,
    },
    {
      number: 4,
      name: 'Composability',
      tagline: 'Lắp ghép được',
      oopOrigin: '✅ Biến thể',
      explanation:
        'Component không tự giả định context xung quanh nó là gì. Hỗ trợ children, slots, hoặc render props khi cần mở rộng.',
      violationSign:
        'Component tự hardcode layout cha, tự fetch data, tự gọi store, không nhận children.',
      language: 'tsx',
      summaryQuestion: 'Component có giả định môi trường xung quanh không?',
      badCode: `// Component giả định quá nhiều về môi trường xung quanh
const UserCard = ({ userId }) => {
  const user = useSelector(state => state.users[userId])

  return (
    // Hardcode layout cố định, không thể tái dùng ở context khác
    <div style={{ width: 300, margin: '0 auto', border: '1px solid #ccc' }}>
      <img src={user.avatar} style={{ width: '100%' }} />
      <div style={{ padding: 16 }}>
        <h3>{user.name}</h3>
        <p>{user.bio}</p>
        <button onClick={() => store.dispatch(followUser(userId))}>Follow</button>
      </div>
    </div>
  )
}`,
      goodCode: `// Component nhận data qua props, layout linh hoạt, hỗ trợ composition
interface UserCardProps {
  avatar: string
  name: string
  bio?: string
  className?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
}

const UserCard = ({ avatar, name, bio, className, actions, footer }: UserCardProps) => {
  return (
    <div className={cn('user-card', className)}>
      <img src={avatar} alt={name} className="user-card__avatar" />
      <div className="user-card__body">
        <h3>{name}</h3>
        {bio && <p>{bio}</p>}
        {actions && <div className="user-card__actions">{actions}</div>}
      </div>
      {footer && <div className="user-card__footer">{footer}</div>}
    </div>
  )
}

// Caller quyết định context và behavior
<UserCard
  avatar={user.avatar}
  name={user.name}
  bio={user.bio}
  actions={<Button onClick={() => follow(user.id)}>Follow</Button>}
/>`,
    },
    {
      number: 5,
      name: 'Extensibility',
      tagline: 'Mở rộng được, không cần sửa',
      oopOrigin: '✅ Trực tiếp (Open/Closed)',
      explanation:
        'Có thể override style, inject behavior qua props mà không cần vào sửa source component.',
      violationSign:
        'Muốn thêm icon hoặc thay đổi style nhỏ thì phải fork hoặc sửa component gốc.',
      language: 'tsx',
      summaryQuestion: 'Muốn mở rộng có phải sửa source không?',
      badCode: `// Không thể extend, mọi thay đổi đều phải sửa source
const Alert = ({ message, type }) => {
  const colors = { success: 'green', error: 'red', warning: 'orange' }

  return (
    // style hardcode, không nhận className, không có slot cho icon
    <div style={{ background: colors[type], padding: 12, borderRadius: 4 }}>
      <span>{message}</span>
    </div>
  )
}

// Muốn thêm icon?       → phải sửa source
// Muốn thêm close button? → phải sửa source
// Muốn dùng trong Toast?  → phải fork`,
      goodCode: `// Có thể extend mà không cần sửa source
interface AlertProps {
  message: React.ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  icon?: React.ReactNode
  onClose?: () => void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const Alert = ({ message, type = 'info', icon, onClose, className, style, children }: AlertProps) => {
  return (
    <div className={cn('alert', \`alert--\${type}\`, className)} style={style} role="alert">
      {icon && <span className="alert__icon">{icon}</span>}
      <div className="alert__content">
        <span>{message}</span>
        {children}
      </div>
      {onClose && (
        <button className="alert__close" onClick={onClose} aria-label="Close">×</button>
      )}
    </div>
  )
}

// Extend không cần sửa source
<Alert
  type="success"
  message="Lưu thành công"
  icon={<CheckCircleIcon />}
  onClose={() => setVisible(false)}
  className="alert--compact"
/>`,
    },
    {
      number: 6,
      name: 'Predictability',
      tagline: 'Cùng input → cùng output',
      oopOrigin: '✅ Gián tiếp (pure function)',
      explanation:
        'Với cùng props, component luôn render ra kết quả nhất quán. Không có side effect ẩn.',
      violationSign:
        'Component tự gọi API bên trong, tự mutate global state, kết quả render phụ thuộc vào thời điểm gọi.',
      language: 'tsx',
      summaryQuestion: 'Cùng props luôn ra cùng UI không?',
      badCode: `// Component tự fetch, kết quả phụ thuộc vào network và thời điểm render
const PriceTag = ({ productId }) => {
  const [price, setPrice] = useState(null)

  // Side effect ẩn — caller không thể kiểm soát hay predict kết quả
  useEffect(() => {
    fetch(\`/api/products/\${productId}/price\`)
      .then(r => r.json())
      .then(data => setPrice(data.price))
  }, [productId])

  // Cùng productId nhưng render khác nhau tùy thời điểm
  return <span>{price ? \`\${price}đ\` : 'Đang tải...'}</span>
}`,
      goodCode: `// Component thuần UI, cùng props luôn cùng output
interface PriceTagProps {
  price: number | null
  currency?: string
  loading?: boolean
  discountPercent?: number
}

const PriceTag = ({ price, currency = 'đ', loading = false, discountPercent }: PriceTagProps) => {
  if (loading) return <Skeleton width={80} />
  if (price === null) return null

  const discounted = discountPercent ? price * (1 - discountPercent / 100) : price

  return (
    <span className="price-tag">
      {discounted.toLocaleString()}{currency}
      {discountPercent && (
        <s className="price-tag__original">{price.toLocaleString()}{currency}</s>
      )}
    </span>
  )
}

// Data fetching nằm ở ngoài — tách biệt hoàn toàn
const { price, loading } = useProductPrice(productId)
<PriceTag price={price} loading={loading} discountPercent={10} />`,
    },
    {
      number: 7,
      name: 'Testability',
      tagline: 'Có thể kiểm chứng độc lập',
      oopOrigin: '✅ Gián tiếp',
      explanation:
        'Component có thể render và assert mà không cần mock quá nhiều thứ. Mọi trạng thái UI đều có thể trigger qua props.',
      violationSign:
        'Muốn test một trạng thái nhỏ thì phải setup cả store, mock API, wrap nhiều layer Provider.',
      language: 'tsx',
      summaryQuestion: 'Test được mà không cần mock nhiều không?',
      badCode: `// Không thể test độc lập
const SubmitButton = () => {
  const { isSubmitting, isValid } = useFormContext()  // coupled với Form context
  const { user } = useAuthStore()                    // coupled với global store
  const { t } = useTranslation()                     // coupled với i18n

  const handleClick = async () => {
    await submitFormToAPI()  // side effect ẩn
  }

  return (
    <button disabled={!isValid || isSubmitting || !user}>
      {isSubmitting ? t('submitting') : t('submit')}
    </button>
  )
}

// Test phải setup: FormProvider + AuthStore + i18n + mock API`,
      goodCode: `// Test được ngay, mọi trạng thái đều kiểm soát được qua props
interface SubmitButtonProps {
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

const SubmitButton = ({
  loading = false,
  disabled = false,
  onClick,
  children = 'Submit',
}: SubmitButtonProps) => (
  <button disabled={disabled || loading} onClick={onClick} type="submit">
    {loading ? <Spinner size="sm" /> : children}
  </button>
)

// Test cực kỳ đơn giản
it('renders loading state', () => {
  render(<SubmitButton loading />)
  expect(screen.getByRole('button')).toBeDisabled()
  expect(screen.getByTestId('spinner')).toBeInTheDocument()
})

it('calls onClick when clicked', async () => {
  const onClick = vi.fn()
  render(<SubmitButton onClick={onClick}>Save</SubmitButton>)
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalledOnce()
})`,
    },
    {
      number: 8,
      name: 'Accessibility',
      tagline: 'Dùng được cho mọi người',
      oopOrigin: '⚡ Mở rộng thêm',
      explanation:
        'Component hoạt động đúng không chỉ với chuột mà còn với keyboard và screen reader. Đây là phần của interface contract — cam kết với người dùng cuối.',
      violationSign:
        'Dùng <div onClick> thay vì semantic element, thiếu ARIA attribute, không quản lý focus.',
      language: 'tsx',
      summaryQuestion: 'Keyboard và screen reader dùng được không?',
      badCode: `// Không accessible
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    // div không có role, không trap focus, không có aria attributes
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ background: 'white', padding: 24 }}>
        {/* không phải button, không focusable bằng keyboard */}
        <div onClick={onClose} style={{ cursor: 'pointer' }}>✕</div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}`,
      goodCode: `// Accessible đầy đủ
const Modal = ({ isOpen, onClose, title, children, id }: ModalProps) => {
  const titleId = \`\${id}-title\`
  const contentRef = useRef<HTMLDivElement>(null)

  useFocusTrap(contentRef, isOpen)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content" ref={contentRef}>
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng modal"
            className="modal-close"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}`,
    },
  ],
  usage: `### Khi thiết kế component mới

Trước khi viết code, tự hỏi:

- Component này làm đúng một việc chưa?
- Props có đủ rõ ràng để người khác dùng không cần đọc source không?
- Internal state có bị lộ ra ngoài không?
- Có thể extend mà không cần sửa source không?
- Mọi trạng thái UI có thể control qua props không?
- Có thể lắp vào nhiều context khác nhau không?
- Keyboard và screen reader có dùng được không?

### Khi review PR

Hỏi component đang vi phạm tiêu chí nào, không phải "code viết thế này đúng không".

### Khi refactor

Dùng như bộ chẩn đoán — component đang "bệnh" ở tiêu chí nào thì refactor từ đó.`,
  foreword: `Bạn đã bao giờ ngồi thiết kế một component rồi tự hỏi:

- Thế nào là một component *tốt*, thế nào là một component *xấu*?
- Có tiêu chuẩn nào cho việc thiết kế component không?

Tôi cũng đã tự hỏi bản thân những câu đó rất nhiều lần.

Sau nhiều năm lập trình và xây dựng không ít component dùng chung, tôi dần hình thành một cảm giác: cái này nên làm thế này, cái kia không nên làm thế kia. Nhưng nó chỉ dừng lại ở cảm giác — mơ hồ, không rõ ràng, và chẳng thể diễn đạt thành lời.

Tôi cũng đã thử tìm kiếm các tiêu chuẩn có sẵn. SOLID chẳng hạn — tôi từng áp dụng, nhưng nó quá mờ nhạt và không thực sự phù hợp với bản chất của React. Rồi một lần tình cờ đọc lại về OOP, tôi chợt nhận ra: nhiều nguyên tắc trong đó trùng khớp đến lạ với những ý tưởng đang tồn tại lơ lửng trong đầu mình.

Đó là lúc tôi quyết định xây dựng một bộ tiêu chuẩn riêng — lấy cảm hứng từ OOP nhưng được điều chỉnh để phù hợp với cách thiết kế component trong React.

Về bản chất, OOP hướng đến *tính kế thừa* còn React hướng đến *thành phần (composition)*. Hai cách tiếp cận khác nhau, nhưng đều có chung một mục tiêu: **tái sử dụng**. Đó là điểm giao nhau mà tôi muốn khai thác.

---

**Một vài lưu ý:**

- Bộ tiêu chuẩn này chỉ áp dụng cho **component dùng chung (common component)**, không phải toàn bộ component trong React.
- Tôi chỉ là một lập trình viên bình thường, không phải chuyên gia — nên đôi chỗ có thể chưa chính xác hoàn toàn. Nếu bạn có góc nhìn khác, rất mong được nghe ý kiến từ bạn.`,
}

export default ccp
