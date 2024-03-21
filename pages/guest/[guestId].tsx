import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useRollbarPerson } from '@rollbar/react'
import * as FullStory from '@fullstory/browser'
import {
  useDocumentData,
  useCollectionData,
} from 'react-firebase-hooks/firestore'

import { Box } from '@mui/material'

import { useRedirectIfNotAuthenticated } from '../../src/auth/useAuthRedirects'
import { GuestPage } from '../../src/components/guests/GuestPage'
import {
  getEventCollection,
  getGuestCollectionByEmail,
  getGuestCollectionByInviteeId,
  getGuestDoc,
  getInviteeCollectionByEmail,
  getInviteeDoc,
} from '../../src'

import { useAuth } from '../../src/auth/useAuth'
import { reject } from 'lodash'

const LimitedGuestView = () => {
  const router = useRouter()
  const { user, logout } = useAuth()

  // Get the data
  const { guestId } = router.query
  const [guestDocRef, setGuestDocRef] =
    useState<ReturnType<typeof getGuestDoc>>()
  const [isDocRefLoading, setIsDocRefLoading] = useState(true)
  useEffect(() => {
    if (typeof guestId === 'string') {
      setGuestDocRef(getGuestDoc(guestId))
    }
    setIsDocRefLoading(false)
  }, [guestId])
  const [guestDocData, guestDocLoading, guestDocError] =
    useDocumentData(guestDocRef)

  // Get logged in user's guests
  const [guestRecords = [], guestsLoading, guestsFirestoreErrObj] =
    useCollectionData(getGuestCollectionByEmail(user?.email ?? ''))

  // Events
  const [eventRecords = [], eventsLoading, eventsFirestoreErrObj] =
    useCollectionData(getEventCollection())

  const loading =
    isDocRefLoading || guestDocLoading || guestsLoading || eventsLoading
  const error = guestDocError ?? guestsFirestoreErrObj ?? eventsFirestoreErrObj

  const onChangeGuest = useCallback(
    (guestId: string) => {
      router.push(`/guest/${guestId}`).catch((err) => {
        console.error(err)
      })
    },
    [router]
  )

  const otherGuestsSameEmail = reject(guestRecords, (g) => g.id === guestId)

  return (
    <Box>
      <GuestPage
        {...{
          loading,
          error,
          logout,
          guestRecord: guestDocData,
          otherGuestsSameEmail: otherGuestsSameEmail,
          onChangeGuest,
          eventRecords,
        }}
      />
    </Box>
  )
}

const InviteeGuestView = () => {
  const router = useRouter()
  const { user, logout } = useAuth()

  // For Rollbar/FS/etc. - The User
  useRollbarPerson(user ?? {})
  if (typeof window !== 'undefined' && user !== null) {
    FullStory.identify(user.id, user)
  }

  // Get the data
  const { guestId } = router.query
  const [guestDocRef, setGuestDocRef] =
    useState<ReturnType<typeof getGuestDoc>>()
  const [inviteeDocRef, setInviteeDocRef] =
    useState<ReturnType<typeof getInviteeDoc>>()
  const [isDocRefLoading, setIsDocRefLoading] = useState(true)
  useEffect(() => {
    if (typeof guestId === 'string') {
      setGuestDocRef(getGuestDoc(guestId))
    }
    setIsDocRefLoading(false)
  }, [guestId])
  const [guestDocData, guestDocLoading, guestDocError] =
    useDocumentData(guestDocRef)
  useEffect(() => {
    setInviteeDocRef(
      guestDocData === undefined
        ? undefined
        : getInviteeDoc(guestDocData.inviteeId)
    )
  }, [guestDocData])
  const [inviteeDocData, inviteeDocLoading, inviteeDocError] =
    useDocumentData(inviteeDocRef)

  // Get logged in user's guests
  const [guestRecords = [], guestsLoading, guestsFirestoreErrObj] =
    useCollectionData(getGuestCollectionByEmail(user?.email ?? ''))

  // Get any other guest records for guests of invitee
  const [
    guestsOfInviteeRecords = [],
    guestsOfInviteeLoading,
    guestsOfInviteeFirestoreErrObj,
  ] = useCollectionData(getGuestCollectionByInviteeId(inviteeDocData?.id ?? ''))

  // Events
  const [eventRecords = [], eventsLoading, eventsFirestoreErrObj] =
    useCollectionData(getEventCollection())

  const loading =
    isDocRefLoading ||
    guestDocLoading ||
    inviteeDocLoading ||
    guestsLoading ||
    guestsOfInviteeLoading ||
    eventsLoading
  const error =
    guestDocError ??
    inviteeDocError ??
    guestsFirestoreErrObj ??
    guestsOfInviteeFirestoreErrObj ??
    eventsFirestoreErrObj

  const onChangeGuest = useCallback(
    (guestId: string) => {
      router.push(`/guest/${guestId}`).catch((err) => {
        console.error(err)
      })
    },
    [router]
  )

  const otherGuestsSameEmail = reject(guestRecords, (g) => g.id === guestId)
  const guestsOfInvitee = reject(
    guestsOfInviteeRecords,
    (g) => g.id === guestId
  )

  return (
    <Box>
      <GuestPage
        {...{
          loading,
          error,
          logout,
          guestRecord: guestDocData,
          inviteesGuests: guestsOfInvitee,
          inviteeRecord: inviteeDocData,
          otherGuestsSameEmail: otherGuestsSameEmail,
          eventRecords,
          onChangeGuest,
        }}
      />
    </Box>
  )
}

const GuestView = () => {
  useRedirectIfNotAuthenticated('/guest/login')

  const { user } = useAuth()

  const [inviteeRecords = [], inviteesLoading, inviteesFirestoreErrObj] =
    useCollectionData(getInviteeCollectionByEmail(user?.email ?? ''))

  if (inviteesFirestoreErrObj !== void 0) {
    console.error(inviteesFirestoreErrObj)
  }

  return (
    <Box>
      <Head>
        <title>{'Mike & Holly'}</title>
        <meta name="description" content="Our wedding website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {inviteesLoading === true ? null : inviteeRecords.length === 0 ? (
        <LimitedGuestView />
      ) : (
        <InviteeGuestView />
      )}
    </Box>
  )
}

export default GuestView
