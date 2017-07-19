import express from 'express';
import uuid from 'node-uuid';
import mime from 'mime';

import { upload, s3 } from '../helpers/utils';
import config from '../config/env';
import common from './common';

const { s3: s3Credentials } = config.aws;

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

/**
 * @swagger
 * /files:
 *   post:
 *     tags:
 *      - Files
 *     description: uploads files in the server
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pictureId
 *         description: old pictureId.
 *         in: query
 *         required: false
 *         type: string
 *       - name: file
 *         description: file to upload.
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Successfully uploaded
 *         schema:
*           properties:
*             url:
*               type: string
*/


router.post('/files', (req, res) => {
  upload()(req, res, err => {
    if (err) return res.status(400).send(err);
    if (!req.file) return res.status(400).end();
    const { file } = req;
    const params = {
      Bucket: s3Credentials.bucket,
      Key: `${uuid.v4()}.${mime.extension(file.mimetype)}`,
      Body: file.buffer,
    };
    const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
    s3.upload(params, options, (err, data) => {
      if (err) throw err;
      return res.json(data);
    });
  });
});

router.use(common);

export default router;
