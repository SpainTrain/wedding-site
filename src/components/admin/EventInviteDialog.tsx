import { z } from 'zod'
import React, { useState, useCallback } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'

import { GuestRecord } from '../../../functions/src/schemas'
import { EventInviteTransferList } from './EventInviteTransferList'

export const useEventInviteDialog = () => {
  const [isEventInviteDialogOpen, setOpen] = useState(false)

  const handleEventInviteDialogOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const handleEventInviteDialogClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return {
    isEventInviteDialogOpen,
    handleEventInviteDialogOpen,
    handleEventInviteDialogClose,
  }
}

interface EventInviteDialogProps {
  open: boolean
  onClose: () => void
  eventTitle: string
  eventId: string
  allGuestsInvited: boolean
  guestRecords: ReadonlyArray<z.infer<typeof GuestRecord>>
}

export const EventInviteDialog = ({
  open,
  onClose: handleClose,
  eventTitle,
  eventId,
  allGuestsInvited,
  guestRecords,
}: EventInviteDialogProps) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{`Manage Invitations`}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {'Remember: Invitations are per guest per event.  '}
        </DialogContentText>
        <Divider sx={{ my: 2 }} variant="middle">
          {eventTitle}
        </Divider>
        <EventInviteTransferList
          {...{
            guestRecords,
            eventId,
            allGuestsInvited,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          variant="contained"
          color="secondary"
          startIcon={<CheckCircleIcon />}
          onClick={handleClose}
        >
          {'Done'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
