import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';

// Format a date as YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

// Parse a date string to Date object
export const parseDate = (dateString) => {
  return parseISO(dateString);
};

// Check if date is within range (inclusive)
export const isDateInRange = (date, start, end) => {
  if (!date) return false;
  const d = new Date(date);
  return (
    (isEqual(d, start) || isAfter(d, start)) &&
    (isEqual(d, end) || isBefore(d, end))
  );
};

// Get today's date as YYYY-MM-DD
export const today = () => {
  return format(new Date(), 'yyyy-MM-dd');
};
