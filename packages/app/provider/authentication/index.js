import React, { useContext, useState, useEffect, useRef } from 'react';
import Realm from 'realm';
import { Overlay } from 'native-base';

import { SignInModal } from '../../components/composite/SignInModal';
import { SignUpModal } from '../../components/composite/SignUpModal';
import { ModalConfirmation } from '../../components/pure';

import { deepCopy } from '../../utils/data';
import { app } from '../../realmApp';
import { LoadingSpinner } from '../../components/pure/LoadingSpinner';
import { AlertSubtle } from '../../components/pure/AlertSubtle';

// Create a new Context object that will be provided to descendants of
// the AuthProvider.
const AuthContext = React.createContext(null);

const defaultSignInInputs = {
  email: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
  password: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
}

const defaultSignUpInputs = {
  email: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
  password: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
  repassword: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
}

const req = {};
req[req.NONE = 'NONE'] = 'NONE';
req[req.SIGN_UP = 'SIGN_UP'] = 'SIGN_UP';
req[req.SIGN_IN = 'SIGN_IN'] = 'SIGN_IN';
req[req.SIGN_OUT = 'SIGN_OUT'] = 'SIGN_OUT';

const ops = {};
ops[ops.NONE = 'NONE'] = 'NONE';
ops[ops.SIGNIN_UP = 'SIGNIN_UP'] = 'SIGNIN_UP';
ops[ops.CONFIRMATION_SENT = 'CONFIRMATION_SENT'] = 'CONFIRMATION_SENT';
ops[ops.SIGN_UP_REJECTED = 'SIGN_UP_REJECTED'] = 'SIGN_UP_REJECTED';
ops[ops.SIGNIN_IN = 'SIGNIN_IN'] = 'SIGNIN_IN';
ops[ops.SIGN_IN_REJECTED = 'SIGN_IN_REJECTED'] = 'SIGN_IN_REJECTED';
ops[ops.SIGNIN_OUT = 'SIGNIN_OUT'] = 'SIGNIN_OUT';

// The AuthProvider is responsible for user management and provides the
// AuthContext value to its descendants. Components under an AuthProvider can
// use the useAuth() hook to access the auth value.
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(app.currentUser);
  const [initialized, setInitialized] = useState(false);
  const [signInInputs, setSignInInputs] = useState(deepCopy(defaultSignInInputs));
  const [signUpInputs, setSignUpInputs] = useState(deepCopy(defaultSignUpInputs));
  const [showInputErrors, setShowInputErrors] = useState(false);
  const [userRequest, setUserRequest] = useState(req.NONE);
  const [operation, setOperation] = useState(ops.NONE);

  // run this initializer effect to format spendingHistory and to set the setters for userInput before mounting the children
  useEffect(() => {
    if (initialized) {
      return;
    }

    console.log('Running initializer effect for AuthProvider...');

    setSignInInputs(current => {
      const newValue = { ...current };
      newValue.email.setters.change = (value) => {
        const valid = value.length > 0;
        setSignInInputs((curr) => {
          return {
            ...curr,
            email : { ...curr.email, value, valid }
          }
        });
      }

      newValue.password.setters.change = (value) => {
        const valid = value.length > 10;
        setSignInInputs((curr) => {
          return {
            ...curr,
            password : { ...curr.password, value, valid }
          }
        });
      }

      return newValue;
    });

    setSignUpInputs(current => {
      const newValue = { ...current };
      newValue.email.setters.change = (value) => {
        const valid = value.length > 0;
        setSignUpInputs((curr) => {
          return {
            ...curr,
            email : { ...curr.email, value, valid }
          }
        });
      }

      newValue.password.setters.change = (value) => {
        const valid = value.length > 10;
        setSignUpInputs((curr) => {
          return {
            ...curr,
            password : { ...curr.password, value, valid }
          }
        });
      }

      newValue.repassword.setters.change = (value) => {
        const valid = value.length > 10;
        setSignUpInputs((curr) => {
          return {
            ...curr,
            repassword : { ...curr.repassword, value, valid }
          }
        });
      }

      return newValue;
    });

  console.log('AuthProvider initialized: setters for signIn/signOut inputs defined')
  setInitialized(true);
  }, []);

  // Wait for the initializer effect to execute before mounting the children
  if (!initialized) {
    return <></>;
  }

  // The signIn, signUp, and signOut functions are provided to the descendants to
  // allow the user to ask for one of these actions. It then spawns a modal for the user to validate
  // give the necessary information and validate the operation.
  const signIn = () => {
    setUserRequest(req.SIGN_IN);
  }

  const signUp = () => {
    setUserRequest(req.SIGN_UP);
  }

  const signOut = () => {
    setUserRequest(req.SIGN_OUT);
  }

  const blur = () => {
    let resetInputs = () => null;
    let defaultInputs;
    if (userRequest === req.SIGN_IN) {
      resetInputs = setSignInInputs;
      defaultInputs = defaultSignInInputs;
    }

    if (userRequest === req.SIGN_UP) {
      resetInputs = setSignUpInputs;
      defaultInputs = defaultSignUpInputs;
    }

    resetInputs(current => {
      const newValue = { ...current };
      Object.entries(defaultInputs).forEach(([input, { value, valid }]) => {
        newValue[input].value = value;
        newValue[input].valid = valid;
      });
      return newValue;
    });

    setShowInputErrors(false);
    setUserRequest(req.NONE);
  }

  // The submitSignIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const submitSignIn = () => {
    const { value : email, valid : validEmail } = signInInputs.email;
    const { value : password, valid : validPassword } = signInInputs.password;
    
    const valid = validEmail && validPassword;
    if (!valid) {
      setShowInputErrors(true);
      return 1;
    }
    
    setOperation(ops.SIGNIN_IN);
    const creds = Realm.Credentials.emailPassword(email, password);
    app.logIn(creds).then((newUser) => {
      setUser(newUser);
      setOperation(ops.NONE);
      blur();
    }, (e) => {
      console.log(e)
      blur();
      setOperation(ops.SIGN_IN_REJECTED);
      setTimeout(() => {
        setOperation(ops.NONE);
      }, 3000);
    });

    return 0;
  };

  // The submitSignUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const submitSignUp = () => {
    console.log('submitting')
    const { value : email, valid : validEmail } = signUpInputs.email;
    const { value : password, valid : validPassword } = signUpInputs.password;
    const { value : repassword } = signUpInputs.repassword;

    const valid = validEmail && validPassword && (password === repassword);
    if (!valid) {
      setShowInputErrors(true);
      return 1;
    }

    setOperation(ops.SIGNIN_UP);
    console.log('signin up')
    app.emailPasswordAuth.registerUser({ email, password }).then(() => {
      blur();
      setOperation(ops.CONFIRMATION_SENT)
      setTimeout(() => {
        setOperation(ops.NONE);
      }, 3000);
    }, (e) => {
      console.log(e);
      blur();
      setOperation(ops.SIGN_UP_REJECTED);
      setTimeout(() => {
        setOperation(ops.NONE);
      }, 3000);
    });

    return 0;
  };

  // The submitSignOut function calls the logOut function on the currently
  // logged in user
  const submitSignOut = () => {
    if (user == null) {
      console.warn("Not logged in, can't log out!");
      return 1;
    }

    user.logOut();
    setUser(null);
    blur();
    return 0;
  };

  return (
    <AuthContext.Provider
      value={{
        showInputErrors,
        signInInputs,
        signUpInputs,
        signUp,
        signIn,
        signOut,
        user,
        // userData,
      }}
    >
      {children}
      {
        userRequest === req.SIGN_IN ?
        <SignInModal
          show={true}
          close={blur}
          submit={submitSignIn}
          signInInputs={signInInputs}
          showInputErrors={showInputErrors}
        />
        : null
      
      }
      {
        userRequest === req.SIGN_UP ?
        <SignUpModal
          show={true}
          close={blur}
          submit={submitSignUp}
          signUpInputs={signUpInputs}
          showInputErrors={showInputErrors}
        />
        : null
      }
      {
        userRequest === req.SIGN_OUT ?
        <ModalConfirmation
          show={true}
          close={blur}
          confirm={submitSignOut}
          header="Déconnexion"
          body="Êtes-vous sûr de vouloir vous déconnecter ?"
          confirmLabel="Oui"
        />
        : null
      }
      {
        userRequest !== req.NONE && operation !== ops.NONE ?
        <LoadingSpinner />
        : null
      }
      {
        operation === ops.CONFIRMATION_SENT ?
        <AlertSubtle color="primary" text="Un email de confirmation vous a été envoyé." />
        : null
      }
      {
        operation === ops.SIGN_UP_REJECTED ?
        <AlertSubtle color="error" text="Une erreur s'est produite, veuillez réessayer plus tard" />
        : null
      }
      {
        operation === ops.SIGN_IN_REJECTED ?
        <AlertSubtle color="error" text="Connexion impossible, les identifiants sont incorrectes" />
        : null
      }
    </AuthContext.Provider>
  );
};

// The useAuth hook can be used by components under an AuthProvider to
// access the auth context value.
const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error("useAuth() called outside of a AuthProvider?");
  }
  return auth;
};

export { AuthProvider, useAuth };
