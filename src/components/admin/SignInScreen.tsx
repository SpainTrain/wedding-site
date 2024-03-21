import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import * as firebaseui from 'firebaseui'
import { GoogleAuthProvider } from 'firebase/auth'

import { getFirebase } from '../../config'
import Typography from '@mui/material/Typography'

// Init Side Effecting
const getAuth = () => getFirebase().auth

// Configure FirebaseUI.
const getFirebaseAuthConfig = ({
  signInSuccessUrl,
}: {
  signInSuccessUrl: string
}): firebaseui.auth.Config => ({
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // If guest, provide more login options
  signInOptions: [
    // Admin login
    GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl,
  credentialHelper: 'none',
})

type Props = {
  signInSuccessUrl: string
  onlyGoogle?: boolean
  heading: string
}

export const SignInScreen = ({ signInSuccessUrl, heading }: Props) => (
  <div>
    <Typography variant="h3">{heading}</Typography>
    {/* <p>{'Please sign-in:'}</p> */}
    <StyledFirebaseAuth
      uiConfig={getFirebaseAuthConfig({ signInSuccessUrl })}
      firebaseAuth={getAuth()}
    />
  </div>
)
