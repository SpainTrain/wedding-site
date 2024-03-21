import { z } from 'zod'
import React, { useState, useCallback } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from '@mui/material'
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js'

import { GuestRecordData } from '../../../functions/src/schemas'

import { useAddGuestRecordToInvitee } from '../firebaseHooks'

const AddGuestFormData = GuestRecordData.pick({
  firstName: true,
  lastName: true,
  email: true,
  mobile: true,
})
type AddGuestFormDataType = z.infer<typeof AddGuestFormData>

interface SelectedInviteeState {
  inviteeId: z.infer<typeof GuestRecordData.shape.inviteeId>
  inviteeName: string
}

export const useAddGuestDialog = () => {
  const [isAddGuestDialogOpen, setOpen] = useState(false)
  const [inviteeForAddGuestDialog, setSelectedInvitee] =
    useState<SelectedInviteeState>({
      inviteeId: '',
      inviteeName: 'ERROR - UNINITIALIZED',
    })

  const handleAddGuestDialogOpen = useCallback(
    (invitee: SelectedInviteeState) => {
      setOpen(true)
      setSelectedInvitee(invitee)
    },
    [setOpen]
  )

  const handleAddGuestDialogClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return {
    isAddGuestDialogOpen,
    handleAddGuestDialogOpen,
    handleAddGuestDialogClose,
    inviteeForAddGuestDialog,
  }
}

interface AddGuestDialogProps {
  open: boolean
  onClose: () => void
  invitee: SelectedInviteeState
}

export const AddGuestDialog = ({
  open,
  onClose: handleClose,
  invitee: { inviteeId, inviteeName },
}: AddGuestDialogProps) => {
  const addGuestRecordToInvitee = useAddGuestRecordToInvitee()

  const { control, handleSubmit, reset } = useForm<AddGuestFormDataType>()

  const onSubmit: SubmitHandler<AddGuestFormDataType> = useCallback(
    async (data) => {
      console.log('AddGuestDialog', 'onSubmit', data)
      await addGuestRecordToInvitee({
        ...data,
        inviteeId,
        vaxRequirementDisposition: 'Unviewed',
        dinnerChoice: 'Not Yet Selected',
      })
      handleClose()
      reset()
    },
    [addGuestRecordToInvitee, handleClose, inviteeId, reset]
  )

  const handleCloseAndReset = useCallback(() => {
    reset()
    handleClose()
  }, [handleClose, reset])

  return (
    <Dialog open={open} onClose={handleCloseAndReset} fullWidth maxWidth="md">
      {/* promise must go to onSubmit for this to work... */}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{`Add New Guest`}</DialogTitle>

        <DialogContent>
          {/* <DialogContentText>{'Enter details below'}</DialogContentText> */}
          <Divider variant="middle">{`Guest of ${inviteeName}`}</Divider>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    autoFocus
                    margin="dense"
                    label="First Name"
                    fullWidth
                    size="small"
                    required
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    margin="dense"
                    label="Last Name"
                    fullWidth
                    size="small"
                    required
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    margin="dense"
                    label="Email Address"
                    fullWidth
                    size="small"
                    type="email"
                    required
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="mobile"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  validate: (value) => isValidPhoneNumber(value),
                }}
                render={({ field }) => {
                  const inputFormatter = new AsYouType('US')
                  const value = inputFormatter.input(field.value)

                  return (
                    <TextField
                      margin="dense"
                      label="Mobile Number"
                      fullWidth
                      size="small"
                      type="tel"
                      required
                      {...field}
                      onChange={(e) => {
                        console.log(e.target.value)

                        const outputFormatter = new AsYouType('US')
                        outputFormatter.input(e.target.value)
                        console.log(outputFormatter.getNumber()?.number)
                        field.onChange(outputFormatter.getNumber()?.number)
                      }}
                      value={value}
                    />
                  )
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseAndReset}>
            {'Cancel'}
          </Button>
          <Button size="large" type="submit">
            {'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
