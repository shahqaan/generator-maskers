'use strict';

var _ = require('lodash');

class WebSockets {


  // TODO: Define token field
  var token = '';

  // TODO: Add event type
  EVENT_TYPE = '<%= name %>';

  // TODO: Define message types
  MESSAGE_TYPE = {};

  userSockets = [];

  newConnection(socket) {
    global.log.info('handshake request from ', socket.handshake.query[token], ' socket id', socket.id);

    if (!socket.handshake.query[token]) {
      global.log.info('disconnecting user because of no token');
      socket.disconnect();
    } else {

      var decoded = jwt.decode(socket.handshake.query[token]);

      if (decoded && decoded.publicId) {
        var userId = decoded.publicId;

        _this.connectUser(socket, userId).then(function () {

          socket.on(_this.EVENT_TYPE, function (message) {
            _this.readMessage(userId, message);
          });

          socket.on('disconnect', function () {
            _this.disconnectUser(userId, socket);
          });
        });

      } else {
        global.log.info('disconnecting user because of incorrect token');
        socket.disconnect();
      }

    }
  };

  isAuthenticated(token) {

  }

  readMessage(user, message) {

    switch(message.type) {
      case this.MESSAGE_TYPE.USER_TYPING:
        _.this.send(message.chatId, _this.MESSAGE_TYPE.USER_TYPING, {userId: userId});
        break;
      default:
        break;

    }

  };

  disconnectUser(userId, socket) {
    _.remove(_this.userSockets, function (userSocket) {
      return userSocket.userId == userId;
    });

    global.log.info('user', userId, 'disconnected');
  };

  connectUser(socket, userId) {

    _this.userSockets.push({socketId: socket.id, userId: userId});

    var Chats = require('../models/chats');

    return Chats.find({'members.userId': userId}).then(function(chats) {
      global.log.debug('chats for user: ', chats);
      chats.forEach(function(chat) {
        socket.join(chat.id);
      });

    });

  };

  subscribeUserToChat(userId, chatId) {

    var userSockets = _.filter(_this.userSockets, {userId: userId});
    _.each(userSockets, function(userSocket) {
      var socket = global.io.sockets.connected[userSocket.socketId];
      if (socket) {
        if (global.io.sockets.adapter.sids[socket.id][chatId]) {
          global.log.warn('user', userId, 'already belongs to', chatId);
        } else {
          socket.join(chatId);
          global.log.info('user', userId, 'joined channel', chatId);
        }
      } else {
        global.log.warn('socket ', socket.id, 'does not exist');
      }
    });

  };

  unsubscribeUserFromChat(userId, chatId) {
    var userSockets = _.filter(_this.userSockets, {userId: userId});
    _.each(userSockets, function(userSocket) {
      var socket = global.io.sockets.connected[userSocket.socketId];
      if (socket) {
        socket.leave(chatId);
      } else {
        global.log.warn('socket ', socket.id, 'does not exist');
      }
    });
  };

  send(chatId, type, message) {
    global.log.info('sending socket message', type, '|', chatId, '|');
    global.io.to(chatId).emit(_this.EVENT_TYPE, {
      type: type,
      chatId: chatId,
      message: message
    });
  }

}

module.exports = new WebSockets();
