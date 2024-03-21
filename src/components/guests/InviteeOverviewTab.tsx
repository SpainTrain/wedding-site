import { z } from 'zod'
import { some, cond, map, size } from 'lodash'
import React, { useCallback, useMemo } from 'react'

import {
  Alert,
  Button,
  Card,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
// import { Masonry } from '@mui/lab'

import { GuestRecord, InviteeRecord } from '../../../functions/src/schemas'
import { renderIf } from '../../render-if'
import {
  useInviteeAcceptedRsvp,
  useInviteeRegrettedRsvp,
} from './firebaseHooks'
import { ChooseFoodCard } from './ChooseFoodCard'
import { BookLodgingCard } from './BookLodgingCard'
import { OverviewDoneState } from './OverviewDoneState'
import { useGuestTabQsNav } from '../useTabQsNav'
import { useRouter } from 'next/router'
import { AddGuestsStep } from './AddGuestsStep'

type InviteeRecordType = z.infer<typeof InviteeRecord>
type GuestRecordType = z.infer<typeof GuestRecord>

interface StepperState {
  activeStep: number
}

const useInviteeOverviewStepper = (
  guestRecord: GuestRecordType,
  inviteeRecord: InviteeRecordType,
  inviteesGuests: readonly GuestRecordType[]
): StepperState => {
  const activeStep = useMemo(
    () =>
      cond([
        // If no response yet, show overall RSVP ask
        [() => inviteeRecord.overallRsvp === 'No Response', () => 0],
        // Invitee is one guest, let them add others
        [() => size(inviteesGuests) < inviteeRecord.guestCount - 1, () => 1],
        // Any of invitee's guests have not chosen food
        [
          () =>
            some(
              [guestRecord, ...inviteesGuests],
              (g) => g.dinnerChoice === 'Not Yet Selected'
            ),
          () => 2,
        ],
        [() => inviteeRecord.lodgingBooking === void 0, () => 3],
        [() => true, () => 4],
      ])(),
    [
      guestRecord,
      inviteeRecord.guestCount,
      inviteeRecord.lodgingBooking,
      inviteeRecord.overallRsvp,
      inviteesGuests,
    ]
  )

  return { activeStep }
}

interface InviteeOverviewTabProps {
  inviteeRecord: InviteeRecordType
  guestRecord: GuestRecordType
  inviteesGuests: readonly GuestRecordType[]
}

export const InviteeOverviewTab = ({
  guestRecord,
  inviteeRecord,
  inviteesGuests,
}: InviteeOverviewTabProps) => {
  const { activeStep } = useInviteeOverviewStepper(
    guestRecord,
    inviteeRecord,
    inviteesGuests
  )

  const inviteeRegrettedRsvp = useInviteeRegrettedRsvp()
  const handleRegretOverallRsvp = useCallback(() => {
    inviteeRegrettedRsvp(inviteeRecord.id).catch((err) => console.error(err))
  }, [inviteeRecord.id, inviteeRegrettedRsvp])

  const inviteeAcceptedRsvp = useInviteeAcceptedRsvp()
  const handleAcceptOverallRsvp = useCallback(() => {
    inviteeAcceptedRsvp(inviteeRecord.id).catch((err) => console.error(err))
  }, [inviteeAcceptedRsvp, inviteeRecord.id])

  // For final step
  const router = useRouter()
  const { navigateToTab } = useGuestTabQsNav(router)
  const handleNavToItinerary = useCallback(() => {
    navigateToTab('Itinerary')
  }, [navigateToTab])
  const handleNavToGuests = useCallback(() => {
    navigateToTab('My Guests')
  }, [navigateToTab])

  return (
    <Container sx={{ mt: 3 }} maxWidth="xl">
      {renderIf(activeStep < 4)(() => (
        <Stepper alternativeLabel activeStep={activeStep}>
          <Step>
            <StepLabel>{'RSVP'}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{'Add Guests'}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{'Choose Dinner'}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{'Book Lodging'}</StepLabel>
          </Step>
        </Stepper>
      ))}

      <Container
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        maxWidth="xl"
      >
        {/* RSVP STEP */}
        {renderIf(activeStep === 0)(() => (
          <Card
            sx={{
              p: 2,
              maxWidth: 520,
              minWidth: 240,
            }}
          >
            <Typography variant="h2">{'RSVP'}</Typography>
            <Typography variant="h4">
              {'Do you plan to attend the festivities?'}
            </Typography>
            <Container
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRegretOverallRsvp}
              >
                {'Regret'}
              </Button>
              <Button variant="contained" onClick={handleAcceptOverallRsvp}>
                {'Attending'}
              </Button>
            </Container>
          </Card>
        ))}
        {/* ADD GUESTS STEP */}
        {renderIf(activeStep === 1)(() => (
          <AddGuestsStep
            {...{
              inviteeRecord,
              guestRecord,
              inviteesGuests,
            }}
          />
        ))}
        {/* CHOOSE FOOD STEP */}
        {renderIf(activeStep === 2)(() => (
          <>
            {map([guestRecord, ...inviteesGuests], (g) => (
              <ChooseFoodCard
                key={g.id}
                name={`${g.firstName} ${g.lastName}`}
                guestId={g.id}
                currentSelection={g.dinnerChoice}
                currentRestrictions={g.foodRestrictions}
              />
            ))}
          </>
        ))}
        {/* LODGING STEP */}
        {renderIf(activeStep === 3)(() => (
          <BookLodgingCard
            inviteeId={inviteeRecord?.id}
            currentLodgingBooking={inviteeRecord?.lodgingBooking}
          />
        ))}

        {/* DONE!!! */}
        {renderIf(activeStep === 4)(() => (
          <OverviewDoneState
            onClickItinerary={handleNavToItinerary}
            onClickMyGuests={handleNavToGuests}
            guestRecord={guestRecord}
            inviteeRecord={inviteeRecord}
          />
        ))}

        {/* ENCOURAGEMENT TO FINISH WIZARD */}
        {renderIf(activeStep < 4)(() => (
          <Container sx={{ mt: 4 }} maxWidth="md">
            <Alert severity="info">
              {
                'More information will be available once you have completed these four easy steps!'
              }
            </Alert>
          </Container>
        ))}
      </Container>
    </Container>
  )
}
