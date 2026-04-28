'use client'

import { useEffect } from 'react'

export default function FadeUpObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    const observe = () => {
      document.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
        observer.observe(el)
      })
    }

    observe()

    // Re-observe on route changes (new elements added to DOM)
    const mutation = new MutationObserver(observe)
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [])

  return null
}
