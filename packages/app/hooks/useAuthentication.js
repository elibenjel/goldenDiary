import React, { useCallback, useState } from "react";
import Realm from "realm";
import { useApp } from '@realm/react';

export let AuthState;

(function (AuthState) {
  AuthState[(AuthState['None'] = 0)] = 'None';
  AuthState[(AuthState['Loading'] = 1)] = 'Loading';
  AuthState[(AuthState['LoginError'] = 2)] = 'LoginError';
  AuthState[(AuthState['RegisterError'] = 3)] = 'RegisterError';
})(AuthState || (AuthState = {}));

export const useAuthentication = () => {
  const app = useApp();
  const [authState, setAuthState] = useState(AuthState.None);

  const handleLogin = useCallback(async ({ email, password }) => {
    setAuthState(AuthState.Loading);
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      await app.logIn(credentials);
      setAuthState(AuthState.None);
    } catch (e) {
      console.log('Error logging in', e);
      setAuthState(AuthState.LoginError);
    }
  }, [setAuthState, app]);

  const handleRegister = useCallback(async ({ email, password }) => {
    setAuthState(AuthState.Loading);
    try {
      // Register the user...
      await app.emailPasswordAuth.registerUser({ email, password });
      // ...then login with the newly created user
      const credentials = Realm.Credentials.emailPassword(email, password);
      await app.logIn(credentials);
      setAuthState(AuthState.None);
    } catch (e) {
      console.log('Error registering', e);
      setAuthState(AuthState.RegisterError);
    }
  }, [setAuthState, app]);

  const handleLogout = useCallback(async (user) => {
    await user?.logOut();
    await app.removeUser(user);
  }, [setAuthState, app]);

  return { handleLogin, handleRegister, handleLogout, authState };
}