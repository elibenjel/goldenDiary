import { Link as SolitoLink } from 'solito/link';
import React, { useState } from 'react';
import {
  HStack,
  VStack,
  Box,
  IconButton,
  useDisclose,
  Divider
} from 'native-base';
import { useWindowDimensions } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '../../assets/icons';
import { SmallTitledCard, TopLayout, TextPrimary, MediumTitledCard } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';
import {
  FormControlledTextField,
  FormControlledSelect,
  FormControlledDatePicker,
  ModalUpdater,
  FormSheet
} from '../../components/inputs';

const SpendingsUpdaterForm = (props) => {
  const { disclose } = props;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([{ label: 'test', value: 'test' }]);
  const [date, setDate] = useState(() => {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear()
    }
  });
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

  let { width } = useWindowDimensions();
  if (width > 300) {
    width = 300;
  }
  
  const addCategory = (newCat) => {
    setCategories(current => [...current, { label: newCat, value: newCat }])
    setCategory(newCat)
  }

  const addCategoryErrorHandler = (v) => {
    return categories.every(c => v !== c.value) ? '' : 'Cette catégorie existe déjà';
  }


  return (
    <Box>
      <FormSheet disclose={disclose} childrenKeys={['nameField', 'categorySelect']}>
        <FormControlledTextField
          state={[name, setName]}
          label="Nom" errorHandler={() => 'Erreur'}
          placeholder="Choisir un nom pour la dépense"
          width={width}
          size="xs"
        />
        <FormControlledSelect
          state={[category, setCategory]}
          items={categories}
          label="Catégorie" labelLeftIcon={
            <IconButton onPress={() => setShowModal(!showModal)} icon={<AntDesign name="plussquare" size="2" color="black" />} />
          }
          placeholder="Choisir la catégorie de la dépense"
          width={width}
          size="xs"
        />
        <HStack alignItems="center" justifyContent="space-between" w={width}>
          <FormControlledDatePicker label="Date" state={[date, setDate]} width={0.45*width} />
          <Divider orientation="vertical" mr={2} />
          <FormControlledTextField
            state={[amount, setAmount]}
            label="Montant" errorHandler={(v) => v === '' || (v === Number(v) && v > 0) ? '' : 'Entrer un montant valide'}
            placeholder="Montant de la dépense"
            width={0.45*width}
            size="xs"
        />
        </HStack>
      </FormSheet>
      <ModalUpdater
        modalState={[showModal, setShowModal]} update={addCategory}
        header="Ajouter une catégorie" placeholder="Entrer la nouvelle catégorie"
        errorHandler={addCategoryErrorHandler}
      />
      </Box>
  );
}

export function Spendings() {
  useSetHeaderRightLayoutEffect();
  const disclose = useDisclose();
  return (
    <TopLayout>
      <VStack flex={1} alignItems="center" mt="4" space="md">
        <SmallTitledCard
          title="Food" subtitle={'<400€'}
          HeaderRight={<IconButton icon={<Ionicons name="pencil" size="10" color="black" />} />}
          TopRightCorner={<IconButton icon={<Entypo name="cross" size="10" color="black" />} />}
        >
          <TextPrimary fontSize="lg">300€</TextPrimary>
        </SmallTitledCard>
        <MediumTitledCard title="Food" subtitle={'<400€'} footer="05/01/2022" rightContent={<Ionicons name="pencil" size="10" color="black" />}
          HeaderRight={<IconButton icon={<Ionicons name="pencil" size="10" color="black" />} />}
          TopRightCorner={<IconButton onPress={disclose.onOpen} icon={<Entypo name="cross" size="10" color="black" />} />}
        >
          <TextPrimary fontSize="lg">300€</TextPrimary>
        </MediumTitledCard>
      </VStack>
      <SpendingsUpdaterForm disclose={disclose}/>
    </TopLayout>
  )
}
