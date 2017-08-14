import httpStatus from 'http-status';
import axios from 'axios';

import config from '../config/env';
import { APIError } from '../helpers/errors';
import Currency from '../models/currency';

const { apiUrl, accessKey } = config.currency.currencyLayer;

const CurrencyController = {
  /**
   * @swagger
   * /currencies:
   *   get:
   *     tags:
   *      - Currency
   *     description: Show all currencies
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: predictive search on name and currencyKey (optional).
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: return an object of currencies'
   */

  async list(req, res) {
    const { search = '' } = req.query;
    const currencies = await Currency.find({ $or: [
      { $text: { $search: search } },
      { currencyKey: { $regex: search, $options: '$i' } },
      { name: { $regex: search, $options: '$i' } },
    ] })
    .select('currencyKey name');
    res.status(httpStatus.OK).json(currencies);
  },

    /**
   * @swagger
   * /currencies/{id}:
   *   get:
   *     tags:
   *      - Currency
   *     description: Show a currency information.
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: auth token, example JWT 'token'
   *         in: header
   *         required: true
   *         type: string
   *       - name: id
   *         description: Currency id Example api/v1/currency/USD
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: return an object of currency'
   */

  async getCurrency(req, res) {
    const currency = await Currency.findOne({ currencyKey: req.params.id });
    res.status(httpStatus.OK).json(currency);
  },

  /**
   * @swagger
   * /currencies/rates:
   *   get:
   *     tags:
   *      - Currency
   *     description: Returns the currencies rates based on a single source
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: source
   *         description: the currency that you have ejm= 'USD'.
   *         in: query
   *         required: true
   *         type: string
   *       - name: currencies
   *         description: the currencies that you want ejm= 'CAD,VEF'.
   *         in: query
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: return an array of users'
   */

  async rates(req, res) {
    const { source, currencies } = req.query;
    const response = await axios.get(`${apiUrl}/live`, {
      params: {
        access_key: accessKey,
        source,
        currencies,
      },
    });
    if (!response.data.success) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Error getting currencies');
    }
    res.status(httpStatus.OK).json(response.data.quotes);
  },

  /**
* @swagger
* /currencies:
*   post:
*     tags:
*      - Currency
*     description: Create Currency
*     produces:
*       - application/json
*     parameters:
*       - name: Authorization
*         description: auth token.
*         in: header
*         required: true
*         type: string
*       - name: currency
*         description: Currency object.
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Currency'
*     responses:
*       200:
*         description: Successfully created Currency
*         schema:
*           allOf:
*              - $ref: '#/definitions/Currency'
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
    const newCurrency = await Currency.create(req.body);
    return res.status(httpStatus.CREATED).json(newCurrency);
  },

/**
* @swagger
* /currencies/{id}:
*   delete:
*     tags:
*      - Currency
*     description: delete Currency
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: Currency id.
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
    const currency = await Currency.findById(req.params.id);
    if (!currency) throw new APIError('Currency not found', httpStatus.NOT_FOUND);
    await currency.remove();
    res.status(httpStatus.NO_CONTENT).end();
  },

};

export default CurrencyController;
