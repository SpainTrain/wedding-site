/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { ImageListItem } from '@mui/material'

interface OverviewPhotosProps {
  alt: string
  src: string
}

const OverviewPhoto = ({ alt, src }: OverviewPhotosProps) => (
  <ImageListItem sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
    <img {...{ alt, src }} />
  </ImageListItem>
)

export const OverviewPhotoBridge = () => (
  <OverviewPhoto
    alt="Couple walking"
    src="https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2FHollyandMikeEngagement-0071.jpg?alt=media&token=b9ed91c6-6404-46f5-b4a8-5e2b383cf983"
  />
)

export const OverviewPhotoWithCow = () => (
  <OverviewPhoto
    alt="Couple with dogs"
    src="https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2Foverview-cards%2Fimage-with-cow.jpg?alt=media&token=7a82e4d1-8333-41ed-942b-72de300303fa"
  />
)

export const OverviewPhotoUsBothPups = () => (
  <OverviewPhoto
    {...{
      alt: 'Couple with dogs',
      src: 'https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2Foverview-cards%2Fus-w-both-pups.png?alt=media&token=9a5f9d2a-ca8d-4741-a9bf-10f1cd32188e',
    }}
  />
)

export const OverviewPhotoDressedUp = () => (
  <OverviewPhoto
    {...{
      alt: 'Couple dressed up',
      src: 'https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2Foverview-cards%2Fdressed-up-eng-party.png?alt=media&token=daddf534-c4cf-4184-9765-a25454ebdd93',
    }}
  />
)

export const OverviewPhotoUsShowingRing = () => (
  <OverviewPhoto
    {...{
      alt: 'Couple showing ring',
      src: 'https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2Foverview-cards%2Fus-showing-ring.png?alt=media&token=bd9432d0-12b6-483a-836e-7cb3bfe16205',
    }}
  />
)

export const OverviewPhotoUsCheersing = () => (
  <OverviewPhoto
    {...{
      alt: 'Couple doing Cheers with bottles',
      src: 'https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2Foverview-cards%2Fus-cheersing.png?alt=media&token=54828830-7758-4379-a5c5-ad13abe9c9a6',
    }}
  />
)

export const OverviewPhotoCowlieInMountains = () => (
  <OverviewPhoto
    {...{
      alt: 'Dog Cowlie in mountains',
      src: 'https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2Foverview-cards%2Fcow-in-mountains.jpg?alt=media&token=9f0916cc-9e5a-4ce5-8138-4f2e5d79b3e5',
    }}
  />
)
