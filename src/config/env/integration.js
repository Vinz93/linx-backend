import path from 'path';

export const dbConfig = {
  db: 'mongodb://linx:solsteace11@aws-us-east-1-portal.5.dblayer.com:20919/linx-dev?ssl=true',
  passportSecret: 'yo78boom90',
};

export const appConfig = {
  env: 'integration',
  host: process.env.HOST || 'http://linx-dev.solsteace.ca',
  path: '/v1',
  basePath: '/api',
  port: 3000,
  publicPort: 80,
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

export const currency = {
  currencyLayer: {
    apiUrl: 'http://apilayer.net/api',
    accessKey: 'db711ea12fbe3e5f97f2a05ed470ad45',
  },
};
export const pushnotifications = {
  apiKeyGcm: '123456',
};

export const constants = {
  distances: {
    findExchanges: 40000,
  },
  times: {
    exchangeExpiration: 1,
  },
};
