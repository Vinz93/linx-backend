import mongoose from 'mongoose';
import Promise from 'bluebird';
import inquirer from 'inquirer';

import config from '../src/config/env';
import Currency from '../src/models/currency';
import currenciesData from './currencies';
import User from '../src/models/user';
import usersData from './users';
import Exchange from '../src/models/exchange';
import exchangeData from './exchanges';

const prompt = inquirer.createPromptModule();

mongoose.Promise = Promise;

async function setup() {
  console.log(`Environment: ${config.appConfig.env}`);
  console.log(`Data bases: ${config.dbConfig.db}`);
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'The seeds erase the data from the database and load the test records, are you sure?',
    },
  ]);
  return answer;
}
async function loadData() {
  const answer = await setup();
  if (!answer.setup) {
    console.log('Nothing happened :)');
    process.exit(0);
  }
  try {
    console.log(`Running seeds 🌱🌱🌱`);
    await Currency.remove({});
    await Currency.create(currenciesData);
    await User.remove({});
    await User.create(usersData);
    await Exchange.remove({});
    await Exchange.create(exchangeData);
    mongoose.connection.close();
    console.log(`The process finished 🌻 🌻 🌻`);
    process.exit(0);
  } catch (err) {
    console.log(`❌`, err);
    process.exit(1);
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
