// Basic date utility functions
const dateToISO = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString();
};

const dateToLocal = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString();
};

const dateToShort = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const dateToLong = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const dateDiffInDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const dateDiffInHours = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

const dateDiffInMinutes = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60));
};

const dateDiffInSeconds = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / 1000);
};

// Advanced date manipulation
const dateAdd = (date, value, unit) => {
  const d = new Date(date);
  switch(unit.toLowerCase()) {
    case 'years': d.setFullYear(d.getFullYear() + value); break;
    case 'months': d.setMonth(d.getMonth() + value); break;
    case 'days': d.setDate(d.getDate() + value); break;
    case 'hours': d.setHours(d.getHours() + value); break;
    case 'minutes': d.setMinutes(d.getMinutes() + value); break;
    case 'seconds': d.setSeconds(d.getSeconds() + value); break;
  }
  return d;
};

const dateSubtract = (date, value, unit) => {
  return dateAdd(date, -value, unit);
};

const dateStartOf = (date, unit) => {
  const d = new Date(date);
  switch(unit.toLowerCase()) {
    case 'year': d.setMonth(0, 1); d.setHours(0, 0, 0, 0); break;
    case 'month': d.setDate(1); d.setHours(0, 0, 0, 0); break;
    case 'day': d.setHours(0, 0, 0, 0); break;
    case 'hour': d.setMinutes(0, 0, 0); break;
  }
  return d;
};

const dateEndOf = (date, unit) => {
  const d = new Date(date);
  switch(unit.toLowerCase()) {
    case 'year': d.setMonth(11, 31); d.setHours(23, 59, 59, 999); break;
    case 'month': d.setMonth(d.getMonth() + 1, 0); d.setHours(23, 59, 59, 999); break;
    case 'day': d.setHours(23, 59, 59, 999); break;
    case 'hour': d.setMinutes(59, 59, 999); break;
  }
  return d;
};

// Helper function to check if date is valid
const isValidDateFormat = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

function now(){
  return new Date();
}
function timestamp(){
  return Date.now();
}