import { Link as SolitoLink } from 'solito/link';
import React, { useEffect, useRef, useState } from 'react';
import {
  HStack,
  VStack,
  Box,
  IconButton,
  useDisclose,
  Divider,
  Button,
  Pressable
} from 'native-base';
import { useWindowDimensions } from 'react-native';

import { Ionicons, Entypo, AntDesign } from '../../assets/icons';
import { Icon } from '../../components/Icon';
import { SmallTitledCard, TopLayout, TextPrimary, MediumTitledCard } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';
import {
  FormControlledTextField,
  FormControlledSelect,
  FormControlledDatePicker,
  ModalUpdater,
  FormSheet,
  ModalForm,
  useModalState,
  ModalConfirmation
} from '../../components/inputs';
import { isNonNegativeValue } from '../../utils/validators';
import { SpendingHistoryProvider, useSpendingHistory } from '../../provider/api';
import { useDiary } from '../../provider/api';
import { useValidator } from '../../components/inputs/useValidator';

const SpendingForm = (props) => {
  const { spendingRef, modalState } = props;
  const { showModal, closeModal } = modalState;
  
  const [name, setName] = useState(spendingRef.current?.name || '');
  const [category, setCategory] = useState(spendingRef.current?.category || '');
  const [date, setDate] = useState(spendingRef.current?.when || new Date());
  const [amount, setAmount] = useState(spendingRef.current?.amount ? `${spendingRef.current.amount}` : '');
  
  const { createSpending, updateSpending } = useSpendingHistory();
  const { diary, addSpendingCategory } = useDiary();
  const addSpendingCategoryModalState = useModalState();

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
        header="Ajouter une nouvelle catégorie de dépense"
        show={showModal}
        close={onClose}
        submit={valid && submit}
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
      </ModalForm>
      <AddSpendingCategoryModal
        submitSpendingCategory={submitSpendingCategory}
        modalState={addSpendingCategoryModalState}
      />
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
      header="Ajouter une nouvelle catégorie de dépense"
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
  const { spendingHistory, deleteSpending } = useSpendingHistory();

  const spendingRef = useRef(null);
  const deleteSpendingRef = useRef(() => null);
  const [period, setPeriod] = useState(null);

  useSetHeaderRightLayoutEffect();
  const modalState = useModalState();
  const deleteModalState = useModalState();

  return (
      <TopLayout>
        <VStack flex={1} my="4" alignItems="center" justifyContent="space-between" >
          <VStack flex={1} alignItems="center" space="md">
            {
              spendingHistory.length === 0 ?
              <TextPrimary fontSize="lg">Aucune dépenses trouvées</TextPrimary>
              : 
              // <TextPrimary fontSize="lg">Aucune dépenses trouvées</TextPrimary>
              spendingHistory.map((spending) => {
                return (
                  <Pressable key={spending._id} onPress={() => {
                    spendingRef.current = spending;
                    modalState.openModal();
                  }}>
                    <MediumTitledCard
                      title={spending.name} subtitle={spending.category}
                      footer={`${spending.when.getDate()}-${spending.when.getMonth()+1}-${spending.when.getFullYear()}`}
                      // HeaderRight={
                      //   <Icon
                      //     family={Ionicons}
                      //     name="pencil"
                      //     size="xs"
                      //     color="black"
                      //     onPress={() => null} // go to update-this-spending screen
                      //   />
                      // }
                      TopRightCorner={
                        <Icon
                          family={Entypo}
                          name="cross"
                          size="xs"
                          color="black"
                          onPress={() => {
                            deleteSpendingRef.current = () => deleteSpending(spending);
                            deleteModalState.openModal();
                          }} // delete this spending (with confirmation)
                        />
                      }
                    >
                      <TextPrimary fontSize="lg">{spending.amount}€</TextPrimary>
                    </MediumTitledCard>
                  </Pressable>
                )
              })
            }
            {/* <SmallTitledCard
              title="Food" subtitle={'<400€'}
              HeaderRight={<Icon family={Ionicons} name="pencil" size="10" color="black" />}
              TopRightCorner={<Icon family={Entypo} name="cross" size="10" color="black" />}
            >
              <TextPrimary fontSize="lg">300€</TextPrimary>
            </SmallTitledCard>
            <MediumTitledCard
              title="Food" subtitle={'<400€'}
              HeaderRight={<Icon family={Ionicons} name="pencil" size="10" color="black" />}
              TopRightCorner={<Icon family={Entypo} name="cross" size="10" color="black" />}
              footer="05/01/2022" rightContent={<Icon family={Ionicons} name="pencil" size="10" color="black" />}
            >
              <TextPrimary fontSize="lg">300€</TextPrimary>
            </MediumTitledCard> */}
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
      </TopLayout>
  )
}

export const Spending = (props) => {
  return (
    <SpendingHistoryProvider>
      <SpendingManager {...props} />
    </SpendingHistoryProvider>
  )
}