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
 *      currencyKey:
 *        type: string
 *     required:
 *       - currencyKey
 */
const DenominationSchema = new Schema({
  coinType: String,
  value: Number,
  currencyKey: String,
  name: String,
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

DenominationSchema.plugin(paginate);
DenominationSchema.plugin(fieldRemover, '__v');

export default mongoose.model('Denomination', DenominationSchema);
