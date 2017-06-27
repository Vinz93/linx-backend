import path from 'path';

export const dbConfig = {
  db: 'mongodb://localhost/linx',
};

export const appConfig = {
  env: 'development',
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
