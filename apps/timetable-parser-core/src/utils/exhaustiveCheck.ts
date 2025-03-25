export const exhaustiveCheck = (value: never) => {
  throw new Error(`exhaustive check not met: ${value}`);
};
