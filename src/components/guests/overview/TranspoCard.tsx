/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'

export const TranspoCard = () => {
  return (
    <Card>
      <CardHeader title="Getting Here" sx={{ pb: 0 }} />
      <CardContent>
        <Typography variant="h5">{'Flying'}</Typography>
        <Typography sx={{ mt: 1 }}>
          {
            'CHO - Charlottesville-Ablemarle Airport is the closest airport to Wintergreen, and is about 1 hour away.'
          }
        </Typography>
        <Typography sx={{ mt: 1 }}>
          {
            "RIC - Richmond Int'l may be better for some, and is ~2 hours from Wintergreen."
          }
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="h5">{'Driving'}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {
            'This is generally pretty straightforward.  Set your GPS for 39 Mountain Inn Loop, Nellysford, VA 22958.  For a VERY scenic route, take Skyline Drive / Blue Ridge Parkway'
          }
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {
            'From Blue Ridge Parkway: Take the Reeds Gap exit (between mileposts 13 and 14). Go east on Rt. 664 one mile to the Wintergreen entrance on your left. It is a beautiful and historic parkway and provides an alternate route to Wintergreen.'
          }
        </Typography>
      </CardContent>
    </Card>
  )
}

export const ShuttlesCard = () => {
  return (
    <Card>
      <CardHeader title="Shuttles" sx={{ pb: 0 }} />
      <CardContent>
        <Typography variant="h5">{'General'}</Typography>
        <Typography>
          {
            'If you book your accommodations through Wintergreen, you can use the convenient on-resort shuttle service.  It is available from 8:00 AM to 10:00 PM daily.'
          }
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="h5">{'Open House'}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {
            'For the Open House on Friday, shuttle service will run between Lot D of Wintergreen Mountain Inn and Bold Rock Cidery from 4:30pm to 9pm.  See Itinerary above for further details.'
          }
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="h5">{'Ceremony/Reception'}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {
            'For the Ceremony on Saturday, shuttle service will be provided from the Mountain Inn at 4:30pm sharp.  If needed, you can park your car in Lot D, E, or F and take the shuttle (NO parking is available at the ceremony location). Shuttles to cocktail hour and reception will be provided.  Cars in Lot D, E, & F can be picked up the next day. See Itinerary above for further details.'
          }
        </Typography>
      </CardContent>
    </Card>
  )
}
