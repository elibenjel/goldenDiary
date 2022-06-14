import { Link as SolitoLink } from 'solito/link';
import React, { useEffect, useState } from 'react';
import {
  HStack,
  VStack,
  Box,
  IconButton,
  useDisclose,
  Divider,
  Button
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
  FormSheet
} from '../../components/inputs';
import { isNonNegativeValue } from '../../utils/validators';
import { useSpendingHistory } from '../../provider/api';
import { useDiary } from '../../provider/api';
import { useValidator } from '../../components/inputs/useValidator';

const SpendingsForm = (props) => {
  const { disclose } = props;
  const { createSpending, updateSpending, deleteSpending } = useSpendingHistory();
  const { diary, updateDiary } = useDiary();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { valid, messages } = useValidator({
    name: {
      value: name,
      isValid: (v) => v.length !== 0,
      message: ''
    },
    category: {
      value: category,
      isValid: (v) => v.length !== 0,
      message: ''
    },
    amount: {
      value: amount,
      isValid: isNonNegativeValue,
      message: 'Entrer un montant valide'
    }
  }, [name, amount]);

  let { width } = useWindowDimensions();
  if (width > 300) {
    width = 300;
  }
  
  const addSpendingCategory = (newCat) => {
    updateDiary({ spendingCategories : [...diary.spendingCategories, newCat] })
    setCategory(newCat);
  }

  const submit = () => {
    createSpending({
      name,
      amount,
      category,
      when: date
    });
    disclose.onClose()
  }

  return (
    <Box>
      <FormSheet disclose={disclose}>
        <FormControlledTextField
          key="nameField"
          state={[name, setName]}
          label="Nom" errorMessage={messages.name}
          placeholder="Choisir un nom pour la dépense"
          width={width}
          size="xs"
        />
        <FormControlledSelect
          key="categorySelect"
          state={[category, setCategory]}
          items={diary.spendingCategories.map(c => ({ label: c, value: c }))}
          label="Catégorie" labelLeftIcon={
            <IconButton onPress={() => setShowModal(!showModal)} icon={<AntDesign name="plussquare" size="2" color="black" />} />
          }
          placeholder="Choisir la catégorie de la dépense"
          width={width}
          size="xs"
        />
        <HStack key="date+amount" alignItems="center" justifyContent="space-between" w={width}>
          <FormControlledDatePicker label="Date" state={[date, setDate]} width={0.45*width} />
          <Divider orientation="vertical" mr={2} />
          <FormControlledTextField
            state={[amount, setAmount]}
            label="Montant" errorMessage={messages.amount}
            placeholder="Montant de la dépense"
            width={0.45*width}
            size="xs"
        />
        </HStack>
        <VStack key="submitButton" w={width} alignItems="center">
          <Button onPress={submit} isDisabled={!valid}>Valider</Button>
        </VStack>
      </FormSheet>
      <ModalUpdater
        modalState={[showModal, setShowModal]} update={addSpendingCategory}
        header="Ajouter une catégorie" placeholder="Entrer la nouvelle catégorie"
        validator={{
          isValid: (v) => diary.spendingCategories.every(c => v !== c.value),
          message: 'Cette catégorie existe déjà !'
        }}
      />
    </Box>
  );
}

export function Spendings() {
  const { spendingHistory } = useSpendingHistory();
  const [period, setPeriod] = useState(null);

  useSetHeaderRightLayoutEffect();
  const disclose = useDisclose();

  return (
    <SpendingHistoryProvider>
      <TopLayout>
        <VStack flex={1} my="4" alignItems="center" justifyContent="space-between" >
          <VStack flex={1} alignItems="center" space="md">
            {
              spendingHistory.length === 0 ?
              <TextPrimary fontSize="lg">Aucune dépenses trouvées</TextPrimary>
              : spendingHistory.map((spending) => {
                return (
                  <MediumTitledCard
                    key={spending._id} title={spending.name} subtitle={spending.category}
                    footer={`${spending.when.getDate()}-${spending.when.getMonth()+1}-${spending.when.getFullYear()}`}
                    HeaderRight={<Icon family={Ionicons} name="pencil" size="10" color="black" />}
                    TopRightCorner={<Icon family={Entypo} name="cross" size="10" color="black" />}
                  >
                    <TextPrimary fontSize="lg">{spending.amount}€</TextPrimary>
                  </MediumTitledCard>
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
          <Icon onPress={disclose.onOpen} family={Entypo} name='add-to-list' size="xs" color="black" />
        </VStack>
        <SpendingsForm disclose={disclose}/>
      </TopLayout>
    </SpendingHistoryProvider>
  )
}
