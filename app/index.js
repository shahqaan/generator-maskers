/**
 * Created by shahqaan on 01/10/2016.
 */
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  constructor: function() {

    generators.Base.apply(this, arguments);

    this.option('coffee'); // This method adds support for --coffee flag
    this.log('constructor called');

  },

  method1: function() {
    this.log('method1 just ran');
  },

  method2: function() {
    this.log('method2 just ran');
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

  writing: function() {

    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {name: this.appname, description: this.answers.description}
    );

    this.fs.copyTpl(
      this.templatePath('logger.js'),
      this.destinationPath('app/lib/logger.js'),
      {name: this.appname}
    );

    if (this.answers.isSockets) {
      this.fs.copyTpl(
        this.templatePath('web_sockets.js'),
        this.destinationPath('app/lib/web_sockets.js'),
        {name: this.appname}
      );
    }

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('index.js'),
      {db: this.answers.db}
    );

    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath('server.js'),
      {name: this.appname, isSockets: this.answers.isSockets, db: this.answers.db}
    );

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
        {name: this.appname}
      );

      this.fs.copyTpl(
        this.templatePath('sequelize/database.js'),
        this.destinationPath('config/database.sample.js'),
        {name: this.appname}
      );

    } else if (this.answers.db === 'mongoose') {

      this.fs.copyTpl(
        this.templatePath('mongoose/mongo.json'),
        this.destinationPath('config/mongo.json'),
        {name: this.appname}
      );

      this.fs.copyTpl(
        this.templatePath('mongoose/mongo.json'),
        this.destinationPath('config/mongo.sample.json'),
        {name: this.appname}
      );

    } else {

    }

    this.fs.copyTpl(
      this.templatePath('users.js'),
      this.destinationPath('app/controllers/api/v1/users.js'),
      {db: this.answers.db}
    );

    this.fs.copyTpl(
      this.templatePath('auth.js'),
      this.destinationPath('app/lib/auth.js')
    );

    this.fs.copyTpl(
      this.templatePath('config/config.json'),
      this.destinationPath('config/config.json')
    );

    this.fs.copyTpl(
      this.templatePath('config/environment.json'),
      this.destinationPath('config/development.json')
    );

    this.fs.copyTpl(
      this.templatePath('config/environment.json'),
      this.destinationPath('config/production.json')
    );


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
