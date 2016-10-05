/**
 * Created by shahqaan on 01/10/2016.
 */
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  constructor: function() {
    generators.Base.apply(this, arguments);
  },

  installingDependencies: function() {

    var productionInstall = [
      'lodash',
      'moment',
      'bunyan',
      'bluebird',
      'express',
      'kraken-js',
      'construx',
      'construx-copier',
      'eslint'
    ];

    var devInstall = [
      'nodemon',
      'mocha',
      'supertest',
      'nodemon'
    ];

    switch (this.answers.db) {
      case 'mongoose':
        productionInstall.push('mongoose');
        break;
      case 'sequelize':
        productionInstall.push('sequelize');
        devInstall.push('sequelize-cli');
        break;
      default:
        break;
    }

    if (this.answers.sockets) { productionInstall.push('socket.io'); }

    this.npmInstall(productionInstall, {save: true});

    this.npmInstall(devInstall, {saveDev: true});

  },

  _getAnswers: function() {
    return {
      name: this.appname,
      description: this.answers.description,
      db: this.answers.db,
      isSockets: this.answers.isSockets
    }
  },

  writing: {

    db: function() {


      this.fs.copyTpl(
        this.templatePath(this.answers.db + '/users.js'),
        this.destinationPath('app/models/users.js')
      );

      if (this.answers.db === 'sequelize') {

        this.fs.copyTpl(
          this.templatePath('sequelize/users.migrate.js'),
          this.destinationPath('app/db/migrate/' + (new Date().getTime() / 1000) + '-create-users.js')
        );

        this.fs.copyTpl(
          this.templatePath('sequelize/index.js'),
          this.destinationPath('app/models/index.js')
        );

        this.fs.copyTpl(
          this.templatePath('sequelize/database.js'),
          this.destinationPath('config/database.js'),
          this._getAnswers()
        );

        this.fs.copyTpl(
          this.templatePath('sequelize/database.js'),
          this.destinationPath('config/database.sample.js'),
          this._getAnswers()
        );

        this.fs.copyTpl(
          this.templatePath('sequelize/.sequelizerc'),
          this.destinationPath('.sequelize.rc')
        );

      } else if (this.answers.db === 'mongoose') {

        this.fs.copyTpl(
          this.templatePath('mongoose/mongo.json'),
          this.destinationPath('config/mongo.json'),
          this._getAnswers()
        );

        this.fs.copyTpl(
          this.templatePath('mongoose/mongo.json'),
          this.destinationPath('config/mongo.sample.json'),
          this._getAnswers()
        );

      }
    },

    files: function() {

      this.fs.copyTpl(
        this.templatePath('*'),
        this.destinationPath(),
        this._getAnswers()
      );

      this.fs.copyTpl(
        this.templatePath('.*'),
        this.destinationPath(),
        this._getAnswers()
      );

      this.fs.copyTpl(
        this.templatePath('config/*'),
        this.destinationPath('config/')
      );

      this.fs.copyTpl(
        this.templatePath('lib/*'),
        this.destinationPath('app/lib/'),
        this._getAnswers()
      );

      this.fs.copyTpl(
        this.templatePath('controllers/users.js'),
        this.destinationPath('app/controllers/api/v1/users.js'),
        this._getAnswers()
      );

    }

  },

  prompting: function() {
    return this.prompt([{
      type: 'input',
      name: 'appname',
      message: 'Your project name',
      default: this.appname
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe your app'
    }, {
      type: 'confirm',
      name: 'isSockets',
      message: 'Would you like to enable sockets?',
      store: true
    }, {
      type: 'list',
      name: 'db',
      message: 'Which ORM would you like?',
      choices: ['mongoose', 'sequelize']
    }]).then(function(answers) {
      this.answers = answers;
      this.appname = answers.appname;
    }.bind(this));
  }


});
