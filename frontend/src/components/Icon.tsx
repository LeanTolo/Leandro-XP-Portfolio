import { useId } from 'react'

export type IconName =
  | 'computer'
  | 'folder'
  | 'browser'
  | 'terminal'
  | 'recycle'
  | 'lab'
  | 'games'
  | 'user'
  | 'logo'
  | 'power'
  | 'speaker'
  | 'speakerOff'

interface IconProps {
  name: IconName
  size?: number
}

/**
 * Iconos SVG originales con look "Luna" (gradientes, brillo, contorno suave).
 * No son assets de Microsoft. Cada icono usa ids únicos (useId) para que los
 * gradientes no colisionen cuando hay varios en pantalla.
 */
export function Icon({ name, size = 32 }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const g = (n: string) => `${uid}-${n}`
  const url = (n: string) => `url(#${g(n)})`

  const shapes: Record<IconName, React.ReactNode> = {
    computer: (
      <>
        <defs>
          <linearGradient id={g('body')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f1e6" />
            <stop offset="1" stopColor="#b9b4a0" />
          </linearGradient>
          <linearGradient id={g('screen')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6fc3ff" />
            <stop offset="0.55" stopColor="#2a74e0" />
            <stop offset="1" stopColor="#1245a8" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="40" height="30" rx="3" fill={url('body')} stroke="#6b675a" />
        <rect x="8" y="8" width="32" height="22" rx="1.5" fill={url('screen')} stroke="#0d3a8c" />
        <path d="M9 9h30v7C30 14 20 17 9 15z" fill="#fff" opacity=".35" />
        <path d="M8 38h32l3 6H5z" fill={url('body')} stroke="#6b675a" />
        <rect x="19" y="34" width="10" height="4" fill="#9d9885" />
        <circle cx="38" cy="41" r="1.2" fill="#3fb13f" />
      </>
    ),
    folder: (
      <>
        <defs>
          <linearGradient id={g('back')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6c35a" />
            <stop offset="1" stopColor="#c9962b" />
          </linearGradient>
          <linearGradient id={g('front')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0a8" />
            <stop offset="1" stopColor="#f0c64a" />
          </linearGradient>
        </defs>
        <path d="M3 10a3 3 0 0 1 3-3h13l4 4h19a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill={url('back')} stroke="#a67a1a" />
        <path d="M3 20a3 3 0 0 1 3-3h36a3 3 0 0 1 3 3l-2 21a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill={url('front')} stroke="#b08a22" />
        <path d="M6 20h36" stroke="#fff" opacity=".6" />
      </>
    ),
    browser: (
      <>
        <defs>
          <radialGradient id={g('globe')} cx=".35" cy=".3" r=".9">
            <stop offset="0" stopColor="#bfe6ff" />
            <stop offset=".45" stopColor="#3b95ea" />
            <stop offset="1" stopColor="#0d4aa8" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="25" r="18" fill={url('globe')} stroke="#0b3d8f" />
        <path d="M10 18c5-3 9 0 11-4s6-3 9-1c-2 4 1 6-2 9s-5 1-6 5-6 4-9 1c-1-3-5-5-3-10z" fill="#5fc15a" opacity=".85" />
        <path d="M30 28c4-1 7 2 6 6s-5 6-8 4c0-3 0-8 2-10z" fill="#5fc15a" opacity=".85" />
        <ellipse cx="24" cy="25" rx="18" ry="6" fill="none" stroke="#fff" opacity=".35" transform="rotate(-25 24 25)" />
        <path d="M8 14C14 5 28 3 38 9" fill="none" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    terminal: (
      <>
        <defs>
          <linearGradient id={g('bar')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b83f0" />
            <stop offset="1" stopColor="#0a4ad0" />
          </linearGradient>
        </defs>
        <rect x="4" y="7" width="40" height="34" rx="3" fill="#111" stroke="#0a2f80" />
        <path d="M4 10a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v3H4z" fill={url('bar')} />
        <path d="M11 22l7 5-7 5" fill="none" stroke="#c8c8c8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 33h10" stroke="#c8c8c8" strokeWidth="2.6" strokeLinecap="round" />
      </>
    ),
    recycle: (
      <>
        <defs>
          <linearGradient id={g('bin')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#dfe8ee" />
            <stop offset=".5" stopColor="#fff" />
            <stop offset="1" stopColor="#a9b8c2" />
          </linearGradient>
        </defs>
        <path d="M10 14h28l-3 28a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2z" fill={url('bin')} stroke="#6b7b86" />
        <rect x="8" y="9" width="32" height="5" rx="2" fill="#cfd9e0" stroke="#6b7b86" />
        <path d="M24 20l5 8h-3v5h-4v-5h-3z" fill="#2fa84a" transform="rotate(8 24 26)" />
        <path d="M17 22v14M24 22v14M31 22v14" stroke="#9aaab5" opacity=".7" />
      </>
    ),
    lab: (
      <>
        <defs>
          <linearGradient id={g('liq')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7be07b" />
            <stop offset="1" stopColor="#1f9d3a" />
          </linearGradient>
        </defs>
        <path d="M19 5h10M21 5v14L9 38a4 4 0 0 0 3.5 6h23A4 4 0 0 0 39 38L27 19V5" fill="#eaf6ff" fillOpacity=".7" stroke="#4a6a85" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 32h22l4 7a3 3 0 0 1-2.6 4.5H11.6A3 3 0 0 1 9 39z" fill={url('liq')} />
        <circle cx="20" cy="36" r="2" fill="#fff" opacity=".7" />
        <circle cx="28" cy="38" r="1.4" fill="#fff" opacity=".7" />
      </>
    ),
    games: (
      <>
        <defs>
          <linearGradient id={g('card')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#dcdcdc" />
          </linearGradient>
        </defs>
        <rect x="7" y="9" width="24" height="32" rx="3" fill={url('card')} stroke="#666" transform="rotate(-10 19 25)" />
        <rect x="16" y="7" width="24" height="32" rx="3" fill={url('card')} stroke="#666" transform="rotate(8 28 23)" />
        <path d="M28 14c-3-4-9 0-4 5l4 4 4-4c5-5-1-9-4-5z" fill="#d6261c" transform="rotate(8 28 23) translate(0 3)" />
      </>
    ),
    user: (
      <>
        <defs>
          <linearGradient id={g('bg')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd27a" />
            <stop offset="1" stopColor="#f08a1c" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="6" fill={url('bg')} stroke="#fff" strokeWidth="2" />
        <circle cx="24" cy="19" r="8" fill="#fff" />
        <path d="M8 42c1-9 8-13 16-13s15 4 16 13z" fill="#fff" />
      </>
    ),
    logo: (
      <>
        <path d="M5 9c5-3 9-1 13 0v13c-4-1-8-3-13 0z" fill="#f25022" />
        <path d="M20 9c4 1 9 3 13 0v13c-4 3-9 1-13 0z" fill="#7fba00" />
        <path d="M5 25c5-3 9-1 13 0v13c-4-1-8-3-13 0z" fill="#00a4ef" />
        <path d="M20 25c4 1 9 3 13 0v13c-4 3-9 1-13 0z" fill="#ffb900" />
      </>
    ),
    power: (
      <>
        <rect x="4" y="4" width="40" height="40" rx="6" fill="#d9391b" stroke="#fff" strokeWidth="2" />
        <path d="M24 12v13" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <path d="M16 17a12 12 0 1 0 16 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    speaker: (
      <>
        <path d="M6 18h8l10-8v28l-10-8H6z" fill="#fff" />
        <path d="M30 17a9 9 0 0 1 0 14M35 11a17 17 0 0 1 0 26" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
    speakerOff: (
      <>
        <path d="M6 18h8l10-8v28l-10-8H6z" fill="#fff" />
        <path d="M30 18l12 12M42 18L30 30" stroke="#ffb3a6" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" style={{ display: 'block', flexShrink: 0 }}>
      {shapes[name]}
    </svg>
  )
}
