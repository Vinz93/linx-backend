const exchanges = [
  {
    user: '59a0a5efc87352a0a08210e0',
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
      coordinates: [-66.934411, 10.485993],
    },
  },
  {
    user: '59a0a5e0c87352a0a08210de',
    haveCurrencies: [
      {
        currencyKey: 'CAD',
        totalAmount: 120,
        denominations: [
          {
            coinType: 'bill',
            value: 20,
            quantity: 6,
          },
        ],
        currencyRates: [
          {
            currencyRateKey: 'CADUSD',
            value: 0.9,
          },
          {
            currencyRateKey: 'CADAUD',
            value: 1.01,
          },
        ],
      },
    ],
    wantCurrencies: ['USD', 'AUD'],
    location: {
      coordinates: [-66.933154, 10.486469],
    },
  },
  {
    user: '59a0a5d7c87352a0a08210dd',
    haveCurrencies: [
      {
        currencyKey: 'AUD',
        totalAmount: 200,
        denominations: [
          {
            coinType: 'bill',
            value: 50,
            quantity: 4,
          },
        ],
        currencyRates: [
          {
            currencyRateKey: 'AUDCAD',
            value: 0.9,
          },
          {
            currencyRateKey: 'AUDUSD',
            value: 0.9,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'USD'],
    location: {
      coordinates: [-66.937070, 10.488305],
    },
  },
  {
    user: '59a0a5d1c87352a0a08210dc',
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
      coordinates: [-66.933342, 10.487301],
    },
  },
];

export default exchanges;
