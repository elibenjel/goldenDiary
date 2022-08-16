import React from 'react';

import { FormControlledTextField } from '../pure';
import { ModalForm } from '../wrapper';

export const SignInModal = ({
  show,
  close,
  submit,
  signInInputs,
  showInputErrors
}) => {
  // const { signInInputs, showInputErrors } = useAuth();
  return (
    <ModalForm
      show={show}
      header="Quels sont vos identifiants ?"
      close={close}
      submit={submit}
      submitLabel="Se connecter"
    >
      <FormControlledTextField
        id="emailField"
        control={signInInputs.email}
        label="Email"
        placeholder="Entrer un email valide"
        showError={showInputErrors}
        width={'100%'}
      />
      <FormControlledTextField
        id="passwordField"
        control={signInInputs.password}
        type="password"
        label="Mot de passe"
        showError={showInputErrors}
        width={'100%'}
      />
    </ModalForm>
  )
}