export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function with2Decimals(number) {
  return Number(number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
}

export function daysBetweenDates(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  let Difference_In_Time = date2.getTime() - date1.getTime();
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
}
