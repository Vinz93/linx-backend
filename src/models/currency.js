import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

import Denomination from './denomination';

const Schema = mongoose.Schema;


/**
 * @swagger
 * definition:
 *   listofCurrencies:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Currency'
 *   Currency:
 *     type: object
 *     properties:
 *      currencyKey:
 *        type: string
 *      name:
 *        type: string
 *      denominations:
 *        type: array
 *        items:
 *         $ref: '#/definitions/Denomination'
 *     required:
 *       - currencyKey
 */
const CurrencySchema = new Schema({
  currencyKey: {
    type: String,
    uppercase: true,
    index: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    index: true,
  },
  denominations: [Denomination],
},
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  });

CurrencySchema.index({
  name: 'text',
  currencyKey: 'text',
});

CurrencySchema.plugin(paginate);
CurrencySchema.plugin(fieldRemover);

export default mongoose.model('Currency', CurrencySchema);
