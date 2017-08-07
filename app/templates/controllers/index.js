var path = require('path');

module.exports = function (router) {
  router.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../', 'index.html'));
  });
};