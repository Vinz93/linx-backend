import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;


/**
 * @swagger
 * definition:
 *   Denomination:
 *     type: object
 *     properties:
 *       coinType:
 *          type: string
 *       value:
 *          type: number
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
  currencyKey: String,
  name: String,
  denominations: [
    {
      coinType: String,
      value: Number,
    },
  ],
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

CurrencySchema.plugin(paginate);
CurrencySchema.plugin(fieldRemover, '__v');

export default mongoose.model('Currency', CurrencySchema);
