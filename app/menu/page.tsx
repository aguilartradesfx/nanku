import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import MenuClient from './MenuClient'

export const metadata: Metadata = {
  title: 'Menu — Steaks, Seafood & Cocktails',
  description:
    'Explore the full menu at Nanku Tropical Bar & Steakhouse — farm-to-table cuisine, premium cocktails, seafood and more in La Fortuna, Costa Rica.',
  alternates: {
    canonical: 'https://www.restaurantenanku.net/menu',
    languages: {
      'en': 'https://www.restaurantenanku.net/menu',
      'es': 'https://www.restaurantenanku.net/es/menu',
      'x-default': 'https://www.restaurantenanku.net/menu',
    },
  },
}

const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Nanku Tropical Bar & Steakhouse Menu',
  url: 'https://www.restaurantenanku.net/menu',
  inLanguage: 'en',
  hasMenuSection: [
    { '@type': 'MenuSection', name: 'Appetizers', hasMenuItem: [
      { '@type': 'MenuItem', name: 'Tuna Tartar', description: 'Tuna marinated with soy sauce, sesame, lemon, cucumber, red onions, served with crostini.', offers: { '@type': 'Offer', price: '9900', priceCurrency: 'CRC' } },
      { '@type': 'MenuItem', name: 'Octopus Ceviche', description: 'Octopus marinated with citrus soy sauce served with smashed plantains.', offers: { '@type': 'Offer', price: '10500', priceCurrency: 'CRC' } },
    ] },
    { '@type': 'MenuSection', name: 'Sea Food', hasMenuItem: [
      { '@type': 'MenuItem', name: 'Grilled Octopus', description: 'Grilled octopus with sweet potato, salad, tomato chimichurri, and citrus concasse soy sauce.', offers: { '@type': 'Offer', price: '19000', priceCurrency: 'CRC' } },
      { '@type': 'MenuItem', name: 'Teriyaki Tuna', description: 'Encrusted yellow-fin tuna with sesame seeds, served with vegetables, mashed potatoes, and teriyaki sauce.', offers: { '@type': 'Offer', price: '14200', priceCurrency: 'CRC' } },
    ] },
    { '@type': 'MenuSection', name: 'Pasta', hasMenuItem: [
      { '@type': 'MenuItem', name: 'Salmon Ravioli', description: 'Salmon ravioli with grana padana, Gorgonzola sauce, cherry tomatoes, mushrooms, basil and crostini.', offers: { '@type': 'Offer', price: '10200', priceCurrency: 'CRC' } },
    ] },
    { '@type': 'MenuSection', name: 'White Meat', hasMenuItem: [
      { '@type': 'MenuItem', name: 'BBQ Pork Ribs', description: 'Pork ribs in pineapple BBQ sauce served with house salad, smashed plantains, refried beans and pico de gallo.', offers: { '@type': 'Offer', price: '12000', priceCurrency: 'CRC' } },
    ] },
    { '@type': 'MenuSection', name: 'Steaks', hasMenuItem: [
      { '@type': 'MenuItem', name: 'Surf and Turf', description: 'Premium steak and lobster tail combo served with rosemary potatoes, sweet plantain, jalapeno, and chimichurri.', offers: { '@type': 'Offer', price: '31900', priceCurrency: 'CRC' } },
      { '@type': 'MenuItem', name: 'Rib Eye', offers: { '@type': 'Offer', price: '17500', priceCurrency: 'CRC' } },
      { '@type': 'MenuItem', name: 'Sirloin Steak', offers: { '@type': 'Offer', price: '19500', priceCurrency: 'CRC' } },
    ] },
    { '@type': 'MenuSection', name: 'Vegetarian', hasMenuItem: [
      { '@type': 'MenuItem', name: 'Parmesan Eggplant', description: 'Encrusted eggplant with Parmesan cheese served with tomato sauce, capers, olives, and house salad.', suitableForDiet: 'https://schema.org/VegetarianDiet', offers: { '@type': 'Offer', price: '8500', priceCurrency: 'CRC' } },
    ] },
    { '@type': 'MenuSection', name: 'Costa Rica', hasMenuItem: [
      { '@type': 'MenuItem', name: 'Typical Casado', description: 'Rice, beans, picadillo, fried eggs, tortilla, cheese, salad and sweet plantain. Choice of beef, chicken or tilapia.', offers: { '@type': 'Offer', price: '7800', priceCurrency: 'CRC' } },
    ] },
    { '@type': 'MenuSection', name: 'Desserts', hasMenuItem: [
      { '@type': 'MenuItem', name: 'Chocolate Brownie with Vanilla Ice Cream', offers: { '@type': 'Offer', price: '4700', priceCurrency: 'CRC' } },
    ] },
  ],
}

export default function MenuPage({ searchParams }: { searchParams: { tab?: string } }) {
  const isDrinks = searchParams?.tab === 'drinks'
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <Navbar lang="en" activePage="Menu" />

      {/* MENU HERO */}
      <div className="menu-hero">
        <div className="menu-hero-glow"></div>
        <div className="menu-hero-inner">
          <span className="section-label">Nanku</span>
          <h1 className="menu-hero-title">{isDrinks ? 'Our Drinks Menu' : 'Our Menu'}</h1>
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
