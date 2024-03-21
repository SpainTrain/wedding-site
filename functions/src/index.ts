import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { backupFirestore } from './firestoreBackup'
import { ingestFromTypeform } from './ingestGuestFromTypeform'
import { getStreetViewStaticUrl } from './getStreetViewStaticUrl'
import { guestsCollName } from './collections'
import { handleCreateGuest } from './handleCreateGuest'

admin.initializeApp()

export const scheduleFirestoreExport = functions.pubsub
  .schedule('every 4 hours')
  .onRun(backupFirestore)

export const ingestGuestFromTypeform =
  functions.https.onRequest(ingestFromTypeform)

export const getStreetViewStatic = functions.https.onCall(
  getStreetViewStaticUrl
)

export const onCreateGuest = functions.firestore
  .document(`${guestsCollName}/{guestId}`)
  .onCreate(handleCreateGuest)
