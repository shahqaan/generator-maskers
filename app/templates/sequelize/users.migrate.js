'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        firstName: {
          type: Sequelize.STRING,
          field: 'first_name'
        },
        lastName: {
          type: Sequelize.STRING,
          field: 'last_name'
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
      });

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
