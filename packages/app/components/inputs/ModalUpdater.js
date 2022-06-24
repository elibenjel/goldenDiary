import React, { useState, useRef } from "react";
import { Box, Modal, Button, AlertDialog } from "native-base";
import { FormControlledTextField } from "./FormControlledTextField";
import { useValidator } from "./useValidator";

export const useModalState = () => {
  const [show, setShow] = useState(false);
  return {
    showModal : show,
    openModal: () => setShow(true),
    closeModal: () => setShow(false)
  }
}

export const ModalConfirmation = (props) => {
  const { show, close, confirm, header, body, confirmLabel = 'Confirmer' } = props;
  const cancelRef = useRef(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={show} onClose={close}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{header}</AlertDialog.Header>
        <AlertDialog.Body>
          {body}
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button variant="unstyled" colorScheme="coolGray" onPress={close} ref={cancelRef}>
              Annuler
            </Button>
            <Button colorScheme="danger" onPress={() => {
              confirm();
              close();
            }}>
              {confirmLabel}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}

export const ModalForm = (props) => {
  const { show, close, header, submit, placement = 'center', children } = props;
  const [fieldWidth, setFieldWidth] = useState(null);
  const onLayout = (event) => {
    const width = event.nativeEvent.layout.width;
    setFieldWidth(width);
  }

  const oneChild = 'props' in children;
  return (
    <Modal isOpen={show} onClose={close}>
        <Modal.Content {...styles[placement]} alignItems="center">
          <Modal.CloseButton />
          <Modal.Header onLayout={onLayout}>{header}</Modal.Header>
          <Modal.Body>
            {
              oneChild ?
              <Box w={fieldWidth}>
                {children}
              </Box> :
              Object.values(children).map(child => {
                return(
                  <Box key={child.key} w={fieldWidth}>
                    {child}
                  </Box>
                )
              })
            }
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={close}>
                Annuler
              </Button>
              <Button isDisabled={!submit} onPress={() => {
                submit();
                close();
              }}>
                Confirmer
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
  )
}

export const ModalUpdater = (props) => {
  const { modalState, update, header, label, placeholder, validator } = props;
  const [showModal, setShowModal] = modalState;
  const [value, setValue] = useState('');
  const { isValid, message } = validator;
  const { valid, messages } = useValidator({
    updatedField: {
      value,
      isValid,
      message
    }
  })

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
              label={label} errorMessage={messages.updatedField}
              placeholder={placeholder} state={[value, setValue]}
              width={fieldWidth}
              size="xs"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                setShowModal(false);
              }}>
                Annuler
              </Button>
              <Button isDisabled={!valid} onPress={() => {
                update(value);
                setShowModal(false);
              }}>
                Confirmer
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
  )
}

const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0
  },
  bottom: {
    marginBottom: 0,
    marginTop: "auto"
  },
  left: {
    marginLeft: 0,
    marginRight: "auto"
  },
  right: {
    marginLeft: "auto",
    marginRight: 0
  },
  center: {}
};