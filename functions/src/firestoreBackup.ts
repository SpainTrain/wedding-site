import * as functions from 'firebase-functions'
import * as firestore from 'firebase-admin/firestore'
import { defineString } from 'firebase-functions/params'

const client = new firestore.v1.FirestoreAdminClient()

// Replace BUCKET_NAME
const bucket = defineString('FIRESTORE_BACKUP_BUCKET_NAME')

export const backupFirestore = () => {
  const projectId = 'mike-and-holly'
  const databaseName = client.databasePath(projectId, '(default)')
  functions.logger.info(`Creating backup ${projectId} ${databaseName}`, {
    structuredData: true,
  })

  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket.value(),
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds: [],
    })
    .then((responses) => {
      const response = responses[0]
      functions.logger.log(`Operation Name: ${response['name']}`)
    })
    .catch((err) => {
      functions.logger.error(err)
      throw new Error('Export operation failed')
    })
}
