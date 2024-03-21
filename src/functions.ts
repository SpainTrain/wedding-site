import { z } from 'zod'
import { useState, useEffect } from 'react'
import { httpsCallable } from 'firebase/functions'

import {
  StreetViewStaticReqCallBody,
  StreetViewStaticResCallBody,
} from '../functions/src/schemas'

import { getFirebase } from './config'

const getFunctions = () => getFirebase().functions

export const getStreetViewStaticUrl = httpsCallable<
  z.infer<typeof StreetViewStaticReqCallBody>,
  z.infer<typeof StreetViewStaticResCallBody>
>(getFunctions(), 'getStreetViewStatic')

const loadingImg =
  'https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg'
export const useGetStreetViewStaticUrl = (location: string): string => {
  const [imgUrl, setImgUrl] = useState(loadingImg)

  useEffect(() => {
    const load = async () => {
      const result = await getStreetViewStaticUrl({ location })
      const body = StreetViewStaticResCallBody.parse(result?.data)
      if (!active) {
        return
      }
      setImgUrl(body.url)
    }
    let active = true
    void load()
    return () => {
      active = false
    }
  }, [location])

  return imgUrl
}
