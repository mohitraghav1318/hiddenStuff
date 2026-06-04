import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export const signup = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!auth) throw new Error('Firebase auth not initialized')
  return createUserWithEmailAndPassword(auth, email, password)
}

export const login = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!auth) throw new Error('Firebase auth not initialized')
  return signInWithEmailAndPassword(auth, email, password)
}

export const logout = async (): Promise<void> => {
  if (!auth) throw new Error('Firebase auth not initialized')
  return signOut(auth)
}

export const getAuthErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const authError = error as { code: string; message: string }
    switch (authError.code) {
      case 'auth/user-not-found':
        return 'No account found with this email'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/email-already-in-use':
        return 'An account already exists with this email'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/invalid-email':
        return 'Invalid email address'
      default:
        return authError.message || 'An authentication error occurred'
    }
  }
  return 'An authentication error occurred'
}