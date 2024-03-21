/* eslint-disable @next/next/no-img-element */
import { filter, groupBy, includes, map, sortBy, toString } from 'lodash'
import { z } from 'zod'
import React, { useCallback, useMemo } from 'react'
import { DateTime } from 'luxon'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@mui/lab'

import { EventRecord, GuestRecord } from '../../../functions/src/schemas'

import { AdminAlert, AlertDataSetter, useAdminAlert } from '../admin/AdminAlert'
import { useGuestAttendsEvent, useGuestRegretsEvent } from './firebaseHooks'
import { EventCardContent } from '../events/EventCardContent'
import { OppositeContentGeneric } from '../events/OppositeContentGeneric'
import { DayDivider } from '../events/DayDivider'
import { EventActions } from './EventActions'
import { renderIf } from '../../render-if'
import { EventRsvpBtnGrp } from './EventRsvpBtnGrp'
import { StreetViewCardMedia } from '../events/StreetViewCardMedia'

type EventRecordType = z.infer<typeof EventRecord>
type GuestRecordType = z.infer<typeof GuestRecord>

type EventRSVP = 'Attend' | 'Regret'

interface EventTimelineCardProps {
  id: EventRecordType['id']
  name: EventRecordType['name']
  description: EventRecordType['description']
  dressCode: EventRecordType['dressCode']
  locationName: EventRecordType['locationName']
  location: EventRecordType['location']
  shuttle?: EventRecordType['shuttle']
  imageUrl?: EventRecordType['imageUrl']
  startDateTime: DateTime
  endDateTime: DateTime
  guestRecord: GuestRecordType
  setAlert: AlertDataSetter
  showTimeAndLocation?: boolean
  inviteesGuests: ReadonlyArray<GuestRecordType>
}

const locationToLongString = (location: EventRecordType['location']) =>
  `${location.street}, ${location.city}, ${location.state} ${location.postal}`

const EventTimelineCard = ({
  id,
  name,
  description,
  locationName,
  location,
  shuttle,
  imageUrl,
  startDateTime,
  endDateTime,
  dressCode,
  guestRecord,
  setAlert,
  showTimeAndLocation = false,
  inviteesGuests,
}: EventTimelineCardProps) => {
  const showActions = useMemo(() => showTimeAndLocation, [showTimeAndLocation])

  const guestAttendsEvent = useGuestAttendsEvent()
  const guestRegretsEvent = useGuestRegretsEvent()

  const handleRSVP = useCallback(
    (guest: GuestRecordType) =>
      (event: React.MouseEvent<HTMLElement>, newRSVP: EventRSVP) => {
        if (newRSVP === 'Attend') {
          guestAttendsEvent(guest.id, id).catch((err) => {
            console.error(err)
            setAlert({
              severity: 'error',
              children: toString(err),
            })
          })
        }
        if (newRSVP === 'Regret') {
          guestRegretsEvent(guest.id, id).catch((err) => {
            console.error(err)
            setAlert({
              severity: 'error',
              children: toString(err),
            })
          })
        }
      },
    [guestAttendsEvent, guestRegretsEvent, id, setAlert]
  )

  const getCurrentRSVP = useCallback(
    (guest: GuestRecordType): EventRSVP | undefined => {
      if (includes(guest.eventsAttending, id)) {
        return 'Attend'
      }
      if (includes(guest.eventsRegretting, id)) {
        return 'Regret'
      }
      return void 0
    },
    [id]
  )

  return (
    <Card sx={{ maxWidth: 345, display: 'inline-block' }}>
      {imageUrl === void 0 ? (
        <StreetViewCardMedia
          locationAsLongString={locationToLongString(location)}
          locationName={locationName}
        />
      ) : (
        <CardMedia
          component="img"
          height="100"
          image={imageUrl}
          alt={locationName}
        />
      )}
      <CardContent sx={{ pb: 0 }}>
        <EventCardContent
          {...{
            description,
            dressCode,
            endDateTime,
            id,
            location,
            locationName,
            name,
            startDateTime,
            shuttle,
            showTimeAndLocation,
          }}
        />

        <Divider>{'RSVP'}</Divider>
        <Box
          sx={{
            my: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderIf(inviteesGuests.length > 0)(() => (
            <Typography>{'Me'}</Typography>
          ))}
          <EventRsvpBtnGrp
            currentRsvp={getCurrentRSVP(guestRecord)}
            onRsvpChange={handleRSVP(guestRecord)}
          />
        </Box>
        {map(inviteesGuests, (guest) => (
          <Box
            key={guest.id}
            sx={{
              my: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography>{`${guest.firstName} ${guest.lastName}`}</Typography>
            <EventRsvpBtnGrp
              key={guest.id}
              currentRsvp={getCurrentRSVP(guest)}
              onRsvpChange={handleRSVP(guest)}
            />
          </Box>
        ))}
        {renderIf(showActions)(() => (
          <Box sx={{ mt: 2, mb: -2 }}>
            <EventActions
              {...{
                description,
                dressCode,
                endDateTime,
                location,
                locationName,
                name,
                startDateTime,
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

interface EventTimelineItemProps {
  id: EventRecordType['id']
  name: EventRecordType['name']
  description: EventRecordType['description']
  dressCode: EventRecordType['dressCode']
  locationName: EventRecordType['locationName']
  location: EventRecordType['location']
  shuttle?: EventRecordType['shuttle']
  imageUrl?: EventRecordType['imageUrl']
  startDateTime: DateTime
  endDateTime: DateTime
  guestRecord: GuestRecordType
  setAlert: AlertDataSetter
  shouldRenderMobile?: boolean
  inviteesGuests: ReadonlyArray<GuestRecordType>
}

const EventTimelineItem = ({
  id,
  name,
  description,
  dressCode,
  location,
  locationName,
  shuttle,
  imageUrl,
  startDateTime,
  endDateTime,
  guestRecord,
  setAlert,
  shouldRenderMobile = false,
  inviteesGuests,
}: EventTimelineItemProps) => {
  return shouldRenderMobile ? (
    <EventTimelineCard
      showTimeAndLocation={shouldRenderMobile}
      {...{
        id,
        name,
        description,
        dressCode,
        location,
        locationName,
        shuttle,
        imageUrl,
        startDateTime,
        endDateTime,
        guestRecord,
        setAlert,
        inviteesGuests,
      }}
    />
  ) : (
    <TimelineItem>
      <TimelineOppositeContent sx={{ m: 'auto 0' }}>
        <OppositeContentGeneric
          {...{
            endDateTime,
            location,
            startDateTime,
          }}
        />
        <Box sx={{ mb: 2 }} />
        <EventActions
          {...{
            description,
            dressCode,
            endDateTime,
            location,
            locationName,
            name,
            startDateTime,
          }}
        />
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot>{/* <FastfoodIcon /> */}</TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent align="left" sx={{ m: 'auto 0' }}>
        <EventTimelineCard
          showTimeAndLocation={shouldRenderMobile}
          {...{
            id,
            name,
            description,
            dressCode,
            location,
            locationName,
            shuttle,
            imageUrl,
            startDateTime,
            endDateTime,
            guestRecord,
            setAlert,
            inviteesGuests,
          }}
        />
      </TimelineContent>
    </TimelineItem>
  )
}

interface EventTimelineProps {
  eventRecords: ReadonlyArray<EventRecordType>
  guestRecord: GuestRecordType
  setAlert: AlertDataSetter
  inviteesGuests: ReadonlyArray<GuestRecordType>
}

const EventTimeline = ({
  eventRecords,
  guestRecord,
  setAlert,
  inviteesGuests,
}: EventTimelineProps) => {
  // Mobile responsive
  const theme = useTheme()
  const shouldRenderMobile = useMediaQuery(theme.breakpoints.down('md'))

  const sortedEventRecords = useMemo(() => {
    const betterEventRecords = map(eventRecords, (event) => ({
      ...event,
      startDateTime: DateTime.fromJSDate(event.startDateTime),
      endDateTime: DateTime.fromJSDate(event.endDateTime),
    }))
    const groupedEventRecords = groupBy(
      betterEventRecords,
      ({ startDateTime }) => startDateTime.toISODate()
    )
    const groupedEventRecordsArr = map(groupedEventRecords, (events, date) => ({
      date,
      events: sortBy(events, ({ startDateTime }) => startDateTime.toISO()),
    }))
    const groupedSortedEventRecords = sortBy(groupedEventRecordsArr, 'date')
    console.log('groupedSortedEventsRecords', groupedSortedEventRecords)
    return groupedSortedEventRecords
  }, [eventRecords])

  return (
    <Box sx={{ my: 6 }}>
      {map(sortedEventRecords, ({ date, events }) => (
        <Box key={date} sx={{ textAlign: 'center' }}>
          {shouldRenderMobile ? (
            <>
              <DayDivider date={date} />
              {map(events, (event) => (
                <EventTimelineItem
                  key={event.id}
                  {...{
                    guestRecord,
                    setAlert,
                    shouldRenderMobile,
                    inviteesGuests,
                  }}
                  {...event}
                />
              ))}
            </>
          ) : (
            <Timeline position="alternate">
              <DayDivider date={date} />
              {map(events, (event) => (
                <EventTimelineItem
                  key={event.id}
                  {...{
                    guestRecord,
                    setAlert,
                    shouldRenderMobile,
                    inviteesGuests,
                  }}
                  {...event}
                />
              ))}
            </Timeline>
          )}
        </Box>
      ))}
    </Box>
  )
}

interface ItineraryTabProps {
  eventRecords?: ReadonlyArray<EventRecordType>
  guestRecord: GuestRecordType
  inviteesGuests: ReadonlyArray<GuestRecordType>
  loading: boolean
  error: string | undefined
}

export const ItineraryTab = ({
  eventRecords,
  guestRecord,
  inviteesGuests,
  loading,
  error,
}: ItineraryTabProps) => {
  const filteredEventRecords = useMemo(
    () =>
      filter(eventRecords, (e) => includes(guestRecord.eventsInvited, e.id)),
    [eventRecords, guestRecord.eventsInvited]
  )

  const { alertData, setAlertData, handleCloseAlert } = useAdminAlert()

  return loading || error !== undefined ? (
    <Box
      sx={{
        height: '87vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {error === undefined ? (
        <CircularProgress />
      ) : (
        <Alert severity="error">{error}</Alert>
      )}
    </Box>
  ) : (
    <Box>
      <EventTimeline
        eventRecords={filteredEventRecords}
        guestRecord={guestRecord}
        setAlert={setAlertData}
        inviteesGuests={inviteesGuests}
      />
      <AdminAlert adminAlertData={alertData} onClose={handleCloseAlert} />
    </Box>
  )
}
