import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Geometry:
 *    type: object
 *    properties:
 *      coordinates:
 *        type: array
 *        items:
 *          type: number
 *          format: float
 *   Zone:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       type:
 *         type: string
 *       geometry:
 *         $ref: '#/definitions/Geometry'
 *     required:
 *       - name
 *       - geometry
 */
const ZoneSchema = new Schema({
  name: {
    type: String,
    required: 'Zone name is required',
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  type: {
    type: String,
  },
  terminals: {
    type: [String],
  },
  geometry: {
    type: {
      type: String,
      default: 'Polygon',
    },
    coordinates: [],
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ZoneSchema.index({ geometry: '2dsphere' });
ZoneSchema.plugin(fieldRemover, '__v');
ZoneSchema.plugin(paginate);

export default mongoose.model('Zone', ZoneSchema);
