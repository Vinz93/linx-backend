import httpStatus from 'http-status';
import axios from 'axios';

import config from '../config/env';
import { APIError } from '../helpers/errors';
const { apiUrl, accessKey } = config.currency.currencyLayer;

const CurrencyController = {
  /**
   * @swagger
   * /currencies/list:
   *   get:
   *     tags:
   *      - Currency
   *     description: Show all currencies
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: return an object of currencies'
   */

  async list(req, res) {
    const response = await axios.get(`${apiUrl}/list`, {
      params: {
        access_key: accessKey,
      },
    });
    if (!response.data.success) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Error getting currencies');
    }
    res.status(httpStatus.OK).json(response.data.currencies);
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
   *         description: the currency that you have ejm: 'USD'.
   *         in: query
   *         required: true
   *         type: string
   *       - name: currencies
   *         description: the currencies that you want ejm: 'CAD,VEF'.
   *         in: query
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: return an array of users'
   */

  async rates(req, res) {
    const { source = 'USD', currencies } = req.query;
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
    res.status(httpStatus.OK).json(response.data.currencies);
  },
};

export default CurrencyController;
