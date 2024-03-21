import { stripIndents } from 'common-tags'
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { FirestoreError } from 'firebase/firestore'
import { useRollbarPerson } from '@rollbar/react'
import * as FullStory from '@fullstory/browser'

import {
  getEventCollection,
  getGuestCollection,
  getInviteeCollection,
  renderIf,
} from '../../src'
import { useRedirectIfNotAuthenticated } from '../../src/auth/useAuthRedirects'
import { useAdminTabQsNav } from '../../src/components/useTabQsNav'
import { EventsTab } from '../../src/components/admin/EventsTab'
import { ResponsiveAppBar } from '../../src/components/ResponsiveAppBar'
import { InviteesTab } from '../../src/components/admin/InviteesTab'
import { AddresseesTab } from '../../src/components/admin/AddresseesTab'
import { GuestsTab } from '../../src/components/admin/GuestsTab'
import { useEnsureAdmin } from '../../src/components/admin/other-hooks'

const fsErrToString = (err?: FirestoreError) =>
  err === undefined
    ? void 0
    : stripIndents`
    ${err.name}
    ${err.code}
    ${err.message}`

const AdminHome: NextPage = () => {
  console.log('rendering AdminHome')

  useRedirectIfNotAuthenticated('/admin/login')

  // Ensure admin user and grab their info
  const { logout, router, user } = useEnsureAdmin()
  const photoURL = user?.photoURL
  const displayName = user?.displayName ?? '?'

  // For Rollbar/FS/etc. - The User
  useRollbarPerson(user ?? {})
  if (typeof window !== 'undefined' && user !== null) {
    FullStory.identify(user.id, user)
  }

  // Navigation via tabs
  const { navState, navigateToTab, tabs } = useAdminTabQsNav(router)

  // Get them collections
  const [inviteeRecords = [], inviteesLoading, inviteesFirestoreErrObj] =
    useCollectionData(getInviteeCollection())

  const [guestRecords = [], guestsLoading, guestsFirestoreErrObj] =
    useCollectionData(getGuestCollection())

  const [eventRecords = [], eventsLoading, eventsFirestoreErrObj] =
    useCollectionData(getEventCollection())

  useEffect(() => {
    console.log('invitee records updated', inviteeRecords)
  }, [inviteeRecords])
  useEffect(() => {
    console.log('guest records updated', guestRecords)
  }, [guestRecords])
  useEffect(() => {
    console.log('event records updated', eventRecords)
  })

  // Create formatted error strings
  const inviteesLoadingError = fsErrToString(inviteesFirestoreErrObj)
  const guestsLoadingError = fsErrToString(guestsFirestoreErrObj)
  const eventsLoadingError = fsErrToString(eventsFirestoreErrObj)

  return (
    <div>
      <Head>
        <title>{'Mike & Holly Admin'}</title>
        <meta
          name="description"
          content="Our wedding website admin interface"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ResponsiveAppBar
          pages={tabs}
          activePage={navState}
          onLogout={logout}
          onChangeActivePage={navigateToTab}
          {...{ photoURL, displayName }}
        />

        {/* INVITEES */}
        {renderIf(navState === 'Invitees')(() => (
          <InviteesTab
            inviteeRecords={inviteeRecords}
            loading={inviteesLoading}
            error={inviteesLoadingError}
          />
        ))}

        {/* ATTENDEES */}
        {renderIf(navState === 'Addressees')(() => (
          <AddresseesTab
            inviteeRecords={inviteeRecords}
            loading={inviteesLoading}
            error={inviteesLoadingError}
          />
        ))}

        {/* GUESTS */}
        {renderIf(navState === 'Guests')(() => (
          <GuestsTab
            guestRecords={guestRecords}
            inviteeRecords={inviteeRecords}
            loading={guestsLoading || inviteesLoading}
            error={guestsLoadingError ?? inviteesLoadingError}
          />
        ))}

        {/* EVENTS */}
        {renderIf(navState === 'Events')(() => (
          <EventsTab
            guestRecords={guestRecords}
            eventRecords={eventRecords}
            loading={eventsLoading || guestsLoading}
            error={eventsLoadingError ?? guestsLoadingError}
          />
        ))}
      </main>
    </div>
  )
}

export default AdminHome
