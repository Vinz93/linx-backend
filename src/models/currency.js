import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;


/**
 * @swagger
 * definition:
 *   updateDenomination:
 *     type: object
 *     properties:
 *      denomination:
 *        type: object
 *        properties:
 *          coinType:
 *            type: string
 *          value:
 *            type: number
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
  currencyKey: {
    type: String,
    uppercase: true,
    index: true,
    trim: true,
  },
  name: {
    type: String,
    index: true,
  },
  denominations: [
    {
      coinType: {
        type: String,
        enum: ['coin', 'bill'],
      },
      value: Number,
    },
  ],
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

CurrencySchema.index({
  name: 'text',
  currencyKey: 'text',
}, {
  name: 'search_name_text',
  currencyKey: 'search_currency_text',
});
CurrencySchema.index({ name: 1, currencyKey: 1 });
CurrencySchema.plugin(paginate);
CurrencySchema.plugin(fieldRemover, '__v');

export default mongoose.model('Currency', CurrencySchema);
