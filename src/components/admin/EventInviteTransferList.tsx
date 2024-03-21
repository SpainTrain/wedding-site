import { z } from 'zod'
import {
  filter,
  includes,
  intersection,
  keyBy,
  map,
  mapValues,
  reject,
  size,
  sortBy,
  union,
  without,
} from 'lodash'
import React, { useCallback, useMemo } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material'
import {
  ArrowBackIosNew as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material'

import { GuestRecord } from '../../../functions/src/schemas'

import {
  useInviteAllGuestsToEvent,
  useInviteGuestsToEvent,
  useRemoveGuestsFromEvent,
  useUntoggleAllGuestsInvitedToEvent,
} from './firebase-hooks'

type GuestId = string
type GuestName = string
type GuestNameMap = Readonly<Record<GuestId, GuestName>>
type GuestList = readonly GuestId[]

interface EventInviteTransferListProps {
  guestRecords: ReadonlyArray<z.infer<typeof GuestRecord>>
  eventId: string
  allGuestsInvited: boolean
}

export const EventInviteTransferList = ({
  guestRecords: guestRecordsUnsorted,
  eventId,
  allGuestsInvited,
}: EventInviteTransferListProps) => {
  // Per Guest Invitation Data/Effects
  const inviteGuestsToEvent = useInviteGuestsToEvent()
  const removeGuestsFromEvent = useRemoveGuestsFromEvent()

  const guestRecords = useMemo(
    () => sortBy(guestRecordsUnsorted, 'lastName'),
    [guestRecordsUnsorted]
  )

  const guestNameMap: GuestNameMap = useMemo(
    () =>
      mapValues(
        keyBy(guestRecords, 'id'),
        ({ firstName, lastName }) => `${firstName} ${lastName}`
      ),
    [guestRecords]
  )

  const notInvited: GuestList = useMemo(
    () =>
      map(
        reject(guestRecords, (record) =>
          includes(record.eventsInvited, eventId)
        ),
        'id'
      ),
    [eventId, guestRecords]
  )
  const invited: GuestList = useMemo(
    () =>
      map(
        filter(guestRecords, (record) =>
          includes(record.eventsInvited, eventId)
        ),
        'id'
      ),
    [eventId, guestRecords]
  )

  const [checked, setChecked] = React.useState<GuestList>([])
  const [potentialGuestsLoading, setPotentialGuestsLoading] =
    React.useState<boolean>(false)
  const [invitedLoading, setInvitedLoading] = React.useState<boolean>(false)

  const notInvitedChecked = intersection(notInvited, checked)
  const invitedChecked = intersection(invited, checked)

  const handleToggle = (guestId: GuestId) => () =>
    includes(checked, guestId)
      ? setChecked(without(checked, guestId))
      : setChecked(union(checked, [guestId]))

  const numberOfChecked = (items: GuestList) =>
    size(intersection(items, checked))

  const handleToggleAll = (items: GuestList) => () => {
    if (numberOfChecked(items) === size(items)) {
      setChecked(without(checked, ...items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleInviteChecked = () => {
    // Invite the checked guests who are not yet invited
    setPotentialGuestsLoading(true)

    inviteGuestsToEvent(notInvitedChecked, eventId)
      .catch((err) => console.error(err))
      .finally(() => {
        setPotentialGuestsLoading(false)
      })

    setChecked(without(checked, ...notInvitedChecked))
  }

  const handleRemoveChecked = () => {
    // Remove the checked guests who are currently invited
    setInvitedLoading(true)

    removeGuestsFromEvent(invitedChecked, eventId)
      .catch((err) => console.error(err))
      .finally(() => {
        setInvitedLoading(false)
      })

    setChecked(without(checked, ...invitedChecked))
  }

  // Toggle for inviting all guests in perpetuity
  const inviteAllGuestsToEvent = useInviteAllGuestsToEvent()
  const untoggleInviteAllGuests = useUntoggleAllGuestsInvitedToEvent()

  const handleChangeAllGuestToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInvitedLoading(true)
      setPotentialGuestsLoading(true)
      const toggleValue = event.target.checked
      const updateFn =
        toggleValue === true ? inviteAllGuestsToEvent : untoggleInviteAllGuests

      updateFn(eventId)
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setInvitedLoading(false)
          setPotentialGuestsLoading(false)
          setChecked([])
        })
    },
    [eventId, inviteAllGuestsToEvent, untoggleInviteAllGuests]
  )

  const customList = (
    title: React.ReactNode,
    items: GuestList,
    loading: boolean
  ) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0 || loading || allGuestsInvited}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={<Typography>{title}</Typography>}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      {loading ? (
        <LinearProgress />
      ) : (
        <LinearProgress value={0} variant="determinate" />
      )}
      <Divider />
      <List
        sx={{
          width: 330,
          height: 400,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {map(items, (guestId: GuestId) => {
          const labelId = `transfer-list-all-item-${guestId}-label`

          return (
            <ListItem
              key={guestId}
              role="listitem"
              button
              onClick={handleToggle(guestId)}
              disabled={loading || allGuestsInvited}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(guestId) !== -1}
                  disabled={allGuestsInvited}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={guestNameMap[guestId]} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="stretch">
      <Grid item>
        {customList('Potential Guests', notInvited, potentialGuestsLoading)}
      </Grid>

      <Grid item alignItems="stretch">
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          sx={{ height: '100%' }}
        >
          <FormControlLabel
            sx={{ mb: 2 }}
            control={
              <Switch
                checked={allGuestsInvited}
                onChange={handleChangeAllGuestToggle}
              />
            }
            labelPlacement="top"
            label={
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">{'Invite'}</Typography>
                <Typography variant="body2">{'All Guests'}</Typography>
              </Box>
            }
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              sx={{ my: 0.5, minWidth: 110 }}
              variant="outlined"
              size="small"
              onClick={handleInviteChecked}
              disabled={
                notInvitedChecked.length === 0 ||
                potentialGuestsLoading ||
                allGuestsInvited
              }
              aria-label="Invite Selected Guests"
              endIcon={<ArrowForwardIosIcon />}
            >
              {'Invite'}
            </Button>
            <Button
              sx={{ my: 0.5, minWidth: 110 }}
              variant="outlined"
              size="small"
              onClick={handleRemoveChecked}
              disabled={
                invitedChecked.length === 0 ||
                invitedLoading ||
                allGuestsInvited
              }
              aria-label="Disinvite Selected Guests"
              startIcon={<ArrowBackIosIcon />}
            >
              {'Remove'}
            </Button>
          </Box>
          <Box />
        </Grid>
      </Grid>

      <Grid item>{customList('Invited', invited, invitedLoading)}</Grid>
    </Grid>
  )
}
