import type { NextPage } from 'next'
import Head from 'next/head'
import { LandingAppBar } from '../src/components/LandingAppBar'
import { LandingHero } from '../src/components/LandingHero'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>{"Holly & Mike's Wedding - 10 Sept 2022"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ height: '100%' }}>
        <LandingAppBar />
        <LandingHero />
      </main>
    </div>
  )
}

export default Home
