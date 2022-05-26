import React, { useState } from "react";
import { Modal, Button } from "native-base";
import { FormControlledTextField } from "./FormControlledInput";

export const ModalUpdater = (props) => {
  const { modalState, update, header, label, placeholder, errorHandler } = props;
  const [showModal, setShowModal] = modalState;
  const [value, setValue] = useState('');
  const [fieldWidth, setFieldWidth] = useState(null);
  const onLayout = (event) => {
    const width = event.nativeEvent.layout.width;
    setFieldWidth(width);
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content mb="auto" mt="20" alignItems="center">
          <Modal.CloseButton />
          <Modal.Header onLayout={onLayout}>{header}</Modal.Header>
          <Modal.Body>
            <FormControlledTextField
              label={label} errorHandler={errorHandler}
              placeholder={placeholder} fieldState={[value, setValue]}
              stackWidth={fieldWidth}
              InputProps={{ size: 'xs' }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                setShowModal(false);
              }}>
                Cancel
              </Button>
              <Button isDisabled={errorHandler(value) !== ''} onPress={() => {
                update(value);
                setShowModal(false);
              }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
  )
}