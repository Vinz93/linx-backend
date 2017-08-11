import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  rates: {
    query: {
      source: Joi.string().required(),
      currencies: Joi.string().required(),
    },
  },
  create: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      currencyKey: Joi.string().required(),
      name: Joi.string().required(),
      denominations: Joi.array().items(
        Joi.object().keys({
          value: Joi.number().required(),
          coinType: Joi.string().required(),
        })
        ),
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
};
