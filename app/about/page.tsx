import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Nanku Tropical Bar & Steakhouse — premium dining, handcrafted cocktails and live music in La Fortuna, Costa Rica.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar lang="en" activePage="About" />

      {/* HERO */}
      <section className="about-hero">
        <div
          className="about-hero-bg"
          style={{ backgroundImage: "url('https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c611dbc1840fb68ef4cad7.jpg')" }}
        ></div>
        <div className="about-hero-overlay"></div>
        <div className="about-hero-glow"></div>
        <div className="about-hero-content">
          <span className="section-label">Our Story</span>
          <h1 className="about-hero-title">About Nanku</h1>
          <p className="about-hero-sub">
            Premium tropical dining, handcrafted cocktails &amp; live music under the stars of Arenal
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="about-story" id="storySection">
        <div className="about-story-glow"></div>
        <div className="about-story-container">
          <div className="about-story-grid">
            <div className="fade-up">
              <span className="section-label">Who We Are</span>
              <h2 className="about-story-title">
                Where the Jungle <br />
                <span className="text-orange">Comes Alive</span>
              </h2>
              <div className="divider-line"></div>
              <p className="about-story-text">
                Nanku Tropical Bar &amp; Steakhouse was born from a passion for exceptional food, vibrant culture,
                and the magic of Costa Rica&apos;s jungle. Nestled in the heart of La Fortuna, just minutes from the
                iconic Arenal Volcano, we offer a dining experience that blends the best of tropical flavors with
                premium international cuisine.
              </p>
              <p className="about-story-text">
                Our name, Nanku, meaning "home" in Chorotega, reflects the spirit of gathering — a place where friends, families, and travelers
                come together to share unforgettable moments over great food, creative cocktails, and live music
                that sets the perfect mood for a night under the stars.
              </p>
            </div>
            <div className="about-story-photos fade-up">
              <Image
                src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c611dbc1840fb68ef4cad7.jpg"
                alt="Restaurant interior"
                loading="lazy"
                width={600}
                height={800}
                className="about-photo-tall"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="about-photo-stack">
                <Image
                  src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5edb5146bc5f778eaab9e.jpg"
                  alt="Premium steak"
                  loading="lazy"
                  width={600}
                  height={400}
                  className="about-photo-sq"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Image
                  src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5e484e24981fcd12193a5.jpg"
                  alt="Signature cocktails"
                  loading="lazy"
                  width={600}
                  height={400}
                  className="about-photo-sq"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="about-pillars" id="pillarsSection">
        <div className="about-pillars-container">
          <div className="about-pillars-header fade-up">
            <span className="section-label">The Experience</span>
            <h2 className="about-pillars-title">What Makes Us Unique</h2>
            <div className="divider-line" style={{ margin: '0 auto' }}></div>
          </div>
          <div className="about-pillars-grid">
            <div className="pillar-card fade-up">
              <div className="pillar-icon" style={{ background: 'rgba(232,117,26,0.094)', borderColor: 'rgba(232,117,26,0.208)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="1.5">
                  <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
              <h3 className="pillar-title">Premium Steaks</h3>
              <p className="pillar-desc">Hand-selected cuts cooked to perfection over an open flame. From ribeye to tenderloin, every steak is a celebration.</p>
            </div>
            <div className="pillar-card fade-up">
              <div className="pillar-icon" style={{ background: 'rgba(245,166,35,0.094)', borderColor: 'rgba(245,166,35,0.208)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5">
                  <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /><circle cx="12" cy="15" r="2" />
                </svg>
              </div>
              <h3 className="pillar-title">Handcrafted Cocktails</h3>
              <p className="pillar-desc">Tropical spirits, fresh fruits, and secret recipes. Our bartenders craft cocktails that capture the essence of Costa Rica.</p>
            </div>
            <div className="pillar-card fade-up">
              <div className="pillar-icon" style={{ background: 'rgba(212,168,83,0.094)', borderColor: 'rgba(212,168,83,0.208)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <h3 className="pillar-title">Live Music</h3>
              <p className="pillar-desc">Every Monday and Saturday, local and international artists take the stage. The best live music experience in La Fortuna.</p>
            </div>
            <div className="pillar-card fade-up">
              <div className="pillar-icon" style={{ background: 'rgba(45,122,39,0.094)', borderColor: 'rgba(45,122,39,0.208)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2D7A27" strokeWidth="1.5">
                  <path d="M17 8C8 10 5.9 16.17 3.82 22M9.58 6.95c0 .27.05.54.1.8C5.98 9.25 3.67 13.25 3 17c3.5-2 7.5-2.5 11-2 1.06-2.79 2.67-5.18 6-6M12 2a7 7 0 01-7 7" />
                </svg>
              </div>
              <h3 className="pillar-title">Jungle Atmosphere</h3>
              <p className="pillar-desc">Dine under the open sky surrounded by the sounds of the jungle and the warmth of Arenal. An atmosphere unlike any other.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="about-location">
        <div className="about-location-container">
          <span className="section-label">Find Us</span>
          <h2 className="about-location-title">Visit Us in La Fortuna</h2>
          <div className="divider-line" style={{ margin: '0 auto 2.5rem' }}></div>
          <div className="about-location-cards">
            <div className="location-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="1.5" className="flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span>Street 142, San Carlos, La Fortuna, Costa Rica</span>
            </div>
            <a href="tel:+50624790707" className="location-card location-card-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="1.5" className="flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8a16 16 0 006.29 6.29l1.18-1.18a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>+506-2479-0707</span>
            </a>
            <a href="mailto:info@restaurantenanku.net" className="location-card location-card-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="1.5" className="flex-shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              <span>info@restaurantenanku.net</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta" id="ctaSection">
        <div className="about-cta-glow"></div>
        <div className="about-cta-inner">
          <div className="fade-up">
            <h2 className="about-cta-title">Come Experience Nanku</h2>
            <p className="about-cta-sub">
              Reserve your table today and discover why guests from around the world choose Nanku for an unforgettable night out
            </p>
            <div className="about-cta-buttons">
              <a
                href="https://wa.me/50624790707?text=Hi%21%20I%27d%20like%20to%20make%20a%20reservation%20at%20Nanku%20Tropical%20Bar%20%26%20Steakhouse."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-white-orange"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Reserve via WhatsApp
              </a>
              <Link href="/#reservations" className="btn-outline-white">Book a Table Online</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer lang="en" />
      <WhatsAppButton />
    </>
  )
}
