console.log('importing in app')
import { Provider } from 'app/provider';
import Head from 'next/head';
import React from 'react';
import 'raf/polyfill';
import { WebNavigation } from 'app/navigation/web';
console.log('finished importing in app ', Provider, WebNavigation)


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Solito Example App</title>
        <meta
          name="description"
          content="Expo + Next.js with Solito. By Fernando Rojo."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <WebNavigation direction='row'>
          <Component {...pageProps} />
        </WebNavigation>
      </Provider>
    </>
  )
}

export default MyApp;
