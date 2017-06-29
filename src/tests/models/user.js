/* eslint-disable */
import chai from 'chai';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import User from '../../models/user';

mongoose.Promise = Promise;

let should = chai.should();

describe('User Model', () => {
  before(done => {
    const connection = mongoose.connect('mongodb://localhost:27017/linx-testing');
    User.remove({})
      .then(() => (
        User.create({
          email: 'unique@gmail.com',
          firstName: 'Test',
          lastName: 'test',
          password: 'Secret123.',
          deviceToken: 'ouiuoiuoiu.ij',
        })
      ))
      .then(() => done())
      .catch(err => console.log(err));
  });

  after(() => mongoose.connection.close());


  describe('fields and virtuals', () => {

    it('Email, password, lastName and firstName are required', done => {
      const user = new User({
        bornAt: Date.now(),
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('firstName');
        err.errors.should.have.property('lastName');
        err.errors.should.have.property('email');
        err.errors.should.have.property('password');
        err.errors.should.have.property('deviceToken');
        done();
      });
    });

    it('reject invalid email format', done => {
      const user = new User({
        email: 'test',
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('email');
        done();
      })
    });

    it('Accept a valid email format', done => {
      const user = new User({
        email: 'unique@should.com',
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.not.have.property('email');
        done();
      });
    });

    it('email field should be unique', done => {
      const user1 = new User({
        email: 'unique@gmail.com',
      });
      user.validate(err => {
        console.log(err.errors);
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('email');
        err.errors.email.should.have.property('kind');
        err.errors.email.kind.should.equal('unique');
        done();
      });
    });

    it('Virtual fields (age, location.lastUpdate, reputation.average)', done => {
      User.create({
        email: 'unique@gmail.com',
        firstName: 'Test',
        lastName: 'test',
        password: 'Secret123.',
        deviceToken: 'ouiuoiuoiu.ij',
      })
      .then(user => {
        user.should.have.property('age');
        user.location.should.have.property('lastUpdate');
        user.reputation.should.have.property('average');
        user.reputation.should.have.property('totalRates');
        done();
      })
    });

  });

});
