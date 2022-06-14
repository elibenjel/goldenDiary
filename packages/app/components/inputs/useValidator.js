import { useEffect, useState } from "react";

export const useValidator = (args, dependencies) => {
  const [valid, setValid] = useState(true);
  const messages = {};

  useEffect(() => {
    let allValid = true;
    Object.entries(args).forEach(([id, { value, isValid, message }]) => {
      messages[id] = '';
      if (!isValid(value)) {
        messages[id] = message;
        allValid = false;
      }
    });

    setValid(allValid);
  }, dependencies);

  return {
    valid,
    messages
  }
}