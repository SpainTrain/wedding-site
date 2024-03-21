import React from 'react'
import { CardMedia } from '@mui/material'

import { useGetStreetViewStaticUrl } from '../../functions'

interface StreetViewCardMediaProps {
  locationAsLongString: string
  locationName: string
}

export const StreetViewCardMedia = ({
  locationAsLongString,
  locationName,
}: StreetViewCardMediaProps) => {
  const streetViewImgUrl = useGetStreetViewStaticUrl(locationAsLongString)

  return (
    <CardMedia
      component="img"
      height="100"
      image={streetViewImgUrl}
      alt={locationName}
    />
  )
}
