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
      requested: Joi.string(),
      meetAt: Joi.string(),
    },
  },
  arrivedPlace: {
    headers: {
      authorization: Joi.string().required(),
    },
    query: {
      longitude: Joi.string().required(),
      latitude: Joi.string().required(),
    },
  },
  invites: {
    headers: {
      authorization: Joi.string().required(),
    },
    path: {
      id: Joi.string().required(),
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
