import React from 'react';

import { ModalForm } from '../wrapper';
import {
  Icon,
  FormControlledTextField,
  FormControlledSelect,
  FormControlledImage
} from '../pure';
import { MaterialCommunityIcons } from '../../assets/icons';

import { useDiary, useSpendingActions } from '../../provider/api';
import { useCamera } from '../../provider/camera';

export const SpendingModal = () => {
  const { userInputs, showInputErrors, focused : focusedSpending, blur, submit } = useSpendingActions();
  const { show : showCamera, open, hasCameraPermission } = useCamera();
  const diary = useDiary();
  return (
    <ModalForm
      show={focusedSpending !== undefined && !showCamera}
      header={focusedSpending ? 'Modifier la dépense ?' : 'Nouvelle dépense'}
      close={blur}
      submit={submit}
      submitLabel={focusedSpending ? 'Modifier' : 'Ajouter'}
    >
      <FormControlledTextField
        id="nameField"
        control={userInputs.name}
        label="Nom"
        placeholder="Choisir un nom pour la dépense"
        showError={showInputErrors}
        width={'100%'}
      />
      <FormControlledSelect
        id="categorySelect"
        control={userInputs.category}
        items={diary.spendingCategories.map(c => ({ label: c, value: c }))}
        label="Catégorie"
        placeholder="Choisir une catégorie existante ..."
        showError={showInputErrors}
        width={'100%'}
      />
      <FormControlledTextField
        id="categoryField"
        control={userInputs.newCategory}
        placeholder="... ou créer une nouvelle catégorie"
        showError={showInputErrors}
        width={'100%'}
      />
      <FormControlledTextField
        id="amountField"
        control={userInputs.amount}
        label="Montant"
        placeholder="Montant de la dépense"
        showError={showInputErrors}
        width={'100%'}
      />
      {/* <FormControlledDatePicker
        id="datePicker"
        control={userInputs.date}
        label="Date"
        showError={showInputErrors}
        width={'100%'}
      /> */}
      <FormControlledImage
        id="bills"
        label="Factures"
        uris={[...userInputs.bills.value]}
        updateController={
          hasCameraPermission ?
          <Icon
            onPress={() => open((uri) => {
              userInputs.bills.setters.addOne(uri);
              console.log('added image to userInputs')
            })}
            family={MaterialCommunityIcons}
            name="camera-plus"
            size="xs"
          /> : <Icon onPress={open} family={MaterialCommunityIcons} name="camera-off" size="xs" />
        }
      />
    </ModalForm>
  )
}

const renderCameraTrigger = () => {
  if (!hasCameraPermission) {
    return (
      <Tooltip
        label="Vous n'avez pas autorisé l'accès à la caméra ou aux photos. Vérifier les réglages de l'application."
        openDelay={300}
      >
        <Icon family={MaterialCommunityIcons} name="camera-off" size="xs" />
      </Tooltip>
    )
  }

  return <Icon onPress={() => setShowCamera(true)} family={MaterialCommunityIcons} name="camera-plus" size="xs" />;
}