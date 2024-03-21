import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAuth } from './useAuth'

export const useRedirectIfNotAuthenticated = (redirectUri: string) => {
  const router = useRouter()
  const { authLoading, user } = useAuth()

  useEffect(() => {
    if (!authLoading && user === null) {
      router.push(redirectUri).catch((e) => {
        console.error(e)
      })
    }
  }, [authLoading, redirectUri, router, user])
}

export const useRedirectIfLoggedIn = (redirectUri: string) => {
  const router = useRouter()
  const { authLoading, user } = useAuth()

  useEffect(() => {
    if (!authLoading && user !== null) {
      router.push(redirectUri).catch((e) => {
        console.error(e)
      })
    }
  }, [authLoading, redirectUri, router, user])
}
