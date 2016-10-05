<% if (db === 'mongoose') { %>var Users = require('../../../models/users.js');<% } %>
module.exports = function (router) {

  router.get('', function(req, res) {
    <% if (db === 'sequelize') { %>
      global.db.Users.findAll({}).then(function(users) {
        res.json(users);
      });
    <% } else if (db === 'mongoose') { %>
      Users.findOne({email: 'shahqaan@onebyte.biz'}).then(function(user) {

        if (user) { return user; }

        return Users.create({email: 'shahqaan@onebyte.biz'});
      }).then(function(user) {
        res.json(user);
      });
    <% } else {} %>
  });

};
