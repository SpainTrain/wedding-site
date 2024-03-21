import { z } from 'zod'
import { parseFullName } from 'parse-full-name'

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { parseTypeformRes } from './parseTypeformRes'
import { inviteesCollName, guestsCollName } from './collections'
import { InviteeRecord, GuestRecordData } from './schemas'

const inviteeToGuest = ({
  id,
  name,
  email,
  mobile,
}: z.infer<typeof InviteeRecord>): z.infer<typeof GuestRecordData> => ({
  email,
  mobile,
  firstName: parseFullName(name).first ?? name,
  lastName: parseFullName(name).last ?? name,
  inviteeId: id,
  eventsAttending: [],
  eventsInvited: [],
  eventsRegretting: [],
  vaxRequirementDisposition: 'Unviewed',
  dinnerChoice: 'Not Yet Selected',
})

export const ingestFromTypeform = async (
  request: functions.https.Request,
  response: functions.Response
) => {
  functions.logger.info('ingestGuestFromTypeform', { structuredData: true })
  functions.logger.debug(request.body, { structuredData: true })

  const attendeeRecord = parseTypeformRes(request.body)
  functions.logger.info(attendeeRecord, { structuredData: true })

  // Create attendee
  const attendeeDoc = await admin
    .firestore()
    .collection(inviteesCollName)
    .add(attendeeRecord)
  functions.logger.info(`${attendeeRecord.name} written to DB`, {
    structuredData: true,
  })

  // Create guest
  const guestRecord = inviteeToGuest({ id: attendeeDoc.id, ...attendeeRecord })
  await admin.firestore().collection(guestsCollName).add(guestRecord)

  response.send(attendeeRecord)
}
