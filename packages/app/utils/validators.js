
export const isNonNegativeValue = (v) => (
  (v === `${Number(v)}` && Number(v) > 0) ||
  (v === Number(v) && v > 0)
);