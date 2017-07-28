import uuid from 'node-uuid';
import mime from 'mime';
import config from '../config/env';
import { upload, s3 } from '../helpers/utils';

const { s3: s3Credentials } = config.aws;

const fileController = {

  /**
   * @swagger
   * /users/upload-picture:
   *   post:
   *     tags:
   *      - User
   *     description: uploads user files on S3
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format='JWT your-token'.
   *         in: header
   *         required: true
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

  uploadS3(req, res, next) {
    upload()(req, res, err => {
      if (err) return res.status(400).send(err);
      if (!req.file) return res.status(400).end();
      const { file, user } = req;
      res.locals.oldPictureId = user.pictureId;
      const params = {
        Bucket: s3Credentials.bucket,
        Key: `${uuid.v4()}.${mime.extension(file.mimetype)}`,
        Body: file.buffer,
        ACL: 'public-read',
      };
      const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
      s3.upload(params, options, async (err, data) => {
        try {
          if (err) throw err;
          const { Location, key } = data;
          [user.pictureId, user.pictureUrl] = [key, Location];
          res.locals.updatedUser = await user.save();
          next();
        } catch (err) {
          return res.status(500).json({ err: err.message });
        }
      });
    });
  },

  deleteS3(req, res) {
    const { oldPictureId, updatedUser } = res.locals;
    if (!oldPictureId) return res.json(updatedUser);
    const params = {
      Bucket: s3Credentials.bucket,
      Key: `${oldPictureId}`,
    };
    s3.deleteObject(params, (err) => {
      if (err) throw err;
      res.json(updatedUser);
    });
  },

};

export default fileController;
