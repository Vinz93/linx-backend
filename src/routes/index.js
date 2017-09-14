import express from 'express';

import common from './common';
import chat from './chat';


const router = express.Router();  // eslint-disable-line new-cap

/**
 * @swagger
 * /time:
 *   get:
 *     tags:
 *       - Times
 *     description: Returns current time
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Current time
 *         schema:
 *           properties:
 *             time:
 *               type: string
 *               format: date-time
 */

router.get('/time', (req, res) => {
  const time = new Date();
  res.json({ time });
});

router.use(common);
router.use(chat);

export default router;
