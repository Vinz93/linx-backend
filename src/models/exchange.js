import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Denom:
 *     type: object
 *     properties:
 *      denominationId:
 *        type: string
 *      quantity:
 *        type: number
 *   Currency:
 *     type: object
 *     properties:
 *      currencyKey:
 *        type: string
 *      totalAmount:
 *        type: number
 *      denominations:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Denom'
 *   Currencies:
 *     type: array
 *     items:
 *      $ref: '#/definitions/Currency'
 *   Exchange:
 *     type: object
 *     properties:
 *       currencies:
 *         $ref: '#/definitions/Currencies'
 *     required:
 *       - currencies
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
          denominationId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Denomination',
            required: true,
          },
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
