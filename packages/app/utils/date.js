
export const getCurrentDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const fromDateToDict = (date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
  toDate: function () {
    return new Date(this.year, this.month - 1, this.day);
  },
  toString: function () {
    return this.toDate().toLocaleDateString();
  }
});

const leftZeroPadding = (n) => `${n < 10 ? '0' : ''}${n}`;

export const getDay = (date) => {
  return leftZeroPadding(date.getDate());
}

export const getMonth = (date) => {
  return leftZeroPadding(date.getMonth() + 1);
}

export const getYear = (date) => {
  return date.getFullYear();
}

export const getMonthlyPeriod = (date = new Date()) => {
  const start = new Date(getYear(date), getMonth(date), 1);
  const end = new Date(getYear(date), getMonth(date) + 1, 0);
  return { start, end };
}

export const getYearlyPeriod = (date = new Date()) => {
  const start = new Date(getYear(date), 0, 1);
  const end = new Date(getYear(date), 12, 1);
  return { start, end };
}

export const getMonthString = (date) => {
  const month = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Aout',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];

  const i = date.getMonth();
  return month[i];
}