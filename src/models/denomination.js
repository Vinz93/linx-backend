import mongoose from 'mongoose';
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
  },
  value: Number,
  pictureName: String,
  quantity: Number,
},
  {
    timestamps: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  });


DenominationSchema.virtual('pictureUrl').get(function () {
  if (!this.pictureName) {
    return undefined;
  }
  const repository = 'https://s3.amazonaws.com/linx-currencies';
  return `${repository}/${this.pictureName}`;
});

DenominationSchema.plugin(fieldRemover, 'pictureName');

export default DenominationSchema;
