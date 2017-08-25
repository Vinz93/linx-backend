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
                })
              ),
          })
        ).required(),
      wantCurrencies: Joi.array().items(Joi.string()).required(),
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
  find: {
    headers: {
      authorization: Joi.string().required(),
    },
    path: {
      id: Joi.objectId().required(),
    },
  },
};
