'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  className?: string
}

export default function FadeUp({ children, className }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`fade-up${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
