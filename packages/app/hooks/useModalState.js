import { useState } from "react";

export const useModalState = () => {
  const [show, setShow] = useState(false);
  return {
    showModal : show,
    openModal: () => setShow(true),
    closeModal: () => setShow(false)
  }
}

