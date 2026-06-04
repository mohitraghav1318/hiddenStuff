'use client'

import Link from 'next/link'
import { useAuthContext } from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const { user, loading } = useAuthContext()
  const { signOut } = useAuth()

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-black dark:text-white">
         Hidden Stuffs
        </Link>
        
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="rounded-md bg-zinc-200 px-3 py-1 text-sm font-medium text-black hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}