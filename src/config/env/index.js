import * as development from './development';
import * as qa from './qa';
import * as integration from './integration';
// import production from './production';

const config = {
  development,
  integration,
  qa,
}[process.env.NODE_ENV || 'integration'];

export default config;
