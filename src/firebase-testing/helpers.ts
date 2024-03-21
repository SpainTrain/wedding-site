import { z } from 'zod'
import { map } from 'lodash'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'

import {
  EventRecordData,
  GuestRecordData,
  InviteeRecordData,
} from '../../functions/src/schemas'

interface SetupProps {
  mockCollections?: {
    events?: {
      [id: string]: z.infer<typeof EventRecordData>
    }
    guests?: {
      [id: string]: z.infer<typeof GuestRecordData>
    }
    invitees?: {
      [id: string]: z.infer<typeof InviteeRecordData>
    }
  }
}

export const setup = async (props?: SetupProps) => {
  // console.debug(JSON.stringify(props, void 0, 2))
  const { mockCollections } = props ?? {}
  const projectId = `rules-spec-${Date.now()}`

  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  })

  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore()
    await Promise.all([
      Promise.all(
        map(mockCollections?.events, async (event, id) =>
          db.doc(`events/${id}`).set(event)
        )
      ),
      Promise.all(
        map(mockCollections?.guests, async (guest, id) =>
          db.doc(`guests/${id}`).set(guest)
        )
      ),
      Promise.all(
        map(mockCollections?.invitees, async (invitee, id) =>
          db.doc(`invitees/${id}`).set(invitee)
        )
      ),
    ])
  })

  return testEnv
}
