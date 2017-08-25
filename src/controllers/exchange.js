import httpStatus from 'http-status';
import { APIError } from '../helpers/errors';

import Exchange from '../models/exchange';


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
*         description: Examples currencyKey= CAD, coinType= coin or bill, currencyRateKey=CADUSD, requester is not necessary
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
    const newExchange = await Exchange.create({ requester: req.user.id, ...req.body });
    return res.status(httpStatus.CREATED).json(newExchange);
  },

/**
* @swagger
* /exchange/{id}:
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

};

export default ExchangeController;
