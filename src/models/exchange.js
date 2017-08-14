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
 *      coinType:
 *        type: string
 *      value:
 *        type: number
 *      quantity:
 *        type: number
 *   haveCurrencies:
 *     type: object
 *     properties:
 *      currencyKey:
 *        type: string
 *      totalAmount:
 *        type: number
 *      denominations:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Denomination'
 *   Currencies:
 *     type: array
 *     items:
 *      $ref: '#/definitions/Currency'
 *   wantCurrencies:
 *     type: string
 *   Exchange:
 *     type: object
 *     properties:
 *       requester:
 *         type: string
 *       haveCurrencies:
 *         type: array
 *         items:
 *           $ref: '#/definitions/haveCurrencies'
 *       wantCurrencies:
 *          type: array
 *          items:
 *            $ref: '#/definitions/wantCurrencies'
 *     required:
 *       - requester
 *       - haveCurrencies
 */
const ExchangeSchema = new Schema({
  requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  haveCurrencies: [
    {
      currencyKey: String,
      totalAmount: Number,
      denominations: [
        {
          coinType: String,
          value: Number,
          quantity: Number,
        },
      ],
    },
  ],
  wantCurrencies: [String],
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ExchangeSchema.plugin(paginate);
ExchangeSchema.plugin(fieldRemover, '__v');

export default mongoose.model('Exchange', ExchangeSchema);
