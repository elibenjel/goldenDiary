import React from "react";
import { Center, Actionsheet, useDisclose } from "native-base";

export const FormSheet = (props) => {
  const { form } = props
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  return (
    <Center>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        {form}
      </Actionsheet>
    </Center>
  );
}