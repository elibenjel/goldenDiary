import React, { useState } from "react";
import { Modal, Input, Button } from "native-base";
import { FormControlledTextField } from "./FormControlledInput";

export const ModalUpdater = (props) => {
  const { modalState, update, header, label, placeholder, errorHandler, footer } = props;
  const [showModal, setShowModal] = modalState;
  const [value, setValue] = useState('');

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content alignItems="center">
          <Modal.CloseButton />
          <Modal.Header>{header}</Modal.Header>
          <Modal.Body>
            <FormControlledTextField
              label={label} errorHandler={errorHandler}
              placeholder={placeholder} fieldState={[value, setValue]}
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
              <Button onPress={() => {
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