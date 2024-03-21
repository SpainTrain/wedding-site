import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAuth } from '../../auth/useAuth'

export const useEnsureAdmin = () => {
  const { user, logout } = useAuth()

  const router = useRouter()

  useEffect(() => {
    console?.debug?.('useEnsureAdmin useEffect', user)
    if (user !== null && user.claims.admin !== true) {
      router.push('/guest').catch(console.error.bind(console))
    }
  }, [user, router])

  return {
    user,
    logout,
    router,
  }
}
