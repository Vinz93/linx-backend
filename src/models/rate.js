import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Rate:
 *     type: object
 *     properties:
 *       from:
 *         type: string
 *       to:
 *         type: string
 *       value:
 *         type: integer
 *       commet:
 *         type: string
 *       connectionId:
 *         type: string
 *     required:
 *       - from
 *       - to
 *       - value
 *       - connectionId
 */
const RateSchema = new Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'from userId is required',
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'to userId is required',
  },
  value: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  commet: {
    type: String,
  },
  connectionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Connection',
    required: true,
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

RateSchema.plugin(fieldRemover, '__v');
RateSchema.plugin(paginate);

export default mongoose.model('Rate', RateSchema);
