import { z } from 'zod'
import React from 'react'
import { DateTime } from 'luxon'
import { Typography } from '@mui/material'

import { EventRecord } from '../../../functions/src/schemas'
import { useEventTimeInfo } from './useEventTimeInfo'

type EventRecordType = z.infer<typeof EventRecord>

interface OppositeContentGenericProps {
  location: EventRecordType['location']
  startDateTime: DateTime
  endDateTime: DateTime
}

/**
 * Expected to be wrapped in a `CardContent` component.
 */
export const OppositeContentGeneric = ({
  location,
  startDateTime,
  endDateTime,
}: OppositeContentGenericProps) => {
  const { durationForHumans, startTimeFormatted } = useEventTimeInfo(
    startDateTime,
    endDateTime
  )

  return (
    <>
      <Typography>{startTimeFormatted}</Typography>
      <Typography sx={{ mb: 1 }}>{durationForHumans}</Typography>

      <Typography variant="body2">{location.street}</Typography>
      <Typography variant="body2">
        {location.city}
        {', '}
        {location.state} {location.postal}
      </Typography>
    </>
  )
}
