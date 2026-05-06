import type { PrinciplesPost } from '@/lib/types'

const ccp: PrinciplesPost = {
  slug: 'ccp',
  title: 'CCP — Common Component Principles',
  description:
    'A set of 8 design criteria specifically for Common Components in a React system, inspired by OOP.',
  publishedAt: '2026-05-05',
  origin: `Building a common component is fundamentally similar to OOP in **spirit**:

| OOP Concept | React Equivalent |
|---|---|
| Class | Component |
| Method | Props / Callbacks |
| Interface | Prop Types / API |
| Inheritance | Composition |

However React *forces* you to lean toward **Composition over Inheritance** from the start — this is both a similarity and an evolution compared to classical OOP.`,
  principles: [
    {
      number: 1,
      name: 'Encapsulation',
      tagline: "What's inside stays inside",
      oopOrigin: '✅ Direct',
      explanation:
        'Internal state and logic must be hidden. Component consumers only interact through props as a public interface.',
      violationSign:
        'Must read source to use it, or too many internal props are exposed to the outside.',
      language: 'tsx',
      summaryQuestion: 'Does the caller need to know internal logic?',
      badCode: `// Exposes internal state, caller must manage it
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

// Caller must hold state themselves
const [isOpen, setIsOpen] = useState(false)
const [selectedIndex, setSelectedIndex] = useState(-1)
<Dropdown
  isOpen={isOpen}
  setIsOpen={setIsOpen}
  selectedIndex={selectedIndex}
  setSelectedIndex={setSelectedIndex}
  options={options}
/>`,
      goodCode: `// Internal state is encapsulated, caller only needs to know value
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

// Caller only needs to care about value
<Dropdown options={options} value={selected} onChange={setSelected} />`,
    },
    {
      number: 2,
      name: 'Single Responsibility',
      tagline: 'One component, one job',
      oopOrigin: '✅ Direct (SOLID)',
      explanation: 'A component solves only one specific UI/UX problem.',
      violationSign:
        'Component name contains "And", or the component fetches data AND renders AND handles business logic.',
      language: 'tsx',
      summaryQuestion: 'How many things is this component doing?',
      badCode: `// One component doing too many things
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
      goodCode: `// Split by proper responsibility
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

// Composition at page/feature level
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
      tagline: 'Props as a contract',
      oopOrigin: '✅ Direct',
      explanation:
        'Props must be clear, fully typed, with self-describing names. Once published, breaking changes require a deprecation warning.',
      violationSign:
        'Props named `data`, `config`, `options` with unclear meaning. Changing props without prior notice.',
      language: 'tsx',
      summaryQuestion: 'Are the props self-describing?',
      badCode: `// Vague props, not self-describing
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
      goodCode: `// Clear, fully typed, self-describing props
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
      tagline: 'Composable',
      oopOrigin: '✅ Variant',
      explanation:
        'The component does not assume what context surrounds it. Supports children, slots, or render props when extensibility is needed.',
      violationSign:
        'Component hardcodes parent layout, fetches its own data, calls store directly, does not accept children.',
      language: 'tsx',
      summaryQuestion: 'Does the component assume its surrounding environment?',
      badCode: `// Component assumes too much about its environment
const UserCard = ({ userId }) => {
  const user = useSelector(state => state.users[userId])

  return (
    // Fixed hardcoded layout, cannot be reused in other contexts
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
      goodCode: `// Component receives data via props, flexible layout, supports composition
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

// Caller decides context and behavior
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
      tagline: 'Extend without modifying',
      oopOrigin: '✅ Direct (Open/Closed)',
      explanation:
        'Can override styles, inject behavior through props without needing to modify the component source.',
      violationSign:
        'To add an icon or change a small style, you have to fork or modify the original component.',
      language: 'tsx',
      summaryQuestion: 'Does extending it require editing the source?',
      badCode: `// Cannot be extended, all changes require editing source
const Alert = ({ message, type }) => {
  const colors = { success: 'green', error: 'red', warning: 'orange' }

  return (
    // hardcoded style, no className support, no icon slot
    <div style={{ background: colors[type], padding: 12, borderRadius: 4 }}>
      <span>{message}</span>
    </div>
  )
}

// Want to add an icon?        → must edit source
// Want to add a close button? → must edit source
// Want to use in a Toast?     → must fork`,
      goodCode: `// Can extend without editing source
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

// Extend without editing source
<Alert
  type="success"
  message="Saved successfully"
  icon={<CheckCircleIcon />}
  onClose={() => setVisible(false)}
  className="alert--compact"
/>`,
    },
    {
      number: 6,
      name: 'Predictability',
      tagline: 'Same input → same output',
      oopOrigin: '✅ Indirect (pure function)',
      explanation:
        'With the same props, the component always renders consistently. No hidden side effects.',
      violationSign:
        'Component fetches its own data, mutates global state, render result depends on when it is called.',
      language: 'tsx',
      summaryQuestion: 'Do the same props always produce the same UI?',
      badCode: `// Component self-fetches, result depends on network and render timing
const PriceTag = ({ productId }) => {
  const [price, setPrice] = useState(null)

  // Hidden side effect — caller cannot control or predict result
  useEffect(() => {
    fetch(\`/api/products/\${productId}/price\`)
      .then(r => r.json())
      .then(data => setPrice(data.price))
  }, [productId])

  // Same productId but different renders depending on timing
  return <span>{price ? \`\${price}đ\` : 'Loading...'}</span>
}`,
      goodCode: `// Pure UI component, same props always same output
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

// Data fetching is outside — fully separated
const { price, loading } = useProductPrice(productId)
<PriceTag price={price} loading={loading} discountPercent={10} />`,
    },
    {
      number: 7,
      name: 'Testability',
      tagline: 'Independently verifiable',
      oopOrigin: '✅ Indirect',
      explanation:
        'The component can render and be asserted without mocking too many things. Every UI state can be triggered via props.',
      violationSign:
        'To test a small state, you must set up an entire store, mock APIs, wrap many Provider layers.',
      language: 'tsx',
      summaryQuestion: 'Can it be tested without heavy mocking?',
      badCode: `// Cannot be tested independently
const SubmitButton = () => {
  const { isSubmitting, isValid } = useFormContext()  // coupled with Form context
  const { user } = useAuthStore()                    // coupled with global store
  const { t } = useTranslation()                     // coupled with i18n

  const handleClick = async () => {
    await submitFormToAPI()  // hidden side effect
  }

  return (
    <button disabled={!isValid || isSubmitting || !user}>
      {isSubmitting ? t('submitting') : t('submit')}
    </button>
  )
}

// Test requires setup: FormProvider + AuthStore + i18n + mock API`,
      goodCode: `// Testable immediately, every state controllable via props
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

// Extremely simple tests
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
      tagline: 'Usable by everyone',
      oopOrigin: '⚡ Additional extension',
      explanation:
        'The component works correctly not just with a mouse but also with keyboard and screen reader. This is part of the interface contract — a commitment to the end user.',
      violationSign:
        'Uses `<div onClick>` instead of semantic elements, missing ARIA attributes, no focus management.',
      language: 'tsx',
      summaryQuestion: 'Can keyboard and screen reader users interact with it?',
      badCode: `// Not accessible
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    // div has no role, no focus trap, no aria attributes
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ background: 'white', padding: 24 }}>
        {/* not a button, not keyboard focusable */}
        <div onClick={onClose} style={{ cursor: 'pointer' }}>✕</div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}`,
      goodCode: `// Fully accessible
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
            aria-label="Close modal"
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
  usage: `### When designing a new component

Before writing code, ask yourself:

- Does this component do exactly one thing?
- Are the props clear enough for others to use without reading the source?
- Is internal state exposed to the outside?
- Can it be extended without modifying the source?
- Can every UI state be controlled via props?
- Can it be plugged into different contexts?
- Can keyboard and screen reader users interact with it?

### When reviewing PRs

Ask which criterion the component is violating, not "is the code written correctly".

### When refactoring

Use as a diagnostic tool — identify which criterion the component is "failing" at, then refactor from there.`,
  foreword: `Have you ever sat down to design a component and asked yourself:

- What makes a component *good*, and what makes it *bad*?
- Is there any standard for designing components?

I've asked myself those questions many times.

After years of programming and building no small number of shared components, I gradually formed a sense: this should be done this way, that shouldn't be done that way. But it remained just a feeling — vague, unclear, and impossible to articulate.

I also tried looking for existing standards. SOLID, for instance — I once applied it, but it was too abstract and didn't really fit the nature of React. Then one day while re-reading about OOP, I suddenly realized: many of its principles align surprisingly well with ideas that had been floating around in my head.

That's when I decided to build my own set of criteria — inspired by OOP but adjusted to fit the way components are designed in React.

At its core, OOP is oriented toward *inheritance* while React is oriented toward *composition*. Two different approaches, but with a shared goal: **reusability**. That's the intersection I wanted to explore.

---

**A few notes:**

- This set of criteria only applies to **shared (common) components**, not all components in React.
- I'm just an ordinary developer, not an expert — so some parts may not be entirely accurate. If you have a different perspective, I'd love to hear from you.`,
}

export default ccp
