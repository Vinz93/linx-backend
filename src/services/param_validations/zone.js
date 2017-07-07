import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  readAll: {
    query: {
      offset: Joi.number().integer(),
      limit: Joi.number().integer(),
    },
  },

  create: {
    body: {
      name: Joi.string().required(),
      description: Joi.string(),
      address: Joi.string(),
      type: Joi.string(),
      geometry: Joi.object()
        .keys({
          coordinates: Joi.array().items(
            Joi.array().items(
              Joi.array().items(Joi.number()))
          ).required(),
        }),
    },
  },

  read: {
    path: {
      id: Joi.objectId().required(),
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

  update: {
    path: {
      id: Joi.objectId().required(),
    },
    body: {
      name: Joi.string(),
      description: Joi.string(),
      address: Joi.string(),
      type: Joi.string(),
      geometry: Joi.object()
        .keys({
          coordinates: Joi.array().items(
            Joi.array().items(
              Joi.array().items(Joi.number()))
          ).required(),
        }),
    },
  },
};
