import { z } from 'zod'
import React from 'react'
import { DateTime } from 'luxon'
import { Box, Grid, Typography } from '@mui/material'

import { EventRecord } from '../../../functions/src/schemas'
import { renderIf } from '../../render-if'
import { useEventTimeInfo } from './useEventTimeInfo'

type EventRecordType = z.infer<typeof EventRecord>

interface EventCardFieldProps {
  label: string
  value: string
  labelGridWidth?: number
  spacing?: number
}

const EventCardField = ({
  label,
  value,
  labelGridWidth = 4,
  spacing = 2,
}: EventCardFieldProps) => (
  <Grid container sx={{ my: spacing }}>
    <Grid item xs={labelGridWidth}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', float: 'left' }}>
        {`${label}: `}
      </Typography>
    </Grid>
    <Grid item xs={12 - labelGridWidth}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ float: 'left', textAlign: 'left' }}
      >
        {value}
      </Typography>
    </Grid>
  </Grid>
)

interface EventCardContentProps {
  id: EventRecordType['id']
  name: EventRecordType['name']
  description: EventRecordType['description']
  dressCode: EventRecordType['dressCode']
  locationName: EventRecordType['locationName']
  location: EventRecordType['location']
  shuttle?: EventRecordType['shuttle']
  startDateTime: DateTime
  endDateTime: DateTime
  showTimeAndLocation?: boolean
}

/**
 * Expected to be wrapped in a `CardContent` component.
 */
export const EventCardContent = ({
  location,
  startDateTime,
  endDateTime,
  locationName,
  name,
  description,
  dressCode,
  shuttle,
  showTimeAndLocation = false,
}: EventCardContentProps) => {
  const { durationForHumans, startTimeFormatted } = useEventTimeInfo(
    startDateTime,
    endDateTime
  )

  return (
    <>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {locationName}
      </Typography>

      {renderIf(showTimeAndLocation)(() => (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {`${location.street}\n${location.city}, ${location.state} ${location.postal}`}
          </Typography>
        </Box>
      ))}

      {renderIf(showTimeAndLocation)(() => (
        <Box sx={{ mb: 2 }}>
          <EventCardField
            label="Start Time"
            value={startTimeFormatted}
            spacing={0}
          />
          <EventCardField
            label="Length"
            value={durationForHumans}
            spacing={0}
          />
        </Box>
      ))}
      <Typography sx={{ mb: 2 }} variant="body1" color="text.secondary">
        {description}
      </Typography>

      <Box sx={{ mb: 1 }}>
        <EventCardField label="Dress Code" value={dressCode} spacing={0} />

        {renderIf(shuttle !== undefined)(() => (
          <EventCardField
            label="Shuttle"
            value={shuttle ?? ''}
            labelGridWidth={3}
            spacing={0}
          />
        ))}
      </Box>
    </>
  )
}
