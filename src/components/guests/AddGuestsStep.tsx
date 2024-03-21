import { z } from 'zod'
import { map } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ManageAccounts as ManageAccountsIcon,
  Person as PersonIcon,
  PersonAddAlt as PersonAddAltIcon,
} from '@mui/icons-material'

import { GuestRecord, InviteeRecord } from '../../../functions/src/schemas'

import { AddGuestCard } from './AddGuestCard'
import { useUpdateGuestCount } from './firebaseHooks'
import { useCanAddMoreGuests } from './otherHooks'
import { renderIf } from '../../render-if'

type InviteeRecordType = z.infer<typeof InviteeRecord>
type GuestRecordType = z.infer<typeof GuestRecord>

interface AddGuestsStepProps {
  inviteeRecord: InviteeRecordType
  guestRecord: GuestRecordType
  inviteesGuests: readonly GuestRecordType[]
}

export const AddGuestsStep = ({
  inviteeRecord,
  guestRecord,
  inviteesGuests,
}: AddGuestsStepProps) => {
  const theme = useTheme()

  // Show / Add state mgmt
  const [isAddingGuest, setIsAddingGuest] = React.useState(false)
  const handleCancelAddingGuest = useCallback(() => setIsAddingGuest(false), [])
  const showAddGuest = useCallback(() => setIsAddingGuest(true), [])

  // More guests allowed?
  const canAddMoreGuests = useCanAddMoreGuests(inviteeRecord, inviteesGuests)

  // Handle effects
  const updateGuestCount = useUpdateGuestCount()
  const currentGuestCount = useMemo(
    () => inviteesGuests.length + 1,
    [inviteesGuests]
  )
  const handleClickNoAddlGuests = useCallback(() => {
    updateGuestCount(inviteeRecord.id, currentGuestCount).catch((err) => {
      console.error(err)
    })
  }, [currentGuestCount, inviteeRecord.id, updateGuestCount])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 720,
      }}
    >
      {isAddingGuest ? (
        <AddGuestCard
          inviteeId={inviteeRecord.id}
          onCancel={handleCancelAddingGuest}
        />
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h5">{'Guests'}</Typography>
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ManageAccountsIcon fontSize="large" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Me (${guestRecord.firstName} ${guestRecord.lastName}`}
                  secondary={guestRecord.email}
                />
              </ListItem>
              {map(inviteesGuests, (g) => (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon fontSize="large" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    key={`${g.firstName}${g.lastName}${g.email} `}
                    primary={`${g.firstName} ${g.lastName}`}
                    secondary={g.email}
                  />
                </ListItem>
              ))}
              {renderIf(canAddMoreGuests)(() => (
                <MenuItem onClick={showAddGuest}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{ backgroundColor: theme.palette.primary.main }}
                    >
                      <PersonAddAltIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Add Guest" />
                </MenuItem>
              ))}
            </List>
          </CardContent>
          <CardActions sx={{ float: 'right', p: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClickNoAddlGuests}
            >
              {'No Additional Guests ➞'}
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  )
}
