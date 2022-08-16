import React from 'react';
import { Link as SolitoLink } from 'solito/link';
import {
  HStack,
  VStack,
  Button,
  Text,
} from 'native-base';

import { ColorModeSwitch, LargeTitledCard, TextPrimary, TextSecondary } from '../../components';
import { useNavigation, useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function ConfirmUser() {
  useSetHeaderRightLayoutEffect();
  useNavigation
  return (
    <Center>
      <Text>Votre adresse email est confirmée. Vous pouvez maintenant vous connecter.</Text>
    </Center>
  )
}
