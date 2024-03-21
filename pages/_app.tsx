import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LicenseInfo } from '@mui/x-data-grid-pro'

import { CacheProvider, EmotionCache } from '@emotion/react'
import { Provider, ErrorBoundary } from '@rollbar/react'
import * as FullStory from '@fullstory/browser'

import { theme } from '../src'
import createEmotionCache from '../src/createEmotionCache'
import { AuthUserProvider } from '../src/auth/useAuth'
import { useIsValidBrowser } from '../src/isValidBrowser'
import { Box } from '@mui/material'

// Apply license
LicenseInfo.setLicenseKey(
  '73bf20c199499127b3d41da8bb79fc83T1JERVI6MzczMDIsRVhQSVJZPTE2NzU2NDU4ODQwMDAsS0VZVkVSU0lPTj0x'
)

// Rollbar!
const rollbarConfig = {
  accessToken: '532b3f9477de4d0ba2db2f90512e07ce',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment:
    process.env.NODE_ENV === 'production' ? 'production' : 'development',
}

// FULLSTORY!!
if (typeof window !== 'undefined') {
  FullStory.init({ orgId: 'o-1BXF1K-na1' })
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  pageProps: Record<string, unknown>
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const { isValidBrowser, browserName, browserVersion, platformType } =
    useIsValidBrowser()

  if (browserName !== 'Server') {
    console.log(
      `isValidBrowser`,
      isValidBrowser,
      browserName,
      browserVersion,
      platformType
    )
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AuthUserProvider>
          <Provider config={rollbarConfig}>
            <ErrorBoundary>
              {isValidBrowser ? (
                <Component {...pageProps} />
              ) : (
                <div>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100vh',
                    }}
                  >
                    <Box sx={{ pb: 2 }}>
                      {`This browser/version - ${platformType} ${browserName} ${browserVersion} - has known issues and is not supported.`}
                    </Box>
                    <Box sx={{ pb: 2 }}>
                      {`Please update your browser or use an updated version of a different browser. `}
                    </Box>
                    <Box>{'Thanks!'}</Box>
                  </Box>
                </div>
              )}
            </ErrorBoundary>
          </Provider>
        </AuthUserProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
