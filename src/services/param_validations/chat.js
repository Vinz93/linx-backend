import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  list: {
    headers: {
      authorization: Joi.string().required(),
    },
    path: {
      id: Joi.objectId().required(),
    },
    query: {
      page: Joi.number(),
      limit: Joi.number(),
      select: Joi.string(),
      sort: Joi.string(),
    },
  },
};
