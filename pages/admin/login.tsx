import type { NextPage } from 'next'
import Head from 'next/head'

import { Avatar, Box, CssBaseline, Paper, Container } from '@mui/material'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import { SignInScreen } from '../../src/components/admin/SignInScreen'
import { useRedirectIfLoggedIn } from '../../src/auth/useAuthRedirects'

const Home: NextPage = () => {
  useRedirectIfLoggedIn('/admin')

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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper elevation={7}>
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <SignInScreen
                heading="Admin Login"
                signInSuccessUrl="/admin"
                onlyGoogle
              />
            </Box>
          </Paper>
        </Container>
      </main>
    </div>
  )
}

export default Home
