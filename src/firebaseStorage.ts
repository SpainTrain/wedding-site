import { ref } from 'firebase/storage'
import { getFirebase } from './config'

const getStorage = () => getFirebase().storage

const getPublicStorageRef = () => {
  const storage = getStorage()
  return ref(storage, 'public')
}

const getEventsRef = () => ref(getPublicStorageRef(), 'events')

export const getEventsImagesRef = () => ref(getEventsRef(), 'images')
