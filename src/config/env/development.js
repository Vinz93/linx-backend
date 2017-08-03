import path from 'path';

export const dbConfig = {
  db: 'mongodb://localhost:27017/linx',
  passportSecret: 'yo78boom90',
};

export const appConfig = {
  env: 'integration',
  host: process.env.HOST || 'http://127.0.0.1',
  path: '/v1',
  basePath: '/api',
  port: 3000,
  publicPort: 3000,
  root: path.join(__dirname, '../../../'),
};

export const mailer = {
  key: 'PjJCch7xJK75lDaJMqVcoQ',
  from: {
    name: 'linx',
    email: 'devtest@solsteace.ca',
  },
  developmentTeam: {
    name: 'development team',
    email: 'vbianco@solsteace.com',
  },
};

export const passport = {
  linkedin: {
    apiKey: '78adk076r633k1',
    secretKey: 'n5rsDNshjjhObhDs',
  },
  facebook: {
    apiKey: '280634502343234',
    secretKey: '9d24a6ab29ad710cd330a73ba9f928f8',
  },
};

export const aws = {
  s3: {
    accessKeyId: 'AKIAID4DP7RATH5M5PEQ',
    secretAccessKey: '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',
    region: 'us-east-1',
    bucket: 'linx-pictures',
  },
};

export const roles = {
  '8ha9hc98-777-oioiuo': 'ADMIN',
  'da907sdc-999-ghtyty': 'COMMON',
};
