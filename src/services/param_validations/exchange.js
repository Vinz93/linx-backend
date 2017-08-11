import objectId from 'joi-objectid';
import Joi from 'joi';

Joi.objectId = objectId(Joi);

export default {
  create: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      currencies: Joi.array().items(
        Joi.object()
          .keys({
            currencyKey: Joi.string(),
            totalAmount: Joi.number(),
            denominations: Joi.array().items(
              Joi.object()
                .keys({
                  denominationId: Joi.string(),
                  quantity: Joi.number(),
                })
              ),
          })
        ).required(),
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
