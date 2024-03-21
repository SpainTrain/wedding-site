import { z } from 'zod'
import { useDebugValue, useMemo } from 'react'
import { GuestRecord, InviteeRecord } from '../../../functions/src/schemas'

type InviteeRecordType = z.infer<typeof InviteeRecord>
type GuestRecordType = z.infer<typeof GuestRecord>

export const useCanAddMoreGuests = (
  inviteeRecord: InviteeRecordType,
  inviteesGuests: readonly GuestRecordType[]
) => {
  useDebugValue(inviteeRecord.guestCount)
  useDebugValue(inviteesGuests.length)
  return useMemo(
    () => inviteeRecord.guestCount - 1 > inviteesGuests.length,
    [inviteeRecord.guestCount, inviteesGuests.length]
  )
}
