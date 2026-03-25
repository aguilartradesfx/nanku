import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Música en Vivo',
  description:
    'Música en vivo cada lunes y sábado en Nanku Tropical Bar & Steakhouse en La Fortuna, Costa Rica. Artistas locales e internacionales desde las 7:00 PM.',
}

export default function LiveMusicPageES() {
  return (
    <>
      <Navbar lang="es" activePage="LiveMusic" />

      {/* HERO */}
      <section className="lm-hero">
        <div
          className="lm-hero-bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1920&q=85')" }}
        ></div>
        <div className="lm-hero-overlay"></div>
        <div className="lm-hero-glow"></div>
        <div className="lm-hero-content">
          <div className="lm-hero-label">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
            <span className="section-label" style={{ margin: 0 }}>Nanku</span>
          </div>
          <h1 className="lm-hero-title">Música en Vivo en Nanku</h1>
          <p className="lm-hero-subtitle">La mejor experiencia de música en vivo en La Fortuna</p>
          <p className="lm-hero-desc">Excelente comida, deliciosos cócteles y actuaciones en vivo inolvidables desde las 7:00 PM</p>
          <a
            href="https://wa.me/50624790707?text=Hola%21%20Quisiera%20reservar%20una%20mesa%20en%20Nanku%20para%20una%20noche%20de%20m%C3%BAsica%20en%20vivo."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary lm-hero-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
            Reservar para Noche de Música
          </a>
        </div>
        <div className="hero-scroll-arrow">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="bounce-arrow">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* HORARIO */}
      <section className="lm-schedule" id="scheduleSection">
        <div className="lm-schedule-glow"></div>
        <div className="lm-schedule-container">
          <div className="lm-schedule-header fade-up">
            <div className="lm-schedule-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="section-label" style={{ margin: 0 }}>Horario</span>
            </div>
            <h2 className="lm-schedule-title">Cuándo Disfrutar Música en Vivo</h2>
            <div className="divider-line" style={{ margin: '0 auto 1.25rem' }}></div>
          </div>
          <div className="lm-schedule-grid fade-up">
            {/* Lunes - EN VIVO */}
            <div className="schedule-day live">
              <span className="schedule-live-badge">EN VIVO</span>
              <span className="schedule-day-name live">Lunes</span>
              <div className="schedule-icon live">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="schedule-info">
                <p className="schedule-event live">Banda en Vivo</p>
                <div className="schedule-time live">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  7:00 PM
                </div>
              </div>
            </div>
            {/* Martes */}
            <div className="schedule-day">
              <span className="schedule-day-name">Martes</span>
              <div className="schedule-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="schedule-info">
                <p className="schedule-event">Playlist tropical</p>
                <div className="schedule-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Toda la noche
                </div>
              </div>
            </div>
            {/* Miércoles */}
            <div className="schedule-day">
              <span className="schedule-day-name">Miércoles</span>
              <div className="schedule-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="schedule-info">
                <p className="schedule-event">Playlist tropical</p>
                <div className="schedule-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Toda la noche
                </div>
              </div>
            </div>
            {/* Jueves */}
            <div className="schedule-day">
              <span className="schedule-day-name">Jueves</span>
              <div className="schedule-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="schedule-info">
                <p className="schedule-event">Playlist tropical</p>
                <div className="schedule-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Toda la noche
                </div>
              </div>
            </div>
            {/* Viernes */}
            <div className="schedule-day">
              <span className="schedule-day-name">Viernes</span>
              <div className="schedule-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="schedule-info">
                <p className="schedule-event">Playlist tropical</p>
                <div className="schedule-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Toda la noche
                </div>
              </div>
            </div>
            {/* Sábado - EN VIVO */}
            <div className="schedule-day live">
              <span className="schedule-live-badge">EN VIVO</span>
              <span className="schedule-day-name live">Sábado</span>
              <div className="schedule-icon live">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="schedule-info">
                <p className="schedule-event live">Banda en Vivo</p>
                <div className="schedule-time live">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  7:00 PM
                </div>
              </div>
            </div>
            {/* Domingo */}
            <div className="schedule-day">
              <span className="schedule-day-name">Domingo</span>
              <div className="schedule-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="schedule-info">
                <p className="schedule-event">Playlist tropical</p>
                <div className="schedule-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Toda la noche
                </div>
              </div>
            </div>
          </div>
          <p className="lm-schedule-note fade-up">El horario puede variar. Síguenos en Instagram para actualizaciones semanales.</p>
        </div>
      </section>

      {/* ARTISTAS */}
      <section className="lm-artists" id="artistsSection">
        <div className="lm-artists-container">
          <div className="lm-artists-header fade-up">
            <div className="lm-artists-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="section-label" style={{ color: '#D4A853', margin: 0 }}>Artistas</span>
            </div>
            <h2 className="lm-artists-title">Artistas Destacados</h2>
            <div className="divider-line" style={{ margin: '0 auto 1.25rem' }}></div>
            <p className="lm-artists-sub">Talento local e internacional en nuestro escenario</p>
          </div>
          <div className="lm-artists-grid fade-up">
            <div className="artist-card">
              <img src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80" alt="Cafe Soul" loading="lazy" className="artist-img" />
              <div className="artist-overlay"></div>
              <div className="artist-hover-overlay"></div>
              <div className="artist-info"><h3 className="artist-name">Cafe Soul</h3><div className="artist-line"></div></div>
            </div>
            <div className="artist-card">
              <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80" alt="Chalo Gonzalez" loading="lazy" className="artist-img" />
              <div className="artist-overlay"></div>
              <div className="artist-hover-overlay"></div>
              <div className="artist-info"><h3 className="artist-name">Chalo Gonzalez</h3><div className="artist-line"></div></div>
            </div>
            <div className="artist-card">
              <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80" alt="Duo Arkot" loading="lazy" className="artist-img" />
              <div className="artist-overlay"></div>
              <div className="artist-hover-overlay"></div>
              <div className="artist-info"><h3 className="artist-name">Duo Arkot</h3><div className="artist-line"></div></div>
            </div>
            <div className="artist-card">
              <img src="https://images.unsplash.com/photo-1516924962150-b3c3e991bcc0?w=600&q=80" alt="Josue Orozco" loading="lazy" className="artist-img" />
              <div className="artist-overlay"></div>
              <div className="artist-hover-overlay"></div>
              <div className="artist-info"><h3 className="artist-name">Josue Orozco</h3><div className="artist-line"></div></div>
            </div>
            <div className="artist-card">
              <img src="https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?w=600&q=80" alt="Mechas (Cadejo)" loading="lazy" className="artist-img" />
              <div className="artist-overlay"></div>
              <div className="artist-hover-overlay"></div>
              <div className="artist-info"><h3 className="artist-name">Mechas (Cadejo)</h3><div className="artist-line"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* MÁS QUE MÚSICA */}
      <section className="lm-experience" id="experienceSection">
        <div className="lm-experience-glow"></div>
        <div className="lm-experience-container">
          <div className="lm-experience-header fade-up">
            <span className="section-label">Experiencia</span>
            <h2 className="lm-experience-title">Más Que Solo Música</h2>
            <div className="divider-line" style={{ margin: '0 auto 2rem' }}></div>
          </div>
          <div className="lm-experience-grid fade-up">
            <div className="lm-experience-text">
              <p className="lm-experience-desc">
                En Nanku, las noches de música en vivo son una experiencia completa. Disfrute de cortes premium, cócteles tropicales signature y el cálido ambiente tropical mientras artistas locales e internacionales crean el ambiente perfecto. Ya sea que esté celebrando una ocasión especial o simplemente buscando la mejor noche en La Fortuna — esto es lo que busca.
              </p>
            </div>
            <div className="lm-experience-photos">
              <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80" alt="Cócteles" loading="lazy" className="lm-exp-photo" />
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" alt="Cortes" loading="lazy" className="lm-exp-photo" />
              <img src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80" alt="Música en Vivo" loading="lazy" className="lm-exp-photo full" />
            </div>
          </div>
          <div className="lm-feature-cards fade-up">
            <div className="lm-feature-card">
              <div className="lm-feature-icon" style={{ background: 'rgba(245,166,35,0.082)', borderColor: 'rgba(245,166,35,0.188)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5">
                  <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="lm-feature-title">Cócteles Signature</h3>
              <p className="lm-feature-desc">Bebidas artesanales para acompañar la música</p>
            </div>
            <div className="lm-feature-card">
              <div className="lm-feature-icon" style={{ background: 'rgba(232,117,26,0.082)', borderColor: 'rgba(232,117,26,0.188)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="1.5">
                  <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
              <h3 className="lm-feature-title">Cena y Espectáculo</h3>
              <p className="lm-feature-desc">Menú completo disponible durante las actuaciones</p>
            </div>
            <div className="lm-feature-card">
              <div className="lm-feature-icon" style={{ background: 'rgba(45,90,39,0.082)', borderColor: 'rgba(45,90,39,0.188)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2D5A27" strokeWidth="1.5">
                  <path d="M17 8C8 10 5.9 16.17 3.82 22M9.58 6.95c0 .27.05.54.1.8C5.98 9.25 3.67 13.25 3 17c3.5-2 7.5-2.5 11-2 1.06-2.79 2.67-5.18 6-6M12 2a7 7 0 01-7 7" />
                </svg>
              </div>
              <h3 className="lm-feature-title">Ambiente Tropical</h3>
              <p className="lm-feature-desc">Asientos al aire libre bajo la canopia selvática</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lm-cta" id="ctaSection">
        <div className="lm-cta-glow"></div>
        <div className="lm-cta-inner">
          <div className="fade-up">
            <div className="lm-cta-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <h2 className="lm-cta-title">No Se Pierda el Próximo Show</h2>
            <p className="lm-cta-sub">Las mesas se llenan rápido en noches de música — reserve la suya ahora</p>
            <div className="lm-cta-buttons">
              <a
                href="https://wa.me/50624790707?text=Hola%21%20Quisiera%20reservar%20una%20mesa%20en%20Nanku%20para%20una%20noche%20de%20m%C3%BAsica%20en%20vivo."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-white-orange"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Reservar su Mesa
              </a>
              <Link href="/es/menu" className="btn-outline-white">Ver Menú Completo</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer lang="es" />
      <WhatsAppButton />
    </>
  )
}
