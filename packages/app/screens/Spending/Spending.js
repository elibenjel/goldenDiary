import { Link as SolitoLink } from 'solito/link';
import React, { useRef, useState } from 'react';
import {
  VStack,
  Box,
  Pressable,
  Image,
  HStack,
  Tooltip
} from 'native-base';


import { Entypo, AntDesign } from '../../assets/icons';
import { Icon } from '../../components/Icon';
import { SmallTitledCard, TopLayout, TextPrimary, MediumTitledCard, HeaderText } from '../../components';
import {
  FormControlledTextField,
  FormControlledSelect,
  FormControlledDatePicker,
  FormControlledImage,
  ModalConfirmation,
  ModalForm
} from '../../components/inputs';
import { useModalState, useValidator } from '../../hooks';
import { SpendingHistoryProvider, useSpendingHistory } from '../../provider/api';
import { useDiary } from '../../provider/api';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';
import { isNonNegativeValue } from '../../utils/validators';
import { getDay, getMonth, getYear } from '../../utils/date';
import { SearchBar } from '../../components/inputs/SearchBar';
import { CameraProvider, useCamera } from '../../provider/camera';

const SpendingForm = (props) => {
  const { spendingRef, modalState } = props;
  const { showModal, closeModal } = modalState;
  
  const [name, setName] = useState(spendingRef.current?.name || '');
  const [category, setCategory] = useState(spendingRef.current?.category || '');
  const [date, setDate] = useState(spendingRef.current?.when || new Date());
  const [amount, setAmount] = useState(spendingRef.current?.amount ? `${spendingRef.current.amount}` : '');
  const [bills, setBills] = useState(spendingRef.current?.bills || []);
  
  const { createSpending, updateSpending } = useSpendingHistory();
  const { diary, addSpendingCategory } = useDiary();
  const addSpendingCategoryModalState = useModalState();
  const { renderCameraTrigger, showCamera } = useCamera();

  const { valid, messages } = useValidator({
    name: {
      isValid: name.length !== 0,
      message: ''
    },
    category: {
      isValid: category.length !== 0,
      message: ''
    },
    amount: {
      isValid: isNonNegativeValue(amount),
      message: 'Entrer un montant valide'
    }
  });

  const submitSpendingCategory = (newCat) => {
    addSpendingCategory(newCat);
    setCategory(newCat);
  }

  const submit = () => {
    const spendingData = {
      name,
      amount: Number(amount),
      category,
      when: date
    };

    if (spendingRef.current) {
      let updator = {};
      Object.entries(spendingData).forEach(([key, value]) => {
        if (spendingRef.current[key] !== value) {
          updator[key] = value;
        }
      });

      Object.keys(updator).length > 0 && updateSpending(spendingRef.current, updator)
    } else {
      createSpending(spendingData);
    }
  }

  const onClose = () => {
    spendingRef.current = null;
    closeModal();
  }

  return (
    <Box>
      <ModalForm
        header={spendingRef.current ? 'Modifier la dépense ?' : 'Nouvelle dépense'}
        show={showModal && !showCamera}
        close={onClose}
        submit={valid && submit}
        submitLabel={spendingRef.current ? 'Modifier' : 'Ajouter'}
      >
        <FormControlledTextField
          key="nameField"
          state={[name, setName]}
          label="Nom" errorMessage={messages.name || ''}
          placeholder="Choisir un nom pour la dépense"
          width={'100%'}
        />
        <FormControlledSelect
          key="categorySelect"
          state={[category, setCategory]}
          items={diary.spendingCategories.map(c => ({ label: c, value: c }))}
          label="Catégorie" labelLeftIcon={
            <Icon onPress={addSpendingCategoryModalState.openModal} family={AntDesign} name="plussquare" size={'xs'} color="black" />
          }
          placeholder="Choisir la catégorie de la dépense"
          width={'100%'}
        />
        <FormControlledTextField
          key="amountField"
          state={[amount, setAmount]}
          label="Montant" errorMessage={messages.amount || ''}
          placeholder="Montant de la dépense"
          width={'100%'}
        />
        <FormControlledDatePicker key="datePicker" label="Date" state={[date, setDate]} width={'100%'} />
        <FormControlledImage key="bills" label="Factures" uris={bills}>
          {renderCameraTrigger()}
        </FormControlledImage> 
      </ModalForm>
      {
        addSpendingCategoryModalState.showModal ?
        <AddSpendingCategoryModal
          submitSpendingCategory={submitSpendingCategory}
          modalState={addSpendingCategoryModalState}
        />
        : null
      }
    </Box>
  );
}

const AddSpendingCategoryModal = (props) => {
  const { submitSpendingCategory, modalState } = props;
  const { diary } = useDiary();
  const { showModal, closeModal } = modalState;
  const [category, setCategory] = useState('');

  const { valid, messages } = useValidator({
    category: {
      value: category,
      isValid: (v) => diary.spendingCategories.every(c => v !== c.value),
      message: 'Cette catégorie existe déjà'
    }
  }, [category]);

  return (
    <ModalForm
      header="Nouvelle catégorie de dépense"
      show={showModal}
      close={closeModal}
      submit={valid && (() => submitSpendingCategory(category))}
    >
      <FormControlledTextField
        label={"Catégorie"} errorMessage={messages.category}
        placeholder={'Ex : Alimentation'} state={[category, setCategory]}
        width={'100%'}
      />
    </ModalForm>
  )
}

const SpendingManager = () => {
  const {
    spendingHistory,
    deleteSpending
  } = useSpendingHistory();

  const spendingRef = useRef(null);
  const deleteSpendingRef = useRef(() => null);

  useSetHeaderRightLayoutEffect();
  const modalState = useModalState();
  const deleteModalState = useModalState();
  const { renderCamera } = useCamera();

  return (
      <TopLayout>
        <VStack flex={1} w='90%' my="4" alignItems="center" justifyContent="space-between" >
          <VStack w='100%' alignItems="center" space="md">
            <SearchBar placeholder="Rechercher" />
            {
              spendingHistory.length === 0 ?
              <TextPrimary fontSize="lg">Aucune dépenses trouvées</TextPrimary>
              : 
              Object.entries(spendingHistory).map(([group, spending]) => {
                return (
                  <VStack key={group} w="100%">
                    <HeaderText>{group}</HeaderText>
                    {
                      spending.map(sp => {
                        return (
                          <Pressable w='90%' key={sp._id} onPress={() => {
                            spendingRef.current = sp;
                            modalState.openModal();
                          }}>
                            <MediumTitledCard
                              title={sp.name} subtitle={sp.category}
                              footer={`${getDay(sp.when)}-${getMonth(sp.when)}-${getYear(sp.when)}`}
                              TopRightCorner={
                                <Icon
                                  family={Entypo}
                                  name="cross"
                                  size="xs"
                                  color="black"
                                  onPress={() => {
                                    deleteSpendingRef.current = () => deleteSpending(sp);
                                    deleteModalState.openModal();
                                  }}
                                />
                              }
                            >
                              <TextPrimary fontSize="lg">{sp.amount}€</TextPrimary>
                            </MediumTitledCard>
                          </Pressable>
                        )
                      })
                    }
                  </VStack>
                )
              })
            }
          </VStack>
          <Icon onPress={modalState.openModal} family={Entypo} name='add-to-list' size="xs" color="black" />
        </VStack>
        {modalState.showModal && <SpendingForm spendingRef={spendingRef} modalState={modalState}/>}
        {
          deleteModalState.showModal &&
            <ModalConfirmation
            show={deleteModalState.showModal}
            close={() => {
              deleteSpendingRef.current = () => null;
              deleteModalState.closeModal();
            }}
            confirm={deleteSpendingRef.current}
            header="Supprimer cette dépense"
            body="Voulez-vous vraiment supprimer définitivement cette dépense ?"
            confirmLabel="Supprimer"
          />
        }
        {renderCamera()}
      </TopLayout>
  )
}

export const Spending = (props) => {
  return (
    <CameraProvider>
      <SpendingHistoryProvider>
        <SpendingManager {...props} />
      </SpendingHistoryProvider>
    </CameraProvider>
  )
}