import mongoose from 'mongoose';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Terminals:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 */
const TerminalSchema = new Schema({
  name: String,
  pictureName: String,
},
  {
    timestamps: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  });


TerminalSchema.virtual('picturesUrl').get(function () {
  if (!this.pictureName) {
    return undefined;
  }
  const repository = 'https://s3.ca-central-1.amazonaws.com/linx-zones';
  const result = `${repository}/${this.pictureName}`;
  return result;
});

TerminalSchema.plugin(fieldRemover, 'pictureName');

export default TerminalSchema;
