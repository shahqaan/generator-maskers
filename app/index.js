/**
 * Created by shahqaan on 01/10/2016.
 */
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  installingDependencies: function () {

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
      'concurrently',
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
        productionInstall.push('mysql');
        productionInstall.push('mysql2');
        productionInstall.push('sequelize');
        devInstall.push('sequelize-cli');
        break;
      default:
        break;
    }

    if (this.answers.isSockets) {
      productionInstall.push('socket.io');
    }

    switch (this.answers.frontend) {
      case 'react': {
        productionInstall.push('webpack');
        productionInstall.push('babel-core');
        productionInstall.push('babel-loader');
        productionInstall.push('babel-preset-es2015');
        productionInstall.push('babel-preset-react');
        productionInstall.push('react');
        productionInstall.push('react-dom');
        break;
      }
      case 'angular4': {
        productionInstall.push(
          '@angular/common',
          '@angular/compiler',
          '@angular/core',
          '@angular/forms',
          '@angular/http',
          '@angular/platform-browser',
          '@angular/platform-browser-dynamic',
          '@angular/router',
          '@types/node',
          'core-js',
          'rxjs',
          'zone.js',
          'angular2-template-loader',
          'awesome-typescript-loader',
          'compression-webpack-plugin',
          'extract-text-webpack-plugin',
          'css-loader',
          'file-loader',
          'html-loader',
          'html-webpack-plugin',
          'node-sass',
          'raw-loader',
          'sass-loader',
          'style-loader',
          'to-string-loader',
          'typescript',
          'webpack',
          'copy-webpack-plugin'
        );
        break;
      }
    }

    this.npmInstall(productionInstall, {save: true});

    this.npmInstall(devInstall, {saveDev: true});

  },

  setupReact: function () {

    if (this.answers.frontend === 'react') {
      this.fs.copyTpl(
        this.templatePath('react/*'),
        this.destinationPath(''),
        this._getAnswers()
      );

      this.fs.copyTpl(
        this.templatePath('react/.babelrc'),
        this.destinationPath('.babelrc'),
        this._getAnswers()
      );

      this.fs.copyTpl(
        this.templatePath('react/client/*'),
        this.destinationPath('client/'),
        this._getAnswers()
      );

      this.fs.copyTpl(
        this.templatePath('controllers/index.js'),
        this.destinationPath('app/controllers/index.js'),
        this._getAnswers()
      );

    }
  },

  setupAngular4: function () {

    if (this.answers.frontend === 'angular4') {
      this.fs.copyTpl(
        this.templatePath('angular4/*'),
        this.destinationPath(''),
        this._getAnswers()
      );
      this.directory(
        this.templatePath('angular4/client'),
        this.destinationPath('client/'),
        this._getAnswers()
      );


      this.fs.copyTpl(
        this.templatePath('controllers/index.js'),
        this.destinationPath('app/controllers/index.js'),
        this._getAnswers()
      );

    }
  },

  _getAnswers: function () {
    return {
      name: this.appname,
      description: this.answers.description,
      db: this.answers.db,
      isSockets: this.answers.isSockets
    }
  },

  writing: {

    db: function () {


      this.fs.copyTpl(
        this.templatePath(this.answers.db + '/users.js'),
        this.destinationPath('app/models/users.js')
      );

      if (this.answers.db === 'sequelize') {

        this.fs.copyTpl(
          this.templatePath('sequelize/users.migrate.js'),
          this.destinationPath('app/db/migrate/' + Math.floor(new Date().getTime() / 1000) + '-create-users.js')
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
          this.destinationPath('.sequelizerc')
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

    files: function () {

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

    },

  },

  prompting: function () {
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
    }, {
      type: 'list',
      name: 'frontend',
      message: 'Which frontend framework would you like to use?',
      choices: ['react', 'angular4', 'none'],
      store: true
    }]).then(function (answers) {
      this.answers = answers;
      this.appname = answers.appname;
    }.bind(this));
  }


});
