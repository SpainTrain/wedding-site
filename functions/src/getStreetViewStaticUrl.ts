import * as crypto from 'crypto'
import * as url from 'url'

import { z } from 'zod'
import { defineSecret } from 'firebase-functions/params'

import {
  StreetViewStaticReqCallBody,
  StreetViewStaticResCallBody,
} from './schemas'

const googleApiKey = defineSecret('GOOGLE_API_KEY')
const googleSigningSecret = defineSecret('GOOGLE_SIGNING_SECRET')

/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param  {string} safeEncodedString The code you want to translate
 *                                    from a web safe form.
 * @return {string}
 */
function removeWebSafe(safeEncodedString: string) {
  return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/')
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param  {string} encodedString The code you want to translate to a
 *                                web safe form.
 * @return {string}
 */
function makeWebSafe(encodedString: string) {
  return encodedString.replace(/\+/g, '-').replace(/\//g, '_')
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param  {string} code The encoded data.
 * @return {string}
 */
function decodeBase64Hash(code: string) {
  // "new Buffer(...)" is deprecated. Use Buffer.from if it exists.
  return Buffer.from ? Buffer.from(code, 'base64') : new Buffer(code, 'base64')
}

/**
 * Takes a key and signs the data with it.
 *
 * @param  {string} key  Your unique secret key.
 * @param  {string} data The url to sign.
 * @return {string}
 */
function encodeBase64Hash(key: string, data: string) {
  return crypto.createHmac('sha1', key).update(data).digest('base64')
}

/**
 * Sign a URL using a secret key.
 *
 * @param  {string} path   The url you want to sign.
 * @param  {string} secret Your unique secret key.
 * @return {string}
 */
function sign(path: string, secret: string) {
  const uri = url.parse(path)
  const safeSecret = decodeBase64Hash(removeWebSafe(secret))
  const hashedSignature = makeWebSafe(
    encodeBase64Hash(safeSecret as unknown as string, uri.path ?? '')
  )
  return url.format(uri) + '&signature=' + hashedSignature
}

export const getStreetViewStaticUrl = (
  data: z.infer<typeof StreetViewStaticReqCallBody>
): z.infer<typeof StreetViewStaticResCallBody> => {
  const { location } = StreetViewStaticReqCallBody.parse(data)
  const encodedLocation = encodeURIComponent(location)
  const unsignedUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${encodedLocation}&fov=80&heading=70&pitch=0&key=${googleApiKey.value()}`

  const signedUrl = sign(unsignedUrl, googleSigningSecret.value())
  return { url: signedUrl }
}
