const exchanges = [
  {
    user: '599c4b44dc47e440fc6d9bb0',
    haveCurrencies: [
      {
        currencyKey: 'USD',
        totalAmount: 100,
        denominations: [
          {
            coinType: 'bill',
            value: 50,
            quantity: 2,
          },
        ],
        currencyRates: [
          {
            currencyRateKey: 'USDCAD',
            value: 1.2,
          },
          {
            currencyRateKey: 'USDAUD',
            value: 1.1,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'AUD'],
    location: {
      coordinates: [0, 0],
    },
  },
];

export default exchanges;
