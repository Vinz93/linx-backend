import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Message:
 *     type: object
 *     properties:
 *       value:
 *         type: string
 *       type:
 *         type: string
 *       chat:
 *         type: string
 *     required:
 *       - value
 *       - type
 *       - chat
 *   ReqMessage:
 *     allOf:
 *      - $ref: '#/definitions/Message'
 *     properties:
 *       id:
 *         type: string
 */
const MessageSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'location'],
  },
  chat: {
    type: mongoose.Schema.ObjectId,
    ref: 'ExchangeMatch',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

MessageSchema.plugin(fieldRemover);
MessageSchema.plugin(paginate);

export default mongoose.model('Message', MessageSchema);
