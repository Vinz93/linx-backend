import httpStatus from 'http-status';

import Exchange from '../models/exchange';
import ExchangeMatch from '../models/exchange_match';
import config from '../config/env';
import { APIError } from '../helpers/errors';
import { contact } from '../services/push_notification';
import { getIdsExchangesMatchParticipationByExchangeId } from '../services/exchange_match';

const debug = require('debug')('linx:exchange');

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
    const requested = await Exchange.findById(req.body.requested).populate('user');
    const { user: requesterUser } = requester;
    const { user: requestedUser } = requested;
    const selectedCurrencies = req.body.selectedCurrencies;
    delete selectedCurrencies.compiled;
    const { deviceType: deviceTypeRequested, deviceToken: deviceTokenRequested } = requestedUser;
    if (requester && requested) {
      const message = `${requesterUser.firstName} ${requesterUser.lastName} has invited you to exchange, please touch to connect`;
      const newMatch = await ExchangeMatch.create(req.body);
      const pushed = await contact({ selectedCurrencies, requester }, deviceTokenRequested, deviceTypeRequested, message, 'contact');
      if (pushed && pushed.failed.length > 0) {
        debug(`[ERROR] push notifiaction: ${JSON.stringify(pushed.failed)}`);
        return res.status(httpStatus.OK).json({ newMatch, sent: false });
      }
      return res.status(httpStatus.OK).json({ newMatch, sent: true });
    }
    throw new APIError('exchange match', httpStatus.NOT_FOUND);
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
    if (!exchangeRequester || !exchangeRequested) {
      throw new APIError('exchange not found', httpStatus.NOT_FOUND);
    }
    const { deviceToken: deviceTokenRequester, deviceType: deviceTypeRequester } = exchangeRequester.user;
    const { user: requested, haveCurrencies: haveCurrenciesRequested } = exchangeRequested;
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
    const { id: userId, firstName, lastName, socialNetworks, pictureUrl } = requested;
    const message = `${firstName} ${lastName} has accepted your request`;
    const pushData = {
      exchangeMatch: {
        id: exchangeMatch.id,
      },
      request: {
        user: {
          id: userId,
          firstName,
          lastName,
          socialNetworks,
          pictureUrl,
        },
        haveCurrencies: haveCurrenciesRequested,
      },
    };
    const pushed = await contact(pushData, deviceTokenRequester, deviceTypeRequester, message, 'accept');
    if (pushed && pushed.sent) {
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
  *       - name: Authorization
  *         description: auth token.
  *         in: header
  *         required: true
  *         type: string
  *       - name: id
  *         description: exchange id.
  *         in: path
  *         required: true
  *         type: string
  *       - name: sort
  *         description: 'parameter for system default is ascending for example: saving'
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: An a array of users exchanges
  */

  async findByDistance(req, res) {
    const { sort } = req.query;
    const exchange = await Exchange.findOne({ _id: req.params.id, user: req.user.id });
    if (!exchange) throw new APIError('exchange not found', httpStatus.NOT_FOUND);
    const haveCurrencies = exchange.haveCurrencies.map(e => e.currencyKey);
    const contactIds = await getIdsExchangesMatchParticipationByExchangeId(exchange.id);
    const sorts = {};
    if (sort === 'saving') {
      sorts['haveCurrencies.currencyRates.value'] = 1;
    }
    const matches = await Exchange.find({
      _id: {
        $nin: contactIds,
      },
      user: { $ne: req.user.id },
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
      .sort(sorts)
      .populate('user');
    res.status(httpStatus.OK).json(matches);
  },

  /**
  * @swagger
  * /exchanges/{id}/find-by-terminal:
  *   get:
  *     tags:
  *      - Exchange
  *     description: Find users who wants to change money near you
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: Authorization
  *         description: auth token.
  *         in: header
  *         required: true
  *         type: string
  *       - name: id
  *         description: exchange id.
  *         in: path
  *         required: true
  *         type: string
  *       - name: zoneId
  *         description: zone id.
  *         in: query
  *         required: true
  *         type: string
  *       - name: terminalName
  *         description: termanal name.
  *         in: query
  *         required: true
  *         type: string
  *       - name: sort
  *         description: 'parameter for system default is ascending for example: saving'
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: An a array of users exchanges
  */

  async findByTerminal(req, res) {
    const { sort } = req.query;
    const exchange = await Exchange.findOne({ _id: req.params.id, user: req.user.id });
    if (!exchange) throw new APIError('exchange not found', httpStatus.NOT_FOUND);
    const haveCurrencies = exchange.haveCurrencies.map(e => e.currencyKey);
    const contactIds = await getIdsExchangesMatchParticipationByExchangeId(exchange.id);
    const { zoneId, terminalName } = req.query;
    const sorts = {};
    if (sort === 'saving') {
      sorts['haveCurrencies.currencyRates.value'] = 1;
    }
    const matches = await Exchange.find({
      _id: {
        $nin: contactIds,
      },
      user: { $ne: req.user.id },
      isActive: true,
      zoneId,
      terminal: terminalName,
      'haveCurrencies.currencyKey': {
        $in: exchange.wantCurrencies,
      },
      wantCurrencies: {
        $in: haveCurrencies,
      },
    })
      .sort(sorts)
      .populate('user');
    res.status(httpStatus.OK).json(matches);
  },

};

export default ExchangeController;
