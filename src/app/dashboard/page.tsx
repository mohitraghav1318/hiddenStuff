'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/RouteGuard'
import { useAuth } from '@/hooks/useAuth'
import { getNotes, deleteNote, createNote } from '@/services/notes'
import type { Note } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.uid) return

    const fetchNotes = async () => {
      const fetchedNotes = await getNotes(user.uid)
      setNotes(fetchedNotes)
    }

    fetchNotes().finally(() => setLoading(false))
  }, [user?.uid])

  const handleCreateNote = async () => {
    if (!user?.uid) return
    setIsCreating(true)
    try {
      await createNote(user.uid, { title: 'Untitled', content: '' })
      setLoading(true)
      const fetchedNotes = await getNotes(user.uid)
      setNotes(fetchedNotes)
      setLoading(false)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!user?.uid) return
    if (!confirm('Are you sure you want to delete this note?')) return
    setDeletingId(noteId)
    try {
      await deleteNote(user.uid, noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col p-4">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black dark:text-white">Your Notes</h2>
            <button
              onClick={handleCreateNote}
              disabled={isCreating}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : '+ New Note'}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-zinc-600 dark:text-zinc-400">Loading notes...</div>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">No notes yet</p>
              <button
                onClick={handleCreateNote}
                disabled={isCreating}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : '+ Create your first note'}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <Link href={`/note/${note.id}`} className="block">
                    <h3 className="mb-2 font-medium text-black dark:text-white truncate">
                      {note.title || 'Untitled'}
                    </h3>
                    <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {note.content || 'No content'}
                    </p>
                  </Link>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={!!deletingId}
                    className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    {deletingId === note.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}