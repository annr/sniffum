const config = {
  startDate: Date.parse('1/03/2019'),
  endDate: Date.parse('12/30/2019'),
  tradeFrequency: 7,
  spendinglimit: 80000.00,
  muffinCost: 5000.00,
  saleThreshold: 0.04,
  growthMarketDefinition: 0.03,
  //  minSaleAge: 21,
  saleTiers: {
    hold: 0.06,
    premium: 0.04,
    regular: 0.035,
    discount: 0.018,
  },
  tradeAtStartOfWeekFlag: false,
  table: {
    hasExtraColumns: true
  }
}
export {config};
