import httpStatus from 'http-status';
// import { APIError } from '../helpers/errors';
import SafePlace from '../models/safe_place';

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
};

export default SafePlaceController;
