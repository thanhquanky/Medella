/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var crypto = require('crypto');
var Waterline = require('waterline');
var bcrypt = require('bcrypt');

var User = {

  schema: true,

  tableName: 'user',

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    address: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    email: {
      type: 'string',
      unique: true
    },
    role: {
      type: ''
    },

    password: {
      type: 'string',
      required: true
    }
  },

  toJSON: function () {
    // this gives you an object with the current values
    var obj = this.toObject();
    delete obj.password;
    delete obj.email;
    // return the new object without password
    return obj;
  },

  beforeCreate: function(user, cb) {
    if (!user.email) {
      return cb({err: ["Must have email!"]});
    }
    // An example encrypt function defined somewhere
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return cb(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        console.log(hash);
        cb(null, user);
      });
    });
  }
};

module.exports = User;
