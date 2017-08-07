<% if (db === 'mongoose') { %>var Users = require('../../../models/users.js');<% } %>
module.exports = function (router) {

  router.get('', function(req, res) {
    <% if (db === 'sequelize') { %>
      global.db.Users.find({where: {email: 'shahqaan@onebyte.biz'}}).then(function(user) {

        if (user) { return user; }

        return global.db.Users.create({
          email: 'shahqaan@onebyte.biz',
          firstName: 'Shahqaan',
          lastName: 'Qasim'
        });
        
      }).then(function(user) {
        res.json(user);
      });

    <% } else if (db === 'mongoose') { %>

      // I know, this API should return a list but what the hell
      Users.findOne({email: 'shahqaan@onebyte.biz'}).then(function(user) {

        if (user) { return user; }

        return Users.create({email: 'shahqaan@onebyte.biz'});
      }).then(function(user) {
        res.json(user);
      });
    <% } else {} %>
  });

};
