import type { NextPage } from 'next'
import Head from 'next/head'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import React, { useCallback, useEffect } from 'react'

import { oneLine } from 'common-tags'

import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  CssBaseline,
  Paper,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'

import EventNoteTwoTone from '@mui/icons-material/EventNoteTwoTone'
import FlakyTwoTone from '@mui/icons-material/FlakyTwoTone'
import KingBedTwoTone from '@mui/icons-material/KingBedTwoTone'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import SetMealTwoTone from '@mui/icons-material/SetMealTwoTone'

import { useEmailSignInLink } from '../../src/auth/guestLoginHooks'
import { useRedirectIfLoggedIn } from '../../src/auth/useAuthRedirects'
import { renderIf } from '../../src/render-if'

const backgroundImageUrl =
  'https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2FHollyandMikeEngagement-0083.jpg?alt=media&token=750dd01d-6205-4f2c-b8d2-f327f4ac1071'

interface LoginFormData {
  email: string
}

const Home: NextPage = () => {
  useRedirectIfLoggedIn('/guest')

  const { control, handleSubmit, setError } = useForm<LoginFormData>()
  const { emailSignInLink, emailSignInError, isEmailSent } =
    useEmailSignInLink()

  useEffect(() => {
    if (emailSignInError) {
      setError('email', {
        type: 'manual',
        message: emailSignInError.message,
      })
    }
  }, [emailSignInError, setError])

  const onSubmit: SubmitHandler<LoginFormData> = useCallback(
    async (data) => {
      try {
        console.log('LoginFormData', 'onSubmit', data)
        await emailSignInLink(data.email)
      } catch (err) {
        console.error(err)
      }
    },
    [emailSignInLink]
  )

  return (
    <div>
      <Head>
        <title>{'Login'}</title>
        <meta
          name="description"
          content="Login to Mike and Holly's Wedding Site"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light'
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter:
                'blur(0.05rem) saturate(1.2) sepia(0.3) brightness(0.8) contrast(1.3)',
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                {'Access Your Guest Account'}
              </Typography>
              {/* <SignInScreen signInSuccessUrl="/guest" /> */}
              <Box sx={{ my: 1 }}></Box>
              <Typography>
                {oneLine`
                Your Wedding Guest account is your main point of access for all
                things related to Mike & Holly's wedding!`}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 0, paddingRight: '1rem' }}>
                    <FlakyTwoTone />
                  </ListItemIcon>
                  <ListItemText primary="RSVP for Events" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 0, paddingRight: '1rem' }}>
                    <KingBedTwoTone />
                  </ListItemIcon>
                  <ListItemText primary="Lodging / Room Blocks" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 0, paddingRight: '1rem' }}>
                    <SetMealTwoTone />
                  </ListItemIcon>
                  <ListItemText primary="Choose Preferences" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 0, paddingRight: '1rem' }}>
                    <EventNoteTwoTone />
                  </ListItemIcon>
                  <ListItemText primary="Your Personalized Itinerary" />
                </ListItem>
              </List>
              <Box
                component="form"
                noValidate
                // promise must go to onSubmit for this to work...
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
              >
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      autoFocus
                      margin="normal"
                      label="Email Address"
                      autoComplete="email"
                      disabled={isEmailSent}
                      fullWidth
                      required
                      {...field}
                    />
                  )}
                />
                {isEmailSent ? (
                  <Alert
                    sx={{ mt: 2 }}
                    severity="success"
                    icon={<MarkEmailReadIcon />}
                  >
                    <AlertTitle>{'Email Sent!'}</AlertTitle>
                    {'Please check your email inbox and '}
                    {'click the provided link to log in!'}
                  </Alert>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {'Email Me Link'}
                  </Button>
                )}
                {renderIf(!isEmailSent)(() => (
                  <Typography>
                    {
                      'A link to access your wedding guest account will be sent to this email.'
                    }
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}

export default Home
