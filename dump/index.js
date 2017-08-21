import mongoose from 'mongoose';
import Promise from 'bluebird';

import config from '../src/config/env';
import Currency from '../src/models/currency';
import currenciesData from './currencies';

mongoose.Promise = Promise;

async function loadData() {
  try {
    console.log(`Running seeds 🌱🌱🌱`);
    await Currency.remove({});
    await Currency.create(currenciesData);
    mongoose.connection.close();
    console.log(`The process finished 🌻 🌻 🌻`);
    process.exit();
  } catch (err) {
    console.log(`❌`, err);
  }
}

function connect() {
  const options = {
    server: {
      socketOptions: {
        keepAlive: 1,
      },
    },
  };
  return mongoose.connect(config.dbConfig.db, options).connection;
}

connect()
.on('error', console.log)
.on('disconnected', connect)
.once('open', loadData);
