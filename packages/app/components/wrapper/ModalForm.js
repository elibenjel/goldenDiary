import React, { useState } from 'react';
import { Box, Modal, Button } from 'native-base';

import { useOnLayout } from '../../hooks';

export const ModalForm = (props) => {
  const { show, close, header, submit, submitLabel = 'Confirmer', placement = 'center', children } = props;
  const { width, onLayout } = useOnLayout();
  const margins = 30;

  const oneChild = 'props' in children;
  return (
    <Modal isOpen={show} onClose={close}>
      <Modal.Content {...styles[placement]} alignItems="center" onLayout={onLayout}>
        <Modal.CloseButton onPress={close} />
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>
          {
            width ? (
              oneChild ? (
                <Box w={width - margins}>
                  {children}
                </Box>
              ) : Object.values(children).map(child => {
                return(
                  <Box key={child.props.id} w={width - margins}>
                    {child}
                  </Box>
                )
              })
            ) : null
          }
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={close}>
              Annuler
            </Button>
            <Button isDisabled={!submit} onPress={() => {
              const error = submit();
              if (!error) {
                close();
              }
            }}>
              {submitLabel}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

// export const ModalUpdater = (props) => {
//   const { modalState, update, header, label, placeholder, validator } = props;
//   const [showModal, setShowModal] = modalState;
//   const [value, setValue] = useState('');
//   const { isValid, message } = validator;
//   const { valid, messages } = useValidator({
//     updatedField: {
//       value,
//       isValid,
//       message
//     }
//   })

//   const [fieldWidth, setFieldWidth] = useState(null);
//   const onLayout = (event) => {
//     const width = event.nativeEvent.layout.width;
//     setFieldWidth(width);
//   }

//   return (
//     <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <Modal.Content mb="auto" mt="20" alignItems="center">
//           <Modal.CloseButton />
//           <Modal.Header onLayout={onLayout}>{header}</Modal.Header>
//           <Modal.Body>
//             <FormControlledTextField
//               label={label} errorMessage={messages.updatedField}
//               placeholder={placeholder} state={[value, setValue]}
//               width={fieldWidth}
//               size="xs"
//             />
//           </Modal.Body>
//           <Modal.Footer>
//             <Button.Group space={2}>
//               <Button variant="ghost" colorScheme="blueGray" onPress={() => {
//                 setShowModal(false);
//               }}>
//                 Annuler
//               </Button>
//               <Button isDisabled={!valid} onPress={() => {
//                 update(value);
//                 setShowModal(false);
//               }}>
//                 Confirmer
//               </Button>
//             </Button.Group>
//           </Modal.Footer>
//         </Modal.Content>
//       </Modal>
//   )
// }

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