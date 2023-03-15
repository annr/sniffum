import {
  getOpenPriceMap,
  getHighPriceMap,
  getFirstDataDay,
  getLastDataDay,
  getValidMarketDay,
  getTradeDays,
  getDaysTradeFrequencyApart
} from "./DataHelpers";

import {items} from './TestData';
const data = getOpenPriceMap(items);
const tradeFrequency = 7;
let tradeAtStartOfWeekFlag = false;

console.log(`first day in data ${getFirstDataDay(data)}`);
console.log(`last day in data ${getLastDataDay(data)}`);

const firstDataDay = Date.parse(getFirstDataDay(data)); // Mon Jan 03 2000
const lastDataDay = Date.parse(getLastDataDay(data)); // Wed Mar 08 2000

const weekendDay = Date.parse('1/15/2000'); // Sat Jan 15 2000
const startDate = Date.parse('1/17/2000'); // Mon Jan 17 2000 (a holiday)
const validDay = Date.parse('1/18/2000'); // Tue Jan 18 2000
const endDate = Date.parse('2/17/2000'); // Thu Feb 17 2000
const outsideDataStartDate = Date.parse('1/5/1999');
const outsideDataEndDate = Date.parse('1/5/2001');

const endDateMakingPeriodMultipleOfTradeDays = Date.parse('2/15/2000') // Tue Feb 15 2000

// startDate and endDate are about one month apart. Expect > 3 trade days.

//
// getOpenPriceMap
//

test('getOpenPriceMap takes array and returns map', () => {
  expect(items instanceof Array).toBe(true);
  expect(data instanceof Map).toBe(true);
});

//
// getHighPriceMap
//

test('getHighPriceMap returns a map with different values than getOpenPriceMap', () => {
  const highMap = getHighPriceMap(items);
  expect(highMap instanceof Map).toBe(true);

});

//
// getValidMarketDay
//

test('getValidMarketDay: If start date is a weekend day, get next day market is open', () => {
  const day = getValidMarketDay(data, weekendDay, 1);
  expect(day).toBe(validDay);
});

test('getValidMarketDay: If start date is a Monday holiday, return the following Tuesday', () => {
  const day = getValidMarketDay(data, startDate, 1);
  expect(day).toBe(validDay);
});

test('getValidMarketDay: If requested start is earlier than first dataset day, return firstDataDay', () => {
  const day = getValidMarketDay(data, outsideDataStartDate, 1);
  expect(day).toBe(firstDataDay);
});

test('getValidMarketDay: If requested end is later than first dataset day, return last', () => {
  const day = getValidMarketDay(data, outsideDataEndDate, -1);
  expect(day).toBe(lastDataDay);
});

//
// getTradeDays
//
const expectedTradeDays = [948182400000, 948787200000, 949392000000, 949996800000, 950601600000];

test('getTradeDays returns expected values', () => {
  const values = getTradeDays(data, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag);
  expect(values).toStrictEqual(expectedTradeDays);
});


test('getTradeDays returns expected values', () => {
  const values = getTradeDays(data, startDate, endDateMakingPeriodMultipleOfTradeDays, tradeFrequency, tradeAtStartOfWeekFlag);
  expect(values).toStrictEqual(expectedTradeDays);
});