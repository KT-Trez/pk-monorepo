import { useRef } from 'react';
import { v4 } from 'uuid';

export const useIdAttribute = () => {
  const id = useRef(`@pk/${v4()}`);

  return id.current;
};
