import {
  convertData,
  getValidMarketDay
} from "./DataHelpers";

import {items} from './TestData';
const data = convertData(items);

const startDate = Date.parse('1/17/2000'); // Mon Jan 17 2000 (a holiday)
const endDate = Date.parse('2/17/2000');

test('convertData takes array and returns map', () => {
  expect(data instanceof Map).toBe(true);
});

test('getValidMarketDay: If start date is a Monday holiday, func returns the following Tuesday ', () => {
  const validStartDate = getValidMarketDay(data, startDate, 1);
  console.log(validStartDate);
  expect(validStartDate).toBe(948182400000);
});