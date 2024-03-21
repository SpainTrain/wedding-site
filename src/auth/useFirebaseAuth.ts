import { z } from 'zod'
import { useCallback, useEffect, useState } from 'react'
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  User,
} from 'firebase/auth'

import { getFirebase } from '../config'
import { AppUser, Claims } from './authSchemas'

const getAuth = () => getFirebase().auth

const mapUserData = async (
  user: Omit<User, 'providerData'>
): Promise<z.infer<typeof AppUser>> => {
  const { uid, email, phoneNumber, photoURL, displayName } = user
  const token = await user.getIdToken(true)
  const tokenResult = await user.getIdTokenResult(true)

  // Validation
  if (email === null) {
    throw new Error('Email null')
  }
  const claims = Claims.parse(tokenResult.claims)

  return {
    id: uid,
    email,
    token,
    claims,
    ...(phoneNumber === null ? {} : { mobile: phoneNumber }),
    ...(photoURL === null ? {} : { photoURL }),
    ...(displayName === null ? {} : { displayName }),
  }
}

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<z.infer<typeof AppUser> | null>(null)
  const [authLoading, setLoading] = useState(true)

  const auth = getAuth()

  const logout = async () => {
    return signOut(getAuth()).catch((e) => {
      console.error(e)
    })
  }

  const authStateChangedAsync = async (userToken: User | null) => {
    if (userToken === null) {
      setUser(null)
      setLoading(false)
    } else {
      setLoading(true)
      setUser(await mapUserData(userToken))
      setLoading(false)
    }
  }

  const authStateChanged = useCallback((userToken: User | null) => {
    authStateChangedAsync(userToken).catch((e) => {
      console.error(e)
    })
  }, [])

  useEffect(() => {
    const cancelAuthListener = auth.onAuthStateChanged(authStateChanged)

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = z
        .string()
        .email()
        .parse(
          window.localStorage.getItem('emailForSignIn') ??
            window.prompt('Please provide your email for confirmation')
        )
      setLoading(true)
      signInWithEmailLink(auth, email, window.location.href)
        .then(async ({ user }) => {
          setLoading(true)
          const userData = await mapUserData(user)
          setUser(userData)
        })
        .catch((e) => {
          console.error(e)
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    return () => cancelAuthListener()
  }, [auth, authStateChanged])

  return { user, logout, authLoading }
}
