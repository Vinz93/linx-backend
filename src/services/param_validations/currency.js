import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  list: {
    query: {
      search: Joi.string(),
    },
  },
  read: {
    path: {
      id: Joi.objectId().required(),
    },
  },
  rates: {
    query: {
      source: Joi.string().required(),
      currencies: Joi.string().required(),
    },
  },
  create: {
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
  addDenominations: {
    body: {
      denomination: Joi.object().keys({
        value: Joi.number().required(),
        coinType: Joi.string().required(),
      }),
    },
    path: {
      id: Joi.string().required(),
    },
  },
  removeDenomination: {
    body: {
      denomination: Joi.object().keys({
        value: Joi.number().required(),
        coinType: Joi.string().required(),
      }),
    },
    path: {
      id: Joi.string().required(),
    },
  },
  delete: {
    path: {
      id: Joi.objectId().required(),
    },
  },
};
