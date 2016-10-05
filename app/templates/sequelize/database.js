var log = require('../app/lib/logger').child({type: "database"});

module.exports = {
  "development": {
    "username": "user",
    "password": "mysecurepassword",
    "database": "<%= name %>",
    "host": "localhost",
    "dialect": "mysql",
    "logging": function (message) {
      log.debug(message);
    }
  },
  "test": {
    "username": "user",
    "password": "mysecurepassword",
    "database": "<%= name %>_test",
    "host": "localhost",
    "dialect": "mysql",
    "logging": function (message) {
      log.debug(message);
    }
  },
  "production": {
    "username": "user",
    "password": "mysecurepassword",
    "database": "<%= name %>",
    "host": "localhost",
    "dialect": "mysql",
    "logging": function (message) {
      log.debug(message);
    }
  }
};
