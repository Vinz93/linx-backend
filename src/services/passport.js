import passport from 'passport';
import LocalStrategy from 'passport-local';
import httpStatus from 'http-status';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LinkedInStrategy } from 'passport-linkedin';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import config from '../config/env';
import { APIError } from '../helpers/errors';
import User from '../models/user';
const { dbConfig, passport: credentials } = config;
const { host, publicPort, basePath, path } = config.appConfig;

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (obj, done) => {
  const user = await User.findById(obj);
  done(null, user);
});

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new APIError('user not found', httpStatus.NOT_FOUND);
    if (!user.authenticate(password)) {
      throw new APIError('wrong password', httpStatus.BAD_REQUEST);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: dbConfig.passportSecret,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

const linkedinOptions = {
  passReqToCallback: true,
  consumerKey: credentials.linkedin.apiKey,
  consumerSecret: credentials.linkedin.secretKey,
  callbackURL: `${host}:${publicPort}${basePath}${path}/auth/linkedin/callback`,
  profileFields: [
    'id',
    'first-name',
    'last-name',
    'email-address',
    'headline',
    'positions',
    'picture-url',
    'location',
  ],
};

function validateDateExperience(startDate) {
  if (startDate) {
    return `${startDate.month}-01-${startDate.year}`;
  }
  return null;
}

const linkedinLogin = new LinkedInStrategy(linkedinOptions, async (req, token, tokenSecret, profile, done) => {
  const { _json: data } = profile;
  try {
    const authorizedUserId = req.user ? req.user.id : undefined;
    const user = await User.findOne({
      $or: [
        { email: data.emailAddress },
        { _id: authorizedUserId },
        { 'socialNetworks.token': token },
      ],
    });
    let experiences = [];
    if (data.positions.values.length > 0) {
      experiences = data.positions.values.map(experience => ({
        company: experience.company.name,
        position: experience.title,
        period: {
          start: validateDateExperience(experience.startDate),
        },
      }));
    }
    if (!user) {
      /*  Register first time for the user */
      const newUser = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.emailAddress,
        headline: data.headline,
        experiences,
        location: {
          coordinates: [-79.390919, 43.723563],
        },
        socialNetworks: [{
          token,
          id: data.id,
          name: 'linkedin',
          profilePicture: data.pictureUrl,
        }],
      });
      return done(null, { isNew: true, ...newUser.toJSON() });
    } else if (user.useSocialNetwork('linkedin')) {
      /*  user exists and use linkedin */
      const linkedinIndex = user.socialNetworks.findIndex(sn => sn.name === 'linkedin');
      user.socialNetworks[linkedinIndex].profilePicture = data.pictureUrl;
      user.socialNetworks[linkedinIndex].token = token;
      await user.save();
      return done(null, user);
    }
    /*  user exists but is not on linkedin */
    user.socialNetworks.push({
      token,
      id: data.id,
      name: 'linkedin',
      profilePicture: data.pictureUrl,
    });
    const linkedinInfo = {
      headline: data.headline,
      experiences,
    };
    const userUpdated = await user.save();
    return done(null, { linkedinInfo, ...userUpdated.toJSON() });
  } catch (err) {
    return done(err, false);
  }
});

const facebookOptions = {
  clientID: credentials.facebook.apiKey,
  clientSecret: credentials.facebook.secretKey,
  callbackURL: `${host}:${publicPort}${basePath}${path}/auth/facebook/callback`,
  profileFields: [
    'id',
    'first_name',
    'last_name',
    'picture',
    'email',
  ],
};

const facebookLogin = new FacebookStrategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const { _json: data } = profile;
    if (!data.email) throw new APIError('you dont have an email asocciated to facebook', httpStatus.UNPROCESSABLE_ENTITY);
    const user = await User.findOne({ email: data.email });
    if (!user) {
      /*  Register first time for the user */
      const newUser = await User.create({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        location: {
          coordinates: [-79.390919, 43.723563],
        },
        socialNetworks: [{
          token: accessToken,
          id: data.id,
          name: 'facebook',
          profilePicture: data.picture.data.url,
        }],
      });
      return done(null, { isNew: true, ...newUser.toJSON() });
    } else if (user.useSocialNetwork('facebook')) {
      /*  user exists and use facebook */
      const facebookIndex = user.socialNetworks.findIndex(sn => sn.name === 'facebook');
      user.socialNetworks[facebookIndex].profilePicture = data.picture.data.url;
      user.socialNetworks[facebookIndex].token = accessToken;
      await user.save();
      return done(null, user);
    }
    /*  user exists but is not on facebook*/
    user.socialNetworks.push({
      token: accessToken,
      id: data.id,
      name: 'facebook',
      profilePicture: data.picture.data.url,
    });
    const userUpdated = await user.save();
    return done(null, userUpdated);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(linkedinLogin);
passport.use(facebookLogin);
