import React from 'react';

import { FormControlledTextField } from '../pure';
import { ModalForm } from '../wrapper';

export const SignUpModal = ({
  show,
  close,
  submit,
  signUpInputs,
  showInputErrors
}) => {
  // const { signUpInputs, showInputErrors } = useAuth();
  return (
    <ModalForm
      show={show}
      header="Nouveau compte"
      close={close}
      submit={submit}
      submitLabel="Créer"
    >
      <FormControlledTextField
        id="emailField"
        control={signUpInputs.email}
        label="Email"
        placeholder="Entrer un email valide"
        showError={showInputErrors}
        width={'100%'}
      />
      <FormControlledTextField
        id="passwordField"
        control={signUpInputs.password}
        type="password"
        label="Mot de passe"
        placeholder="10 caractères min. avec au moins 1 chiffre et 1 symbole"
        showError={showInputErrors}
        width={'100%'}
      />
      <FormControlledTextField
        id="repasswordField"
        control={signUpInputs.repassword}
        type="password"
        label="Confirmer le mot de passe"
        showError={showInputErrors}
        width={'100%'}
      />
    </ModalForm>
  )
}