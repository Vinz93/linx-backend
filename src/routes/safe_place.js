import express from 'express';
import validate from 'express-validation';
import passport from 'passport';

import '../services/passport';
const requireAuth = passport.authenticate('jwt', { session: true });
import { catchErrors } from '../helpers/errors';


import safePlaceValidator from '../services/param_validations/safe_place';
import SafePlace from '../controllers/safe_place';

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/safe-place')
.post(requireAuth, catchErrors(SafePlace.create))
.get(validate(safePlaceValidator), requireAuth, catchErrors(SafePlace.find));


export default router;
