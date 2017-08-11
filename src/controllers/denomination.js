import httpStatus from 'http-status';
import { APIError } from '../helpers/errors';

import Denomination from '../models/denomination';

const DenominationController = {
/**
* @swagger
* /denominations:
*   post:
*     tags:
*      - Denomination
*     description: Create Denomination
*     produces:
*       - application/json
*     parameters:
*       - name: Authorization
*         description: auth token.
*         in: header
*         required: true
*         type: string
*       - name: denomination
*         description: Denomination object.
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Denomination'
*     responses:
*       200:
*         description: Successfully created Denomination
*         schema:
*           allOf:
*              - $ref: '#/definitions/Denomination'
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
    //const { currencyKey } = req.body;
    const newDenomination = await Denomination.create(req.body);
    return res.status(httpStatus.CREATED).json(newDenomination);
  },

/**
* @swagger
* /denominations/{id}:
*   delete:
*     tags:
*      - Denomination
*     description: delete denomination
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: denomination id.
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
    const denomination = await Denomination.findById(req.params.id);
    if (!denomination) throw new APIError('denomination not found', httpStatus.NOT_FOUND);
    await denomination.remove();
    res.status(httpStatus.NO_CONTENT).end();
  },

};

export default DenominationController;

