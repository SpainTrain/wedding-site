import { cond, sample, size } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Box } from '@mui/material'

import { getGuestCollectionByEmail } from '../../src'
import { useAuth } from '../../src/auth/useAuth'
import { useRedirectIfNotAuthenticated } from '../../src/auth/useAuthRedirects'
import { GuestPage } from '../../src/components/guests/GuestPage'
import { GuestError } from '../../src/components/guests/GuestError'

const GuestHome: NextPage = () => {
  useRedirectIfNotAuthenticated('/guest/login')

  const { user, logout } = useAuth()
  const router = useRouter()

  // Get all other guest records that match user
  const [guestRecords = [], guestsLoading, guestsFirestoreErrObj] =
    useCollectionData(getGuestCollectionByEmail(user?.email ?? ''))
  console.log('guestRecords', guestRecords)

  // Overall loading state
  const [overallLoading, setOverallLoading] = useState(true)

  // Zero case handler
  const [guestStateError, setGuestStateError] = useState<
    GuestError | undefined
  >()
  const zeroCaseError: GuestError = useMemo(
    () => ({
      code: 'NotFound',
      name: 'Guest Not Found',
      message: `Guest with email address ${
        user?.email ?? 'UNKNOWN'
      } not found.`,
    }),
    [user?.email]
  )
  const handleNoGuestFound = useCallback(() => {
    setGuestStateError(zeroCaseError)
    setOverallLoading(false)
  }, [zeroCaseError])

  // Guests found handler
  const handleGuestsFound = useCallback(() => {
    const guest = sample(guestRecords)
    if (guest === undefined) {
      handleNoGuestFound()
    } else {
      router.push(`/guest/${guest.id}`).catch((err) => console.error(err))
    }
  }, [guestRecords, handleNoGuestFound, router])

  // Handle redirection based on guest records that match user
  useEffect(
    () =>
      cond([
        [() => guestsLoading, () => void 0],
        [() => size(guestRecords) === 0, () => handleNoGuestFound()],
        [() => size(guestRecords) >= 1, () => handleGuestsFound()],
        [() => true, () => console.log('Condition should be impossible')],
      ])(),
    [guestRecords, guestsLoading, handleGuestsFound, handleNoGuestFound]
  )

  // Shouldn't actually be called on this page, but here in case
  const onChangeGuest = useCallback(
    (guestId: string) => {
      router.push(`/guest/${guestId}`).catch((err) => {
        console.error(err)
      })
    },
    [router]
  )

  return (
    <Box>
      <Head>
        <title>{'Mike & Holly'}</title>
        <meta name="description" content="Our wedding website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <GuestPage
          loading={guestsLoading || overallLoading}
          logout={logout}
          onChangeGuest={onChangeGuest}
          error={guestsFirestoreErrObj ?? guestStateError}
        />
      </main>
    </Box>
  )
}

export default GuestHome
