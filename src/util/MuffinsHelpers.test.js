import {
  getNewMuffin,          m
} from "./MuffinsHelpers";

import {
  convertData,
  getPrice,
} from "./DataHelpers";

import {items} from './TestData';
const data = convertData(items);

const index = 0;
const muffinPrice = 5000;
const day = 1645171200000;

const sample =  {
  'id': index,
  'cost': muffinPrice,
  'purchaseDate': new Date(day).toDateString(),
  'purchasePrice': getPrice(data,day),
  'saleDate': null,
  'salePrice': null,
  'profit': null,
  'age': null,
  'currentGain': null,
};

const muffin = getNewMuffin(data, day, index, muffinPrice);

const sameObject =  JSON.stringify(sample) === JSON.stringify(muffin);

test('test', () => {
  expect(sameObject).toBe(true);
});


