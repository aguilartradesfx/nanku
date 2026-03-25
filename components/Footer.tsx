import Link from 'next/link'

interface FooterProps {
  lang?: 'en' | 'es'
}

export default function Footer({ lang = 'en' }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          {/* Logo + tagline */}
          <div>
            <div className="footer-logo-row">
              <div className="footer-logo-icon">
                <span>N</span>
              </div>
              <span className="footer-logo-name">NANKU</span>
            </div>
            <p className="footer-tagline">
              {lang === 'es'
                ? 'Cocina tropical premium, cócteles artesanales y música en vivo bajo las estrellas de Arenal.'
                : 'Premium tropical dining, handcrafted cocktails & live music under the stars of Arenal.'}
            </p>
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/restaurantenanku/"
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/RestauranteNanku/"
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.tripadvisor.es/Restaurant_Review-g309226-d7273982-Reviews-Restaurante_Nanku-La_Fortuna_de_San_Carlos_Arenal_Volcano_National_Park_Province_.html"
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TripAdvisor"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="8.5" cy="14" r="3.5" />
                  <circle cx="15.5" cy="14" r="3.5" />
                  <path d="M12 5C8.5 5 5.5 7.5 5.5 7.5H2.5l2 2.5a7 7 0 0 0-.5 2.5h16a7 7 0 0 0-.5-2.5l2-2.5h-3S15.5 5 12 5z" />
                </svg>
              </a>
              <a
                href="https://wa.me/50624790707"
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="footer-col-title">
              {lang === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
            </h4>
            <ul className="footer-links">
              <li>
                <Link href={lang === 'es' ? '/es' : '/'}>
                  {lang === 'es' ? 'Inicio' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es#experience' : '/#experience'}>
                  {lang === 'es' ? 'Nuestra Experiencia' : 'Our Experience'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es#dishes' : '/#dishes'}>
                  {lang === 'es' ? 'Platos Destacados' : 'Signature Dishes'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es#cocktails' : '/#cocktails'}>
                  {lang === 'es' ? 'Cócteles' : 'Cocktails'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es/live-music' : '/live-music'}>
                  {lang === 'es' ? 'Música en Vivo' : 'Live Music'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es#gallery' : '/#gallery'}>
                  {lang === 'es' ? 'Galería' : 'Gallery'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es/about' : '/about'}>
                  {lang === 'es' ? 'Nosotros' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es#reservations' : '/#reservations'}>
                  {lang === 'es' ? 'Reservar Mesa' : 'Reserve a Table'}
                </Link>
              </li>
              <li>
                <Link href={lang === 'es' ? '/es/menu' : '/menu'}>
                  {lang === 'es' ? 'Menú Completo' : 'Full Menu'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="footer-col-title">
              {lang === 'es' ? 'Horario de Atención' : 'Opening Hours'}
            </h4>
            <ul className="footer-hours">
              <li className="footer-hours-row">
                <span className="footer-hours-day">
                  {lang === 'es' ? 'Lunes' : 'Monday'}
                </span>
                <div className="footer-hours-time-wrap">
                  <span className="footer-hours-time">12 PM – 11 PM</span>
                  <span className="footer-live-badge">LIVE</span>
                </div>
              </li>
              <li className="footer-hours-row">
                <span className="footer-hours-day">
                  {lang === 'es' ? 'Martes' : 'Tuesday'}
                </span>
                <span className="footer-hours-time">12 PM – 11 PM</span>
              </li>
              <li className="footer-hours-row">
                <span className="footer-hours-day">
                  {lang === 'es' ? 'Miércoles' : 'Wednesday'}
                </span>
                <span className="footer-hours-time">12 PM – 11 PM</span>
              </li>
              <li className="footer-hours-row">
                <span className="footer-hours-day">
                  {lang === 'es' ? 'Jueves' : 'Thursday'}
                </span>
                <span className="footer-hours-time">12 PM – 11 PM</span>
              </li>
              <li className="footer-hours-row">
                <span className="footer-hours-day">
                  {lang === 'es' ? 'Viernes' : 'Friday'}
                </span>
                <span className="footer-hours-time">12 PM – 1 AM</span>
              </li>
              <li className="footer-hours-row">
                <span className="footer-hours-day">
                  {lang === 'es' ? 'Sábado' : 'Saturday'}
                </span>
                <div className="footer-hours-time-wrap">
                  <span className="footer-hours-time">12 PM – 1 AM</span>
                  <span className="footer-live-badge">LIVE</span>
                </div>
              </li>
              <li className="footer-hours-row">
                <span className="footer-hours-day">
                  {lang === 'es' ? 'Domingo' : 'Sunday'}
                </span>
                <span className="footer-hours-time">12 PM – 10 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-col-title">
              {lang === 'es' ? 'Contáctanos' : 'Contact Us'}
            </h4>
            <ul className="footer-contact">
              <li>
                <a href="tel:+50624790707">
                  <div className="footer-contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#B0B0B0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.97-1.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span>+506-2479-0707</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@restaurantenanku.com">
                  <div className="footer-contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#B0B0B0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span>info@restaurantenanku.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/50624790707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-link"
                >
                  <div className="footer-contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#B0B0B0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
            <div className="footer-addr-box">
              <div className="footer-addr-city">La Fortuna, Arenal</div>
              <div className="footer-addr-street">
                La Fortuna Town,
                <br />
                Street 142, San Carlos, Costa Rica
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} Nanku Tropical Bar &amp; Steakhouse.{' '}
            {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <div className="footer-badge">
            <div className="footer-badge-dot"></div>
            <span className="footer-badge-text">La Fortuna, Costa Rica</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
