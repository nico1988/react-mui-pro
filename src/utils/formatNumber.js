import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number, unit = '¥') {
  return `${unit}${numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00')}`;
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
export function fDataM100(number) {
  return Number(number)*100;
}
export function fDataD100(number) {
  return Number(number)/100;
}
