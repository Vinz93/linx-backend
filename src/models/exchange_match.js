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
 *       meetAt:
 *         type: string
 *       requesterAtPlace:
 *         type: boolean
 *       requestedAtPlace:
 *         type: boolean
 *       status:
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
  meetAt: {
    type: mongoose.Schema.ObjectId,
    ref: 'SafePlace',
  },
  requesterAtPlace: {
    type: Boolean,
    default: false,
  },
  requestedAtPlace: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "invited",
  },
},
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  });

ExchangeMatchSchema.index({ requester: 1, requested: 1 }, { unique: true });

ExchangeMatchSchema.plugin(paginate);
ExchangeMatchSchema.plugin(fieldRemover, '__v');

export default mongoose.model('ExchangeMatch', ExchangeMatchSchema);
