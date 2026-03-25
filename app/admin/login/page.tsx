'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-4">
            <span className="text-orange-400 font-bold text-2xl">N</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Nanku Admin</h1>
          <p className="text-zinc-400 text-sm mt-1">Sign in to manage reservations</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nanku.com"
              required
              autoComplete="email"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-3.5 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-6">
          Nanku Tropical Bar &amp; Steakhouse · Admin Portal
        </p>
      </div>
    </div>
  )
}
