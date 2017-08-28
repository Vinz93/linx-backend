import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   ExchangeConnect:
 *     type: object
 *     properties:
 *       requester:
 *         type: string
 *       requested:
 *         type: string
 *       selectedCurrencies:
 *         type: array
 *         items:
 *           $ref: '#/definitions/wantCurrencies'
 *     items:
 *       type: string
 *   Denomination:
 *     type: object
 *     properties:
 *      coinType:
 *        type: string
 *      value:
 *        type: number
 *      quantity:
 *        type: number
 *   CurrencyRate:
 *     type: object
 *     properties:
 *      currencyRateKey:
 *        type: string
 *      value:
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
 *      currencyRates:
 *        type: array
 *        items:
 *          $ref: '#/definitions/CurrencyRate'
 *   Currencies:
 *     type: array
 *     items:
 *      $ref: '#/definitions/Currency'
 *   wantCurrencies:
 *     type: string
 *   Exchange:
 *     type: object
 *     properties:
 *       user:
 *         type: string
 *       haveCurrencies:
 *         type: array
 *         items:
 *           $ref: '#/definitions/haveCurrencies'
 *       wantCurrencies:
 *          type: array
 *          items:
 *            $ref: '#/definitions/wantCurrencies'
 *       terminal:
 *          type: string
 *       securityZone:
 *         type: boolean
 *       zoneId:
 *         type: string
 *     required:
 *       - haveCurrencies
 *       - wantCurrencies
 */
const ExchangeSchema = new Schema({
  user: {
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
      currencyRates: [
        {
          currencyRateKey: String,
          value: Number,
        },
      ],
    },
  ],
  wantCurrencies: [String],
  securityZone: Boolean,
  zoneId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Zone',
  },
  terminal: String,
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ExchangeSchema.plugin(paginate);
ExchangeSchema.plugin(fieldRemover, '__v');

export default mongoose.model('Exchange', ExchangeSchema);
