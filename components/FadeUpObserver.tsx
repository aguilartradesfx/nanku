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

    // Defer until after Next.js has committed all server-rendered HTML to the DOM.
    // A double rAF guarantees we're past the initial commit + layout/paint cycle,
    // so querySelectorAll('.fade-up') finds all 43 elements instead of 0.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        observe()
      })
    })

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
