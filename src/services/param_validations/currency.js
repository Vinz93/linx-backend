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
};
