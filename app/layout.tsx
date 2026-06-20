import type { Metadata } from 'next'
import { Playfair_Display, Lato, Montserrat } from 'next/font/google'
import Script from 'next/script'
import { headers } from 'next/headers'
import './globals.css'
import FadeUpObserver from '@/components/FadeUpObserver'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.restaurantenanku.net'),
  title: {
    default: 'Nanku Tropical Bar & Steakhouse | La Fortuna, Costa Rica',
    template: '%s | Nanku',
  },
  description:
    'Premium steaks, handcrafted tropical cocktails & live music under the stars. Located in La Fortuna, Costa Rica — near Arenal Volcano.',
  keywords: ['restaurant La Fortuna', 'Nanku', 'steakhouse Costa Rica', 'tropical bar Arenal'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Nanku Tropical Bar & Steakhouse',
    images: [
      {
        url: 'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c194d50d1082cd084c8590.jpg',
        width: 1200,
        height: 630,
        alt: 'Surf and Turf at Nanku Tropical Bar & Steakhouse',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  themeColor: '#1A1A1A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = headers().get('x-pathname') || ''
  const lang = pathname.startsWith('/es') ? 'es' : 'en'
  return (
    <html
      lang={lang}
      className={`${playfair.variable} ${lato.variable} ${montserrat.variable}`}
    >
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KF7H92HN"
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <FadeUpObserver />
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KF7H92HN');`,
          }}
        />
      </body>
    </html>
  )
}
