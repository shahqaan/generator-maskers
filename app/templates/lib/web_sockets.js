
function WebSockets() {


  // TODO: Define token field
  var token = '';

  // TODO: Add event type
  this.EVENT_TYPE = '<%= name %>';

  // TODO: Define message types
  this.MESSAGE_TYPE = {};

  this.newConnection = function(socket) {
    global.log.info('handshake request from ', socket.handshake.query[token], ' socket id', socket.id);

    if (!socket.handshake.query[token]) {
      global.log.info('disconnecting user because of no token');
      socket.disconnect();
    } else {

    }

  };


  this.send = function(chatId, type, message) {
    // TODO: implement socket send message
  };

}

module.exports = new WebSockets();
