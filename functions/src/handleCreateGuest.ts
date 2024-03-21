import { once } from 'lodash'
import * as functions from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { eventsCollName } from './collections'

const getDB = once(() => {
  try {
    initializeApp()
    return getFirestore()
  } catch {
    return getFirestore()
  }
})

export const handleCreateGuest = async (
  newGuestSnapshot: functions.firestore.QueryDocumentSnapshot
  //   context: functions.EventContext
) => {
  const db = getDB()
  const eventsSnapshot = await db
    .collection(eventsCollName)
    .where('allGuestsInvited', '==', true)
    .get()
  const eventIds = eventsSnapshot.docs.map((doc) => doc.id)
  console.log(
    `Found ${eventIds.length} events that include all guests`,
    eventIds
  )

  console.log('Updating guest', newGuestSnapshot.id)
  await newGuestSnapshot.ref.update({
    eventsInvited: FieldValue.arrayUnion(...eventIds),
  })
}
