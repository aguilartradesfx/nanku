'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const CDN = 'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/'

const galleryImages = [
  { src: CDN + '69c5fbd8146bc51f9eec8ca7.jpg', alt: 'Rib Eye' },
  { src: CDN + '69c194d50d1082cd084c8590.jpg', alt: 'Surf and Turf' },
  { src: CDN + '69c5f866421e24593383c6c8.jpg', alt: 'Tuna Tartar' },
  { src: CDN + '69c5f674146bc581d6ebd34f.jpg', alt: 'Octopus Ceviche' },
  { src: CDN + '69b9175087f0f2768356c731.jpg', alt: 'Grilled Octopus' },
  { src: CDN + '69c5f8667794bfe0805014c0.jpg', alt: 'Cahuita Chicken' },
  { src: CDN + '69b91750269d6516ffc77360.jpg', alt: 'BBQ Pork Ribs' },
  { src: CDN + '69c194d5c1e996220ba4333f.jpg', alt: 'Spaghetti Pura Vida' },
  { src: CDN + '69c5f94c7794bf69985031bf.jpg', alt: 'Chocolate Brownie' },
]

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const prevImage = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length
    )
  }, [])

  const nextImage = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % galleryImages.length
    )
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, prevImage, nextImage])

  return (
    <>
      <div className="gallery-grid">
        {galleryImages.map((img, i) => (
          <div
            key={img.src}
            className="gallery-item fade-up"
            onClick={() => setLightboxIndex(i)}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={700}
              height={500}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="gallery-overlay">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={closeLightbox}
          style={{ opacity: 1, pointerEvents: 'all' }}
        >
          <button
            className="lightbox-close"
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); closeLightbox() }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button
            className="lightbox-prev"
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="lightbox-next"
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <Image
            className="lightbox-img"
            src={galleryImages[lightboxIndex].src}
            alt={galleryImages[lightboxIndex].alt}
            width={1200}
            height={800}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  )
}
