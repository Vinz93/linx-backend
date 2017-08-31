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
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      bornAt: Joi.string().isoDate(),
      password: Joi.string().required(),
      deviceToken: Joi.string().required(),
      deviceType: Joi.string().required(),
      location: Joi.object()
        .keys({
          coordinates: Joi.array().items(Joi.number()).required(),
        }),
    },
  },

  update: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      firstName: Joi.string(),
      lastName: Joi.string(),
      bornAt: Joi.string().isoDate(),
      deviceToken: Joi.string(),
      deviceType: Joi.string(),
      pictureId: Joi.string(),
      location: Joi.object()
        .keys({
          coordinates: Joi.array().items(Joi.number()),
        }),
      accounts: Joi.array().items(
        Joi.object()
        .keys({
          number: Joi.number(),
          type: Joi.string(),
        })
      ),
      blockList: Joi.array().items(Joi.string()),
      experiences: Joi.array().items(
        Joi.object()
        .keys({
          company: Joi.string(),
          position: Joi.string(),
          private: Joi.boolean(),
          period: Joi.object()
            .keys({
              start: Joi.string().isoDate(),
              finish: Joi.string().isoDate(),
            }),
        })
      ),
      education: Joi.array().items(
        Joi.object()
        .keys({
          institution: Joi.string(),
          degree: Joi.string(),
          private: Joi.boolean(),
          period: Joi.object()
            .keys({
              start: Joi.string().isoDate(),
              finish: Joi.string().isoDate(),
            }),
        })
      ),
      languages: Joi.array().items(
        Joi.object()
        .keys({
          name: Joi.string(),
          level: Joi.number().min(1).max(5),
          private: Joi.boolean(),
        })
      ),
      reputation: Joi.object()
        .keys({
          rates: Joi.array()
          .items(
            Joi.object()
            .keys({
              rate: Joi.number().min(1).max(5),
              from: Joi.string(),
            })
          ),
        }),
      headline: Joi.string(),
      privateFields: Joi.array().items(Joi.string()),
    },
  },

  signin: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      deviceType: Joi.string().required(),
    },
  },

  readByMe: {
    headers: {
      authorization: Joi.string().required(),
    },
  },

  delete: {
    headers: {
      authorization: Joi.string().required(),
    },
  },

  signout: {
    headers: {
      authorization: Joi.string().required(),
    },
  },

  forgotPassword: {
    body: {
      email: Joi.string().email().required(),
    },
  },
  atAirport: {
    headers: {
      authorization: Joi.string().required(),
    },
    query: {
      longitude: Joi.string().required(),
      latitude: Joi.string().required(),
    },
  },

  changePassword: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      password: Joi.string().required(),
    },
  },
};
