import * as React from 'react'
// import Image from 'next/image'
import { Button, Typography } from '@mui/material'
import { Theme, styled } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

const ProductHeroLayoutRoot = styled('section')(({ theme }) => ({
  color: theme.palette.common.white,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    height: '90vh',
    minHeight: 500,
    maxHeight: 1300,
  },
}))

const Background = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  zIndex: -2,
  filter: 'brightness(40%) saturate(180%)',
})

interface ProductHeroLayoutProps {
  sxBackground: SxProps<Theme>
}

function ProductHeroLayout(
  props: React.HTMLAttributes<HTMLDivElement> & ProductHeroLayoutProps
) {
  const { sxBackground, children } = props

  return (
    <ProductHeroLayoutRoot>
      <Container
        sx={{
          mt: { xs: 4, med: 16 },
          mb: 14,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '75vh',
        }}
      >
        {children}
        <Background sx={sxBackground} />
      </Container>
    </ProductHeroLayoutRoot>
  )
}

const backgroundImage =
  'https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2FHollyandMikeEngagement-0071.jpg?alt=media&token=b9ed91c6-6404-46f5-b4a8-5e2b383cf983'

export const LandingHero = () => {
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#5a6bb2', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography color="inherit" align="center" variant="h2">
          {'10 September 2022'}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            href="/guest/login"
            size="large"
            variant="outlined"
            color="inherit"
            sx={{
              fontSize: 18,
              ':hover': {
                bgcolor: 'primary.main',
                color: 'white',
              },
            }}
          >
            {'Guest RSVP  ➜'}
          </Button>
        </Box>
      </Box>
      <Box>
        <Typography color="inherit" align="center" variant="h3" sx={{ pb: 2 }}>
          {'Wintergreen Resort, Virginia'}
        </Typography>
      </Box>
    </ProductHeroLayout>
  )
}
