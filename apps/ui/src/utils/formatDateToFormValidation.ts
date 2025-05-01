export const formatDateToFormValidation = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const minDate = `${year}-${month}-${day}`;
  const minTime = `${hours}:${minutes}`;

  return `${minDate}T${minTime}`;
};
