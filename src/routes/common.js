import express from 'express';
import validate from 'express-validation';
import passport from 'passport';

import passportService from '../services/passport';
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const linkedinOAuth = passport.authenticate('linkedin');

import User from '../controllers/user';
import userValidator from '../services/param_validations/user';
import { catchErrors } from '../helpers/errors';
const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/users')
  .get(validate(userValidator.readAll), catchErrors(User.readAll))
  .post(validate(userValidator.create), catchErrors(User.create));

router.route('/users/:id')
  .patch(validate(userValidator.update), catchErrors(User.update));

router.route('/users/signin')
  .post(validate(userValidator.signin), requireSignin, User.signin);

router.route('/users/me')
.get(requireAuth, User.readByMe);

router.route('/auth/linkedin')
  .get(linkedinOAuth);

router.route('/auth/linkedin/callback')
  .get(linkedinOAuth, User.linkedin);


export default router;
