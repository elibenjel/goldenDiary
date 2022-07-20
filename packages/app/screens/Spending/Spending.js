import { Link as SolitoLink } from 'solito/link';
import React, { useRef, useState } from 'react';
import {
  VStack,
  Box,
  Center,
  Pressable,
  Image,
  Stack,
  HStack,
  Text,
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
  const [newBills, setNewBills] = useState([]);

  const { createSpending, updateSpending, assignBillToSpending } = useSpendingHistory();
  const { diary, addSpendingCategory } = useDiary();
  const addSpendingCategoryModalState = useModalState();
  const { renderCameraTrigger, showCamera, onSaveSuccessRef } = useCamera();
  onSaveSuccessRef.current = (uri) => setNewBills([...newBills, uri]);

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
      when: date,
    };

    if (spendingRef.current) {
      let updator = {};
      Object.entries(spendingData).forEach(([key, value]) => {
        if (spendingRef.current[key] !== value) {
          updator[key] = value;
        }
      });

      Object.keys(updator).length > 0 && updateSpending(spendingRef.current, updator);
      newBills.forEach(newBill => assignBillToSpending(newBill, spendingRef.current));
    } else {
      createSpending({
        ...spendingData,
        bills: newBills
      });
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
            <Icon onPress={addSpendingCategoryModalState.openModal} family={AntDesign} name="plussquare" size={15} color="orange" />
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
        <FormControlledImage key="bills" label="Factures" uris={[...bills, ...newBills]}>
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

const SpendingCard = (props) => {
  const { title, category, date, TopRightCorner, amount } = props;
  return (
    <VStack p={1} w="100%" h="80px" rounded="lg" overflow="hidden" borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700"
      }} _light={{
        borderColor: "coolGray.200",
        backgroundColor: "gray.50"
      }} _web={{
        shadow: 2,
        borderWidth: 0
      }}
      alignItems="flex-start"
    >
      <Center>
        <Text fontSize="lg">{title}</Text>
      </Center>
      <Center mt="-1">
        <Text fontSize="xs">{category}</Text>
      </Center>
      <Center position="absolute" top="-10" right="-10">
        {TopRightCorner}
      </Center>
      <Center position="absolute" left="1" bottom="0">
        <Text fontSize="10" fontWeight="500" color="red.900">{date}</Text>
      </Center>
      <Center position="absolute" bottom="30%" right="20">
        <Text fontSize="2xl">{amount}€</Text>
      </Center>
    </VStack>
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
              Object.keys(spendingHistory).length === 0 ?
              <TextPrimary fontSize="lg">Aucune dépenses trouvées</TextPrimary>
              : 
              Object.entries(spendingHistory).map(([group, spending]) => {
                return (
                  <VStack key={group} alignItems="stretch" w="100%">
                    <Center p={1} mb={2} backgroundColor="gray.200">
                      <HeaderText>{group}</HeaderText>
                    </Center>
                    <Center>
                      {
                        spending.map(sp => {
                          return (
                            <Pressable w='90%' mb={2} key={sp._id} onPress={() => {
                              spendingRef.current = sp;
                              modalState.openModal();
                            }}>
                              <SpendingCard
                                title={sp.name} category={sp.category}
                                date={`${getDay(sp.when)}-${getMonth(sp.when)}-${getYear(sp.when)}`}
                                amount={sp.amount}
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
                              />
                            </Pressable>
                          )
                        })
                      }
                    </Center>
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
    <CameraProvider saveDir="bills">
      <SpendingHistoryProvider>
        <SpendingManager {...props} />
      </SpendingHistoryProvider>
    </CameraProvider>
  )
}