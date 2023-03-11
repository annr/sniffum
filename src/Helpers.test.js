import {
  getDynamicThreshold
} from "./Helpers";

const baseDynamicThreshold = 0.022;
const maxMuffins = 16;

test('dynamicThreshold oven < 3/4 full', () => {
  let muffinsLength = 1;
  let dt = getDynamicThreshold(baseDynamicThreshold, muffinsLength, maxMuffins);
  expect(dt).toBe(0.064);

  muffinsLength = 10;
  dt = getDynamicThreshold(baseDynamicThreshold, muffinsLength, maxMuffins);
  expect(dt.toFixed(3)).toBe(0.028.toString());
});

test('dynamicThreshold oven exactly 3/4 full', () => {
  const muffinsLength = 12;
  const dt = getDynamicThreshold(baseDynamicThreshold, muffinsLength, maxMuffins);
  expect(dt).toBe(baseDynamicThreshold);
});

test('dynamicThreshold oven over 3/4 full', () => {
  const muffinsLength = 13;
  const dt = getDynamicThreshold(baseDynamicThreshold, muffinsLength, maxMuffins);
  expect(dt).toBe(0.0209);
});