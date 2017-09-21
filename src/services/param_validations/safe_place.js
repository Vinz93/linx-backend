import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  list: {
    query: {
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
      maxDistance: Joi.number(),
    },
  },
};
