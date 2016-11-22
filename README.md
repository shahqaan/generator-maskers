# generator-maskers

Yeoman generator for:

* Express with KrakenJS
* Mongoose or Sequelize
* Sockets.io (Optional)
* Bare-bones ReactJS with Webpack and Babel

# Installation

As this is a yeoman generator, make sure you have yeoman installed:

  `npm install -g yo`
  
To install the generator:

  `npm install -g generator-maskers`
  
# Usage

  `cd /path/to/app/directory; yo maskers`
  
# Files & App Structure

    .
    +-- app/
    |   +-- controllers/
    |   +-- lib/
    |   +-- models/
    +-- config/
    |   +-- config.json
    |   +-- development.json
    |   +-- production.json
    +-- .gitignore
    +-- .npmignore
    +-- .editorconfig
    +-- .eslintrc
    +-- package.json
    +-- README.md
    +-- server.js
    +-- index.js

This generator is somewhat opinionated. You might be interested in knowing the following things about the way it sets the app.

## Sequelize

* It loads all the models on the variable `global.db`
* While loading models, it converts snake cased file names found under `app/models` into camel case model name. For example, a file named `user_chats` will be available as `global.db.UserChats`
