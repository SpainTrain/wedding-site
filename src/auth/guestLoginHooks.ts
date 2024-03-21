import { z } from 'zod'
import { ActionCodeSettings, sendSignInLinkToEmail } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRollbar } from '@rollbar/react'

import { getFirebase } from '../config'

const getAuth = () => getFirebase().auth

const getActionCodeSettings = (): ActionCodeSettings => ({
  url: `${window.location.protocol}//${window.location.host}/guest`,
  handleCodeInApp: true,
})

const EmailSignInError = z.object({
  code: z.string().default('Error'),
  message: z.string().default('Unknown error occurred.'),
})

export const useEmailSignInLink = () => {
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false)
  const [emailSignInError, setError] = useState<
    z.infer<typeof EmailSignInError> | undefined
  >()

  // Check is already logged in
  const router = useRouter()
  const auth = getAuth()

  // Rollbar!
  const rollbar = useRollbar()

  useEffect(() => {
    if (auth.currentUser !== null) {
      router.push(getActionCodeSettings().url).catch((e) => {
        console.error(e)
      })
    }
  })

  const emailSignInLink = async (email: string) => {
    try {
      const auth = getAuth()
      window.localStorage.setItem('emailForSignIn', email)
      rollbar.info('Sending sign in link to email', { auth, email })
      await sendSignInLinkToEmail(auth, email, getActionCodeSettings())
      setIsEmailSent(true)
    } catch (error) {
      const parsedError = EmailSignInError.parse(error)
      setError({
        code: parsedError.code,
        message: parsedError.message,
      })
    }
  }
  return { emailSignInError, emailSignInLink, isEmailSent }
}
