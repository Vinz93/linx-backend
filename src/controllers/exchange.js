import httpStatus from 'http-status';

import Exchange from '../models/exchange';
import ExchangeMatch from '../models/exchange_match';
import config from '../config/env';
import { APIError } from '../helpers/errors';
import { contact } from '../services/push_notification';

const { distances } = config.constants;


const ExchangeController = {
  /**
  * @swagger
  * /exchanges:
  *   post:
  *     tags:
  *      - Exchange
  *     description: This endpoint put you in a currency search
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: Authorization
  *         description: auth token format= JWT your-token.
  *         in: header
  *         required: true
  *         type: string
  *       - name: exchange
  *         description: Examples currencyKey= CAD, coinType= coin or bill, currencyRateKey=CADUSD, user is not necessary
  *         in: body
  *         required: true
  *         schema:
  *           $ref: '#/definitions/Exchange'
  *     responses:
  *       200:
  *         description: Successfully created Exchange
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/Exchange'
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
    const newExchange = await Exchange.create({ user: req.user.id, ...req.body });
    return res.status(httpStatus.CREATED).json(newExchange);
  },

  /**
  * @swagger
  * /exchanges/{id}:
  *   delete:
  *     tags:
  *      - Exchange
  *     description: delete exchange
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: id
  *         description: exchange id.
  *         in: path
  *         required: true
  *         type: string
  *       - name: Authorization
  *         description: auth token.
  *         in: header
  *         required: true
  *         type: string
  *     responses:
  *       204:
  *         description: Successfully deleted
  */

  async delete(req, res) {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) throw new APIError('exchange not found', httpStatus.NOT_FOUND);
    await exchange.remove();
    res.status(httpStatus.NO_CONTENT).end();
  },
  /**
  * @swagger
  * /exchanges/{id}:
  *   get:
  *     tags:
  *      - Exchange
  *     description: find  exchange by id
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: id
  *         description: exchange id.
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
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) throw new APIError('exchange not found', httpStatus.NOT_FOUND);
    res.status(httpStatus.OK).json(exchange);
  },

  /**
   * @swagger
   * /exchanges/contact:
   *   post:
   *     tags:
   *      - Exchange
   *     description: Sends Push notification to a exchanger to invite him to exchange
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT <your-token>'.
   *         in: header
   *         required: true
   *         type: string
   *       - name: connectExchange
   *         description: selected currencies, requester exchangeID and requested exchangeID
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/ExchangeConnect'
   *     responses:
   *       200:
   *         description: Exchanger object'
   */

  async contact(req, res) {
    const requester = await Exchange.findById(req.body.requester).populate('user');
    const { user: requested } = await Exchange.findById(req.body.requested).populate('user');
    const selectedCurrencies = req.body.selectedCurrencies;
    const { deviceType, deviceToken } = requested;
    if (requester && requested) {
      const message = `${requester.user.firstName} ${requester.user.lastName} has invited you to exchange, please touch to connect`;
      delete selectedCurrencies.compiled;
      const pushed = await contact({ selectedCurrencies, requester }, deviceToken, deviceType, message, 'contact');
      const newMatch = await ExchangeMatch.create(req.body);
      if (pushed && pushed.failed.length > 0) res.status(httpStatus.OK).json({ newMatch, sent: false });
      res.status(httpStatus.OK).json({ newMatch, sent: true });
    }
  },

  /**
   * @swagger
   * /exchanges/accept-contact:
   *   post:
   *     tags:
   *      - Exchange
   *     description: Accept Invitation to exchange money
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT <your-token>'.
   *         in: header
   *         required: true
   *         type: string
   *       - name: exchange match
   *         description: Exchange id of requester and requested
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             requester:
   *               type: string
   *             requested:
   *               type: string
   *     responses:
   *       200:
   *         description: Exchange Match object'
   */

  async acceptContact(req, res) {
    const { requester: exchangeRequesterId, requested: exchangeRequestedId } = req.body;

    const exchangeRequester = await Exchange.findById(exchangeRequesterId).populate('user');
    const exchangeRequested = await Exchange.findById(exchangeRequestedId).populate('user');

    const { deviceToken, deviceType } = exchangeRequester.user;
    const { user: requested } = exchangeRequested;
    const exchangeMatch = await ExchangeMatch.findOne({
      $and: [
        { requester: exchangeRequesterId },
        { requested: exchangeRequestedId },
      ],
    });
    if (!exchangeMatch) {
      throw new APIError('exchange match not found', httpStatus.NOT_FOUND);
    }
    exchangeMatch.status = "active";
    await exchangeMatch.save();
    const message = `${requested.firstName} ${requested.lastName} has accepted your request`;
    const pushed = await contact({ requested: exchangeRequested }, deviceToken, deviceType, message, 'accept');
    if (pushed.sent) {
      return res.json({ exchangeMatch, sent: true });
    }
    return res.json({ exchangeMatch, sent: false });
  },

  /**
   * @swagger
   * /exchanges/reject-contact:
   *   put:
   *     tags:
   *      - Exchange
   *     description: Reject Invitation to exchange money
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: format 'JWT <your-token>'.
   *         in: header
   *         required: true
   *         type: string
   *       - name: exchange match
   *         description: Exchange id of requester and requested
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             requester:
   *               type: string
   *             requested:
   *               type: string
   *     responses:
   *       200:
   *         description: Exchange Match object'
   */

  async rejectContact(req, res) {
    const exchangeMatch = await ExchangeMatch.findOne({
      $and: [
        { requester: req.body.requester },
        { requested: req.body.requested },
      ],
    });
    if (!exchangeMatch) {
      throw new APIError('exchange match not found', httpStatus.NOT_FOUND);
    }
    exchangeMatch.status = "rejected";
    await exchangeMatch.save();
    res.status(httpStatus.CREATED).json(exchangeMatch);
  },

  /**
  * @swagger
  * /exchanges/{id}/find-by-distance:
  *   get:
  *     tags:
  *      - Exchange
  *     description: Find users who wants to change money near you
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: id
  *         description: exchange id.
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
  *         description: An a array of users exchanges
  */

  async findByDistance(req, res) {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) throw new APIError('exchange not found', httpStatus.NOT_FOUND);
    const haveCurrencies = exchange.haveCurrencies.map(e => e.currencyKey);
    const matches = await Exchange.find({
      _id: {
        $ne: exchange.id,
      },
      isActive: true,
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: exchange.location.coordinates,
          },
          $maxDistance: distances.findExchanges,
        },
      },
      'haveCurrencies.currencyKey': {
        $in: exchange.wantCurrencies,
      },
      wantCurrencies: {
        $in: haveCurrencies,
      },
    })
      .populate('user');
    res.status(httpStatus.OK).json(matches);
  },

};

export default ExchangeController;
