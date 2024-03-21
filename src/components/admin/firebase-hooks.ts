import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { isUndefined, omitBy } from 'lodash'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React from 'react'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  setDoc,
  updateDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore'

import {
  GuestRecordData,
  InviteeRecordData,
  EventRecordData,
  EventRecord,
} from '../../../functions/src/schemas'
import {
  getDB,
  getEventCollection,
  getEventDoc,
  getEventsImagesRef,
  getGuestCollection,
  getGuestDoc,
  getInviteeDoc,
} from '../../../src'

// STORAGE
export const useUploadEventImage = () =>
  React.useCallback(async (file: File) => {
    const extension = extname(file.name)
    const newFileName = `${uuidv4()}${extension}`

    const eventsImageseRef = getEventsImagesRef()
    const storageRef = ref(eventsImageseRef, newFileName)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  }, [])

// INVITEE
const PartialInviteeRecordData = InviteeRecordData.partial()
export const useUpdateInviteeTableRecord = () =>
  React.useCallback(
    async (
      id: string,
      inviteeRecord: z.infer<typeof PartialInviteeRecordData>
    ) => {
      const inviteeRef = getInviteeDoc(id)
      const cleanInviteeRecord = omitBy(inviteeRecord, isUndefined) as z.infer<
        typeof PartialInviteeRecordData
      >
      const validatedInviteeRecord =
        PartialInviteeRecordData.strict().parse(cleanInviteeRecord)
      console.log(
        'updateInviteeTableRecord',
        inviteeRecord,
        cleanInviteeRecord,
        validatedInviteeRecord
      )
      await updateDoc(inviteeRef, validatedInviteeRecord)
    },
    []
  )

// GUEST
const PartialGuestRecordData = GuestRecordData.partial()
export const useUpdateGuestTableRecord = () =>
  React.useCallback(
    async (id: string, guestRecord: z.infer<typeof PartialGuestRecordData>) => {
      const guestRef = getGuestDoc(id)
      const cleanGuestRecord = omitBy(guestRecord, isUndefined)
      const validatedGuestRecord =
        PartialGuestRecordData.strict().parse(cleanGuestRecord)
      console.log(
        'updateGuestTableRecord',
        guestRecord,
        cleanGuestRecord,
        validatedGuestRecord
      )
      await updateDoc(guestRef, validatedGuestRecord)
    },
    []
  )

export const useRemoveGuestRecord = () =>
  React.useCallback(async (id: string) => {
    const guestRef = getGuestDoc(id)
    console.log('removeGuestRecord', id)
    await deleteDoc(guestRef)
  }, [])

// EVENTS
export const useCreateEventTableRecord = () =>
  React.useCallback(async (eventRecord: z.infer<typeof EventRecordData>) => {
    console.log('createEventTableRecord', eventRecord)
    const parsedEventRecord = EventRecordData.parse(eventRecord)
    await addDoc(getEventCollection(), parsedEventRecord)
  }, [])

export const useUpdateEventTableRecord = () =>
  React.useCallback(async (eventRecord: z.infer<typeof EventRecord>) => {
    console.log('updateEventTableRecord', eventRecord)
    const parsedEventRecord = EventRecord.parse(eventRecord)
    await setDoc(getEventDoc(eventRecord.id), parsedEventRecord)
  }, [])

export const useDeleteEventTableRecord = () =>
  React.useCallback(async (id: string) => {
    console.log('deleteEventTableRecord', id)
    const eventRef = getEventDoc(id)
    await deleteDoc(eventRef)
  }, [])

// Guest + Event interactions
export const useInviteGuestsToEvent = () =>
  React.useCallback(
    async (guestsIds: ReadonlyArray<string>, eventId: string) => {
      const eventRef = getEventDoc(eventId)

      const batch = writeBatch(getDB())
      for (const guestId of guestsIds) {
        const guestRef = getGuestDoc(guestId)
        batch.update(guestRef, { eventsInvited: arrayUnion(eventRef.id) })
      }
      await batch.commit()
    },
    []
  )

export const useRemoveGuestsFromEvent = () =>
  React.useCallback(
    async (guestsIds: ReadonlyArray<string>, eventId: string) => {
      const eventRef = getEventDoc(eventId)

      const batch = writeBatch(getDB())
      for (const guestId of guestsIds) {
        const guestRef = getGuestDoc(guestId)
        batch.update(guestRef, { eventsInvited: arrayRemove(eventRef.id) })
      }
      await batch.commit()
    },
    []
  )

export const useInviteAllGuestsToEvent = () =>
  React.useCallback(async (eventId: string) => {
    // Update event itself
    const eventRef = getEventDoc(eventId)
    await updateDoc(eventRef, { allGuestsInvited: true })

    // Get all guest IDs
    const guestCollection = getGuestCollection()
    const guests = await getDocs(guestCollection)
    const guestsIds = guests.docs.map((doc) => doc.id)

    // Invite all guests to event
    const batch = writeBatch(getDB())
    for (const guestId of guestsIds) {
      const guestRef = getGuestDoc(guestId)
      batch.update(guestRef, { eventsInvited: arrayUnion(eventRef.id) })
    }
    await batch.commit()
  }, [])

export const useUntoggleAllGuestsInvitedToEvent = () =>
  React.useCallback(async (eventId: string) => {
    const eventRef = getEventDoc(eventId)
    await updateDoc(eventRef, { allGuestsInvited: false })
  }, [])
