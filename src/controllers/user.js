import httpStatus from 'http-status';

import { paginate } from '../helpers/utils';
// import { APIError } from '../helpers/errors';
import { createJwt } from '../services/jwt';
import User from '../models/user';

const UserController = {
  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *      - User
   *     description: Show all users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: limit
   *         description: pagination limit.
   *         in: query
   *         required: false
   *         type: string
   *       - name: offset
   *         description: pagination offset.
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: return an array of users'
   */

  async readAll(req, res) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || {
      createdAt: 1,
    };

    const users = await User.paginate(find, {
      sort,
      offset,
      limit,
    });
    res.json(users);
  },

  /**
   * @swagger
   * /users:
   *   post:
   *     tags:
   *      - User
   *     description: Create users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: user
   *         description: User object.
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/User'
   *              - properties:
   *                  id:
   *                    type: string
   *                  createdAt:
   *                    type: string
   *                    format: date-time
   *                  updatedAt:
   *                    type: string
   *                    format: date-time
   */
  async create(req, res) {
    const newUser = await User.create(req.body);
    res.json({ jwt: createJwt(newUser), profile: newUser });
  },

  /**
   * @swagger
   * /users:
   *   patch:
   *     tags:
   *      - User
   *     description: updates an user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT <your-token>'.
   *         in: header
   *         required: true
   *         type: string
   *       - name: user
   *         description: User object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: User object'
   */

  async update(req, res) {
    const user = req.user;
    user.set(req.body);
    const updatedUser = await user.save();
    res.status(httpStatus.OK).json(updatedUser);
  },

  /**
   * @swagger
   * /users:
   *   delete:
   *     tags:
   *      - User
   *     description: delete the current user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT <your-token>'.
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Ok'
   */

  async delete(req, res) {
    await req.user.remove();
    res.status(httpStatus.NO_CONTENT).end();
  },

  /**
   * @swagger
   * /users/signin:
   *   post:
   *     tags:
   *      - User
   *     description: Login to the application
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: User's email.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: returns user token'
   */

  signin(req, res) {
    res.json({ jwt: createJwt(req.user), profile: req.user });
  },

  /**
   * @swagger
   * /users/signout:
   *   post:
   *     tags:
   *      - User
   *     description: signout the current user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT <your-token>'.
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: no content'
   */

  async signout(req, res) {
    const { user } = req;
    user.deviceToken = null;
    await user.save();
    res.status(httpStatus.NO_CONTENT).end();
  },

  /**
   * @swagger
   * /users/me:
   *   get:
   *     tags:
   *      - User
   *     description: user info
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT <your-token>'.
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: user information'
   */

  readByMe(req, res) {
    return res.json(req.user);
  },

  /**
   * @swagger
   * /auth/linkedin:
   *   get:
   *     tags:
   *      - User
   *     description: signin linkedin
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: user information'
   */

  linkedin(req, res) {
    res.json({ jwt: createJwt(req.user), profile: req.user });
  },

};

export default UserController;
