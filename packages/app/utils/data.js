
export const deepCopy = (aObject) => {
  // Prevent undefined objects
  // if (!aObject) return aObject;

  let bObject = Array.isArray(aObject) ? [] : {};

  let value;
  for (const key in aObject) {

    // Prevent self-references to parent object
    // if (Object.is(aObject[key], aObject)) continue;
    
    value = aObject[key];

    bObject[key] = (typeof value === "object") ? deepCopy(value) : value;
  }

  return bObject;
}