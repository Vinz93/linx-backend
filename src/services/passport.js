import passport from 'passport';
import LocalStrategy from 'passport-local';
import httpStatus from 'http-status';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LinkedInStrategy } from 'passport-linkedin';

import config from '../config/env';
import { APIError } from '../helpers/errors';
import User from '../models/user';
const { dbConfig, passport: credentials, appConfig } = config;

passport.serializeUser((user, done) => {
  console.log('🔊 serialize', user.id);
  done(null, user.id);
});
passport.deserializeUser(async (obj, done) => {
  console.log('🔊 Deserialize', obj);
  const user = User.find({ socialNetworks: { $elemMatch: { token: obj } } });
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
  consumerKey: credentials.linkedin.apiKey,
  consumerSecret: credentials.linkedin.secretKey,
  callbackURL: `${appConfig.host}:${appConfig.port}/auth/linkedin/callback`,
  profileFields: [
    'id',
    'first-name',
    'last-name',
    'email-address',
    'headline',
    'industry',
    'positions',
    'picture-url',
    'location',
    'num-connections',
    'summary',
    'specialties',
  ],
};


const linkedinLogin = new LinkedInStrategy(linkedinOptions, async (token, tokenSecret, profile, done) => {
  try {
    // const user = await User.findOrCreate({ linkedinId: profile.id });
    // const user = await User.find({ socialNetworks: { $elemMatch: { token: obj } } });
    const { _json: data } = profile;
    console.log('🐼  profile:  ', data);
    const user = await User.findOne({ email: data.emailAddress });
    if (!user) {
      // register (first Time)
      const experiences = data.positions.values.map(experience => ({
        company: experience.company.name,
        position: experience.title,
        period: {
          start: `${experience.startDate.month}-01-${experience.startDate.year}`,
        },
      }));
      User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.emailAddress,
        image: data.pictureUrl,
        deviceToken: 'giveme this just after login',
        verified: true,
        experiences,
        socialNetworks: [{
          name: 'linkedin',
          token: 'token',
        }],
      });
    }

    return done(null, profile);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(linkedinLogin);
