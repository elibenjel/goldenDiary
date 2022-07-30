import React, { useRef } from "react";
import { Button, AlertDialog } from "native-base";

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