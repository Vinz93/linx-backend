import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import { APIError } from '../helpers/errors';
import config from '../config/env';

const { dbConfig } = config;

export const createJwt = user => (
  jwt.sign({
    id: user._id,
    iat: Date.now(),
  }, dbConfig.passportSecret)
);


export const verifyJwt = token => (
  new Promise((resolve, reject) => {
    jwt.verify(token, dbConfig.passportSecret, (err, decoded) => {
      if (err) {
        reject(new APIError('Invalid token.', httpStatus.UNAUTHORIZED));
      } else {
        resolve(decoded);
      }
    });
  })
);
