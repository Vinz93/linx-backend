import mongoose from 'mongoose';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Denomination:
 *     type: object
 *     properties:
 *       label:
 *          type: string
 *       symbol:
 *          type: string
 *       coinType:
 *          type: string
 *       value:
 *          type: number
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
 */
const DenominationSchema = new Schema({
  coinType: {
    type: String,
    enum: ['coin', 'bill'],
    set: (val) => val && val.trim(),
  },
  label: {
    type: String,
    set: (val) => val && val.trim(),
  },
  symbol: {
    type: String,
    set: (val) => val && val.trim(),
  },
  value: Number,
  pictureNames: [String],
  quantity: Number,
},
  {
    timestamps: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  });


DenominationSchema.virtual('picturesUrl').get(function () {
  if (!this.pictureNames || this.pictureNames.length === 0) {
    return undefined;
  }
  const repository = 'https://s3.amazonaws.com/linx-currencies';
  const results = this.pictureNames.map(picture => `${repository}/${picture}`);
  return results;
});

DenominationSchema.plugin(fieldRemover, 'pictureNames');

export default DenominationSchema;
