import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Location:
 *    type: object
 *    properties:
 *      coordinates:
 *        type: array
 *        items:
 *          type: number
 *          format: float
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
 *       location:
 *         $ref: '#/definitions/Location'
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
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!',
    }],
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  securityZone: Boolean,
  zoneId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Zone',
  },
  terminal: String,
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ExchangeSchema.plugin(paginate);
ExchangeSchema.plugin(fieldRemover, '__v');

export default mongoose.model('Exchange', ExchangeSchema);
