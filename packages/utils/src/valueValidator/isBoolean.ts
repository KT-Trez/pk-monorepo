export const isBoolean = (value: unknown) => {
  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'string') {
    return value === 'true' || value === 'false';
  }

  return false;
};
