import { groupBy, map, sortBy } from 'lodash'
import { z } from 'zod'
import React, { useCallback, useMemo } from 'react'
import { DateTime } from 'luxon'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Fab,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Groups as GroupsIcon,
  MapTwoTone as MapIcon,
} from '@mui/icons-material'
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

import { EventFormDialog, useEventFormDialog } from './EventFormDialog'
import { useDeleteEventTableRecord } from './firebase-hooks'
import { EventInviteDialog, useEventInviteDialog } from './EventInviteDialog'
import { AdminAlert, AlertDataSetter, useAdminAlert } from './AdminAlert'
import { EventCardContent } from '../events/EventCardContent'
import { OppositeContentGeneric } from '../events/OppositeContentGeneric'
import { StreetViewCardMedia } from '../events/StreetViewCardMedia'
import { DayDivider } from '../events/DayDivider'

type EventRecordType = z.infer<typeof EventRecord>
type GuestRecordType = z.infer<typeof GuestRecord>

interface EventTimelineCardProps {
  id: EventRecordType['id']
  name: EventRecordType['name']
  description: EventRecordType['description']
  dressCode: EventRecordType['dressCode']
  allGuestsInvited: boolean
  locationName: EventRecordType['locationName']
  location: EventRecordType['location']
  shuttle?: EventRecordType['shuttle']
  imageUrl?: EventRecordType['imageUrl']
  startDateTime: DateTime
  endDateTime: DateTime
  guestRecords: ReadonlyArray<GuestRecordType>
  setAlert: AlertDataSetter
}

const EventTimelineCard = ({
  id,
  name,
  description,
  locationName,
  location,
  startDateTime,
  endDateTime,
  dressCode,
  allGuestsInvited,
  shuttle,
  imageUrl,
  guestRecords,
  setAlert,
}: EventTimelineCardProps) => {
  const locationAsLongString = `${location.street}, ${location.city}, ${location.state} ${location.postal}`
  const locationEncoded = encodeURIComponent(locationAsLongString)
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${locationEncoded}`

  const {
    isEventFormDialogOpen,
    handleEventFormDialogOpen,
    handleEventFormDialogClose,
  } = useEventFormDialog()

  const {
    handleEventInviteDialogClose,
    handleEventInviteDialogOpen,
    isEventInviteDialogOpen,
  } = useEventInviteDialog()

  const deleteEventTableRecord = useDeleteEventTableRecord()
  const handleDeleteEvent = useCallback(() => {
    deleteEventTableRecord(id).catch((err) => console.error(err))
  }, [deleteEventTableRecord, id])

  return (
    <>
      <Card sx={{ maxWidth: 345, display: 'inline-block' }}>
        {imageUrl === undefined ? (
          <StreetViewCardMedia
            locationAsLongString={locationAsLongString}
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
              id,
              name,
              description,
              locationName,
              location,
              startDateTime,
              endDateTime,
              dressCode,
              shuttle,
            }}
          />
          <Divider />
        </CardContent>
        <CardActions disableSpacing>
          <Button
            aria-label="Edit"
            startIcon={<EditIcon />}
            onClick={handleEventFormDialogOpen}
          >
            {'Edit'}
          </Button>
          <Button
            aria-label="Invite"
            startIcon={<GroupsIcon />}
            onClick={handleEventInviteDialogOpen}
          >
            {'Invite'}
          </Button>
          <IconButton aria-label="Google Maps">
            <a target="_blank" href={googleMapsUrl} rel="noopener noreferrer">
              <MapIcon />
            </a>
          </IconButton>
          <IconButton aria-label="Delete" onClick={handleDeleteEvent}>
            <DeleteIcon color="error" />
          </IconButton>
        </CardActions>
      </Card>
      <EventFormDialog
        open={isEventFormDialogOpen}
        onClose={handleEventFormDialogClose}
        editInfo={{
          id,
          name,
          description,
          dressCode,
          location,
          locationName,
          shuttle,
          startDateTime: startDateTime.toJSDate(),
          endDateTime: endDateTime.toJSDate(),
        }}
        imageUrl={imageUrl}
        setAlert={setAlert}
      />
      <EventInviteDialog
        open={isEventInviteDialogOpen}
        onClose={handleEventInviteDialogClose}
        eventTitle={name}
        eventId={id}
        allGuestsInvited={allGuestsInvited}
        guestRecords={guestRecords}
      />
    </>
  )
}

interface EventTimelineItemProps {
  id: EventRecordType['id']
  name: EventRecordType['name']
  description: EventRecordType['description']
  dressCode: EventRecordType['dressCode']
  allGuestsInvited: boolean
  locationName: EventRecordType['locationName']
  location: EventRecordType['location']
  startDateTime: DateTime
  endDateTime: DateTime
  shuttle?: EventRecordType['shuttle']
  imageUrl?: EventRecordType['imageUrl']
  guestRecords: ReadonlyArray<z.infer<typeof GuestRecord>>
  setAlert: AlertDataSetter
}

const EventTimelineItem = ({
  id,
  name,
  description,
  dressCode,
  allGuestsInvited,
  location,
  locationName,
  startDateTime,
  endDateTime,
  shuttle,
  imageUrl,
  guestRecords,
  setAlert,
}: EventTimelineItemProps) => {
  return (
    <TimelineItem>
      <TimelineOppositeContent sx={{ m: 'auto 0' }}>
        <OppositeContentGeneric
          {...{
            endDateTime,
            location,
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
          {...{
            id,
            name,
            description,
            dressCode,
            allGuestsInvited,
            location,
            locationName,
            startDateTime,
            endDateTime,
            shuttle,
            imageUrl,
            guestRecords,
            setAlert,
          }}
        />
      </TimelineContent>
    </TimelineItem>
  )
}

interface EventTimelineProps {
  eventRecords: ReadonlyArray<z.infer<typeof EventRecord>>
  guestRecords: ReadonlyArray<z.infer<typeof GuestRecord>>
  setAlert: AlertDataSetter
}

const EventTimeline = ({
  eventRecords,
  guestRecords,
  setAlert,
}: EventTimelineProps) => {
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
        <Box key={date}>
          <Timeline position="alternate">
            <DayDivider date={date} />
            {map(events, (event) => (
              <EventTimelineItem
                key={event.id}
                guestRecords={guestRecords}
                allGuestsInvited={event.allGuestsInvited ?? false}
                setAlert={setAlert}
                {...event}
              />
            ))}
          </Timeline>
        </Box>
      ))}
    </Box>
  )
}

interface EventsTabProps {
  eventRecords: ReadonlyArray<z.infer<typeof EventRecord>>
  guestRecords: ReadonlyArray<z.infer<typeof GuestRecord>>
  loading: boolean
  error: string | undefined
}

export const EventsTab = ({
  eventRecords,
  guestRecords,
  loading,
  error,
}: EventsTabProps) => {
  const {
    isEventFormDialogOpen,
    handleEventFormDialogOpen,
    handleEventFormDialogClose,
  } = useEventFormDialog()

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
        eventRecords={eventRecords}
        guestRecords={guestRecords}
        setAlert={setAlertData}
      />
      <Fab
        onClick={handleEventFormDialogOpen}
        variant="extended"
        color="secondary"
        sx={{
          position: 'fixed',
          bottom: '3vh',
          right: '3vh',
        }}
      >
        <AddIcon />
        {'New Event'}
      </Fab>
      <AdminAlert adminAlertData={alertData} onClose={handleCloseAlert} />
      <EventFormDialog
        open={isEventFormDialogOpen}
        onClose={handleEventFormDialogClose}
        setAlert={setAlertData}
      />
    </Box>
  )
}
