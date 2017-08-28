import express from 'express';
import validate from 'express-validation';
import passport from 'passport';

import '../services/passport';
const requireAuth = passport.authenticate('jwt', { session: true });
const requireSignin = passport.authenticate('local', { session: false });
const linkedinOAuth = passport.authenticate('linkedin');
const facebookOAuth = passport.authenticate('facebook', { scope: 'email' });

import User from '../controllers/user';
import userValidator from '../services/param_validations/user';
import Exchange from '../controllers/exchange';
import exchangeValidator from '../services/param_validations/exchange';
import Zone from '../controllers/zone';
import SafePlace from '../controllers/safe_place';
import ExchangeMatch from '../controllers/exchange_match';
import zoneValidator from '../services/param_validations/zone';
import fileCtrl from '../controllers/file';
import Currency from '../controllers/currency';
import currencyValidator from '../services/param_validations/currency';
import ExchangeMatchValidator from '../services/param_validations/exchange_match';
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

router.route('/users/at-airport')
.get(requireAuth, User.atAirport);

router.route('/users/linkedin')
  .get(requireAuth, linkedinOAuth);

router.route('/auth/linkedin')
  .get(linkedinOAuth);

router.route('/auth/linkedin/callback')
  .get(linkedinOAuth, User.linkedin);

router.route('/auth/facebook')
  .get(facebookOAuth);

router.route('/exchanges')
  .post(validate(exchangeValidator.create), requireAuth, catchErrors(Exchange.create));

router.route('/exchanges/contact')
  .post(validate(exchangeValidator.connect), requireAuth, catchErrors(Exchange.connect));

router.route('/exchanges/acceptConnect')
  .post(validate(exchangeValidator.acceptConnect), requireAuth, catchErrors(Exchange.acceptConnect));

router.route('/exchanges/:id')
  .get(validate(exchangeValidator.find), requireAuth, catchErrors(Exchange.find))
  .delete(validate(exchangeValidator.delete), requireAuth, catchErrors(Exchange.delete));

router.route('/exchanges/:id/find-by-distance')
.get(validate(exchangeValidator.findByDistance), requireAuth, catchErrors(Exchange.findByDistance));

router.route('/exchangeMatch')
  .post(validate(ExchangeMatchValidator.create), requireAuth, catchErrors(ExchangeMatch.create));

router.route('/exchange-match/arrived-place')
  .patch(validate(ExchangeMatchValidator.arrivedPlace), requireAuth, catchErrors(ExchangeMatch.arrivedPlace));

router.route('/auth/facebook/callback')
  .get(facebookOAuth, User.facebook);

router.route('/zones')
  .get(validate(zoneValidator.readAll), requireAuth, onlyAdmin, catchErrors(Zone.readAll))
  .post(validate(zoneValidator.create), requireAuth, onlyAdmin, catchErrors(Zone.create));

router.route('/zones/:id')
  .get(validate(zoneValidator.read), requireAuth, onlyAdmin, catchErrors(Zone.read))
  .patch(validate(zoneValidator.update), requireAuth, onlyAdmin, catchErrors(Zone.update))
  .delete(validate(zoneValidator.delete), requireAuth, onlyAdmin, catchErrors(Zone.delete));

router.route('/currencies')
  .get(validate(currencyValidator.list), catchErrors(Currency.list))
  .post(validate(currencyValidator.create), catchErrors(Currency.create))
  .delete(validate(currencyValidator.delete), catchErrors(Currency.delete));

router.route('/currencies/rates')
  .get(validate(currencyValidator.rates), catchErrors(Currency.rates));

router.route('/currencies/:id')
  .get(validate(currencyValidator.read), catchErrors(Currency.getCurrency));

router.route('/currencies/:id/add-denomination')
  .post(validate(currencyValidator.addDenominations), catchErrors(Currency.addDenominations));

router.route('/currencies/:id/remove-denomination')
  .delete(validate(currencyValidator.removeDenomination), catchErrors(Currency.removeDenomination));

router.route('/safePlace')
  .post(catchErrors(SafePlace.create));

export default router;
