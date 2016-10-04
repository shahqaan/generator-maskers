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
    this.npmInstall([
      'lodash',
      'moment',
      'mongoose',
      'bunyan',
      'bluebird',
      'express',
      'krakenjs',
      'construx',
      'construx-copier',
      'eslint'
    ], {save: true});

    this.npmInstall(([
      'nodemon',
      'mocha',
      'supertest'
    ]), {saveDev: true});

    if (this.answers.sockets) { this.npmInstall(['socket.io'], {save: true}); }
  },

  writing: function() {


    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {name: this.appname}
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
      this.destinationPath('index.js')
    );

    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath('server.js'),
      {name: this.appname, isSockets: this.answers.isSockets}
    );

  },

  prompting: function() {
    return this.prompt([{
      type: 'input',
      name: 'appname',
      message: 'Your project name',
      default: this.appname
    }, {
      type: 'confirm',
      name: 'isSockets',
      message: 'Would you like to enable sockets?',
      store: true
    }]).then(function(answers) {
      this.answers = answers;
      this.appname = answers.appname;
    }.bind(this));
  }


});
