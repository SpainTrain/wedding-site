import { isEqual, map } from 'lodash'
import { z } from 'zod'
import React, { useCallback } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import {
  LocalPhone as LocalPhoneIcon,
  Hotel as HotelIcon,
  DashboardCustomize as DashboardCustomizeIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers-pro'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { DateTime } from 'luxon'

import { useBookLodging } from './firebaseHooks'

import { LodgingBooking, LodgingOptions } from '../../../functions/src/schemas'
import { renderIf } from '../../render-if'

interface BookLodgingFormData {
  lodgingChoice: z.infer<typeof LodgingOptions>
  startDate: Date
  endDate: Date
}

interface BookLodgingCardProps {
  inviteeId: string
  currentLodgingBooking?: z.infer<typeof LodgingBooking>
}

export const CallLink = () => (
  <span>
    <span>{'Call '}</span>
    <a href="tel:+1-800-611-6888">{'800-611-6888'}</a>
  </span>
)

export const BookLodgingCard = ({
  inviteeId,
  currentLodgingBooking,
}: BookLodgingCardProps) => {
  const { control, handleSubmit, setValue, watch } =
    useForm<BookLodgingFormData>({
      defaultValues: currentLodgingBooking,
    })

  const watchAllFields = watch()
  const isFormSaved = useCallback(() => {
    if (currentLodgingBooking === void 0) {
      return false
    }
    return isEqual(watchAllFields, currentLodgingBooking)
  }, [currentLodgingBooking, watchAllFields])

  const bookLodging = useBookLodging()

  const onSubmit: SubmitHandler<BookLodgingFormData> = useCallback(
    async (data) => {
      try {
        console.log('BookLodgingCard', 'onSubmit', data)
        await bookLodging(inviteeId, {
          ...data,
          startDate: DateTime.fromJSDate(data.startDate).toJSDate(),
          endDate: DateTime.fromJSDate(data.endDate).toJSDate(),
        })
      } catch (err) {
        console.error(err)
      }
    },
    [bookLodging, inviteeId]
  )

  return (
    <Card
      sx={{
        p: 2,
        minWidth: 240,
      }}
    >
      <CardHeader
        title={
          currentLodgingBooking === undefined
            ? 'Book Lodging'
            : 'Review Lodging'
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Typography variant="body1">
          {'We strongly recommend booking through Wintergreen Resort.'}
        </Typography>
        <Alert severity="info" sx={{ my: 1 }}>
          {
            'Booking through 3rd parties may mean you cannot use the convenient on-resort shuttle service.'
          }
        </Alert>

        <Typography variant="h5">{'Steps'}</Typography>

        <List>
          <ListItem disablePadding sx={{ pl: 2 }}>
            <ListItemButton dense>
              <ListItemIcon>
                <LocalPhoneIcon />
              </ListItemIcon>
              <ListItemText primary={<CallLink />} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 2 }}>
            <ListItemButton dense>
              <ListItemIcon>
                <HotelIcon />
              </ListItemIcon>
              <ListItemText primary="Book on the Fuhrman/Spainhower room block" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 2 }}>
            <ListItemButton dense>
              <ListItemIcon>
                <DashboardCustomizeIcon />
              </ListItemIcon>
              <ListItemText primary="Add your booking below 👇" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 2 }}>
            <ListItemButton dense>
              <ListItemIcon>
                <CelebrationIcon />
              </ListItemIcon>
              <ListItemText primary="Get ready to party!" />
            </ListItemButton>
          </ListItem>
        </List>
        <Alert severity="warning">
          {
            'Note: Booking a house or condo, especially without a car, will require significant extra lead time to get to events.'
          }
        </Alert>
        <Divider sx={{ mb: 2 }}>{'My Booking'}</Divider>
        {/* promise must go to onSubmit for this to work... */}
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="lodgingChoice"
                  control={control}
                  defaultValue={
                    currentLodgingBooking?.lodgingChoice ?? 'Unselected/None'
                  }
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel htmlFor="lodgingChoice">
                        {'Lodging'}
                      </InputLabel>
                      <Select
                        value={field.value}
                        label="Lodging"
                        onChange={(newValue) => {
                          console.log('newValue', newValue)

                          if (newValue !== null) {
                            setValue(
                              'lodgingChoice',
                              newValue.target.value as unknown as z.infer<
                                typeof LodgingOptions
                              >
                            )
                          }
                        }}
                      >
                        {map(LodgingOptions.options, (option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="startDate"
                  control={control}
                  defaultValue={DateTime.fromISO('2022-09-09').toJSDate()}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DatePicker
                      inputRef={field.ref}
                      renderInput={(props) => (
                        <TextField
                          margin="dense"
                          size="small"
                          fullWidth
                          name={field.name}
                          {...props}
                        />
                      )}
                      label="Check-in Date"
                      value={field.value}
                      onChange={(newValue) => {
                        console.log('newValue', newValue)

                        if (newValue !== null) {
                          console.log('here')

                          setValue('startDate', newValue)
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  defaultValue={DateTime.fromISO('2022-09-11').toJSDate()}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DatePicker
                      renderInput={(props) => (
                        <TextField
                          margin="dense"
                          size="small"
                          fullWidth
                          name={field.name}
                          ref={field.ref}
                          {...props}
                        />
                      )}
                      label="Check-out Date"
                      value={field.value}
                      onChange={(newValue) => {
                        if (newValue !== null) {
                          setValue('endDate', newValue)
                        }
                      }}
                    />
                  )}
                />
                <Box sx={{ float: 'right' }}>
                  {renderIf(isFormSaved())(() => (
                    <Typography
                      variant="body2"
                      component="span"
                      color="success"
                    >
                      {'Saved '}
                    </Typography>
                  ))}
                  <Button size="large" variant="contained" type="submit">
                    {currentLodgingBooking === void 0 ? 'Book' : 'Update'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </form>
      </CardContent>
    </Card>
  )
}
