import httpStatus from 'http-status';
// import { APIError } from '../helpers/errors';
import config from '../config/env';
import SafePlace from '../models/safe_place';

const { distances } = config.constants;

const SafePlaceController = {
  /**
  * @swagger
  * /safe-place:
  *   post:
  *     tags:
  *      - SafePlace
  *     description: This endpoint creates a safe place to exchange money.
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: Authorization
  *         description: auth token format= JWT your-token.
  *         in: header
  *         required: true
  *         type: string
  *       - name: SafePlace
  *         description: The information of a safe place where people can meet
  *         in: body
  *         required: true
  *         schema:
  *           $ref: '#/definitions/SafePlace'
  *     responses:
  *       200:
  *         description: Successfully created SafePlace
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/SafePlace'
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
    const safeplace = await SafePlace.create(req.body);
    return res.status(httpStatus.CREATED).json(safeplace);
  },

  /**
  * @swagger
  * /safe-place:
  *   get:
  *     tags:
  *      - SafePlace
  *     description: This endpoint find a safe place to exchange money.
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: Authorization
  *         description: auth token format= JWT your-token.
  *         in: header
  *         required: true
  *         type: string
  *       - name: longitude
  *         description: User's latitude.
  *         in: query
  *         required: true
  *         type: string
  *       - name: latitude
  *         description: User's longitude.
  *         in: query
  *         required: true
  *         type: string
  *       - name: maxDistance
  *         description: Maximum radian search distance (miles).
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: list safe place
  *         schema:
  *          type: array
  *          items:
  *           $ref: '#/definitions/SafePlace'
  */
  async find(req, res) {
    const { longitude, latitude, maxDistance } = req.query;
    const safeplace = await SafePlace.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance || distances.findExchanges,
        },
      },
    });
    return res.json(safeplace);
  },

};

export default SafePlaceController;
