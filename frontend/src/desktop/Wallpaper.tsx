import styles from './Wallpaper.module.css'

/**
 * Paisaje original inspirado en la estética "Bliss" (colinas verdes, cielo azul,
 * nubes). Es ilustración propia en SVG: la fotografía original de Microsoft
 * tiene copyright y no se redistribuye. Si querés usar una imagen propia,
 * reemplazá este componente por un <img> en /public.
 */
export function Wallpaper() {
  return (
    <svg className={styles.root} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a58d6" />
          <stop offset=".35" stopColor="#2e86ee" />
          <stop offset=".62" stopColor="#7cc0f7" />
          <stop offset="1" stopColor="#d4ecfb" />
        </linearGradient>
        <linearGradient id="wp-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fb83a" />
          <stop offset="1" stopColor="#3f8a1e" />
        </linearGradient>
        <linearGradient id="wp-hill-front" x1="0" y1="0" x2=".3" y2="1">
          <stop offset="0" stopColor="#8fd44a" />
          <stop offset=".35" stopColor="#58ad2a" />
          <stop offset="1" stopColor="#2d6e14" />
        </linearGradient>
        <radialGradient id="wp-light" cx=".3" cy=".1" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="wp-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill="url(#wp-sky)" />

      <g fill="#fff" filter="url(#wp-blur)" opacity=".92">
        <ellipse cx="300" cy="190" rx="190" ry="34" />
        <ellipse cx="410" cy="165" rx="130" ry="30" />
        <ellipse cx="900" cy="130" rx="230" ry="30" />
        <ellipse cx="1040" cy="108" rx="140" ry="24" />
        <ellipse cx="1350" cy="250" rx="210" ry="32" />
        <ellipse cx="640" cy="320" rx="260" ry="26" opacity=".7" />
        <ellipse cx="1200" cy="400" rx="300" ry="24" opacity=".6" />
      </g>

      <path d="M0 560C220 500 420 470 640 500s420 70 640 20 220-40 320-10V900H0z" fill="url(#wp-hill-back)" />
      <path d="M0 640C180 570 380 560 600 600s420 100 700 40 220-60 300-40V900H0z" fill="url(#wp-hill-front)" />
      <path d="M0 760C300 690 560 700 820 740s500 60 780-30V900H0z" fill="#3c8a1c" opacity=".55" />
      <rect width="1600" height="900" fill="url(#wp-light)" />
    </svg>
  )
}
