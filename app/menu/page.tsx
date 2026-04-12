import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import MenuClient from './MenuClient'

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Explore the full menu at Nanku Tropical Bar & Steakhouse — farm-to-table cuisine, premium cocktails, seafood and more in La Fortuna, Costa Rica.',
}

export default function MenuPage() {
  return (
    <>
      <Navbar lang="en" activePage="Menu" />

      {/* MENU HERO */}
      <div className="menu-hero">
        <div className="menu-hero-glow"></div>
        <div className="menu-hero-inner">
          <span className="section-label">Nanku</span>
          <h1 className="menu-hero-title">Our Menu</h1>
          <div className="divider-line" style={{ margin: '0 auto 1.25rem' }}></div>
          <p className="menu-hero-sub">Farm-to-table freshness, locally sourced ingredients, all prices include taxes.</p>
        </div>
      </div>

      <Suspense><MenuClient /></Suspense>

      <Footer lang="en" />
      <WhatsAppButton />
    </>
  )
}
