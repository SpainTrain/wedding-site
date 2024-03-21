import { z } from 'zod'
import { createContext, useContext } from 'react'

import { useFirebaseAuth } from './useFirebaseAuth'
import { AppUser } from './authSchemas'

const authUserContext = createContext<{
  user: z.infer<typeof AppUser> | null
  authLoading: boolean
  logout: () => void
}>({
  user: null,
  authLoading: true,
  logout: () => {
    console.log('logout')
  },
})

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth()
  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  )
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext)
