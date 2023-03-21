import {
  getPriceMap,
  getFirstDataDay,
  getLastDataDay,
  getValidMarketDay,
  getTradeDays,
  yearsFrom,
  getYearPeriodSets,
  getDaysTradeFrequencyApart,
  runBasicScenario
} from "./DataHelpers";

import {items} from './StaticTestData';

const data = getPriceMap(items);
const tradeFrequency = 7;
let tradeAtStartOfWeekFlag = false;

const firstDataDay = Date.parse(getFirstDataDay(data)); // Mon Jan 03 2000
const lastDataDay = Date.parse(getLastDataDay(data)); // Wed Mar 08 2000

const weekendDay = Date.parse('1/15/2000'); // Sat Jan 15 2000
const startDate = Date.parse('1/17/2000'); // Mon Jan 17 2000 (a holiday)
const validDay = Date.parse('1/18/2000'); // Tue Jan 18 2000
const endDate = Date.parse('2/17/2000'); // Thu Feb 17 2000

const beforeDataStartDate = Date.parse('1/5/1999');
const afterDataEndDate = Date.parse('1/5/2024');

const yearPeriodStart = Date.parse('1/01/2019');
const yearPeriodFirstValidDay = getValidMarketDay(data, yearPeriodStart, 1);

const yearPeriodEnd = Date.parse('12/31/2019');
const yearPeriodLastValidDay = getValidMarketDay(data, yearPeriodEnd, -1);

const endDateMultipleOfFrequency = Date.parse('2/15/2000') // Tue Feb 15 2000

// startDate and endDate are about one month apart. Expect > 3 trade days.

//
// confirm all data is loaded
//

test('items', () => {
  expect(items.length).toBe(5831);
});

//
// getPriceMap
//

test('getPriceMap takes array and returns map', () => {
  expect(items instanceof Array).toBe(true);
  expect(data instanceof Map).toBe(true);
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
  const day = getValidMarketDay(data, beforeDataStartDate, 1);
  expect(day).toBe(firstDataDay);
});

test('getValidMarketDay: If requested end is later than first dataset day, return last', () => {
  const day = getValidMarketDay(data, afterDataEndDate, -1);
  expect(day).toBe(lastDataDay);
});

//
// getTradeDays
//
const expectedTradeDays = [948182400000, 948787200000, 949392000000, 949996800000, 950601600000];

test('1. getTradeDays over short period returns expected values', () => {
  const values = getTradeDays(data, startDate, endDate, tradeFrequency, tradeAtStartOfWeekFlag);
  expect(values).toStrictEqual(expectedTradeDays);
});

test('2. getTradeDays returns expected values', () => {
  const values = getTradeDays(data, startDate, endDateMultipleOfFrequency, tradeFrequency, tradeAtStartOfWeekFlag);
  expect(values).toStrictEqual(expectedTradeDays);
});

test('3. getTradeDays returns expected values when period is multiple of tradeFrequency', () => {
  const values = getTradeDays(data, startDate, endDateMultipleOfFrequency, tradeFrequency, tradeAtStartOfWeekFlag);
  expect(values).toStrictEqual(expectedTradeDays);
});

test('4. getTradeDays returns 53 days when period is one year', () => {
  const values = getTradeDays(data, yearPeriodStart, yearPeriodEnd, tradeFrequency);
  expect(values.length).toBe(53);
});
//
// yearsFrom
//
test('yearsFrom returns expected values', () => {
  const years = yearsFrom(new Date(getFirstDataDay(data)).getFullYear());
  const expected = [
    2000, 2001, 2002, 2003,
    2004, 2005, 2006, 2007,
    2008, 2009, 2010, 2011,
    2012, 2013, 2014, 2015,
    2016, 2017, 2018, 2019,
    2020, 2021, 2022, 2023
  ]
  expect(years).toStrictEqual(expected);
});

//
// getYearPeriodSets
//

test('getYearPeriodSets returns start and end dates for each year up until current (years.length - 1)', () => {
  const years = yearsFrom(new Date(getFirstDataDay(data)).getFullYear());
  const periods = getYearPeriodSets(data);
  expect(periods.length).toStrictEqual(years.length - 1);
});

test('getYearPeriodSets with mid year flag returns count ((years.length - 1) * 2) - 1', () => {
  const years = yearsFrom(new Date(getFirstDataDay(data)).getFullYear());
  const periods = getYearPeriodSets(data, true);
  expect(periods.length).toStrictEqual((((years.length - 1) * 2) - 1));
});

//
// getDaysTradeFrequencyApart
//
//   The mean of getTradeDays, but a separate function

test('getDaysTradeFrequencyApart returns correct trade days', () => {
  const tradeDays = getDaysTradeFrequencyApart(data, yearPeriodStart, yearPeriodEnd, tradeFrequency);

  // first should be first market day of year
  expect(tradeDays[0]).toBe(yearPeriodFirstValidDay);

  // last should be last market day of year
  expect(tradeDays[tradeDays.length - 1]).toBe(yearPeriodLastValidDay);

  // total should be 53
  expect(tradeDays.length).toBe(53);
});

test('getDaysTradeFrequencyApart returns 53 trade days for any period', () => {
  const yearPeriods = getYearPeriodSets(data, true);
  for(let j=0; j < yearPeriods.length; j++) {
    const tradeDaysByYearPeriod = getTradeDays(data, yearPeriods[j][0], yearPeriods[j][1], tradeFrequency);
    expect(tradeDaysByYearPeriod.length).toBe(53);
  }
});

//     const yearPeriods = getYearPeriodSets(data, true);

//
// runScenario
//

// test('runBasicScenario returns correct outcome', () => {

//   const outcome = runBasicScenario(data, tradeDaysByYearPeriod, maxMuffins, muffinCost, saleThreshold);

//   expect(outcome).toStrictEqual({});
// });