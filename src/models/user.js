import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';

import { average } from '../helpers/utils';
import config from '../config/env';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   atAirport:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       terminals:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Terminals'
 *       isAt:
 *         type: boolean
 *   listofUsers:
 *     type: array
 *     items:
 *       $ref: '#/definitions/User'
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
 *      private:
 *        type: boolean
 *      period:
 *        $ref: '#/definitions/Period'
 *   Language:
 *     type: object
 *     properties:
 *      name:
 *        type: string
 *      level:
 *        type: integer
 *      private:
 *        type: boolean
 *   SocialNetwork:
 *     type: object
 *     properties:
 *      name:
 *        type: string
 *      idToken:
 *        type: string
 *      profilePicture:
 *        type: string
 *   Study:
 *     type: object
 *     properties:
 *      institution:
 *        type: string
 *      degree:
 *        type: string
 *      private:
 *        type: boolean
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
 *   PrivateFields:
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
 *       pictureId:
 *         type: string
 *       password:
 *         type: string
 *       deviceToken:
 *         type: string
 *       headline:
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
 *       privateFields:
 *         $ref: '#/definitions/PrivateFields'
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
    lowercase: true,
  },
  bornAt: {
    type: Date,
  },
  pictureId: {
    type: String,
  },
  pictureUrl: {
    type: String,
  },
  password: {
    type: String,
  },
  deviceToken: {
    type: String,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!',
    }],
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
      private: {
        type: Boolean,
        default: false,
      },
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
      private: {
        type: Boolean,
        default: false,
      },
      period: {
        start: Date,
        finish: Date,
      },
    },
  ],
  languages: [
    {
      name: String,
      private: {
        type: Boolean,
        default: false,
      },
      level: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
  socialNetworks: [
    {
      id: String,
      name: String,
      token: String,
      profilePicture: String,
      contacts: [String],
    },
  ],
  privateFields: [
    {
      type: String,
      enum: ['lastName', 'email', 'bornAt'],
    },
  ],
  headline: {
    type: String,
  },
  roleKey: {
    type: String,
    default: 'da907sdc-999-ghtyty',
  },

}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      delete ret.deviceToken;
      delete ret.roleKey;
      ret.social = ret.socialNetworks.map(sn => ({
        name: sn.name,
        profilePicture: sn.profilePicture,
      }));
      delete ret.socialNetworks;
      return ret;
    },
  },
});

UserSchema.index({ location: '2dsphere' });

UserSchema.virtual('age').get(function () {
  const today = new Date();
  const bornAt = this.bornAt;
  let age = 0;
  if (bornAt) {
    const m = today.getMonth() - bornAt.getMonth();
    age = today.getFullYear() - bornAt.getFullYear();
    if (m < 0 || (m === 0 && today.getDate() < bornAt.getDate())) age--;
  }

  return age;
});

/* add rates avg as virtual or static (aggregate)*/

UserSchema.methods = {
  authenticate(password) {
    return crypto.createHash('md5').update(password).digest('hex') === this.password;
  },

  getRole() {
    const { roles } = config;
    return roles[this.roleKey];
  },

  useSocialNetwork(name) {
    const sn = this.socialNetworks.some(sn => sn.name === name);
    return sn;
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


UserSchema.plugin(uniqueValidator);
UserSchema.plugin(paginate);

export default mongoose.model('User', UserSchema);
