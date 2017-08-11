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
      coinType: Joi.string().required(),
      currencyKey: Joi.string().required(),
      value: Joi.number().required(),
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
