
export const getAverageInvestment = array => array.reduce((a, b) => a + b) / array.length;

export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatPercent = (num) => {
  return Number(num/100).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
};


export const getAverageInvestmentFromEvents = (events) => {

  const sums = events.reduce((prev, curr) => {
    return {
      costUnsoldMuffins: prev.costUnsoldMuffins + curr.costUnsoldMuffins,
    }
  }, {
    costUnsoldMuffins: 0,
  });

  return sums.costUnsoldMuffins/events.length;
};