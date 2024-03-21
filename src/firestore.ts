import { z } from 'zod'
import { omitBy, isUndefined } from 'lodash'
import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  where,
  WithFieldValue,
} from 'firebase/firestore'

import {
  EventRecord,
  EventRecordData,
  GuestRecord,
  GuestRecordData,
  InviteeRecord,
  InviteeRecordData,
  LodgingBooking,
} from '../functions/src/schemas'
import {
  inviteesCollName,
  guestsCollName,
  eventsCollName,
} from '../functions/src/collections'
import { getFirebase } from './config'

export const getDB = () => getFirebase().db

type InviteeRecordType = z.infer<typeof InviteeRecord>
type GuestRecordType = z.infer<typeof GuestRecord>
// type EventRecordDataType = z.infer<typeof EventRecordData>
type EventRecordType = z.infer<typeof EventRecord>
type LodgingBookingType = z.infer<typeof LodgingBooking>

const inviteeConverter: FirestoreDataConverter<InviteeRecordType> = {
  toFirestore: (invitee: WithFieldValue<InviteeRecordType>): DocumentData =>
    InviteeRecordData.partial().parse(omitBy(invitee, isUndefined)),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): InviteeRecordType => {
    const docData = snapshot.data(options)
    const lodgingBooking = docData?.lodgingBooking as
      | LodgingBookingType
      | undefined
    const startDate = lodgingBooking?.startDate as Timestamp | undefined
    const endDate = lodgingBooking?.endDate as Timestamp | undefined

    return startDate === void 0 || endDate === void 0
      ? {
          id: snapshot.id,
          ...InviteeRecordData.parse(docData),
        }
      : {
          id: snapshot.id,
          ...InviteeRecordData.parse({
            ...docData,
            lodgingBooking: {
              ...lodgingBooking,
              startDate: startDate.toDate(),
              endDate: endDate.toDate(),
            },
          }),
        }
  },
}

export const getInviteeCollection = () =>
  collection(getDB(), inviteesCollName).withConverter(inviteeConverter)

export const getInviteeCollectionByEmail = (email: string) =>
  query(getInviteeCollection(), where('email', '==', email))

export const getInviteeDoc = (id: string) =>
  doc(getDB(), inviteesCollName, id).withConverter(inviteeConverter)

const guestConverter: FirestoreDataConverter<GuestRecordType> = {
  toFirestore: (guest: WithFieldValue<GuestRecordType>): DocumentData =>
    GuestRecordData.partial().parse(omitBy(guest, isUndefined)),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): GuestRecordType => ({
    id: snapshot.id,
    ...GuestRecordData.parse(snapshot.data(options)),
  }),
}

export const getGuestCollection = () =>
  collection(getDB(), guestsCollName).withConverter(guestConverter)

export const getGuestCollectionByEmail = (email: string) =>
  query(getGuestCollection(), where('email', '==', email))

export const getGuestCollectionByInviteeId = (inviteeId: string) =>
  query(getGuestCollection(), where('inviteeId', '==', inviteeId))

export const getGuestDoc = (id: string) =>
  doc(getDB(), guestsCollName, id).withConverter(guestConverter)

const eventConverter: FirestoreDataConverter<EventRecordType> = {
  toFirestore: (event: WithFieldValue<EventRecordType>): DocumentData => {
    const parsedEventRecordData = EventRecordData.parse(event)

    return {
      ...parsedEventRecordData,
      startDateTime: Timestamp.fromDate(parsedEventRecordData.startDateTime),
      endDateTime: Timestamp.fromDate(parsedEventRecordData.endDateTime),
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): EventRecordType => {
    const docData = snapshot.data(options)
    const startDateTimestamp = docData.startDateTime as Timestamp
    const endDateTimestamp = docData.endDateTime as Timestamp

    return {
      id: snapshot.id,
      ...EventRecordData.parse({
        ...docData,
        startDateTime: startDateTimestamp.toDate(),
        endDateTime: endDateTimestamp.toDate(),
      }),
    }
  },
}

export const getEventCollection = () =>
  collection(getDB(), eventsCollName).withConverter(eventConverter)

export const getEventDoc = (id: string) =>
  doc(getDB(), eventsCollName, id).withConverter(eventConverter)
