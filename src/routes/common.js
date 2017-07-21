import express from 'express';
import validate from 'express-validation';
import passport from 'passport';

import '../services/passport';
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const linkedinOAuth = passport.authenticate('linkedin');
const facebookOAuth = passport.authenticate('facebook', { scope: 'email' });

import User from '../controllers/user';
import userValidator from '../services/param_validations/user';
import Zone from '../controllers/zone';
import zoneValidator from '../services/param_validations/zone';
import fileCtrl from '../controllers/file';
import { catchErrors } from '../helpers/errors';
import { onlyAdmin } from '../services/acl';
const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/users')
  .get(validate(userValidator.readAll), catchErrors(User.readAll))
  .post(validate(userValidator.create), catchErrors(User.create))
  .patch(validate(userValidator.update), requireAuth, catchErrors(User.update))
  .delete(validate(userValidator.delete), requireAuth, catchErrors(User.delete));

router.route('/users/signin')
  .post(validate(userValidator.signin), requireSignin, User.signin);

router.route('/users/signout')
  .post(validate(userValidator.signout), requireAuth, User.signout);

router.route('/users/forgot-password')
  .post(validate(userValidator.forgotPassword), User.forgotPassword);

router.route('/users/change-password')
  .patch(validate(userValidator.changePassword), requireAuth, User.changePassword);

router.post('/users/upload-picture', requireAuth, fileCtrl.uploadS3, fileCtrl.deleteS3);

router.route('/users/me')
.get(requireAuth, User.readByMe);

router.route('/auth/linkedin')
  .get(linkedinOAuth);

router.route('/auth/linkedin/callback')
  .get(linkedinOAuth, User.linkedin);

router.route('/auth/facebook')
  .get(facebookOAuth);

router.route('/auth/facebook/callback')
  .get(facebookOAuth, User.facebook);

router.route('/zones')
  .get(validate(zoneValidator.readAll), requireAuth, onlyAdmin, catchErrors(Zone.readAll))
  .post(validate(zoneValidator.create), requireAuth, onlyAdmin, catchErrors(Zone.create));

router.route('/zones/:id')
  .get(validate(zoneValidator.read), requireAuth, onlyAdmin, catchErrors(Zone.read))
  .patch(validate(zoneValidator.update), requireAuth, onlyAdmin, catchErrors(Zone.update))
  .delete(validate(zoneValidator.delete), requireAuth, onlyAdmin, catchErrors(Zone.delete));


export default router;
