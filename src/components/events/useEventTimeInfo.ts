import { useMemo } from 'react'
import { DateTime, Interval, DateTimeFormatOptions } from 'luxon'
import { useRollbar } from '@rollbar/react'

const dateTimeFormat: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
}

export const useEventTimeInfo = (
  startDateTime: DateTime,
  endDateTime: DateTime
) => {
  const rollbar = useRollbar()

  const interval = useMemo(
    () => Interval.fromDateTimes(startDateTime, endDateTime),
    [endDateTime, startDateTime]
  )
  const durationForHumans = useMemo(
    () => interval.toDuration(['hours', 'minutes']).normalize().toHuman(),
    [interval]
  )
  const startTimeFormatted = useMemo((): string => {
    try {
      return startDateTime
        .setZone('America/New_York')
        .toLocaleString(dateTimeFormat)
    } catch (err) {
      rollbar.error('startTimeFormatted', err as Error)
      return 'FORMAT_ERROR'
    }
  }, [rollbar, startDateTime])

  return { durationForHumans, startTimeFormatted }
}
