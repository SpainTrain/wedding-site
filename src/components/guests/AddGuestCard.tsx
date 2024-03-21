import { z } from 'zod'
import React, { useCallback } from 'react'
import {
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js'

import { useAddGuestRecordToInvitee } from '../firebaseHooks'
import { GuestRecordData } from '../../../functions/src/schemas'

const AddGuestFormData = GuestRecordData.pick({
  firstName: true,
  lastName: true,
  email: true,
  mobile: true,
})
type AddGuestFormDataType = z.infer<typeof AddGuestFormData>

interface AddGuestCardProps {
  inviteeId: string
  onCancel?: () => void
}

export const AddGuestCard = ({ inviteeId, onCancel }: AddGuestCardProps) => {
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
      reset()
    },
    [addGuestRecordToInvitee, inviteeId, reset]
  )

  const handleCancel = useCallback(() => {
    reset()
    onCancel?.()
  }, [onCancel, reset])

  return (
    <Card
      sx={{
        p: 2,
        minWidth: 240,
      }}
    >
      <Typography variant="h5">{'Add Guest'}</Typography>
      {/* promise must go to onSubmit for this to work... */}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
        <Container
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button color="secondary" onClick={handleCancel} sx={{ mr: 1 }}>
            {'Cancel'}
          </Button>
          <Button size="large" variant="contained" type="submit">
            {'Add'}
          </Button>
        </Container>
      </form>
    </Card>
  )
}
