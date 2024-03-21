import React, { useState, useCallback } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import { useRemoveGuestRecord } from './firebase-hooks'

interface SelectedGuestState {
  guestId: string
  guestFirstName: string
  guestLastName: string
}

export const useConfirmRemoveGuestDialog = () => {
  const [isConfirmRemoveGuestDialogOpen, setOpen] = useState(false)
  const [guestToRemove, setConfirmRemoveGuest] = useState<SelectedGuestState>({
    guestId: '',
    guestFirstName: '',
    guestLastName: '',
  })

  const handleConfirmRemoveGuestDialogOpen = useCallback(
    (guestRecord: SelectedGuestState) => {
      setOpen(true)
      setConfirmRemoveGuest(guestRecord)
    },
    [setOpen]
  )

  const handleConfirmRemoveGuestDialogClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return {
    isConfirmRemoveGuestDialogOpen,
    handleConfirmRemoveGuestDialogOpen,
    handleConfirmRemoveGuestDialogClose,
    guestForConfirmRemove: guestToRemove,
  }
}

interface ConfirmRemoveGuestDialogProps {
  open: boolean
  onClose: () => void
  guestToRemove: SelectedGuestState
}

export const ConfirmRemoveGuestDialog = ({
  open,
  onClose: handleClose,
  guestToRemove,
}: ConfirmRemoveGuestDialogProps) => {
  const removeGuestRecord = useRemoveGuestRecord()

  const handleSubmitAsync = useCallback(async () => {
    console.log('ConfirmRemoveGuestDialog', 'onSubmit', guestToRemove)
    await removeGuestRecord(guestToRemove.guestId)
    handleClose()
  }, [guestToRemove, handleClose, removeGuestRecord])

  const handleSubmit = useCallback(() => {
    handleSubmitAsync().catch((err) => {
      console.error(err)
    })
  }, [handleSubmitAsync])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {/* promise must go to onSubmit for this to work... */}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <DialogTitle>{`Remove Guest?`}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to remove guest ${guestToRemove.guestFirstName} ${guestToRemove.guestLastName}`}
        </DialogContentText>
        {/* <Divider variant="middle">{`Guest of ${inviteeName}`}</Divider> */}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          {'Cancel'}
        </Button>
        <Button size="large" onClick={handleSubmit}>
          {'REMOVE'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
