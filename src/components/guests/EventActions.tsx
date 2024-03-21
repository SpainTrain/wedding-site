/* eslint-disable @next/next/no-img-element */
import { z } from 'zod'
import React, { useMemo } from 'react'
import { DateTime } from 'luxon'
import {
  CalendarEvent,
  google as googleEvent,
  ics as icsEvent,
  office365 as office365Event,
  outlook as outlookEvent,
  yahoo as yahooEvent,
} from 'calendar-link'
import {
  Avatar,
  Button,
  ButtonGroup,
  ListItemAvatar,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Apple as AppleIcon,
  Event as EventIcon,
  MapTwoTone as MapIcon,
} from '@mui/icons-material'

import { EventRecord } from '../../../functions/src/schemas'

type EventRecordType = z.infer<typeof EventRecord>

const locationToLongString = (location: EventRecordType['location']) =>
  `${location.street}, ${location.city}, ${location.state} ${location.postal}`

const encodeLocation = (location: EventRecordType['location']) =>
  encodeURIComponent(locationToLongString(location))

const locationToGoogleMapsUrl = (location: EventRecordType['location']) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeLocation(location)}`

const locationToAppleMapsUrl = (location: EventRecordType['location']) =>
  `http://maps.apple.com/?q={${encodeLocation(location)}}`

const locationToWazeUrl = (location: EventRecordType['location']) =>
  `https://waze.com/ul?q=${encodeLocation(location)}`

interface EventActionsProps {
  name: EventRecordType['name']
  description: EventRecordType['description']
  dressCode: EventRecordType['dressCode']
  locationName: EventRecordType['locationName']
  location: EventRecordType['location']
  startDateTime: DateTime
  endDateTime: DateTime
}

export const EventActions = ({
  location,
  name,
  locationName,
  description,
  dressCode,
  startDateTime,
  endDateTime,
}: EventActionsProps) => {
  // MAPS
  const googleMapsUrl = locationToGoogleMapsUrl(location)
  const appleMapsUrl = locationToAppleMapsUrl(location)
  const wazeMapsUrl = locationToWazeUrl(location)

  // Calendar Links
  const {
    googleEventLink,
    icsEventLink,
    office365EventLink,
    outlookEventLink,
    yahooEventLink,
  } = useMemo(() => {
    const event: CalendarEvent = {
      title: `H&M Wedding - ${name}`,
      description: `${locationName} \n\n${description} \n\n${dressCode}`,
      start: startDateTime.toISO(),
      end: endDateTime.toISO(),
      location: locationToLongString(location),
    }

    return {
      googleEventLink: googleEvent(event),
      outlookEventLink: outlookEvent(event),
      office365EventLink: office365Event(event),
      yahooEventLink: yahooEvent(event),
      icsEventLink: icsEvent(event),
    }
  }, [
    description,
    dressCode,
    endDateTime,
    location,
    locationName,
    name,
    startDateTime,
  ])

  // MENUS
  const [anchorElCal, setAnchorElCal] = React.useState<null | HTMLElement>(null)
  const [anchorElMap, setAnchorElMap] = React.useState<null | HTMLElement>(null)

  const handleOpenCalMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCal(event.currentTarget)
  }
  const handleOpenMapMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMap(event.currentTarget)
  }

  const handleCloseCalMenu = React.useCallback(() => {
    setAnchorElCal(null)
  }, [])

  const handleCloseMapMenu = React.useCallback(() => {
    setAnchorElMap(null)
  }, [])

  return (
    <ButtonGroup variant="text" orientation="vertical">
      <Button
        aria-label="Add To Calendar"
        startIcon={<EventIcon />}
        onClick={handleOpenCalMenu}
      >
        {'Add To Calendar'}
      </Button>
      <Menu
        anchorEl={anchorElCal}
        open={Boolean(anchorElCal)}
        onClose={handleCloseCalMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem
          aria-label="Google Calendar"
          component="a"
          target="_blank"
          href={googleEventLink}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <img
                alt="Google Maps"
                width="40px"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png"
              />
            </Avatar>
          </ListItemAvatar>
          {'Google Cal'}
        </MenuItem>
        <MenuItem
          aria-label="Apple (ICS)"
          component="a"
          target="_blank"
          href={icsEventLink}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <AppleIcon />
            </Avatar>
          </ListItemAvatar>
          {'Apple (ICS)'}
        </MenuItem>
        <MenuItem
          aria-label="Outlook Calendar"
          component="a"
          target="_blank"
          href={outlookEventLink}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <img
                alt="Outlook"
                width="40px"
                src="https://www.blackwiredesigns.com/wp-content/uploads/Outlook-Calendar-Logo.png"
              />
            </Avatar>
          </ListItemAvatar>
          {'Outlook'}
        </MenuItem>
        <MenuItem
          aria-label="Office 365 Calendar"
          component="a"
          target="_blank"
          href={office365EventLink}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <img
                alt="Office 365"
                width="40px"
                src="https://marketplace-static.teamleader.eu/icons/ba72fd6a-c3be-49b3-8c3e-da76f9194e1c.png"
              />
            </Avatar>
          </ListItemAvatar>
          {'Office 365'}
        </MenuItem>
        <MenuItem
          aria-label="Yahoo Calendar"
          component="a"
          target="_blank"
          href={yahooEventLink}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <img
                alt="Yahoo"
                width="40px"
                src="https://w7.pngwing.com/pngs/596/137/png-transparent-yahoo-mail-email-outlook-com-yahoo-search-sizes-miscellaneous-purple-violet.png"
              />
            </Avatar>
          </ListItemAvatar>
          {'Yahoo'}
        </MenuItem>
      </Menu>
      <Button
        aria-label="Directions"
        onClick={handleOpenMapMenu}
        startIcon={<MapIcon />}
      >
        {'Map/Directions'}
      </Button>
      <Menu
        anchorEl={anchorElMap}
        open={Boolean(anchorElMap)}
        onClose={handleCloseMapMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem
          aria-label="Google Maps"
          component="a"
          target="_blank"
          href={googleMapsUrl}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <img
                alt="Google Maps"
                width="40px"
                src="data:image/png;base64,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"
              />
            </Avatar>
          </ListItemAvatar>
          {'Google Maps'}
        </MenuItem>
        <MenuItem
          aria-label="Apple Maps"
          component="a"
          target="_blank"
          href={appleMapsUrl}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <img
                alt="Apple Maps"
                width="40px"
                src="https://www.apple.com/v/maps/d/images/overview/intro_icon__dfyvjc1ohbcm_large.png"
              />
            </Avatar>
          </ListItemAvatar>
          {'Apple Maps'}
        </MenuItem>
        <MenuItem
          aria-label="Apple Maps"
          component="a"
          target="_blank"
          href={wazeMapsUrl}
          rel="noopener noreferrer"
        >
          <ListItemAvatar>
            <Avatar>
              <img
                alt="Waze Logo"
                width="40px"
                src="https://play-lh.googleusercontent.com/r7XL36PVNtnidqy6ikRiW1AHEIsjhePrZ8W5M4cNTQy5ViF3-lIDY47hpvxc84kJ7lw"
              />
            </Avatar>
          </ListItemAvatar>
          {'Waze'}
        </MenuItem>
      </Menu>
    </ButtonGroup>
  )
}
