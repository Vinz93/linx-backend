import path from 'path';

export const dbConfig = {
  db: 'mongodb://linx:solsteace11@aws-us-east-1-portal.5.dblayer.com:20919/linx-qa?ssl=true',
};

export const appConfig = {
  env: 'qa',
  host: process.env.HOST || 'http://127.0.0.1',
  path: '/',
  basePath: '/',
  port: 3000,
  basePort: 3000,
  root: path.join(__dirname, '../../../'),
};

export const mailer = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'solsteace@solsteace.com',
    pass: 'vinotinto2016',
  },
};

export const passport = {
  linkedin: {
    apiKey: '78adk076r633k1',
    secretKey: 'n5rsDNshjjhObhDs',
  },
  facebook: {
    apiKey: '',
    secretKey: '',
  },
};

export const roles = {
  '8ha9hc98-777-oioiuo': 'ADMIN',
  'da907sdc-999-ghtyty': 'COMMON',
};
