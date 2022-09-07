import React, { useEffect, useState } from 'react';
import { ApolloClient } from '@apollo/client';

import { useAuth } from '../authentication';
import realmConfig from '../../realm.json';

const RealmProvider = ({ children }) => <>{children}</>;

// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken(user) {
  if (!user) {
   return;
  }

  // An already logged in user's access token might be stale. To guarantee that the token is
  // valid, we refresh the user's custom data which also refreshes their access token.
  await user.refreshCustomData();
  return user.accessToken;
}

const RealmContext = React.createContext(null);

const RealmWebProvider = ({ children }) => {
  const { user } = useAuth();
  const [accessToken, setAccessToken] = useState();
  const [apolloClient, setApolloClient] = useState();

  useEffect(() => {
    if (accessToken) {
      // Configure the ApolloClient to connect to your app's GraphQL endpoint
      const client = new ApolloClient({
        link: new HttpLink({
          uri: realmConfig.graphqlEndpoint,
          // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
          // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
          // access token before sending the request.
          fetch: async (uri, options) => {
            const accessToken = accessToken;
            options.headers.Authorization = `Bearer ${accessToken}`;
            return fetch(uri, options);
          },
        }),
        cache: new InMemoryCache(),
      });

      setApolloClient(client);
    } else if (!user) {
      setAccessToken(undefined);
      setApolloClient(undefined);
      return;
    } else {
      (async () => {
        // An already logged in user's access token might be stale. To guarantee that the token is
        // valid, we refresh the user's custom data which also refreshes their access token.
        await user.refreshCustomData();
        setAccessToken(user.accessToken);
      })();
    }
  }, [user, accessToken]);

  if (!apolloClient) {
    return (
      <RealmContext.Provider
        value={{}}
      >
        {children}
      </RealmContext.Provider>
    )
  }


  // Render the children within the RealmContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useRealm hook.
  return (
    <RealmContext.Provider
      value={{
        useQuery,
        useMutations
      }}
    >
      {children}
    </RealmContext.Provider>
  )
}

const useRealm = () => ({});

export { RealmProvider, useRealm };