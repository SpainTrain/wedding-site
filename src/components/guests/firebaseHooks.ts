import { z } from 'zod'
// import { isUndefined, omitBy } from 'lodash'
import React from 'react'
import {
  //   addDoc,
  arrayRemove,
  arrayUnion,
  //   deleteDoc,
  //   setDoc,
  updateDoc,
} from 'firebase/firestore'

import {
  // GuestRecordData,
  //   InviteeRecordData,
  //   EventRecordData,
  //   EventRecord,
  LodgingBooking,
} from '../../../functions/src/schemas'
import {
  getGuestDoc,
  //   getGuestCollection,
  getInviteeDoc,
  //   getEventCollection,
  //   getEventDoc,
} from '../../../src'

// GUEST
// const PartialGuestRecordData = GuestRecordData.partial()
export const useGuestViewedVaxReq = () =>
  React.useCallback(async (id: string) => {
    const guestRef = getGuestDoc(id)
    console.log('useGuestViewedVaxReq')
    await updateDoc(guestRef, { vaxRequirementDisposition: 'Viewed' })
  }, [])

export const useGuestAcceptedVaxReq = () =>
  React.useCallback(async (id: string) => {
    const guestRef = getGuestDoc(id)
    console.log('useGuestAcceptedVaxReq')
    await updateDoc(guestRef, { vaxRequirementDisposition: 'Accepted' })
  }, [])

export const useGuestRejectedVaxReq = () =>
  React.useCallback(async (id: string, inviteeId?: string) => {
    const guestRef = getGuestDoc(id)
    console.log('useGuestRejectedVaxReq')
    await updateDoc(guestRef, { vaxRequirementDisposition: 'Rejected' })

    // If the guest is also invitee, they are also regretting their RSVP
    if (inviteeId !== void 0) {
      const inviteeRef = getInviteeDoc(inviteeId)
      await updateDoc(inviteeRef, { overallRsvp: 'Regret' })
    }
  }, [])

export const useGuestRegretsEvent = () =>
  React.useCallback(async (guestId: string, eventId: string) => {
    const guestRef = getGuestDoc(guestId)
    await updateDoc(guestRef, {
      eventsAttending: arrayRemove(eventId),
      eventsRegretting: arrayUnion(eventId),
    })
  }, [])

export const useGuestAttendsEvent = () =>
  React.useCallback(async (guestId: string, eventId: string) => {
    const guestRef = getGuestDoc(guestId)
    await updateDoc(guestRef, {
      eventsAttending: arrayUnion(eventId),
      eventsRegretting: arrayRemove(eventId),
    })
  }, [])

// INVITEE
export const useInviteeRegrettedRsvp = () =>
  React.useCallback(async (inviteeId: string) => {
    const inviteeRef = getInviteeDoc(inviteeId)
    console.log('useInviteeRegrettedRsvp')
    await updateDoc(inviteeRef, { overallRsvp: 'Regret' })
  }, [])

export const useInviteeAcceptedRsvp = () =>
  React.useCallback(async (inviteeId: string) => {
    const inviteeRef = getInviteeDoc(inviteeId)
    console.log('useInviteeAcceptedRsvp')
    await updateDoc(inviteeRef, { overallRsvp: 'Attending' })
  }, [])

export const useBookLodging = () =>
  React.useCallback(
    async (
      inviteeId: string,
      lodgingBooking: z.infer<typeof LodgingBooking>
    ) => {
      const inviteeRef = getInviteeDoc(inviteeId)
      console.log('useBookLodging', inviteeId, lodgingBooking)
      await updateDoc(inviteeRef, { lodgingBooking })
    },
    []
  )

export const useUpdateGuestCount = () =>
  React.useCallback(async (inviteeId: string, guestCount: number) => {
    const inviteeRef = getInviteeDoc(inviteeId)
    console.log('useUpdateGuestCount', inviteeId)

    await updateDoc(inviteeRef, { guestCount })
  }, [])
