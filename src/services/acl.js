import httpStatus from 'http-status';
import { APIError } from '../helpers/errors';

export const onlyAdmin = (req, res, next) => {
  if (req.user.getRole() === 'ADMIN') {
    return next();
  }
  throw new APIError('FORBIDDEN', httpStatus.FORBIDDEN);
};
