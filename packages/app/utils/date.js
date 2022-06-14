
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
