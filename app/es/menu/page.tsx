import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import MenuClient from '@/app/menu/MenuClient'

export const metadata: Metadata = {
  title: 'Menú',
  description:
    'Explora el menú completo de Nanku Tropical Bar & Steakhouse — cocina de campo a mesa, cócteles premium, mariscos y más en La Fortuna, Costa Rica.',
}

export default function MenuPageES() {
  return (
    <>
      <Navbar lang="es" activePage="Menu" />

      {/* MENU HERO */}
      <div className="menu-hero">
        <div className="menu-hero-glow"></div>
        <div className="menu-hero-inner">
          <span className="section-label">Nanku</span>
          <h1 className="menu-hero-title">Nuestro Menú</h1>
          <div className="divider-line" style={{ margin: '0 auto 1.25rem' }}></div>
          <p className="menu-hero-sub">Ingredientes frescos de origen local, todos los precios incluyen impuestos.</p>
        </div>
      </div>

      <MenuClient />

      <Footer lang="es" />
      <WhatsAppButton />
    </>
  )
}
