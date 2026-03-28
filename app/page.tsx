import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Gallery from '@/components/Gallery'
import ReservationForm from '@/components/ReservationForm'
import ReviewsScroll from '@/components/ReviewsScroll'
import CookieConsent from '@/components/CookieConsent'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Nanku Tropical Bar & Steakhouse | La Fortuna, Costa Rica',
  alternates: { canonical: 'https://restaurantenanku.com' },
}

export default function HomePage() {
  return (
    <>
      <Navbar lang="en" />

      {/* HERO */}
      <section className="hero noise-overlay">
        <div className="hero-bg"></div>
        <div className="hero-overlay-1"></div>
        <div className="hero-overlay-2"></div>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-brand">Tropical Bar &amp; Steakhouse</div>
          <h1 className="hero-title">
            Where the Jungle
            <br />
            <span>Comes Alive</span> at Night
          </h1>
          <p className="hero-tagline">
            Premium steaks, handcrafted tropical cocktails &amp; live music under the stars
          </p>
          <div className="hero-location">La Fortuna, Costa Rica — Near Arenal Volcano</div>
          <div className="hero-btns">
            <a href="#reservations" className="btn-orange">Reserve Your Table</a>
            <a href="#dishes" className="btn-outline-white">View Menu</a>
            <a
              href="https://wa.me/50624790707?text=Hi!%20I'd%20like%20to%20make%20a%20reservation%20at%20Nanku%20Tropical%20Bar%20%26%20Steakhouse."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
        <a href="#experience" className="hero-scroll bounce-arrow" aria-label="Scroll down">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="experience-section">
        <div className="experience-bg"></div>
        <div className="experience-line"></div>
        <div className="container">
          <div className="experience-header fade-up">
            <span className="section-label">Discover What Awaits</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}>
              The Nanku<br />
              <span className="experience-title-gradient">Experience</span>
            </h2>
            <p className="font-lato" style={{ color: '#B0B0B0', fontWeight: 300, fontSize: '1.125rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
              More than a meal — an evening woven from fire, rhythm, and the untamed beauty of Costa Rica&apos;s volcanic heartland.
            </p>
            <div className="experience-divider">
              <div className="line"></div>
              <div className="dot"></div>
              <div className="line"></div>
            </div>
          </div>

          <div className="exp-cards">
            {/* 01 Live Music */}
            <div className="exp-card fade-up">
              <div className="exp-card-inner">
                <div className="exp-img-side">
                  <div className="exp-img-frame"></div>
                  <div className="exp-img-wrap">
                    <Image src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c611db69544cbe5cda9286.jpg" alt="Live Music" width={800} height={600} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    <div className="exp-img-gradient" style={{ background: 'linear-gradient(to right,rgba(17,17,17,0.7) 0%,transparent 50%),linear-gradient(to top,rgba(17,17,17,0.5) 0%,transparent 40%)' }}></div>
                    <div className="exp-img-number" style={{ WebkitTextStroke: '1px rgba(232,117,26,0.25)' }}>01</div>
                  </div>
                </div>
                <div className="exp-text-side">
                  <div className="exp-icon-wrap">
                    <div className="exp-icon" style={{ background: 'linear-gradient(135deg,rgba(232,117,26,0.15),rgba(232,117,26,0.08))', border: '1px solid rgba(232,117,26,0.3)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#E8751A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                    </div>
                  </div>
                  <span className="exp-subtitle" style={{ color: '#F5A623' }}>Feel the Rhythm</span>
                  <h3 className="exp-title">Live Music</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#E8751A,transparent)' }}></div>
                  <p className="exp-desc">Every Monday &amp; Saturday, the jungle comes alive with talented local artists performing tropical and Latin beats under the stars.</p>
                  <Link href="/live-music" className="exp-cta">
                    <span style={{ color: '#E8751A' }}>Discover more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#E8751A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* 02 Signature Cocktails */}
            <div className="exp-card fade-up">
              <div className="exp-card-inner reverse">
                <div className="exp-img-side">
                  <div className="exp-img-frame"></div>
                  <div className="exp-img-wrap">
                    <Image src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5e484e24981fcd12193a5.jpg" alt="Signature Cocktails" width={800} height={600} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="exp-img-gradient" style={{ background: 'linear-gradient(to left,rgba(17,17,17,0.7) 0%,transparent 50%),linear-gradient(to top,rgba(17,17,17,0.5) 0%,transparent 40%)' }}></div>
                    <div className="exp-img-number" style={{ WebkitTextStroke: '1px rgba(245,166,35,0.25)', left: '1.5rem', right: 'auto' }}>02</div>
                  </div>
                </div>
                <div className="exp-text-side">
                  <div className="exp-icon-wrap">
                    <div className="exp-icon" style={{ background: 'linear-gradient(135deg,rgba(245,166,35,0.15),rgba(245,166,35,0.08))', border: '1px solid rgba(245,166,35,0.3)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M8 22h8" /><path d="M7 10h10" /><path d="M12 22V10" /><path d="M12 10C12 4 8 2 8 2h8S12 4 12 10z" /></svg>
                    </div>
                  </div>
                  <span className="exp-subtitle" style={{ color: '#E8751A' }}>Crafted with Passion</span>
                  <h3 className="exp-title">Signature Cocktails</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#F5A623,transparent)' }}></div>
                  <p className="exp-desc">Handcrafted tropical cocktails blending local spirits with fresh exotic fruits, aromatic herbs, and a touch of Costa Rican magic.</p>
                  <Link href="/menu" className="exp-cta">
                    <span style={{ color: '#F5A623' }}>Discover more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* 03 Premium Steaks */}
            <div className="exp-card fade-up">
              <div className="exp-card-inner">
                <div className="exp-img-side">
                  <div className="exp-img-frame"></div>
                  <div className="exp-img-wrap">
                    <Image src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5edb5146bc5f778eaab9e.jpg" alt="Premium Steaks" width={800} height={600} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="exp-img-gradient" style={{ background: 'linear-gradient(to right,rgba(17,17,17,0.7) 0%,transparent 50%),linear-gradient(to top,rgba(17,17,17,0.5) 0%,transparent 40%)' }}></div>
                    <div className="exp-img-number" style={{ WebkitTextStroke: '1px rgba(232,117,26,0.25)' }}>03</div>
                  </div>
                </div>
                <div className="exp-text-side">
                  <div className="exp-icon-wrap">
                    <div className="exp-icon" style={{ background: 'linear-gradient(135deg,rgba(232,117,26,0.15),rgba(232,117,26,0.08))', border: '1px solid rgba(232,117,26,0.3)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#E8751A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9.5 6.5c-2 1.5-3.5 4-3.5 7 0 2.5 1 4.5 2.5 6" /><path d="M14.5 6.5c2 1.5 3.5 4 3.5 7 0 2.5-1 4.5-2.5 6" /><line x1="12" y1="2" x2="12" y2="22" /></svg>
                    </div>
                  </div>
                  <span className="exp-subtitle" style={{ color: '#D4A853' }}>Fire &amp; Flavor</span>
                  <h3 className="exp-title">Premium Steaks</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#E8751A,transparent)' }}></div>
                  <p className="exp-desc">Choice cuts cooked to perfection over open flame, sourced from the finest local farms and seasoned with our signature blends.</p>
                  <Link href="/menu" className="exp-cta">
                    <span style={{ color: '#E8751A' }}>Discover more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#E8751A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* 04 Tropical Atmosphere */}
            <div className="exp-card fade-up">
              <div className="exp-card-inner reverse">
                <div className="exp-img-side">
                  <div className="exp-img-frame"></div>
                  <div className="exp-img-wrap">
                    <Image src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c611dbc1840fb68ef4cad7.jpg" alt="Tropical Atmosphere" width={800} height={600} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="exp-img-gradient" style={{ background: 'linear-gradient(to left,rgba(17,17,17,0.7) 0%,transparent 50%),linear-gradient(to top,rgba(17,17,17,0.5) 0%,transparent 40%)' }}></div>
                    <div className="exp-img-number" style={{ WebkitTextStroke: '1px rgba(45,90,39,0.4)', left: '1.5rem', right: 'auto' }}>04</div>
                  </div>
                </div>
                <div className="exp-text-side">
                  <div className="exp-icon-wrap">
                    <div className="exp-icon" style={{ background: 'linear-gradient(135deg,rgba(45,90,39,0.15),rgba(45,90,39,0.08))', border: '1px solid rgba(45,90,39,0.3)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#2D5A27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 8a5 5 0 0 0-10 0c0 3 2 5.5 5 7 3-1.5 5-4 5-7z" /><line x1="12" y1="22" x2="12" y2="15" /></svg>
                    </div>
                  </div>
                  <span className="exp-subtitle" style={{ color: '#F5A623' }}>Dine in Paradise</span>
                  <h3 className="exp-title">Tropical Atmosphere</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#2D5A27,transparent)' }}></div>
                  <p className="exp-desc">Immerse yourself in lush jungle flora, open skies, and the gentle warmth of volcano country — just minutes from Arenal.</p>
                  <Link href="/about" className="exp-cta">
                    <span style={{ color: '#2D5A27' }}>Discover more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="#2D5A27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="exp-bottom fade-up">
            <div className="line" style={{ background: 'linear-gradient(to right,transparent,rgba(255,255,255,0.1))' }}></div>
            <div className="dot"></div>
            <span>Est. La Fortuna, Costa Rica</span>
            <div className="dot"></div>
            <div className="line" style={{ background: 'linear-gradient(to left,transparent,rgba(255,255,255,0.1))' }}></div>
          </div>
        </div>
      </section>

      {/* DISHES */}
      <section id="dishes" className="dishes-section">
        <div className="dishes-bg"></div>
        <div className="container">
          <div className="dishes-header fade-up">
            <span className="section-label">Culinary Highlights</span>
            <h2 className="section-title">Signature Dishes</h2>
            <div className="section-divider"></div>
          </div>
          <div className="dishes-grid">
            {[
              { img: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21eead02761cdd64eb23.jpg', name: 'Rib Eye', price: '₡17,500', desc: 'Premium cut served sizzling on cast iron with rosemary potatoes, sweet plantain, jalapeño, and chimichurri.', badge: { text: "Chef's Choice", color: 'orange' } },
              { img: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d661cba538a2a13a41.jpg', name: 'Grilled Octopus', price: '₡19,000', desc: 'Charred octopus tentacle with sweet potato purée, fresh salad, tomato chimichurri, and citrus concassé soy sauce.' },
              { img: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d29ab5e21035712b06.jpg', name: 'Tuna Tartar', price: '₡9,900', desc: 'Fresh tuna marinated with soy sauce, sesame, lemon, cucumber, and red onions, served with crostini.', badge: { text: 'Fan Favorite', color: 'orange' } },
              { img: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21e9ad0276ce1964ea9e.jpg', name: 'Cahuita Chicken', price: '₡9,100', desc: 'Grilled chicken in rich coconut milk, thyme, and chili pepper sauce with vegetables and mashed potatoes.' },
              { img: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba221edac584673cb76ed5.jpg', name: 'Parmesan Eggplant', price: '₡8,500', desc: 'Crispy Parmesan-crusted eggplant in pomodoro sauce with cherry tomatoes, capers, olives, and house salad.', badge: { text: 'Vegetarian', color: 'green' } },
              { img: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba222cdac58405aab77052.jpg', name: 'Flambéed Pineapple', price: '₡4,700', desc: 'Caramelized pineapple in orange and cinnamon sauce, flamed in orange liquor, topped with vanilla ice cream.', badge: { text: 'Premium', color: 'orange' } },
            ].map((dish) => (
              <div key={dish.name} className="dish-card fade-up">
                <div className="dish-img-wrap">
                  <Image src={dish.img} alt={dish.name} width={400} height={300} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="dish-img-gradient"></div>
                  {dish.badge && (
                    <span className={`dish-badge ${dish.badge.color}`}>{dish.badge.text}</span>
                  )}
                </div>
                <div className="dish-body">
                  <div className="dish-row">
                    <h3 className="dish-name">{dish.name}</h3>
                    <span className="dish-price">{dish.price}</span>
                  </div>
                  <p className="dish-desc">{dish.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="dishes-cta fade-up">
            <Link href="/menu" className="btn-outline-orange">View Full Menu →</Link>
          </div>
        </div>
      </section>

      {/* COCKTAILS */}
      <section id="cocktails" className="cocktails-section">
        <div className="cocktails-bg"></div>
        <div className="container">
          <div className="cocktails-header fade-up">
            <span className="section-label">Behind the Bar</span>
            <h2 className="section-title">Signature Cocktails</h2>
            <div className="section-divider"></div>
            <p className="cocktails-desc">Every glass tells a story of the jungle. Handcrafted with fresh local ingredients and premium spirits.</p>
          </div>
          <div className="cocktails-grid">
            {[
              {
                img: 'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/6840b85b269d65a9c8c29dca.jpeg',
                title: 'Craft Margaritas',
                desc: 'Elevated twists on the classic, using premium mezcal and tequila with locally sourced tropical fruits and house-made syrups.',
                drinks: ['Mango Habanero Margarita', 'Maracuyá Mezcalita', 'Coconut Lime Classic'],
                highlight: false,
              },
              {
                img: 'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/6840b87e269d65a9c8c29dce.jpeg',
                title: 'Tiki Paradise',
                desc: 'Transport yourself to the tropics with rum-forward concoctions layered with coconut, passion fruit, and fresh pineapple.',
                drinks: ['Arenal Volcano Punch', 'Jungle Bird', 'Blue Lagoon Tiki'],
                highlight: true,
              },
              {
                img: 'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/6840b893db6cd63ce6c15b6f.jpeg',
                title: 'House Specials',
                desc: 'Signature creations by our head bartender — exclusive to Nanku and inspired by the flora and fauna of the Arenal region.',
                drinks: ['Nanku Sunset', 'Volcanic Night', 'Jungle Elixir'],
                highlight: false,
              },
            ].map((c) => {
              const card = (
                <div key={c.title} className="cocktail-card fade-up">
                  <div className="cocktail-img-wrap">
                    <Image src={c.img} alt={c.title} width={800} height={600} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="cocktail-img-gradient"></div>
                    <div className="cocktail-img-title"><h3>{c.title}</h3></div>
                  </div>
                  <div className="cocktail-body">
                    <p>{c.desc}</p>
                    <ul className="cocktail-drinks">
                      {c.drinks.map((d) => (
                        <li key={d} className="cocktail-drink">
                          <span className="cocktail-drink-dot"></span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
              return c.highlight
                ? <div key={c.title} className="cocktail-highlight-wrap fade-up">{card}</div>
                : card
            })}
          </div>
          <div className="cocktails-cta fade-up">
            <Link href="/menu" className="btn-outline-orange">See Drinks Menu →</Link>
          </div>
        </div>
      </section>

      {/* LIVE MUSIC */}
      <section id="music" className="music-section">
        <div className="music-bg"></div>
        <div className="container-sm">
          <div className="music-header fade-up">
            <div className="music-header-top">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#E8751A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
              <span className="section-label" style={{ margin: 0 }}>Feel the Beat</span>
            </div>
            <h2 className="section-title">Live Music Nights</h2>
            <div className="section-divider"></div>
            <p className="music-header-desc">Talented local artists bring the jungle alive with rhythm every Monday and Saturday. Arrive early — it fills up fast.</p>
          </div>
          <div className="music-schedule fade-up">
            {[
              { label: 'MON', active: true, note: 'Live Latin & Tropical' },
              { label: 'TUE', active: false, note: 'Ambient Music' },
              { label: 'WED', active: false, note: 'Acoustic Sessions' },
              { label: 'THU', active: false, note: 'Ambient Music' },
              { label: 'FRI', active: false, note: 'DJ Night' },
              { label: 'SAT', active: true, note: 'Live Band Night' },
              { label: 'SUN', active: false, note: 'Relaxed Vibes' },
            ].map((day) => (
              <div key={day.label} className={`music-day ${day.active ? 'active' : 'inactive'}`}>
                <span className="music-day-label">{day.label}</span>
                <div className="music-day-icon">
                  {day.active ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                  ) : (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                  )}
                </div>
                <span className="music-day-note">{day.note}</span>
              </div>
            ))}
          </div>
          <div className="music-live-cards fade-up">
            {[
              { title: 'Monday Night', subtitle: 'Live Latin & Tropical · Starts 8:00 PM' },
              { title: 'Saturday Night', subtitle: 'Live Band Night · Starts 8:00 PM' },
            ].map((card) => (
              <div key={card.title} className="music-live-card">
                <div className="music-live-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </div>
                <div>
                  <div className="music-live-title">{card.title}</div>
                  <div className="music-live-subtitle">{card.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="music-cta fade-up">
            <a href="#reservations" className="btn-orange" style={{ display: 'inline-block' }}>Reserve for Music Night</a>
            <Link href="/live-music" className="btn-outline-orange" style={{ display: 'inline-flex' }}>See Live Music Page →</Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <div className="gallery-header fade-up">
            <span className="section-label">Inside Nanku</span>
            <h2 className="section-title">Gallery</h2>
            <div className="section-divider"></div>
          </div>
          <Gallery />
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="reviews-section">
        <div className="reviews-bg"></div>
        <ReviewsScroll />
      </section>

      {/* RESERVATIONS */}
      <section id="reservations" className="reservations-section noise-overlay">
        <div className="reservations-texture"></div>
        <div className="container-sm" style={{ position: 'relative', zIndex: 10 }}>
          <div className="reservations-header fade-up">
            <h2>Reserve Your Table</h2>
            <p>Book your experience at Nanku. We&apos;ll confirm your reservation within 2 hours.</p>
          </div>
          <div className="reservations-form-card fade-up">
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* MAP */}
      <section id="location" className="map-section">
        <div className="container">
          <div className="map-header fade-up">
            <span className="section-label">Find Us</span>
            <h2 className="section-title">Location &amp; Directions</h2>
            <div className="section-divider"></div>
          </div>
          <div className="map-grid">
            <div className="map-wrap fade-up">
              <iframe
                title="Nanku Location - La Fortuna, Costa Rica"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245.2105386900293!2d-84.64325924605953!3d10.471579485684078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa00c88c43ff4a3%3A0xb63077c441cc27ec!2sRestaurante%20Nanku!5e0!3m2!1ses-419!2scr!4v1773737597015!5m2!1ses-419!2scr"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="fade-up">
              <div className="map-info-card">
                <div className="map-info-addr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#E8751A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <div>
                    <div className="map-info-addr-label">Address</div>
                    <div className="map-info-addr-val">La Fortuna Town,<br />Street 142, San Carlos<br />Costa Rica</div>
                  </div>
                </div>
                <div className="map-hours">
                  <div className="map-hours-title">Hours</div>
                  <div className="map-hours-row"><span className="map-hours-day">Monday – Thursday</span><span className="map-hours-time">12:00 PM – 11:00 PM</span></div>
                  <div className="map-hours-row"><span className="map-hours-day">Friday – Saturday</span><span className="map-hours-time">12:00 PM – 1:00 AM</span></div>
                  <div className="map-hours-row"><span className="map-hours-day">Sunday</span><span className="map-hours-time">12:00 PM – 10:00 PM</span></div>
                </div>
                <a href="https://maps.google.com/?q=Restaurante+Nanku+La+Fortuna+Costa+Rica" target="_blank" rel="noopener noreferrer" className="map-directions">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                  Get Directions
                </a>
              </div>
              <div className="map-volcano">
                <div className="map-volcano-title">Near Arenal Volcano</div>
                <div className="map-volcano-desc">We&apos;re located in the heart of La Fortuna, just 5 minutes from Arenal Volcano National Park entrance.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang="en" />
      <WhatsAppButton />
      <CookieConsent />
    </>
  )
}
