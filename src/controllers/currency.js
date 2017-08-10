import httpStatus from 'http-status';
import axios from 'axios';
import { APIError } from '../helpers/errors';

const url = `http://apilayer.net/api/list`;
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
   *         description: return an array of currencies'
   */

  async list(req, res) {
    const response = await axios.get(url, {
      params: {
        access_key: `db711ea12fbe3e5f97f2a05ed470ad45`,
      },
    });
    if (!response.data.success) {
      throw new APIError(httpStatus.BAD_REQUEST, 'error getting currencies');
    }
    res.status(httpStatus.OK).json(response.data.currencies);
  },
};

export default CurrencyController;
