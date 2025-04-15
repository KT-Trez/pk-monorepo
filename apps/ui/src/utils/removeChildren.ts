export const removeChildren = (element: Element) => {
  for (const child of element.children) {
    element.removeChild(child);
  }

  return element;
};
