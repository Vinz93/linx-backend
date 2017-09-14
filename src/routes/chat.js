import express from 'express';
import validate from 'express-validation';
import passport from 'passport';

import { catchErrors } from '../helpers/errors';

import chatValidator from '../services/param_validations/chat';

import Chat from '../controllers/chat';

const requireAuth = passport.authenticate('jwt', { session: true });
const router = express.Router(); // eslint-disable-line new-cap

router.route('/chats/:id/message').get(validate(chatValidator.list), requireAuth, catchErrors(Chat.find));

export default router;
