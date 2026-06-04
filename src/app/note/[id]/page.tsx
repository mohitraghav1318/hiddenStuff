'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/RouteGuard'
import { useAuth } from '@/hooks/useAuth'
import { useParams } from 'next/navigation'
import { getNote, updateNote } from '@/services/notes'
import type { Note } from '@/types'

export default function NotePage() {
  const { user, signOut } = useAuth()
  const params = useParams()
  const noteId = params.id as string
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!user?.uid || isLoaded) return

    getNote(user.uid, noteId).then((noteData) => {
      setNote(noteData)
      if (noteData) {
        setTitle(noteData.title)
        setContent(noteData.content)
      }
      setIsLoaded(true)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, noteId])

  useEffect(() => {
    if (!note || !user?.uid || !isLoaded) return

    const timeoutId = setTimeout(() => {
      setSaving(true)
      updateNote(user.uid, noteId, { title, content })
        .then(() => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        })
        .finally(() => setSaving(false))
    }, 1000)

    return () => clearTimeout(timeoutId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, title, content])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <header className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <h1 className="text-xl font-bold text-black dark:text-white">Note</h1>
            <button
              onClick={signOut}
              className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-black hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col p-4">
          <div className="mx-auto w-full max-w-4xl">
            {!isLoaded ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-zinc-600 dark:text-zinc-400">Loading note...</div>
              </div>
            ) : !note ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-zinc-600 dark:text-zinc-400">Note not found</div>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-end">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {saving ? 'Saving...' : saved ? 'Saved!' : ' '}
                  </span>
                </div>
                
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled"
                  className="mb-4 w-full text-2xl font-bold text-black dark:text-white placeholder-zinc-400 focus:outline-none dark:bg-transparent"
                />
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing..."
                  className="w-full min-h-96 resize-none text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 focus:outline-none dark:bg-transparent"
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}