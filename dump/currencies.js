const currencies = [
  {
    currencyKey: "USD",
    name: "American Dollar",
    denominations: [
      {
        coinType: "bill",
        value: 1,
        pictureNames: ["usd-bill-1.jpg"],
      },
      {
        coinType: "bill",
        value: 2,
        pictureNames: ["usd-bill-2.jpg"],
      },
      {
        coinType: "bill",
        value: 5,
        pictureNames: ["usd-bill-5.jpg"],
      },
      {
        coinType: "bill",
        value: 10,
        pictureNames: ["usd-bill-10.jpg"],
      },
      {
        coinType: "bill",
        value: 20,
        pictureNames: ["usd-bill-20.jpg"],
      },
      {
        coinType: "bill",
        value: 50,
        pictureNames: ["usd-bill-50.jpg"],
      },
      {
        coinType: "bill",
        value: 100,
        pictureNames: ["usd-bill-100.jpg"],
      },
      {
        coinType: "coin",
        value: 0.25,
        pictureNames: ["usd-coin-025.jpg"],
      },
      {
        coinType: "coin",
        value: 0.1,
        pictureNames: ["usd-coin-010.jpg"],
      },
      {
        coinType: "coin",
        value: 0.05,
        pictureNames: ["usd-coin-05.jpg"],
      },
      {
        coinType: "coin",
        value: 0.01,
        pictureNames: ["usd-coin-01.jpg"],
      },
    ],
  },
  {
    currencyKey: "CAD",
    name: "Canadian Dollar",
    denominations: [
      {
        coinType: "coin",
        value: 1,
      },
      {
        coinType: "coin",
        value: 2,
      },
      {
        coinType: "coin",
        value: 0.25,
      },
      {
        coinType: "coin",
        value: 0.1,
      },
      {
        coinType: "coin",
        value: 0.05,
      },
      {
        coinType: "coin",
        value: 0.01,
      },
      {
        coinType: "bill",
        value: 5,
        pictureNames: ["cad-bill-5.jpg"],
      },
      {
        coinType: "bill",
        value: 10,
        pictureNames: ["cad-bill-10.jpg"],
      },
      {
        coinType: "bill",
        value: 20,
        pictureNames: ["cad-bill-20.jpg"],
      },
      {
        coinType: "bill",
        value: 50,
        pictureNames: ["cad-bill-50.jpg"],
      },
      {
        coinType: "bill",
        value: 100,
        pictureNames: ["cad-bill-100.jpg"],
      },

    ],
  },
  {
    currencyKey: "EUR",
    name: "Euro",
    denominations: [
      {
        coinType: "coin",
        value: 0.01,
      },
      {
        coinType: "coin",
        value: 0.02,
      },
      {
        coinType: "coin",
        value: 0.05,
      },
      {
        coinType: "coin",
        value: 0.1,
      },
      {
        coinType: "coin",
        value: 0.2,
      },
      {
        coinType: "coin",
        value: 0.5,
      },
      {
        coinType: "coin",
        value: 1,
      },
      {
        coinType: "coin",
        value: 2,
      },
      {
        coinType: "bill",
        value: 5,
        pictureNames: ["eur-bill-5.jpg"],
      },
      {
        coinType: "bill",
        value: 10,
        pictureNames: ["eur-bill-10.jpg"],
      },
      {
        coinType: "bill",
        value: 20,
        pictureNames: ["eur-bill-20.jpg"],
      },
      {
        coinType: "bill",
        value: 50,
        pictureNames: ["eur-bill-50.jpg"],
      },
      {
        coinType: "bill",
        value: 100,
        pictureNames: ["eur-bill-100.jpg"],
      },
      {
        coinType: "bill",
        value: 200,
        pictureNames: ["eur-bill-200.jpg"],
      },
      {
        coinType: "bill",
        value: 500,
        pictureNames: ["eur-bill-500.jpg"],
      },
    ],
  },
  {
    currencyKey: "GBP",
    name: "British Pound Sterling",
    denominations: [
      {
        coinType: "bill",
        value: 50,
      },
      {
        coinType: "bill",
        value: 20,
      },
      {
        coinType: "bill",
        value: 10,
      },
      {
        coinType: "bill",
        value: 5,
      },
      {
        coinType: "coin",
        value: 5,
      },
      {
        coinType: "coin",
        value: 2,
      },
      {
        coinType: "coin",
        value: 1,
      },
      {
        coinType: "coin",
        value: 0.5,
      },
      {
        coinType: "coin",
        value: 0.2,
      },
      {
        coinType: "coin",
        value: 0.1,
      },
      {
        coinType: "coin",
        value: 0.05,
      },
      {
        coinType: "coin",
        value: 0.02,
      },
      {
        coinType: "coin",
        value: 0.01,
      },
    ],
  },
  {
    currencyKey: "AUD",
    name: "Australian Dollar",
    denominations: [
      {
        coinType: "bill",
        value: 100,
        pictureNames: ["aud-bill-100.jpg"],
      },
      {
        coinType: "bill",
        value: 50,
        pictureNames: ["aud-bill-50.jpg"],
      },
      {
        coinType: "bill",
        value: 20,
        pictureNames: ["aud-bill-20.jpg"],
      },
      {
        coinType: "bill",
        value: 10,
        pictureNames: ["aud-bill-10.jpg"],
      },
      {
        coinType: "bill",
        value: 5,
        pictureNames: ["aud-bill-5.jpg"],
      },
      {
        coinType: "coin",
        value: 2,
      },
      {
        coinType: "coin",
        value: 1,
      },
      {
        coinType: "coin",
        value: 0.5,
      },
      {
        coinType: "coin",
        value: 0.2,
      },
      {
        coinType: "coin",
        value: 0.1,
      },
      {
        coinType: "coin",
        value: 0.05,
      },
    ],
  },
  {
    currencyKey: "SEK",
    name: "Swedish Kron",
    denominations: [
      {
        coinType: "coin",
        value: 1,
      },
      {
        coinType: "coin",
        value: 2,
      },
      {
        coinType: "coin",
        value: 5,
      },
      {
        coinType: "coin",
        value: 10,
      },
      {
        coinType: "bill",
        value: 20,
        pictureNames: ["sek-bill-20.jpg"],
      },
      {
        coinType: "bill",
        value: 50,
        pictureNames: ["sek-bill-50.jpg"],
      },
      {
        coinType: "bill",
        value: 100,
        pictureNames: ["sek-bill-100.jpg"],
      },
      {
        coinType: "bill",
        value: 500,
        pictureNames: ["sek-bill-500.jpg"],
      },
      {
        coinType: "bill",
        value: 1000,
        pictureNames: ["sek-bill-1000.jpg"],
      },
    ],
  },
];

export default currencies;
