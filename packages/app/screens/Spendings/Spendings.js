import { Link as SolitoLink } from 'solito/link';
import React, { useState } from 'react';
import {
  Center,
  Image,
  HStack,
  Text,
  Input,
  Select,
  Heading,
  Code,
  Link,
  VStack,
  Button,
  AspectRatio,
  Box,
  IconButton,
  FlatList
} from 'native-base';
import { MaterialCommunityIcons, Feather, Ionicons, Entypo, AntDesign } from '../../assets/icons';
import { SmallTitledCard, TopLayout, TextPrimary, MediumTitledCard } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';
import { FormControlledTextField, FormControlledSelect } from '../../components/FormControlledInput';
import { ModalUpdater } from '../../components/ModalUpdater';

const SpendingsUpdater = (props) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([{ label: 'test', value: 'test' }]);
  const [showModal, setShowModal] = useState(false);
  
  const errorHandler = (v) => {
    let message = '';
    categories.forEach(c => {
      if (v === c) {
        message = 'Cette catégorie existe déjà';
      }
    });
    return message;
  }

  return (
    <VStack alignItems="center">
      <FormControlledTextField
        fieldState={[name, setName]}
        label="Nom" errorHandler={() => 'Erreur'}
        placeholder="Choisir un nom pour la dépense"
        InputProps={{ size: 'xs' }}
      />
      <FormControlledSelect
        selectState={[category, setCategory]}
        label="Catégorie" labelLeftIcon={
          <IconButton onPress={() => setShowModal(!showModal)} icon={<AntDesign name="plussquare" size="2" color="black" />} />
        }
        placeholder="Choisir la catégorie de la dépense"
        items={categories}
        InputProps={{ size: 'xs' }}
      />

      <ModalUpdater
        modalState={[showModal, setShowModal]} update={(v) => setCategories(current => [...current, { label: v, value: v }])}
        header="Ajouter une catégorie" placeholder="Entrer la nouvelle catégorie" errorHandler={errorHandler}
      />
    </VStack>
  );
}

export function Spendings() {
  useSetHeaderRightLayoutEffect();
  return (
    <TopLayout>
      {/* <VStack flex={1} alignItems="center" mt="4" space="md">
        <SmallTitledCard
          title="Food" subtitle={'<400€'}
          HeaderRight={<IconButton icon={<Ionicons name="pencil" size="10" color="black" />} />}
          TopRightCorner={<IconButton icon={<Entypo name="cross" size="10" color="black" />} />}
        >
          <TextPrimary fontSize="lg">300€</TextPrimary>
        </SmallTitledCard>
        <MediumTitledCard title="Food" subtitle={'<400€'} footer="05/01/2022" rightContent={<Ionicons name="pencil" size="10" color="black" />}
          HeaderRight={<IconButton icon={<Ionicons name="pencil" size="10" color="black" />} />}
          TopRightCorner={<IconButton icon={<Entypo name="cross" size="10" color="black" />} />}
        >
          <TextPrimary fontSize="lg">300€</TextPrimary>
        </MediumTitledCard>
      </VStack> */}
      <SpendingsUpdater />
    </TopLayout>
  )
}
