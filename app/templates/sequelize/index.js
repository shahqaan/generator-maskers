'use strict';
var Sequelize = require('sequelize');
var databaseConfig = require('../../config/database.js');
var fs = require('fs');
var path = require('path');
var app = require('../index');


if (!databaseConfig[app.settings.env]) {
  throw new Error('Database configuration object for missing for environment ' + app.settings.env);
}

var db = {};
var sequelize = new Sequelize(databaseConfig[app.settings.env]);

sequelize
  .authenticate()
  .then(function () {
    global.log.info('Database connection has been established successfully.')
  })
  .done();

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    model.name = model.name.charAt(0).toUpperCase() + model.name.slice(1).replace(/_(.)/g, function(match, char) {
        return char.toUpperCase();
      });
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
