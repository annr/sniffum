const config = {
  startDate: Date.parse('1/03/2005'),
  endDate: Date.parse('12/30/2005'),
  tradeFrequency: 7,
  spendinglimit: 80000.00,
  muffinCost: 5000.00,
  saleThreshold: 0.022,
  growthMarketDefinition: 0.03,
  //  minSaleAge: 21,
  saleTiers: {
    premium: 0.04,
    regular: 0.028,
    discount: 0.018
  },
  tradeAtStartOfWeekFlag: false,
  table: {
    hasExtraColumns: true
  }
}
export {config};
