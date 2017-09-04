import httpStatus from 'http-status';
import { APIError } from '../helpers/errors';

import ExchangeMatch from '../models/exchange_match';


const exchangeMatchController = {

/**
* @swagger
* /exchange-match:
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
*         description: The information of requester (User ID), requested (User ID) and place where they are going to meet (placeID)
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
* /exchange-match/arrived-place:
*   patch:
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
      if (exchangeUser.requester && exchangeUser.requester.equals(req.user.id)) {
        exchangeUser.requesterAtPlace = true;
      } else {
        if (exchangeUser.requested && exchangeUser.requested.equals(req.user.id)) {
          exchangeUser.requestedAtPlace = true;
        }
      }
    } else { // we need to return always the meetat field because its required, and
      // when we use populate and the condition fails this field returns in null state, so we access the model again
      const { meetAt } = await ExchangeMatch.findOne({
        $or: [
        { requester: req.user.id },
        { requested: req.user.id },
        ] });
      exchangeUser.meetAt = meetAt;
    }
    await exchangeUser.save();
    console.info(exchangeUser);
    res.status(httpStatus.CREATED).json(exchangeUser);
  },

/**
* @swagger
* /exchange-match/invites/{id}:
*   get:
*     tags:
*      - ExchangeMatch
*     description: find all the invites received to exchange
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: exchange id of user
*         in: path
*         required: true
*         type: string
*       - name: Authorization
*         description: auth token.
*         in: header
*         required: true
*         type: string
*     responses:
*       200:
*         description: Successfully
*/

  async invites(req, res) {
    const exchange = await ExchangeMatch.find({ requested: req.path.id, status: "invited" });
    if (!exchange) throw new APIError('exchange Match not found', httpStatus.NOT_FOUND);
    res.status(httpStatus.OK).json(exchange);
  },

/**
* @swagger
* /exchange-match/{id}:
*   get:
*     tags:
*      - ExchangeMatch
*     description: find  exchange match by id
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: exchange match id.
*         in: path
*         required: true
*         type: string
*       - name: Authorization
*         description: auth token.
*         in: header
*         required: true
*         type: string
*     responses:
*       200:
*         description: Successfully
*/

  async find(req, res) {
    const exchange = await ExchangeMatch.findById(req.params.id);
    if (!exchange) throw new APIError('exchange match not found', httpStatus.NOT_FOUND);
    res.status(httpStatus.OK).json(exchange);
  },
};

export default exchangeMatchController;
