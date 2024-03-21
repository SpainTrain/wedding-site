import React from 'react'
import { DateTime } from 'luxon'
import { Divider, Typography } from '@mui/material'

interface DayDividerProps {
  /** ISO Date String */
  date: string
}

/**
 * Expected to be wrapped in a `CardContent` component.
 */
export const DayDivider = ({ date }: DayDividerProps) => {
  return (
    <Divider variant="middle">
      <Typography variant="h4" sx={{ mb: 6 }}>
        {DateTime.fromISO(date)
          .setZone('America/New_York')
          .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
      </Typography>
    </Divider>
  )
}
