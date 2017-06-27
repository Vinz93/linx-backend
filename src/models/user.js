import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from 'mongoose-field-remover';
import crypto from 'crypto';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Period:
 *     type: object
 *     properties:
 *      start:
 *        type: string
 *        format: date-time
 *      finish:
 *        type: string
 *        format: date-time
 *   Location:
 *    type: object
 *    properties:
 *      coordinates:
 *        type: array
 *        items:
 *          type: number
 *          format: float
 *      lastUpdate:
 *        type: string
 *        format: date-time
 *   Account:
 *     type: object
 *     properties:
 *      number:
 *        type: integer
 *      type:
 *        type: string
 *   Experience:
 *     type: object
 *     properties:
 *      company:
 *        type: string
 *      position:
 *        type: string
 *      period:
 *        $ref: '#/definitions/Period'
 *   Language:
 *     type: object
 *     properties:
 *      name:
 *        type: string
 *      level:
 *        type: integer
 *   SocialNetwork:
 *     type: object
 *     properties:
 *      name:
 *        type: string
 *      idToken:
 *        type: string
 *   Study:
 *     type: object
 *     properties:
 *      institution:
 *        type: string
 *      degree:
 *        type: string
 *      period:
 *        $ref: '#/definitions/Period'
 *   Accounts:
 *     type: array
 *     items:
 *      $ref: '#/definitions/Account'
 *   Experiences:
 *     type: array
 *     items:
 *      $ref: '#/definitions/Experience'
 *   Education:
 *     type: array
 *     items:
 *      $ref: '#/definitions/Study'
 *   Languages:
 *     type: array
 *     items:
 *      $ref: '#/definitions/Language'
 *   SocialNetworks:
 *     type: array
 *     items:
 *      $ref: '#/definitions/SocialNetwork'
 *   PublicFields:
 *     type: array
 *     items:
 *       type: string
 *   BlockList:
 *     type: array
 *     items:
 *       type: string
 *   User:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       bornAt:
 *         type: string
 *         format: date-time
 *       image:
 *         type: string
 *       password:
 *         type: string
 *       deviceToken:
 *         type: string
 *       location:
 *         $ref: '#/definitions/Location'
 *       accounts:
 *         $ref: '#/definitions/Accounts'
 *       blockList:
 *         $ref: '#/definitions/BlockList'
 *       experiences:
 *         $ref: '#/definitions/Experiences'
 *       education:
 *         $ref: '#/definitions/Education'
 *       languages:
 *         $ref: '#/definitions/Languages'
 *       socialNetworks:
 *         $ref: '#/definitions/SocialNetworks'
 *       publicFields:
 *         $ref: '#/definitions/PublicFields'
 *     required:
 *       - firstName
 *       - lastName
 *       - email
 *       - password
 */

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: 'firstName is a required field',
  },
  lastName: {
    type: String,
    required: 'lastName is a required field',
  },
  email: {
    type: String,
    validate: validate({
      validator: 'isEmail',
      message: 'not a valid email',
    }),
    required: true,
    unique: 'the email is already taken',
    uniqueCaseInsensitive: true,
    sparse: true,
    trim: true,
  },
  bornAt: {
    type: Date,
    default: new Date(),
  },
  image: {
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  deviceToken: {
    type: String,
  },
  location: {
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    lastUpdate: Date,
  },
  accounts: [
    {
      number: Number,
      type: {
        type: String,
        enum: ['VISA', 'MASTERCARD', 'AMERICANEXPRESS'],
      },
    },
  ],
  blockList: [
    {
      type: String,
      ref: 'User',
    },
  ],
  experiences: [
    {
      company: String,
      position: String,
      period: {
        start: Date,
        finish: Date,
      },
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      period: {
        start: Date,
        finish: Date,
      },
    },
  ],
  languages: [
    {
      name: String,
      level: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
  socialNetworks: [
    {
      name: String,
      token: String,
    },
  ],
  publicFields: [
    {
      type: String,
    },
  ],

}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

UserSchema.virtual('age').get(function () {
  const today = new Date();
  const bornAt = this.bornAt;
  const m = today.getMonth() - bornAt.getMonth();
  let age = today.getFullYear() - bornAt.getFullYear();

  if (m < 0 || (m === 0 && today.getDate() < bornAt.getDate())) age--;

  return age;
});

UserSchema.methods = {
  authenticate(password) {
    return crypto.createHash('md5').update(password).digest('hex') === this.password;
  },
};

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = crypto.createHash('md5').update(this.password).digest('hex');
  }
  if (this.isModified('location')) {
    this.location.lastUpdate = Date.now();
  }
  next();
});

UserSchema.plugin(fieldRemover, 'password __v');
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(paginate);

export default mongoose.model('User', UserSchema);
