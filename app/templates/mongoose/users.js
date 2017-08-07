'use strict';

var mongoose = require('mongoose');

var UsersModel = function() {

  var usersSchema = mongoose.Schema({
    email: String
  }, {collection: 'Users'});

  usersSchema.statics.getUser = function(userId) {
    return this.findOne({_id: userId}).then(function(user) {
      return user;
    });
  };

  return mongoose.model('Users', usersSchema);
  
};

module.exports = new UsersModel();
