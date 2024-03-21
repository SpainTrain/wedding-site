import { useMemo } from 'react'
import * as Bowser from 'bowser'

const validBrowserSpec: Bowser.Parser.checkTree = {
  desktop: { safari: '>=14' },
}

type IsValidBrowserReturn = Readonly<{
  isValidBrowser: boolean
  browserName: string
  browserVersion: string
  platformType: string
}>

export const useIsValidBrowser = (): IsValidBrowserReturn =>
  useMemo(() => {
    // Server-side
    if (typeof window === 'undefined') {
      return {
        isValidBrowser: true,
        browserName: 'Server',
        browserVersion: 'N/A',
        platformType: 'N/A',
      }
    }

    const browser = Bowser.getParser(window.navigator.userAgent)
    const isValidBrowser = browser.satisfies(validBrowserSpec) !== false

    return {
      isValidBrowser,
      platformType: browser.getPlatformType(),
      browserName: browser.getBrowserName(),
      browserVersion: browser.getBrowserVersion(),
    }
  }, [])
