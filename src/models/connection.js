import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Flight:
 *    type: object
 *    properties:
 *      to:
 *        type: string
 *      number:
 *        type: string
 *   Connection:
 *     type: object
 *     properties:
 *       requester:
 *         type: string
 *       requested:
 *         type: string
 *       metAt:
 *         type: string
 *       accepted:
 *         type: boolean
 *       visibility:
 *         type: boolean
 *       lookingFor:
 *         type: string
 *       flight:
 *         $ref: '#/definitions/Flight'
 *     required:
 *       - requester
 *       - requested
 */
const ConnectionSchema = new Schema({
  requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  requested: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  metAt: {
    type: mongoose.Schema.ObjectId,
    ref: 'SavePlace',
  },
  accepted: {
    type: Boolean,
  },
  visibility: {
    type: Boolean,
  },
  lookingFor: {
    type: String,
  },
  flight: {
    to: String,
    number: String,
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ConnectionSchema.plugin(fieldRemover, '__v');
ConnectionSchema.plugin(paginate);

export default mongoose.model('Connection', ConnectionSchema);
