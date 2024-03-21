import { isEmpty, omit } from 'lodash'
import React, { useState, useCallback } from 'react'
import { DateTime } from 'luxon'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'

import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import {
  AddPhotoAlternate as AddPhotoAlternateIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import {
  useCreateEventTableRecord,
  useUpdateEventTableRecord,
  useUploadEventImage,
} from './firebase-hooks'
import { AlertDataSetter } from './AdminAlert'

interface EventFormData {
  name: string
  locationName: string
  location: {
    street: string
    city: string
    state: string
    postal: string
  }
  description: string
  dressCode: string
  startDateTime: Date
  endDateTime: Date

  shuttle?: string
}

type EditFormData = EventFormData & {
  id: string
}

export const useEventFormDialog = () => {
  const [isEventFormDialogOpen, setOpen] = useState(false)

  const handleEventFormDialogOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const handleEventFormDialogClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return {
    isEventFormDialogOpen,
    handleEventFormDialogOpen,
    handleEventFormDialogClose,
  }
}

interface EventFormDialogProps {
  open: boolean
  onClose: () => void
  setAlert: AlertDataSetter
  editInfo?: EditFormData
  imageUrl?: string
}

export const EventFormDialog = ({
  open,
  onClose: handleClose,
  setAlert,
  editInfo = undefined,
  imageUrl,
}: EventFormDialogProps) => {
  // Firebase hooks
  const createEventTableRecord = useCreateEventTableRecord()
  const updateEventTableRecord = useUpdateEventTableRecord()
  const uploadEventImage = useUploadEventImage()

  // Image upload state
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>()

  // DROPZONE
  const onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles)
      uploadEventImage(acceptedFiles[0])
        .then((dlUrl) => {
          console.log(dlUrl)
          setNewImageUrl(dlUrl)
        })
        .catch((err) => console.error(err))
    },
    [uploadEventImage]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  // Shuttle state
  const [hasShuttle, updateHasShuttle] = useState<boolean>(
    !isEmpty(editInfo?.shuttle)
  )
  const handleShuttleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateHasShuttle(event.target.checked)
  }

  // FORM STUFF
  const { control, handleSubmit, reset, setValue } = useForm<EventFormData>({
    defaultValues: editInfo,
  })

  const onSubmit: SubmitHandler<EventFormData> = useCallback(
    async (data) => {
      try {
        console.log('EventFormDialog', 'onSubmit', data)
        const dataWithShuttle = hasShuttle ? data : omit(data, 'shuttle')
        const dataToSave =
          newImageUrl === undefined
            ? dataWithShuttle
            : {
                ...dataWithShuttle,
                imageUrl: newImageUrl,
              }
        editInfo === undefined
          ? await createEventTableRecord(dataToSave)
          : await updateEventTableRecord({
              id: editInfo.id,
              ...dataToSave,
            })
        handleClose()
        reset(editInfo === undefined ? undefined : data)
        setAlert({
          severity: 'success',
          children: 'Event saved successfully!',
        })
      } catch (err) {
        console.error(err)
        setAlert({
          severity: 'error',
          children: 'Error while saving event (see console)!',
        })
      }
    },
    [
      createEventTableRecord,
      editInfo,
      handleClose,
      hasShuttle,
      newImageUrl,
      reset,
      setAlert,
      updateEventTableRecord,
    ]
  )

  const isNewEvent = editInfo === undefined

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isNewEvent ? 'Create New Event' : 'Edit Event'}
      </DialogTitle>
      <DialogContent sx={{ overflow: 'visible', pb: 0 }}>
        <Divider>{'Event Photo'}</Divider>
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card sx={{ width: 345, mt: 1 }}>
              <CardMedia
                component="img"
                height="100"
                image={
                  newImageUrl ??
                  imageUrl ??
                  'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png'
                }
                alt="Event Photo"
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card elevation={isDragActive ? 24 : 1}>
              <CardActionArea
                sx={{
                  height: 100,
                  width: 345,
                  mt: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}
                {...getRootProps()}
              >
                <Avatar sx={{ display: 'flex' }}>
                  {isDragActive ? (
                    <CloudUploadIcon />
                  ) : (
                    <AddPhotoAlternateIcon />
                  )}
                </Avatar>
                <Typography sx={{ display: 'flex' }}>
                  {isDragActive
                    ? 'Drop to Upload'
                    : 'Drag or Click to Change Photo'}
                </Typography>
                <input {...getInputProps()} />
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      {/* promise must go to onSubmit for this to work... */}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DialogContent>
            <Divider variant="middle">{'Event Info'}</Divider>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Event Name"
                      fullWidth
                      size="small"
                      required
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="startDateTime"
                  control={control}
                  defaultValue={DateTime.fromISO('2022-09-10').toJSDate()}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DateTimePicker
                      renderInput={(props) => (
                        <TextField
                          margin="dense"
                          size="small"
                          fullWidth
                          name={field.name}
                          {...props}
                        />
                      )}
                      label="Start Date/Time"
                      value={field.value}
                      onChange={(newValue) => {
                        if (newValue !== null) {
                          setValue('startDateTime', newValue)
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="endDateTime"
                  control={control}
                  defaultValue={DateTime.fromISO('2022-09-10').toJSDate()}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DateTimePicker
                      renderInput={(props) => (
                        <TextField
                          margin="dense"
                          size="small"
                          fullWidth
                          name={field.name}
                          {...props}
                        />
                      )}
                      label="End Date/Time"
                      value={field.value}
                      onChange={(newValue) => {
                        if (newValue !== null) {
                          setValue('endDateTime', newValue)
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      margin="dense"
                      label="Description"
                      multiline
                      fullWidth
                      size="small"
                      minRows={5}
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="dressCode"
                  control={control}
                  defaultValue="Casual"
                  rules={{ required: true, minLength: 1 }}
                  render={({ field }) => (
                    <TextField
                      margin="dense"
                      label="Dress Code"
                      fullWidth
                      size="small"
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={hasShuttle}
                          onChange={handleShuttleChange}
                        />
                      }
                      label="shuttle"
                      labelPlacement="top"
                    />
                  </Grid>
                  <Grid item xs={10}>
                    <Controller
                      name="shuttle"
                      control={control}
                      defaultValue=""
                      rules={{ required: hasShuttle, minLength: 1 }}
                      render={({ field }) => (
                        <TextField
                          margin="dense"
                          label="Shuttle Info"
                          size="small"
                          required={hasShuttle}
                          disabled={!hasShuttle}
                          fullWidth
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider variant="middle">{'Location'}</Divider>
              </Grid>
              <Grid item xs={12} md={8}>
                <Controller
                  name="locationName"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      margin="dense"
                      label="Event Location Name"
                      fullWidth
                      size="small"
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Controller
                  name="location.street"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      margin="dense"
                      label="Street"
                      fullWidth
                      size="small"
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Controller
                  name="location.city"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      margin="dense"
                      label="City"
                      size="small"
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={1}>
                <Controller
                  name="location.state"
                  control={control}
                  defaultValue="VA"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      margin="dense"
                      label="State"
                      size="small"
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Controller
                  name="location.postal"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      margin="dense"
                      label="Postal"
                      size="small"
                      required
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={handleClose}>
              {'Cancel'}
            </Button>
            <Button size="large" variant="contained" type="submit">
              {isNewEvent ? 'Create' : 'Update'}
            </Button>
          </DialogActions>
        </LocalizationProvider>
      </form>
    </Dialog>
  )
}
