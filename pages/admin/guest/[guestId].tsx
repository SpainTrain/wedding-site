import { reject } from 'lodash'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import {
  useDocumentData,
  useCollectionData,
} from 'react-firebase-hooks/firestore'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
} from '@mui/material'
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material'

import { useEnsureAdmin } from '../../../src/components/admin/other-hooks'
import { useRedirectIfNotAuthenticated } from '../../../src/auth/useAuthRedirects'
import { GuestPage } from '../../../src/components/guests/GuestPage'
import {
  getGuestCollectionByEmail,
  getGuestCollectionByInviteeId,
  getGuestDoc,
  getInviteeDoc,
  getEventCollection,
} from '../../../src'

const GuestViewAsAdmin = () => {
  useRedirectIfNotAuthenticated('/admin/login')

  const { router, user } = useEnsureAdmin()

  // Faux logout (close guest preview)
  const logout = useCallback(() => {
    window.close()
  }, [])

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

  // Get any other guest records
  const [guestRecords = [], guestsLoading, guestsFirestoreErrObj] =
    useCollectionData(getGuestCollectionByEmail(guestDocData?.email ?? ''))

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
      router.push(`/admin/guest/${guestId}`).catch((err) => {
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
      <Head>
        <title>{'Mike & Holly'}</title>
        <meta name="description" content="Our wedding website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GuestPage
        {...{
          loading,
          error,
          logout,
          guestRecord: guestDocData,
          inviteeRecord: inviteeDocData,
          inviteesGuests: guestsOfInvitee,
          otherGuestsSameEmail: otherGuestsSameEmail,
          eventRecords,
          onChangeGuest,
        }}
      />
      {guestDocData === undefined || inviteeDocData === undefined ? null : (
        <Box sx={{ position: 'fixed', bottom: 64, left: 16, opacity: 0.6 }}>
          <Accordion>
            <AccordionSummary expandIcon={<HelpOutlineIcon />}>
              {'Impersonation'}
            </AccordionSummary>
            <AccordionDetails sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1 }}>
                <Divider>
                  <Typography variant="body2">{'GuestId'}</Typography>
                </Divider>
                <Typography variant="body2">{guestId}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Divider>
                  <Typography variant="body2">{'You are: '}</Typography>
                </Divider>
                <Typography variant="body2">{user?.email}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Divider>
                  <Typography variant="body2">{'Impersonating: '}</Typography>
                </Divider>
                <Typography variant="body2">
                  {`${guestDocData.firstName} ${guestDocData.lastName}`}
                </Typography>
              </Box>

              <Divider>
                <Typography variant="body2">{'Who is a guest of: '}</Typography>
              </Divider>
              <Typography variant="body2">
                {inviteeDocData.addressee}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  )
}

export default GuestViewAsAdmin
