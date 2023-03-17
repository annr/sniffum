export const getReturn = (totalProfit, averageInvestment) => {
  return (totalProfit/averageInvestment)*100;
}

export const getAverageInvestment = array => array.reduce((a, b) => a + b) / array.length;

export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatPercent = (num) => {
  return Number(num/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
};