export const removeChildren = (element: Element) => {
  const children = [...element.children];

  for (const child of children) {
    element.removeChild(child);
  }

  return element;
};
