import { z } from 'zod'
import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  configure as configureCookyCutter,
  define,
  derive,
  //   random,
} from 'cooky-cutter'

import {
  EventRecordData,
  GuestRecordData,
  InviteeRecordData,
} from '../../functions/src/schemas'

import { setup } from './helpers'
import { getDoc, setDoc, setLogLevel } from 'firebase/firestore'

configureCookyCutter({ errorOnHardCodedValues: true })

type InviteeRecordDataType = z.infer<typeof InviteeRecordData>
const inviteeFactory = define<InviteeRecordDataType>({
  name: (i: number) => `Some Person ${i}`,
  addressee: derive<InviteeRecordDataType, string>(
    ({ name }) => name ?? '',
    'name'
  ),
  street: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  postal: '12345',
  // TODO: https://firebase.google.com/docs/firestore/security/rules-fields
  guestCount: 2,
  saveTheDateSent: false,
  invitationSent: false,
  overallRsvp: 'No Response',
  mobile: '+15553334444',
  email: (i: number) => `some-person-${i}@gmail.com`,
})

type GuestRecordDataType = z.infer<typeof GuestRecordData>
const guestFactory = define<GuestRecordDataType>({
  firstName: (i: number) => `First${i}`,
  lastName: (i: number) => `Last${i}`,
  email: (i: number) => `some-guest-${i}@gmail.com`,
  inviteeId: (i: number) => `some-person-${i}`,
  mobile: '+15553334444',
  vaxRequirementDisposition: 'Accepted',
  dinnerChoice: 'Not Yet Selected',
})

type EventRecordDataType = z.infer<typeof EventRecordData>
const eventFactory = define<EventRecordDataType>({
  name: (i: number) => `Event ${i}`,
  description: 'This is a description',
  dressCode: 'Casual',
  location: define<EventRecordDataType['location']>({
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    postal: '12345',
  }),
  locationName: 'Someplace',
  startDateTime: (i: number) => new Date(Date.now() + i * 1000 * 60 * 60 * 24),
  endDateTime: (i: number) => new Date(Date.now() + i * 1000 * 60 * 60 * 24),
})

describe('Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment

  beforeEach(async () => {
    testEnv = await setup({
      mockCollections: {
        invitees: {
          'some-person-1': inviteeFactory(),
          'some-person-2': inviteeFactory(),
        },
        guests: {
          'some-guest-1': guestFactory(),
          'some-guest-2': guestFactory(),
          'some-guest-3': {
            ...guestFactory(),
            inviteeId: 'some-person-1',
          },
        },
        events: {
          'some-event-1': eventFactory(),
        },
      },
    })

    // https://github.com/firebase/firebase-js-sdk/issues/5872
    setLogLevel('error')
  })

  afterEach(async () => {
    await testEnv.clearFirestore()
    await testEnv.cleanup()
    inviteeFactory.resetSequence()
    guestFactory.resetSequence()
    eventFactory.resetSequence()
  })

  // ********
  // INVITEES
  // ********
  describe('Invitee records', () => {
    test('rando cannot access', async () => {
      const rando = testEnv.unauthenticatedContext()

      await assertFails(
        getDoc(rando.firestore().doc('/invitees/some-person-1'))
      )
    })

    test('admin can read & write record', async () => {
      const admin = testEnv.authenticatedContext('admin', {
        admin: true,
      })

      const db = admin.firestore()

      await assertSucceeds(getDoc(db.doc('/invitees/some-person-1')))

      await assertSucceeds(
        setDoc(db.doc('/invitees/some-person-1'), {
          firstName: 'Ding',
        })
      )
    })

    test('invitee can read their own record', async () => {
      const personOne = testEnv.authenticatedContext('personOne', {
        email: 'some-person-1@gmail.com',
      })

      await assertSucceeds(
        getDoc(personOne.firestore().doc('/invitees/some-person-1'))
      )
    })

    test('other invitees cannot read or write other records', async () => {
      const personTwo = testEnv.authenticatedContext('personTwo', {
        email: 'some-person-2@gmail.com',
      })

      const db = personTwo.firestore()

      await assertFails(getDoc(db.doc('/invitees/some-person-1')))

      await assertFails(
        setDoc(db.doc('/invitees/some-person-1'), {
          firstName: 'Ding',
        })
      )
    })
  })

  // ******
  // GUESTS
  // ******
  describe('Guest records', () => {
    test('rando cannot access', async () => {
      const rando = testEnv.unauthenticatedContext()

      await assertFails(getDoc(rando.firestore().doc('/guests/some-guest-1')))
    })

    test('admin can read & write record', async () => {
      const admin = testEnv.authenticatedContext('admin', {
        admin: true,
      })

      const db = admin.firestore()

      await assertSucceeds(getDoc(db.doc('/guests/some-guest-1')))

      await assertSucceeds(
        setDoc(db.doc('/guests/some-guest-1'), {
          firstName: 'Ding',
        })
      )
    })

    test('guest can read & write their own record', async () => {
      const guestOne = testEnv.authenticatedContext('guestOne', {
        email: 'some-guest-1@gmail.com',
      })

      const db = guestOne.firestore()

      await assertSucceeds(getDoc(db.doc('/guests/some-guest-1')))

      await assertSucceeds(
        setDoc(db.doc('/guests/some-guest-1'), {
          firstName: 'Ding',
        })
      )
    })

    test("invitee can read & write their guest's record", async () => {
      const personOne = testEnv.authenticatedContext('personOne', {
        email: 'some-person-1@gmail.com',
      })

      const db = personOne.firestore()

      await assertSucceeds(getDoc(db.doc('/guests/some-guest-1')))

      await assertSucceeds(
        setDoc(db.doc('/guests/some-guest-1'), {
          firstName: 'Ding',
        })
      )
    })

    test("invitee can create their guest's records if inviteeId is correct", async () => {
      const personOne = testEnv.authenticatedContext('personOne', {
        email: 'some-person-1@gmail.com',
      })

      const db = personOne.firestore()

      await assertSucceeds(
        setDoc(db.doc('/guests/new-guest'), {
          ...guestFactory(),
          inviteeId: 'some-person-1',
        })
      )

      await assertSucceeds(getDoc(db.doc('/guests/new-guest')))
    })

    test('invitee cannot create guest record with different inviteeId', async () => {
      const personOne = testEnv.authenticatedContext('personOne', {
        email: 'some-person-1@gmail.com',
      })

      const db = personOne.firestore()

      await assertFails(
        setDoc(db.doc('/guests/new-guest'), {
          ...guestFactory(),
          inviteeId: 'NOT-some-person-1',
        })
      )

      await assertFails(getDoc(db.doc('/guests/new-guest')))
    })

    test('guests cannot read & write OTHER guest records', async () => {
      const guestOne = testEnv.authenticatedContext('guestOne', {
        email: 'some-guest-1@gmail.com',
      })

      const db = guestOne.firestore()

      await assertFails(getDoc(db.doc('/guests/some-guest-2')))

      await assertFails(
        setDoc(db.doc('/guests/some-guest-2'), {
          firstName: 'Ding',
        })
      )
    })
  })

  // ******
  // EVENTS
  // ******
  describe('Event records', () => {
    test('rando cannot access', async () => {
      const rando = testEnv.unauthenticatedContext()

      await assertFails(getDoc(rando.firestore().doc('/events/some-guest-1')))
    })

    test('Guest can read any event', async () => {
      const guestOne = testEnv.authenticatedContext('guestOne', {
        email: 'some-guest-1@gmail.com',
      })
      const db = guestOne.firestore()

      await assertSucceeds(getDoc(db.doc('/events/some-event-1')))
    })

    test('Guest canNOT write to event', async () => {
      const guestOne = testEnv.authenticatedContext('guestOne', {
        email: 'some-guest-1@gmail.com',
      })
      const db = guestOne.firestore()

      await assertFails(
        setDoc(db.doc('/events/some-event-1'), {
          name: 'Ding',
        })
      )
    })

    test('admin can read & write record', async () => {
      const admin = testEnv.authenticatedContext('admin', {
        admin: true,
      })

      const db = admin.firestore()

      await assertSucceeds(getDoc(db.doc('/events/some-event-1')))

      await assertSucceeds(
        setDoc(db.doc('/events/some-event-1'), {
          name: 'Ding',
        })
      )
    })
  })
})
