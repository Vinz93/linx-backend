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
            pictureNames: "aud-bill-50.png",
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
  {
    user: '59a0a5e5c87352a0a08210df',
    haveCurrencies: [
      {
        currencyKey: 'CAD',
        totalAmount: 170,
        denominations: [
          {
            coinType: 'bill',
            value: 20,
            quantity: 6,
          },
          {
            coinType: 'bill',
            value: 50,
            quantity: 1,
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
      coordinates: [-79.389546, 43.726044],
    },
  },
  {
    user: '59a0a5f4c87352a0a08210e1',
    haveCurrencies: [
      {
        currencyKey: 'CAD',
        totalAmount: 170,
        denominations: [
          {
            coinType: 'bill',
            value: 20,
            quantity: 5,
          },
          {
            coinType: 'bill',
            value: 50,
            quantity: 1,
          },
          {
            coinType: 'bill',
            value: 10,
            quantity: 2,
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
      coordinates: [-79.393162, 43.727509],
    },
  },
  {
    user: '59a0a5f4c87352a0a08210e2',
    haveCurrencies: [
      {
        currencyKey: 'SEK',
        totalAmount: 100,
        denominations: [
          {
            coinType: 'coin',
            value: 10,
            quantity: 5,
          },
          {
            coinType: 'bill',
            value: 50,
            quantity: 1,
          },
        ],
        currencyRates: [
          {
            currencyRateKey: 'SEKCAD',
            value: 0.9,
          },
          {
            currencyRateKey: 'SEKGBP',
            value: 1.01,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'GBP'],
    location: {
      coordinates: [-79.365671, 43.739917],
    },
  },
  {
    user: '59a0a5f4c87352a0a08210e3',
    haveCurrencies: [
      {
        currencyKey: 'SEK',
        totalAmount: 100,
        denominations: [
          {
            coinType: 'coin',
            value: 10,
            quantity: 5,
          },
          {
            coinType: 'bill',
            value: 50,
            quantity: 1,
          },
        ],
        currencyRates: [
          {
            currencyRateKey: 'SEKCAD',
            value: 0.9,
          },
          {
            currencyRateKey: 'SEKGBP',
            value: 1.01,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'GBP'],
    location: {
      coordinates: [-66.854051, 10.492639],
    },
  },
  {
    user: '59a0a5f4c87352a0a08210e4',
    haveCurrencies: [
      {
        currencyKey: 'GBP',
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
            currencyRateKey: 'GBPSEK',
            value: 0.9,
          },
          {
            currencyRateKey: 'GBPCAD',
            value: 1.01,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'SEK'],
    location: {
      coordinates: [-66.853118, 10.494084],
    },
  },
  {
    user: '59a0a5f4c87352a0a08210e5',
    haveCurrencies: [
      {
        currencyKey: 'GBP',
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
            currencyRateKey: 'GBPSEK',
            value: 0.9,
          },
          {
            currencyRateKey: 'GBPCAD',
            value: 1.01,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'SEK'],
    location: {
      coordinates: [-79.383020, 43.732475],
    },
  },
  {
    user: '59a0a5f4c87352a0a08210e6',
    haveCurrencies: [
      {
        currencyKey: 'EUR',
        totalAmount: 50,
        denominations: [
          {
            coinType: 'bill',
            value: 10,
            quantity: 5,
          },
        ],
        currencyRates: [
          {
            currencyRateKey: 'EURSEK',
            value: 0.9,
          },
          {
            currencyRateKey: 'EURCAD',
            value: 1.01,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'SEK'],
    location: {
      coordinates: [-79.362903, 43.739545],
    },
  },
  {
    user: '59a0a5f4c87352a0a08210e7',
    haveCurrencies: [
      {
        currencyKey: 'EUR',
        totalAmount: 50,
        denominations: [
          {
            coinType: 'bill',
            value: 10,
            quantity: 5,
          },
        ],
        currencyRates: [
          {
            currencyRateKey: 'EURSEK',
            value: 0.9,
          },
          {
            currencyRateKey: 'EURCAD',
            value: 1.01,
          },
        ],
      },
    ],
    wantCurrencies: ['CAD', 'SEK'],
    location: {
      coordinates: [-66.853933, 10.495392],
    },
  },
];

export default exchanges;
