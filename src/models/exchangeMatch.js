import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   ExchangeMatch:
 *     type: object
 *     properties:
 *       requester:
 *         type: string
 *       requested:
 *         type: string
 *       metAt:
 *         type: string
 *     required:
 *       - requester
 *       - requested
 */
const ExchangeMatchSchema = new Schema({
  requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'Exchange',
    required: true,
  },
  requested: {
    type: mongoose.Schema.ObjectId,
    ref: 'Exchange',
    required: true,
  },
  metAt: {
    type: mongoose.Schema.ObjectId,
    ref: 'SavePlace',
    required: true,
  },

}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ExchangeMatchSchema.plugin(paginate);
ExchangeMatchSchema.plugin(fieldRemover, '__v');

export default mongoose.model('ExchangeMatch', ExchangeMatchSchema);
