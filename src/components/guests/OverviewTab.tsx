/* eslint-disable @next/next/no-img-element */
import { z } from 'zod'
import React from 'react'

import { Container } from '@mui/material'
import { Masonry } from '@mui/lab'

import { GuestRecord /*, InviteeRecord*/ } from '../../../functions/src/schemas'

import { ChooseFoodCard } from './ChooseFoodCard'
import { GiftsCard } from './overview/GiftsCard'
import {
  OverviewPhotoBridge,
  OverviewPhotoCowlieInMountains,
  OverviewPhotoUsBothPups,
  OverviewPhotoUsCheersing,
  OverviewPhotoWithCow,
} from './overview/OverviewPhotos'
import { ShuttlesCard, TranspoCard } from './overview/TranspoCard'
import { AdultsCard } from './overview/AdultsCard'

// type InviteeRecordType = z.infer<typeof InviteeRecord>
type GuestRecordType = z.infer<typeof GuestRecord>

interface OverviewTabProps {
  /** READONLY - Do not perform write ops in Firestore */
  // inviteeRecord: InviteeRecordType
  guestRecord: GuestRecordType
}

/**
 * Overview tab for a guest that is NOT also invitee
 *
 * @returns React component
 */
export const OverviewTab = ({
  guestRecord,
}: // inviteeRecord,
OverviewTabProps) => {
  return (
    <Container
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Masonry
        columns={{ xs: 1, md: 2, xl: 3 }}
        spacing={{ xs: 1, md: 2, xl: 4 }}
      >
        <ChooseFoodCard
          guestId={guestRecord.id}
          name={`${guestRecord.firstName} ${guestRecord.lastName}`}
          email={guestRecord.email}
          currentSelection={guestRecord.dinnerChoice}
          currentRestrictions={guestRecord.foodRestrictions}
        />
        <OverviewPhotoBridge />

        <GiftsCard />
        <OverviewPhotoWithCow />

        <TranspoCard />
        <OverviewPhotoUsCheersing />

        <ShuttlesCard />
        <OverviewPhotoCowlieInMountains />

        <AdultsCard />
        <OverviewPhotoUsBothPups />
      </Masonry>
    </Container>
  )
}
