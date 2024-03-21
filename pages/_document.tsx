import * as React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import { theme } from '../src'
import createEmotionCache from '../src/createEmotionCache'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />

          {/* ~~~{ FONTS }~~~ */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Birthstone+Bounce&family=Josefin+Sans&family=Yuji+Syuku&family=Raleway&family=Dosis&display=swap"
            rel="stylesheet"
          />

          {/* ~~~{ FAVICON }~~~ */}
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/site.webmanifest" />

          {/* ~~~{ UNFURL }~~~ */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://mike-and-holly.com/" />
          <meta
            property="og:title"
            content="Holly & Mike's Wedding - 10 Sept 2022"
          />
          <meta
            property="og:description"
            content="Holly Fuhrman & Michael Spainhower hope you can join our wedding on 10 September 2022 at the Wintergreen Resort in Nellysford, Virginia!"
          />
          <meta
            name="description"
            content="Holly Fuhrman & Michael Spainhower hope you can join our wedding on 10 September 2022 at the Wintergreen Resort in Nellysford, Virginia!"
          />
          <meta
            property="og:image"
            content="https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2FHollyandMikeEngagement-0072.jpg?alt=media&token=a17f491d-a3f0-4643-915c-33189de1c9c0"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:domain" content="mike-and-holly.com" />
          <meta name="twitter:title" content="Holly & Mike's Wedding" />
          <meta
            name="twitter:description"
            content="We hope you can join 10 September 2022 at the Wintergreen Resort in Virginia!"
          />
          <meta
            name="twitter:image"
            content="https://firebasestorage.googleapis.com/v0/b/mike-and-holly.appspot.com/o/assets%2FHollyandMikeEngagement-0072.jpg?alt=media&token=a17f491d-a3f0-4643-915c-33189de1c9c0"
          />
          <meta name="twitter:url" content="https://mike-and-holly.com/" />
          <meta name="twitter:label1" content="Save The Date" />
          <meta name="twitter:data1" content="10 September 2022" />
          <meta name="twitter:label2" content="The Place" />
          <meta name="twitter:data2" content="Wintergreen Resort, VA" />

          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */}
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}
