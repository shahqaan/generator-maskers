module.exports = function(sequelize, Sequelize) {
  var users = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name'
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name'
    },
    fullName: {
      type: Sequelize.VIRTUAL,
      get: function() {
        return this.firstName + ' ' + this.lastName;
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at'
    }
  }, {
    paranoid: true,
    classMethods: {},
    instanceMethods: {},
    defaultScope: {},
    scopes: {
      view: {
        attributes: ['id', 'email', 'firstName']
      }
    }
  });

  return users;
};
