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
    return res.json(newZone);
  },
};

export default ZoneController;
