import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Note, NoteFormData } from '@/types/index'

const COLLECTION_NAME = 'notes'

const toNote = (docData: {
  title: string
  content: string
  createdAt: Timestamp
  updatedAt: Timestamp
}, id: string, userId: string): Note => ({
  id,
  userId,
  title: docData.title,
  content: docData.content,
  createdAt: docData.createdAt.toDate(),
  updatedAt: docData.updatedAt.toDate(),
})

export const createNote = async (userId: string, data: NoteFormData): Promise<string> => {
  if (!db) throw new Error('Firestore not initialized')
  
  const notesRef = collection(db, 'users', userId, COLLECTION_NAME)
  const now = new Date()
  
  const docRef = await addDoc(notesRef, {
    title: data.title,
    content: data.content,
    createdAt: now,
    updatedAt: now,
  })
  
  return docRef.id
}

export const getNotes = async (userId: string): Promise<Note[]> => {
  if (!db) throw new Error('Firestore not initialized')
  
  const notesRef = collection(db, 'users', userId, COLLECTION_NAME)
  const q = query(notesRef, orderBy('updatedAt', 'desc'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => {
    const data = doc.data() as {
      title: string
      content: string
      createdAt: Timestamp
      updatedAt: Timestamp
    }
    return toNote(data, doc.id, userId)
  })
}

export const getNote = async (userId: string, noteId: string): Promise<Note | null> => {
  if (!db) throw new Error('Firestore not initialized')
  
  const noteRef = doc(db, 'users', userId, COLLECTION_NAME, noteId)
  const snapshot = await getDoc(noteRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  const data = snapshot.data() as {
    title: string
    content: string
    createdAt: Timestamp
    updatedAt: Timestamp
  }
  
  return toNote(data, snapshot.id, userId)
}

export const updateNote = async (userId: string, noteId: string, data: Partial<NoteFormData>): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized')
  
  const noteRef = doc(db, 'users', userId, COLLECTION_NAME, noteId)
  await updateDoc(noteRef, {
    ...data,
    updatedAt: new Date(),
  })
}

export const deleteNote = async (userId: string, noteId: string): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized')
  
  const noteRef = doc(db, 'users', userId, COLLECTION_NAME, noteId)
  await deleteDoc(noteRef)
}