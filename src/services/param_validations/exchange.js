import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  create: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      requester: Joi.string(),
      haveCurrencies: Joi.array().items(
        Joi.object()
          .keys({
            currencyKey: Joi.string(),
            totalAmount: Joi.number(),
            denominations: Joi.array().items(
              Joi.object()
                .keys({
                  coinType: Joi.string(),
                  value: Joi.number(),
                  quantity: Joi.number(),
                })
            ),
            currencyRates: Joi.array().items(
              Joi.object()
                .keys({
                  currencyRateKey: Joi.string(),
                  value: Joi.number(),
                  forexValue: Joi.number(),
                })
            ),
          })
      ).required(),
      wantCurrencies: Joi.array().items(Joi.string()).required(),
      location: Joi.object()
        .keys({
          coordinates: Joi.array().items(Joi.number()).required(),
        }),
      zoneId: Joi.string(),
      terminal: Joi.string(),
      securityZone: Joi.boolean(),
    },
  },
  delete: {
    headers: {
      authorization: Joi.string().required(),
    },
    path: {
      id: Joi.objectId().required(),
    },
  },
  contact: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      selectedCurrencies: Joi.array().items(Joi.string()),
      requester: Joi.string(),
      requested: Joi.string(),
    },
  },
  find: {
    headers: {
      authorization: Joi.string().required(),
    },
    path: {
      id: Joi.objectId().required(),
    },
  },

  acceptContact: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      requester: Joi.string().required(),
      requested: Joi.string().required(),
    },
  },
  rejectContact: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      requester: Joi.string().required(),
      requested: Joi.string().required(),
    },
  },
  findByDistance: {
    headers: {
      authorization: Joi.string().required(),
    },
    path: {
      id: Joi.objectId().required(),

    },
  },
};
