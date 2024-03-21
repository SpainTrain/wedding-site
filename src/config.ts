import { once } from 'lodash'
import * as z from 'zod'
import { initializeApp, FirebaseOptions, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const FirebaseConfig = z.object({
  apiKey: z.string(),
  authDomain: z.string(),
  projectId: z.string(),
  storageBucket: z.string(),
  messagingSenderId: z.string(),
  appId: z.string(),
  measurementId: z.string(),
})

const firebaseConfig: FirebaseOptions = FirebaseConfig.parse({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
})

const initFirebase = once(() => {
  console.log('Initializing firebase')

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const functions = getFunctions(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  if (process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true') {
    console.log('Attching firebase emulators')

    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9299')
    connectFunctionsEmulator(functions, 'localhost', 5001)
    connectStorageEmulator(storage, 'localhost', 9199)
  }
  return { auth, functions, db, storage }
})

export const getFirebase = () => {
  try {
    const app = getApp()
    const auth = getAuth(app)
    const functions = getFunctions(app)
    const db = getFirestore(app)
    const storage = getStorage(app)
    return { auth, functions, db, storage }
  } catch (e) {
    return initFirebase()
  }
}
