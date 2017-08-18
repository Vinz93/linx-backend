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
 *   Terminals:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *   Zone:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       zoneType:
 *         type: string
 *       terminals:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Terminals'
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
  zoneType: {
    type: String,
  },
  terminals: [String],
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
