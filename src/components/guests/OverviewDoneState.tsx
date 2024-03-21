/* eslint-disable @next/next/no-img-element */
import { z } from 'zod'
import { Masonry } from '@mui/lab'
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

import {
  PersonSearch as PersonSearchIcon,
  Rsvp as RsvpIcon,
} from '@mui/icons-material'
import { BookLodgingCard } from './BookLodgingCard'
import { GuestRecord, InviteeRecord } from '../../../functions/src/schemas'
import { GiftsCard } from './overview/GiftsCard'
import {
  OverviewPhotoBridge,
  OverviewPhotoCowlieInMountains,
  OverviewPhotoDressedUp,
  OverviewPhotoUsBothPups,
  OverviewPhotoUsCheersing,
  OverviewPhotoUsShowingRing,
  OverviewPhotoWithCow,
} from './overview/OverviewPhotos'
import { VaxCard } from './VaxInterstitial'
import { useMemo } from 'react'
import { AdultsCard } from './overview/AdultsCard'
import { ShuttlesCard, TranspoCard } from './overview/TranspoCard'

interface OverviewDoneStateProps {
  guestRecord: z.infer<typeof GuestRecord>
  inviteeRecord: z.infer<typeof InviteeRecord>
  onClickItinerary: () => void
  onClickMyGuests: () => void
}

export const OverviewDoneState = ({
  guestRecord,
  inviteeRecord,
  onClickItinerary: handleClickItinerary,
  onClickMyGuests: handleClickMyGuests,
}: OverviewDoneStateProps) => {
  const inviteeId = useMemo(() => inviteeRecord?.id, [inviteeRecord])
  const currentLodgingBooking = useMemo(
    () => inviteeRecord?.lodgingBooking,
    [inviteeRecord?.lodgingBooking]
  )

  return (
    <Masonry
      columns={{ xs: 1, md: 2, xl: 3 }}
      spacing={{ xs: 1, md: 2, xl: 4 }}
    >
      <Card>
        <CardHeader title="See you September 10!" />
        <CardContent>
          <Typography>{'The big stuff is done, thanks!'}</Typography>
          <Typography sx={{ mt: 2 }}>{'Now you can: '}</Typography>
          <List disablePadding sx={{ mt: 1 }}>
            <ListItem disablePadding>
              <ListItemButton dense onClick={handleClickItinerary}>
                <ListItemIcon>
                  <RsvpIcon />
                </ListItemIcon>
                <ListItemText primary="RSVP for Additional Events ➔" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton dense onClick={handleClickMyGuests}>
                <ListItemIcon>
                  <PersonSearchIcon />
                </ListItemIcon>
                <ListItemText primary="Review My Guests ➔" />
              </ListItemButton>
            </ListItem>
          </List>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            {'More general info below! 👇'}
          </Typography>
        </CardContent>
      </Card>
      <OverviewPhotoBridge />

      <GiftsCard />
      <OverviewPhotoWithCow />

      <TranspoCard />
      <OverviewPhotoUsCheersing />

      <ShuttlesCard />
      <OverviewPhotoCowlieInMountains />

      <AdultsCard />
      <OverviewPhotoUsBothPups />

      {/* REVIEW LODGING BOOKING */}
      <Card>
        <BookLodgingCard
          inviteeId={inviteeId}
          currentLodgingBooking={currentLodgingBooking}
        />
      </Card>
      <OverviewPhotoDressedUp />

      {/* REVIEW VACCINATION */}
      <VaxCard {...{ guestRecord, inviteeRecord }} />
      <OverviewPhotoUsShowingRing />
    </Masonry>
  )
}
