import React from 'react';
import { MaterialCommunityIcons } from '../../assets/icons';

import { useSpendingActions } from '../../provider/api';
import { useCamera } from '../../provider/camera';
import { ModalForm } from '../inputs';
import {
  FormControlledTextField,
  FormControlledSelect,
  FormControlledDatePicker,
  FormControlledImage
} from '../inputs';

export const SpendingModal = () => {
  const { userInputs, setters, focused : focusedSpending, blur, submit } = useSpendingActions();
  const { show : showCamera, trigger } = useCamera();
  return (
    <ModalForm
      show={focusedSpending !== undefined && !showCamera}
      header={focusedSpending ? 'Modifier la dépense ?' : 'Nouvelle dépense'}
      close={blur}
      submit={submit}
      submitLabel={focusedSpending ? 'Modifier' : 'Ajouter'}
    >
      <FormControlledTextField
        key="nameField"
        state={[userInputs.name, setters.name]}
        label="Nom" errorMessage={messages.name || ''}
        placeholder="Choisir un nom pour la dépense"
        width={'100%'}
      />
      <FormControlledSelect
        key="categorySelect"
        state={[userInputs.category, setters.category]}
        items={diary.spendingCategories.map(c => ({ label: c, value: c }))}
        label="Catégorie" labelLeftIcon={
          <Icon onPress={addSpendingCategoryModalState.openModal} family={AntDesign} name="plussquare" size={15} color="orange" />
        }
        placeholder="Choisir la catégorie de la dépense"
        width={'100%'}
      />
      <FormControlledTextField
        key="amountField"
        state={[userInputs.amount, setters.amount]}
        label="Montant" errorMessage={messages.amount || ''}
        placeholder="Montant de la dépense"
        width={'100%'}
      />
      <FormControlledDatePicker key="datePicker" label="Date" state={[userInputs.date, setters.date]} width={'100%'} />
      <FormControlledImage
        key="bills"
        label="Factures"
        uris={[...userInputs.bills]}
        cameraTrigger={
          <Icon
            onPress={trigger}
            family={MaterialCommunityIcons}
            name="camera-plus"
            size="xs"
          />
        }
      />
    </ModalForm>
  )
}