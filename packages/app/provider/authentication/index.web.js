import React from 'react';
import * as Realm from 'realm-web';

const AuthProvider = ({ children }) => <>{children}</>;

const useAuth = () => ({});

export { AuthProvider, useAuth };