import httpStatus from 'http-status';
import { APIError } from '../helpers/errors';

export const onlyAdmin = (req, res, next) => {
  if (req.user.getRole() === 'ADMIN') {
    return next();
  }
  throw new APIError('zone not found', httpStatus.FORBIDDEN);
};
