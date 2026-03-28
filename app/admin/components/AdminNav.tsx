'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminTheme } from './AdminThemeProvider'

const NAV_ITEMS = [
  { href: '/admin',               label: 'Dashboard' },
  { href: '/admin/reservations',  label: 'Reservaciones' },
  { href: '/admin/new-reservation', label: '+ Nueva' },
  { href: '/admin/table-map',     label: 'Mapa de Mesas' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const { theme, toggle } = useAdminTheme()

  return (
    <div className="flex gap-0 overflow-x-auto items-center">
      {NAV_ITEMS.map(item => {
        const isActive = item.href === '/admin'
          ? pathname === '/admin'
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition ${
              isActive
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
            }`}
          >
            {item.label}
          </Link>
        )
      })}

      {/* Theme toggle */}
      <button
        onClick={toggle}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="ml-1 px-2 py-2 rounded-lg text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition border-b-2 border-transparent"
      >
        {theme === 'dark' ? (
          // Sun icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          // Moon icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </div>
  )
}
