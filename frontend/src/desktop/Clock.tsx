import { useEffect, useState } from 'react'

const timeFmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })
const dateFmt = new Intl.DateTimeFormat('es-AR', { dateStyle: 'full' })

export function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <time dateTime={now.toISOString()} title={dateFmt.format(now)}>
      {timeFmt.format(now)}
    </time>
  )
}
