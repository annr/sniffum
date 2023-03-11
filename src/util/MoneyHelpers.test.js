import {
  money,
  getAverageInvestment,              m
} from "./MoneyHelpers";

const investedAmountByDay = [1000.99, 600.80];

test('getAverageInvestment', () => {
  expect(getAverageInvestment(investedAmountByDay)).toBe(800.895);
});

test('money.format return formatted dollars with cents', () => {
  expect(money.format(1000)).toBe('$1,000.00');
});

