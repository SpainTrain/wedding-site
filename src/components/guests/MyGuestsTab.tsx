import { z } from 'zod'
import { Card, Grid, Typography } from '@mui/material'
import { map } from 'lodash'
import React from 'react'

import { GuestRecord, InviteeRecord } from '../../../functions/src/schemas'
import { renderIf } from '../../render-if'

import { AddGuestCard } from './AddGuestCard'
import { ChooseFoodCard } from './ChooseFoodCard'
import { useCanAddMoreGuests } from './otherHooks'

type InviteeRecordType = z.infer<typeof InviteeRecord>
type GuestRecordType = z.infer<typeof GuestRecord>

interface MyGuestsTabProps {
  guestRecord: GuestRecordType
  inviteeRecord: InviteeRecordType
  inviteesGuests: readonly GuestRecordType[]
}

export const MyGuestsTab = ({
  guestRecord,
  inviteeRecord,
  inviteesGuests,
}: MyGuestsTabProps) => {
  const canAddMoreGuests = useCanAddMoreGuests(inviteeRecord, inviteesGuests)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2">{'Guests'}</Typography>
      </Grid>

      {map([guestRecord, ...inviteesGuests], (g) => (
        <Grid item xs={12} md={6} key={g.id}>
          <ChooseFoodCard
            name={`${g.firstName} ${g.lastName}`}
            email={g.email}
            guestId={g.id}
            currentSelection={g.dinnerChoice}
            currentRestrictions={g.foodRestrictions}
          />
        </Grid>
      ))}

      {renderIf(canAddMoreGuests)(() => (
        <Grid item xs={12} md={6}>
          <Card>
            <AddGuestCard inviteeId={inviteeRecord.id} />
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
