import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Gallery from '@/components/Gallery'
import ReservationForm from '@/components/ReservationForm'
import ReviewsScroll from '@/components/ReviewsScroll'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Nanku Tropical Bar & Steakhouse | La Fortuna, Costa Rica',
  description:
    'Cortes premium, cócteles tropicales artesanales y música en vivo bajo las estrellas. Ubicado en La Fortuna, Costa Rica — cerca del Volcán Arenal.',
  openGraph: {
    title: 'Nanku Tropical Bar & Steakhouse | La Fortuna, Costa Rica',
    description:
      'Cortes premium, cócteles tropicales artesanales y música en vivo bajo las estrellas.',
    locale: 'es_CR',
  },
}

const DAY_LABEL_ES: Record<string, string> = {
  Monday: 'LUN', Tuesday: 'MAR', Wednesday: 'MIÉ',
  Thursday: 'JUE', Friday: 'VIE', Saturday: 'SÁB', Sunday: 'DOM',
}
const DAY_NAME_ES: Record<string, string> = {
  Monday: 'Lunes', Tuesday: 'Martes', Wednesday: 'Miércoles',
  Thursday: 'Jueves', Friday: 'Viernes', Saturday: 'Sábado', Sunday: 'Domingo',
}

type SchedDay = {
  id: string; day_of_week: string; is_active: boolean
  event_label: string; start_time: string; sort_order: number
  artist?: { name: string; label: string } | null
}

export default async function HomePageES() {
  let schedule: SchedDay[] = []
  try {
    const sb = createClient()
    const { data } = await sb
      .from('live_music_schedule')
      .select('*, artist:artists(name, label)')
      .order('sort_order')
    schedule = data ?? []
  } catch { /* show static fallback below */ }

  const liveDays = schedule.filter(d => d.is_active)

  return (
    <>
      <Navbar lang="es" activePage="Home" />

      {/* HERO */}
      <section className="hero noise-overlay">
        <div className="hero-bg"></div>
        <div className="hero-overlay-1"></div>
        <div className="hero-overlay-2"></div>
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="hero-brand">Tropical Bar &amp; Steakhouse</div>
          <h1 className="hero-title">
            Donde la Selva<br />
            <span>Cobra Vida</span> de Noche
          </h1>
          <p className="hero-tagline">Cortes premium, cócteles tropicales artesanales y música en vivo bajo las estrellas</p>
          <div className="hero-location">La Fortuna, Costa Rica — Cerca del Volcán Arenal</div>
          <div className="hero-btns">
            <a href="#reservations" className="btn-orange">Reservá tu Mesa</a>
            <a href="#dishes" className="btn-outline-white">Ver Menú</a>
            <a
              href="https://wa.me/50624790707?text=Hola%21%20Me%20gustar%C3%ADa%20hacer%20una%20reservaci%C3%B3n%20en%20Nanku%20Tropical%20Bar%20%26%20Steakhouse."
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
            <span className="section-label">Descubrí lo que te Espera</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}>
              La<br />
              <span className="experience-title-gradient">Experiencia Nanku</span>
            </h2>
            <p className="font-lato" style={{ color: '#B0B0B0', fontWeight: 300, fontSize: '1.125rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
              Más que una cena — una noche tejida entre fuego, ritmo y la belleza salvaje del corazón volcánico de Costa Rica.
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
                    <img src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c611db69544cbe5cda9286.jpg" alt="Música en Vivo" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
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
                  <span className="exp-subtitle" style={{ color: '#F5A623' }}>Sentí el Ritmo</span>
                  <h3 className="exp-title">Música en Vivo</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#E8751A,transparent)' }}></div>
                  <p className="exp-desc">Cada lunes y sábado, la selva cobra vida con artistas locales interpretando ritmos tropicales y latinos bajo las estrellas.</p>
                  <Link href="/es/live-music" className="exp-cta">
                    <span style={{ color: '#E8751A' }}>Descubrí más</span>
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
                    <img src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5e484e24981fcd12193a5.jpg" alt="Cócteles de la Casa" loading="lazy" />
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
                  <span className="exp-subtitle" style={{ color: '#E8751A' }}>Hechos con Pasión</span>
                  <h3 className="exp-title">Cócteles de la Casa</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#F5A623,transparent)' }}></div>
                  <p className="exp-desc">Cócteles tropicales artesanales que mezclan destilados locales con frutas exóticas frescas, hierbas aromáticas y un toque de magia costarricense.</p>
                  <Link href="/es/menu" className="exp-cta">
                    <span style={{ color: '#F5A623' }}>Descubrí más</span>
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
                    <img src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5edb5146bc5f778eaab9e.jpg" alt="Cortes Premium" loading="lazy" />
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
                  <span className="exp-subtitle" style={{ color: '#D4A853' }}>Fuego y Sabor</span>
                  <h3 className="exp-title">Cortes Premium</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#E8751A,transparent)' }}></div>
                  <p className="exp-desc">Cortes selectos cocinados a la perfección sobre llama viva, de las mejores fincas locales y sazonados con nuestras mezclas exclusivas.</p>
                  <Link href="/es/menu" className="exp-cta">
                    <span style={{ color: '#E8751A' }}>Descubrí más</span>
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
                    <img src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c611dbc1840fb68ef4cad7.jpg" alt="Ambiente Tropical" loading="lazy" />
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
                  <span className="exp-subtitle" style={{ color: '#F5A623' }}>Cená en el Paraíso</span>
                  <h3 className="exp-title">Ambiente Tropical</h3>
                  <div className="exp-bar" style={{ background: 'linear-gradient(to right,#2D5A27,transparent)' }}></div>
                  <p className="exp-desc">Sumergite en la exuberante flora de la selva, cielos abiertos y la calidez del territorio volcánico — a minutos del Arenal.</p>
                  <Link href="/es/about" className="exp-cta">
                    <span style={{ color: '#2D5A27' }}>Descubrí más</span>
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
            <span className="section-label">Lo Mejor de Nuestra Cocina</span>
            <h2 className="section-title">Platos Estrella</h2>
            <div className="section-divider"></div>
          </div>

          <div className="dishes-grid">
            <div className="dish-card fade-up">
              <div className="dish-img-wrap">
                <img src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21eead02761cdd64eb23.jpg" alt="Rib Eye" loading="lazy" />
                <div className="dish-img-gradient"></div>
                <span className="dish-badge orange">Elección del Chef</span>
              </div>
              <div className="dish-body">
                <div className="dish-row">
                  <h3 className="dish-name">Rib Eye</h3>
                  <span className="dish-price">₡17,500</span>
                </div>
                <p className="dish-desc">Corte premium servido chisporroteante sobre hierro fundido con papas al romero, plátano maduro, jalapeño y chimichurri.</p>
              </div>
            </div>

            <div className="dish-card fade-up">
              <div className="dish-img-wrap">
                <img src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d661cba538a2a13a41.jpg" alt="Pulpo a la Parrilla" loading="lazy" />
                <div className="dish-img-gradient"></div>
              </div>
              <div className="dish-body">
                <div className="dish-row">
                  <h3 className="dish-name">Pulpo a la Parrilla</h3>
                  <span className="dish-price">₡19,000</span>
                </div>
                <p className="dish-desc">Tentáculo de pulpo chamuscado con puré de camote, ensalada fresca, chimichurri de tomate y concassé cítrico de soya.</p>
              </div>
            </div>

            <div className="dish-card fade-up">
              <div className="dish-img-wrap">
                <img src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d29ab5e21035712b06.jpg" alt="Tartar de Atún" loading="lazy" />
                <div className="dish-img-gradient"></div>
                <span className="dish-badge orange">Favorito</span>
              </div>
              <div className="dish-body">
                <div className="dish-row">
                  <h3 className="dish-name">Tartar de Atún</h3>
                  <span className="dish-price">₡9,900</span>
                </div>
                <p className="dish-desc">Atún fresco marinado con salsa de soya, ajonjolí, limón, pepino y cebolla morada, servido con crostinis.</p>
              </div>
            </div>

            <div className="dish-card fade-up">
              <div className="dish-img-wrap">
                <img src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21e9ad0276ce1964ea9e.jpg" alt="Pollo Cahuita" loading="lazy" />
                <div className="dish-img-gradient"></div>
              </div>
              <div className="dish-body">
                <div className="dish-row">
                  <h3 className="dish-name">Pollo Cahuita</h3>
                  <span className="dish-price">₡9,100</span>
                </div>
                <p className="dish-desc">Pollo a la parrilla en salsa de leche de coco, tomillo y chile picante con vegetales y puré de papa.</p>
              </div>
            </div>

            <div className="dish-card fade-up">
              <div className="dish-img-wrap">
                <img src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba221edac584673cb76ed5.jpg" alt="Berenjena Parmesana" loading="lazy" />
                <div className="dish-img-gradient"></div>
                <span className="dish-badge green">Vegetariano</span>
              </div>
              <div className="dish-body">
                <div className="dish-row">
                  <h3 className="dish-name">Berenjena Parmesana</h3>
                  <span className="dish-price">₡8,500</span>
                </div>
                <p className="dish-desc">Berenjena crujiente con costra de parmesano en salsa pomodoro con tomates cherry, alcaparras, aceitunas y ensalada de la casa.</p>
              </div>
            </div>

            <div className="dish-card fade-up">
              <div className="dish-img-wrap">
                <img src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba222cdac58405aab77052.jpg" alt="Piña Flambeada" loading="lazy" />
                <div className="dish-img-gradient"></div>
                <span className="dish-badge orange">Premium</span>
              </div>
              <div className="dish-body">
                <div className="dish-row">
                  <h3 className="dish-name">Piña Flambeada</h3>
                  <span className="dish-price">₡4,700</span>
                </div>
                <p className="dish-desc">Piña caramelizada en salsa de naranja y canela, flambeada con licor de naranja y helado de vainilla.</p>
              </div>
            </div>
          </div>

          <div className="dishes-cta fade-up">
            <a href="/es/menu" className="btn-outline-orange">Ver Menú Completo →</a>
          </div>
        </div>
      </section>

      {/* COCKTAILS */}
      <section id="cocktails" className="cocktails-section">
        <div className="cocktails-bg"></div>
        <div className="container">
          <div className="cocktails-header fade-up">
            <span className="section-label">Detrás de la Barra</span>
            <h2 className="section-title">Cócteles de la Casa</h2>
            <div className="section-divider"></div>
            <p className="cocktails-desc">Cada copa cuenta una historia de la selva. Preparados con ingredientes frescos locales y destilados premium.</p>
          </div>

          <div className="cocktails-grid">
            <div className="cocktail-card fade-up">
              <div className="cocktail-img-wrap">
                <img src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c734203204cc754642fc04.jpg" alt="Margaritas Artesanales" loading="lazy" />
                <div className="cocktail-img-gradient"></div>
                <div className="cocktail-img-title"><h3>Margaritas Artesanales</h3></div>
              </div>
              <div className="cocktail-body">
                <p>Versiones elevadas del clásico, con mezcal y tequila premium, frutas tropicales locales y jarabes de la casa.</p>
                <ul className="cocktail-drinks">
                  <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Mango Habanero Margarita</li>
                  <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Maracuyá Mezcalita</li>
                  <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Coconut Lime Classic</li>
                </ul>
              </div>
            </div>

            <div className="cocktail-highlight-wrap fade-up">
              <div className="cocktail-card">
                <div className="cocktail-img-wrap">
                  <img src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c7341f899abb6360f61a32.jpg" alt="Paraíso Tiki" loading="lazy" />
                  <div className="cocktail-img-gradient"></div>
                  <div className="cocktail-img-title"><h3>Paraíso Tiki</h3></div>
                </div>
                <div className="cocktail-body">
                  <p>Transportate al trópico con creaciones a base de ron, capas de coco, maracuyá y piña fresca.</p>
                  <ul className="cocktail-drinks">
                    <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Arenal Volcano Punch</li>
                    <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Jungle Bird</li>
                    <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Blue Lagoon Tiki</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="cocktail-card fade-up">
              <div className="cocktail-img-wrap">
                <img src="https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c734202e89d8e97f5f1526.jpg" alt="Especiales de la Casa" loading="lazy" />
                <div className="cocktail-img-gradient"></div>
                <div className="cocktail-img-title"><h3>Especiales de la Casa</h3></div>
              </div>
              <div className="cocktail-body">
                <p>Creaciones exclusivas de nuestro bartender principal — inspiradas en la flora y fauna de la región del Arenal.</p>
                <ul className="cocktail-drinks">
                  <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Nanku Sunset</li>
                  <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Volcanic Night</li>
                  <li className="cocktail-drink"><span className="cocktail-drink-dot"></span>Jungle Elixir</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cocktails-cta fade-up">
            <a href="/es/menu" className="btn-outline-orange">Ver Menú de Bebidas →</a>
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
              <span className="section-label" style={{ margin: 0 }}>Sentí el Ritmo</span>
            </div>
            <h2 className="section-title">Noches de Música en Vivo</h2>
            <div className="section-divider"></div>
            <p className="music-header-desc">Artistas locales e internacionales se presentan en vivo en Nanku. Revisá el horario y reservá temprano — las noches de música se llenan rápido.</p>
          </div>

          <div className="music-schedule fade-up">
            {(schedule.length > 0 ? schedule : [
              { id:'1', day_of_week:'Monday',    is_active:true,  event_label:'Banda en Vivo', start_time:'7:00 PM', sort_order:1, artist:null },
              { id:'2', day_of_week:'Tuesday',   is_active:false, event_label:'Música Ambiental', start_time:'Toda la noche', sort_order:2, artist:null },
              { id:'3', day_of_week:'Wednesday', is_active:false, event_label:'Sesiones Acústicas', start_time:'Toda la noche', sort_order:3, artist:null },
              { id:'4', day_of_week:'Thursday',  is_active:false, event_label:'Música Ambiental', start_time:'Toda la noche', sort_order:4, artist:null },
              { id:'5', day_of_week:'Friday',    is_active:false, event_label:'Noche de DJ', start_time:'Toda la noche', sort_order:5, artist:null },
              { id:'6', day_of_week:'Saturday',  is_active:true,  event_label:'Banda en Vivo', start_time:'7:00 PM', sort_order:6, artist:null },
              { id:'7', day_of_week:'Sunday',    is_active:false, event_label:'Ambiente Relajado', start_time:'Toda la noche', sort_order:7, artist:null },
            ] as SchedDay[]).map((day) => (
              <div key={day.id} className={`music-day ${day.is_active ? 'active' : 'inactive'}`}>
                <span className="music-day-label">{DAY_LABEL_ES[day.day_of_week] ?? day.day_of_week.slice(0,3).toUpperCase()}</span>
                <div className="music-day-icon">
                  {day.is_active ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                  ) : (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                  )}
                </div>
                <span className="music-day-note">
                  {day.is_active && day.artist ? day.artist.name : day.event_label}
                </span>
              </div>
            ))}
          </div>

          <div className="music-live-cards fade-up">
            {(liveDays.length > 0 ? liveDays : [
              { id:'1', day_of_week:'Monday',   is_active:true, event_label:'Banda en Vivo', start_time:'7:00 PM', sort_order:1, artist:null },
              { id:'6', day_of_week:'Saturday', is_active:true, event_label:'Banda en Vivo', start_time:'7:00 PM', sort_order:6, artist:null },
            ] as SchedDay[]).map((day) => (
              <div key={day.id} className="music-live-card">
                <div className="music-live-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </div>
                <div>
                  <div className="music-live-title">Noche de {DAY_NAME_ES[day.day_of_week] ?? day.day_of_week}</div>
                  <div className="music-live-subtitle">
                    {day.artist ? day.artist.name : day.event_label} · Desde las {day.start_time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="music-cta fade-up">
            <a href="#reservations" className="btn-orange" style={{ display: 'inline-block' }}>Reservar para Noche Musical</a>
            <a href="/es/live-music" className="btn-outline-orange" style={{ display: 'inline-flex' }}>Ver Página de Música en Vivo →</a>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <div className="gallery-header fade-up">
            <span className="section-label">Dentro de Nanku</span>
            <h2 className="section-title">Galería</h2>
            <div className="section-divider"></div>
          </div>
          <Gallery />
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="reviews-section">
        <div className="reviews-bg"></div>
        <ReviewsScroll lang="es" />
      </section>

      {/* RESERVATIONS */}
      <section id="reservations" className="reservations-section noise-overlay">
        <div className="reservations-texture"></div>
        <div className="container-sm" style={{ position: 'relative', zIndex: 10 }}>
          <div className="reservations-header fade-up">
            <h2>Reservá tu Mesa</h2>
            <p>Reservá tu experiencia en Nanku. Te confirmamos en menos de 2 horas.</p>
          </div>
          <ReservationForm />
        </div>
      </section>

      {/* MAP */}
      <section id="location" className="map-section">
        <div className="container">
          <div className="map-header fade-up">
            <span className="section-label">Ubicación</span>
            <h2 className="section-title">Ubicación y Cómo Llegar</h2>
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
              ></iframe>
            </div>

            <div className="fade-up">
              <div className="map-info-card">
                <div className="map-info-addr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#E8751A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <div>
                    <div className="map-info-addr-label">Dirección</div>
                    <div className="map-info-addr-val">La Fortuna,<br />Calle 142, San Carlos<br />Costa Rica</div>
                  </div>
                </div>
                <div className="map-hours">
                  <div className="map-hours-title">Horario</div>
                  <div className="map-hours-row">
                    <span className="map-hours-day">Lunes – Jueves</span>
                    <span className="map-hours-time">12:00 PM – 11:00 PM</span>
                  </div>
                  <div className="map-hours-row">
                    <span className="map-hours-day">Viernes – Sábado</span>
                    <span className="map-hours-time">12:00 PM – 1:00 AM</span>
                  </div>
                  <div className="map-hours-row">
                    <span className="map-hours-day">Domingo</span>
                    <span className="map-hours-time">12:00 PM – 10:00 PM</span>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=Restaurante+Nanku+La+Fortuna+Costa+Rica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-directions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                  Cómo Llegar
                </a>
              </div>

              <div className="map-volcano">
                <div className="map-volcano-title">Cerca del Volcán Arenal</div>
                <div className="map-volcano-desc">Estamos en el corazón de La Fortuna, a solo 5 minutos de la entrada del Parque Nacional Volcán Arenal.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang="es" />
      <WhatsAppButton />
    </>
  )
}
