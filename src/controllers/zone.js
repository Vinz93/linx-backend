import httpStatus from 'http-status';

import { paginate } from '../helpers/utils';
import { APIError } from '../helpers/errors';
import Zone from '../models/Zone';

const ZoneController = {
  /**
   * @swagger
   * /zones:
   *   get:
   *     tags:
   *      - Zone
   *     description: Show all zones
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
   *         description: return an array of zones'
   */

  async readAll(req, res) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || {
      createdAt: 1,
    };

    const zones = await Zone.paginate(find, {
      sort,
      offset,
      limit,
    });
    res.json(zones);
  },

  /**
   * @swagger
   * /zones/{id}:
   *   get:
   *     tags:
   *      - Zone
   *     description: Show a zone by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Zone id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: return a zone'
   */

  async read(req, res) {
    const zone = await Zone.findById(req.params.id);
    if (!zone) throw new APIError('zone not found', httpStatus.NOT_FOUND);
    res.json(zone);
  },

  /**
   * @swagger
   * /zones:
   *   post:
   *     tags:
   *      - Zone
   *     description: Create zones
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: zone
   *         description: Zone object.
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Zone'
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/Zone'
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
    const newZone = await Zone.create(req.body);
    return res.status(httpStatus.CREATED).json(newZone);
  },

  /**
   * @swagger
   * /zones/{id}:
   *   delete:
   *     tags:
   *      - Zone
   *     description: delete zone
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Zone id.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  async delete(req, res) {
    const zone = await Zone.findById(req.params.id);
    if (!zone) throw new APIError('zone not found', httpStatus.NOT_FOUND);
    await zone.remove();
    res.status(httpStatus.NO_CONTENT).end();
  },

  /**
   * @swagger
   * /zones/{id}:
   *   patch:
   *     tags:
   *      - Zone
   *     description: update zone
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: Zone id.
   *         in: path
   *         required: true
   *         type: string
   *       - name: zone
   *         description: Zone object.
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Zone'
   *     responses:
   *       204:
   *         description: Successfully updated
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/Zone'
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
  async update(req, res) {
    const zone = await Zone.findById(req.params.id);
    if (!zone) throw new APIError('zone not found', httpStatus.NOT_FOUND);
    zone.set(req.body);
    await zone.save();
    res.status(httpStatus.NO_CONTENT).end();
  },
};

export default ZoneController;
