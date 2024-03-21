import { z } from 'zod'
import React, { useCallback, useEffect, useMemo } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  DoNotDisturbAltTwoTone as DoNotDisturbIcon,
} from '@mui/icons-material'

import { GuestRecord, InviteeRecord } from '../../../functions/src/schemas'
import {
  useGuestAcceptedVaxReq,
  useGuestRejectedVaxReq,
  useGuestViewedVaxReq,
} from './firebaseHooks'
import { renderIf } from '../../render-if'

const VaxInfoContent = () => {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ width: '240px' }}
          alt="COVID-19 Vaccine"
          src="https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2F12_Seeing-COVID19-Vaccine.webp?alt=media&token=3702b51d-e6ea-44ca-b803-b8e3ea8cba2d"
        />
      </Box>

      <Divider sx={{ mt: 2 }} variant="middle">
        {'Attendance'}
      </Divider>
      <DialogContentText>
        {
          'For the safety and comfort of all guests, we ask that all attending guests be vaccinated against COVID-19.'
        }
      </DialogContentText>

      <Divider sx={{ mt: 2 }} variant="middle">
        {'Standard'}
      </Divider>
      <DialogContentText>
        {
          'We will follow the CDC definition of "Fully Vaccinated". This means the primary series and any boosters are completed.'
        }
      </DialogContentText>

      <Divider sx={{ mt: 2 }} variant="middle">
        {'Verification'}
      </Divider>
      <DialogContentText>
        {
          'A 3rd party verification service will verify the vaccination status of each guest. The service and all data handling are fully HIPAA compliant and we will not see guest health information.'
        }
      </DialogContentText>
    </>
  )
}

interface VaxConsentActionsProps {
  guestRecord: z.infer<typeof GuestRecord>
  /** Invitee only added if guest is also invitee */
  inviteeRecord?: z.infer<typeof InviteeRecord>
  stateful?: boolean
}

const VaxConsentActions = ({
  guestRecord,
  inviteeRecord,
}: VaxConsentActionsProps) => {
  const guestAcceptedVaxReq = useGuestAcceptedVaxReq()
  const guestRejectedVaxReq = useGuestRejectedVaxReq()

  const handleAccept = useCallback(() => {
    guestAcceptedVaxReq(guestRecord.id).catch((err) => {
      console.error(err)
    })
  }, [guestAcceptedVaxReq, guestRecord.id])

  const handleReject = useCallback(() => {
    console.log('handleReject')

    guestRejectedVaxReq(guestRecord.id, inviteeRecord?.id).catch((err) => {
      console.error(err)
    })
  }, [guestRecord.id, guestRejectedVaxReq, inviteeRecord?.id])

  const hasAccepted = useMemo(
    () => guestRecord.vaxRequirementDisposition === 'Accepted',
    [guestRecord.vaxRequirementDisposition]
  )
  const hasChosen = useMemo(
    () => hasAccepted || guestRecord.vaxRequirementDisposition === 'Rejected',
    [guestRecord.vaxRequirementDisposition, hasAccepted]
  )

  return (
    <>
      <Box>
        <Button
          size="large"
          variant={hasChosen && hasAccepted ? 'outlined' : 'contained'}
          color="warning"
          startIcon={<DoNotDisturbIcon />}
          onClick={handleReject}
        >
          {'DECLINE'}
        </Button>
      </Box>
      <Box>
        <Button
          size="large"
          variant={hasChosen && !hasAccepted ? 'outlined' : 'contained'}
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleAccept}
        >
          {hasAccepted ? 'AGREED' : 'AGREE'}
        </Button>
        {renderIf(hasAccepted)(() => (
          <Typography
            variant="body2"
            color="success"
            sx={{ textAlign: 'center', pt: 0.5, mb: -1 }}
          >
            {'Saved'}
          </Typography>
        ))}
      </Box>
    </>
  )
}

interface VaxInterstitialDialogProps {
  open: boolean
  guestRecord: z.infer<typeof GuestRecord>
  /** Invitee only added if guest is also invitee */
  inviteeRecord?: z.infer<typeof InviteeRecord>
}

export const VaxInterstitialDialog = ({
  open,
  guestRecord,
  inviteeRecord,
}: VaxInterstitialDialogProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const guestViewedVaxReq = useGuestViewedVaxReq()

  useEffect(() => {
    if (
      guestRecord?.vaxRequirementDisposition !== 'Accepted' &&
      guestRecord?.vaxRequirementDisposition !== 'Rejected'
    ) {
      guestViewedVaxReq(guestRecord.id).catch((err) => {
        console.error(err)
      })
    }
  }, [
    guestRecord.id,
    guestRecord?.vaxRequirementDisposition,
    guestViewedVaxReq,
  ])

  return (
    <Dialog open={open} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle>{`Important Information`}</DialogTitle>

      <DialogContent>
        <VaxInfoContent />
      </DialogContent>
      <Divider>
        {guestRecord.firstName} {guestRecord.lastName}
      </Divider>
      <DialogActions sx={{ justifyContent: 'space-around' }}>
        <VaxConsentActions
          {...{
            guestRecord,
            inviteeRecord,
          }}
        />
      </DialogActions>
    </Dialog>
  )
}

interface VaxCardProps {
  guestRecord: z.infer<typeof GuestRecord>
  /** Invitee only added if guest is also invitee */
  inviteeRecord?: z.infer<typeof InviteeRecord>
}

export const VaxCard = ({ guestRecord, inviteeRecord }: VaxCardProps) => {
  return (
    <Card>
      <CardHeader title="COVID-19 Safety Policy" />
      <CardContent>
        <VaxInfoContent />
        <Divider>
          {guestRecord.firstName} {guestRecord.lastName}
        </Divider>
        <Container
          sx={{ mt: 1, display: 'flex', justifyContent: 'space-around' }}
        >
          <VaxConsentActions
            {...{
              guestRecord,
              inviteeRecord,
            }}
          />
        </Container>
      </CardContent>
    </Card>
  )
}
