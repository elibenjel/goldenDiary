import { useEffect, useState } from "react";

export const useValidator = (args) => {
  let valid = true;
  let messages = {};
  Object.entries(args).forEach(([id, { value, isValid, message }]) => {
    messages[id] = '';
    if (value === '') {
      valid = false;
    }
    else if (!isValid) {
      messages[id] = message;
      valid = false;
    }
  });

  return {
    valid,
    messages
  }
}