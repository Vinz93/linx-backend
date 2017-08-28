import httpStatus from 'http-status';
import { APIError } from '../helpers/errors';

import ExchangeMatch from '../models/exchangeMatch';
import SafePlace from '../models/safe_place';

const exchangeMatchController = {

/**
* @swagger
* /exchangeMatch:
*   post:
*     tags:
*      - ExchangeMatch
*     description: This endpoint creates a connection of exchange between two users.
*     produces:
*       - application/json
*     parameters:
*       - name: Authorization
*         description: auth token format= JWT your-token.
*         in: header
*         required: true
*         type: string
*       - name: exchangeMatch
*         description: The information of requester, requested and where they are going to meet
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/ExchangeMatch'
*     responses:
*       200:
*         description: Successfully created ExchangeMatch
*         schema:
*           allOf:
*              - $ref: '#/definitions/ExchangeMatch'
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
    const exchange = await ExchangeMatch.create(req.body);
    return res.status(httpStatus.CREATED).json(exchange);
  },
/**
* @swagger
* /exchangeMatch/arrivedPlace:
*   get:
*     tags:
*      - ExchangeMatch
*     description: Arrived to the meeting place
*     produces:
*       - application/json
*     parameters:
*       - name: latitude
*         description: must supply latitude
*         in: query
*         type: string
*         required: true
*       - name: longitude
*         description: must supply longitude
*         in: query
*         type: string
*         required: true
*       - name: Authorization
*         description: auth token.
*         in: header
*         required: true
*         type: string
*     responses:
*       204:
*         description: Arrived or not to Exchange Place
*/
  async arrivedPlace(req, res) {
    const coord = [req.query.longitude, req.query.latitude];
    const maxDistance = 100;
    const exchangeUser = await ExchangeMatch.findOne({
      $or: [
        { requester: req.user.id },
        { requested: req.user.id },
      ] })
      .populate('meetAt', null, {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coord,
            },
            $maxDistance: maxDistance,
          },
        },
      });
    if (exchangeUser.meetAt) {
      if (exchangeUser.requester.equals(req.user.id)) {
        exchangeUser.requesterAtPlace = true;
      } else {
        if (exchangeUser.requested.equals(req.user.id)) {
          exchangeUser.requestedAtPlace = true;
        }
      }
    } else {
      const { meetAt } = await ExchangeMatch.findOne({
        $or: [
        { requester: req.user.id },
        { requested: req.user.id },
        ] });
      exchangeUser.meetAt = meetAt;
    }
    await exchangeUser.save();
    console.info(exchangeUser);
    // await exchangeUser.set(req.body);
    res.status(httpStatus.CREATED).json(exchangeUser);
  },
};

export default exchangeMatchController;
