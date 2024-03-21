import { z } from 'zod'
import { intersection, map } from 'lodash'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import gravatar from 'gravatar'

import { Box } from '@mui/material'

import {
  EventRecord,
  GuestRecord,
  InviteeRecord,
} from '../../../functions/src/schemas'
import { useGuestTabQsNav } from '../useTabQsNav'
import { renderIf } from '../../render-if'

import { ContentAreaMessage } from './ContentAreaMessage'
import { GuestAppBar } from './GuestAppBar'
import { GuestError } from './GuestError'
import { ItineraryTab } from './ItineraryTab'
import { MyGuestsTab } from './MyGuestsTab'
import { OverviewTab } from './OverviewTab'
import { InviteeOverviewTab } from './InviteeOverviewTab'
import { VaxInterstitialDialog } from './VaxInterstitial'
import { GiftsCard } from './overview/GiftsCard'

interface GuestPageProps {
  loading?: boolean
  error?: GuestError
  logout: () => void
  onChangeGuest: (guestId: string) => void
  eventRecords?: ReadonlyArray<z.infer<typeof EventRecord>>
  inviteeRecord?: z.infer<typeof InviteeRecord>
  guestRecord?: z.infer<typeof GuestRecord>
  isInvitee?: boolean
  otherGuestsSameEmail?: ReadonlyArray<z.infer<typeof GuestRecord>>
  inviteesGuests?: readonly z.infer<typeof GuestRecord>[]
}

export const GuestPage = ({
  guestRecord,
  inviteeRecord,
  inviteesGuests,
  eventRecords,
  otherGuestsSameEmail,
  logout,
  onChangeGuest: handleChangeGuest,
  loading = true,
  error,
  isInvitee = false,
}: GuestPageProps) => {
  const router = useRouter()
  const { navState, navigateToTab, tabs } = useGuestTabQsNav(router)

  const photoURL = useMemo(
    () =>
      gravatar.url(guestRecord?.email ?? '', {
        protocol: 'https',
        default: 'mp',
      }),
    [guestRecord?.email]
  )

  // VAXXXXXXXX
  const vaxDispositionOutstanding = useMemo(
    () =>
      guestRecord?.vaxRequirementDisposition !== 'Accepted' &&
      guestRecord?.vaxRequirementDisposition !== 'Rejected',
    [guestRecord?.vaxRequirementDisposition]
  )

  const vaxRejected = useMemo(
    () => guestRecord?.vaxRequirementDisposition === 'Rejected',
    [guestRecord?.vaxRequirementDisposition]
  )

  // IS THIS GUEST ALSO THE INVITEE FOR THE PARTY?
  const isGuestAlsoInvitee = useMemo(
    () => inviteeRecord?.email === guestRecord?.email,
    [guestRecord?.email, inviteeRecord?.email]
  )

  // AVAILABLE TABS (GUEST VS INVITEE)
  const availableTabs: typeof navState[] = useMemo(
    () =>
      isGuestAlsoInvitee ? tabs : intersection(tabs, ['Overview', 'Itinerary']),
    [isGuestAlsoInvitee, tabs]
  )

  return guestRecord === undefined ||
    (isInvitee && inviteeRecord === undefined) ||
    loading ||
    error !== undefined ||
    vaxRejected ||
    inviteeRecord?.overallRsvp === 'Regret' ? (
    <ContentAreaMessage
      headingMessage={
        vaxRejected || inviteeRecord?.overallRsvp
          ? 'Thanks for letting us know!'
          : 'Having an issue?'
      }
      error={error}
      loading={loading}
      showQuestionPrompt={vaxRejected}
    >
      <GiftsCard nonAttendeeCopy />
    </ContentAreaMessage>
  ) : (
    <Box sx={{ mb: 8 }}>
      <GuestAppBar
        pages={availableTabs}
        activePage={navState}
        onLogout={logout}
        onChangeActivePage={navigateToTab}
        displayName={guestRecord?.firstName ?? 'Anonymous'}
        photoURL={photoURL}
        otherGuestsSameEmail={map(
          otherGuestsSameEmail,
          ({ firstName, lastName, id }) => ({
            displayName: `${firstName} ${lastName}`,
            guestId: id,
          })
        )}
        onChangeGuest={handleChangeGuest}
      />
      <>
        {/* INVITEE OVERVIEW */}
        {renderIf(navState === 'Overview' && isGuestAlsoInvitee)(() =>
          inviteeRecord === undefined ? (
            <ContentAreaMessage headingMessage="Having an issue?" />
          ) : (
            <InviteeOverviewTab
              guestRecord={guestRecord}
              inviteeRecord={inviteeRecord}
              inviteesGuests={inviteesGuests ?? []}
            />
          )
        )}

        {/* OVERVIEW */}
        {renderIf(navState === 'Overview' && !isGuestAlsoInvitee)(() => (
          <OverviewTab
            guestRecord={guestRecord}
            // inviteeRecord={inviteeRecord}
          />
        ))}

        {/* ITINERARY */}
        {renderIf(navState === 'Itinerary')(() => (
          <ItineraryTab
            guestRecord={guestRecord}
            eventRecords={eventRecords}
            inviteesGuests={inviteesGuests ?? []}
            loading={loading}
            error={error}
          />
        ))}

        {/* MY GUESTS */}
        {renderIf(navState === 'My Guests')(() =>
          inviteeRecord === undefined ? (
            <ContentAreaMessage headingMessage="Having an issue?" />
          ) : (
            <MyGuestsTab
              guestRecord={guestRecord}
              inviteeRecord={inviteeRecord}
              inviteesGuests={inviteesGuests ?? []}
            />
          )
        )}
      </>
      <VaxInterstitialDialog
        open={vaxDispositionOutstanding}
        guestRecord={guestRecord}
        inviteeRecord={isGuestAlsoInvitee ? inviteeRecord : void 0}
      />
    </Box>
  )
}
