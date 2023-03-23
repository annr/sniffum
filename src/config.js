const config = {
  startDate: Date.parse('1/01/2011'),
  endDate: Date.parse('12/31/2011'),
  tradeFrequency: 7,
  spendinglimit: 80000.00,
  muffinCost: 5000.00,
  saleThreshold: 0.04,
  growthMarketDefinition: 0.03,
  //  minSaleAge: 21,
  saleTiers: {
    premium: 0.06,
    regular: 0.04,
    discount: 0.03,
    firesale: 0.022,
  },
  tradeAtStartOfWeekFlag: false,
  table: {
    hasExtraColumns: true
  }
}
export {config};
