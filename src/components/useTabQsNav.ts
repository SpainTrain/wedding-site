import { NextRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'

const tabQsParamName = 'tab'

const AdminNavState = z.enum(['Invitees', 'Addressees', 'Guests', 'Events'])
const GuestNavState = z.enum(['Overview', 'Itinerary', 'My Guests'])

export const useAdminTabQsNav = (router: NextRouter) => {
  const currTab = AdminNavState.default('Invitees').parse(
    router.query[tabQsParamName]
  )

  const [navState, setNavState] =
    useState<z.infer<typeof AdminNavState>>(currTab)
  useEffect(() => {
    setNavState(currTab)
  }, [setNavState, currTab])

  const navigateToTab = useCallback(
    (navState: z.infer<typeof AdminNavState>) => {
      setNavState(navState)
      router
        .push({
          query: { [tabQsParamName]: navState },
        })
        .catch(console.error.bind(console))
    },
    [setNavState, router]
  )

  return {
    navState,
    navigateToTab,
    tabs: AdminNavState.options,
  } as {
    navState: z.infer<typeof AdminNavState>
    navigateToTab: (navState: z.infer<typeof AdminNavState>) => void
    tabs: typeof AdminNavState.options
  }
}

export const useGuestTabQsNav = (router: NextRouter) => {
  const currTab = GuestNavState.default('Overview').parse(
    router.query[tabQsParamName]
  )

  const [navState, setNavState] =
    useState<z.infer<typeof GuestNavState>>(currTab)
  useEffect(() => {
    setNavState(currTab)
  }, [setNavState, currTab])

  const navigateToTab = useCallback(
    (navState: z.infer<typeof GuestNavState>) => {
      setNavState(navState)
      router
        .push({
          query: { ...router.query, [tabQsParamName]: navState },
        })
        .catch(console.error.bind(console))
    },
    [setNavState, router]
  )

  return {
    navState,
    navigateToTab,
    tabs: GuestNavState.options,
  } as {
    navState: z.infer<typeof GuestNavState>
    navigateToTab: (navState: z.infer<typeof GuestNavState>) => void
    tabs: typeof GuestNavState.options
  }
}
