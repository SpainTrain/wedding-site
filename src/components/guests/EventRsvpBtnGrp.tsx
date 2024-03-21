import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  DoNotDisturbOn as DoNotDisturbOnIcon,
} from '@mui/icons-material'
type EventRSVP = 'Attend' | 'Regret'

interface EventRsvpBtnGrpProps {
  currentRsvp: EventRSVP | undefined
  onRsvpChange: (
    event: React.MouseEvent<HTMLElement>,
    newRSVP: EventRSVP
  ) => void
}

export const EventRsvpBtnGrp = ({
  currentRsvp,
  onRsvpChange: handleRsvpChange,
}: EventRsvpBtnGrpProps) => (
  <ToggleButtonGroup
    color={currentRsvp === 'Attend' ? 'success' : 'error'}
    exclusive
    value={currentRsvp}
    onChange={handleRsvpChange}
  >
    <ToggleButton size="small" value="Attend">
      <CheckCircleIcon sx={{ mr: 1 }} />
      {'Attend'}
    </ToggleButton>
    <ToggleButton size="small" value="Regret">
      <DoNotDisturbOnIcon sx={{ mr: 1 }} />

      {'Regret'}
    </ToggleButton>
  </ToggleButtonGroup>
)
