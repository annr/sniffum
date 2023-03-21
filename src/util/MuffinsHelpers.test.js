import {
  getNewMuffin,          m
} from "./MuffinsHelpers";

import {
  getPriceMap,
  getPrice,
} from "./DataHelpers";

import {items} from './StaticTestData';
const data = getPriceMap(items);

const index = 0;
const muffinCost = 5000;
const day = 1645171200000;

const sample =  {
  'id': index,
  'cost': muffinCost,
  'purchaseDate': new Date(day).toDateString(),
  'purchasePrice': getPrice(data,day),
  'saleDate': null,
  'salePrice': null,
  'profit': null,
  'age': null,
  'currentGain': null,
};

const muffin = getNewMuffin(data, day, index, muffinCost);

const sameObject =  JSON.stringify(sample) === JSON.stringify(muffin);

test('test', () => {
  expect(sameObject).toBe(true);
});


