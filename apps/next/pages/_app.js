import { Provider } from 'app/provider';
import Head from 'next/head';
import React from 'react';
import 'raf/polyfill';
import { useRouter } from 'next/router';
import { WebNavigation } from 'app/navigation/web';


function MyApp({ Component, pageProps }) {
  const router = useRouter();
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
        <WebNavigation router={router} direction='row'>
          <Component {...pageProps} />
        </WebNavigation>
      </Provider>
    </>
  )
}

export default MyApp;
