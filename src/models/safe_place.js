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
 *   SafePlace:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       category:
 *         type: string
 *       phone:
 *         type: string
 *       relevance:
 *         type: integer
 *       location:
 *         $ref: '#/definitions/Location'
 *     required:
 *       - name
 *       - location
 */
const SafePlaceSchema = new Schema({
  name: {
    type: String,
    required: 'Place name is required',
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  category: {
    type: String,
  },
  phone: {
    type: String,
  },
  terminal: {
    type: String,
  },
  relevance: {
    type: Number,
    min: 1,
    max: 5,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [],
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

SafePlaceSchema.plugin(fieldRemover, '__v');
SafePlaceSchema.plugin(paginate);
SafePlaceSchema.index({ location: '2dsphere' });

export default mongoose.model('SafePlace', SafePlaceSchema);
