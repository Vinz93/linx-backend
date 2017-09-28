import socketio from 'socket.io';
import http from 'http';
import { verifyJwt } from './jwt';

import { validatioUserParticipation as validatioUserParticipationChat } from './exchange_match';

import Message from '../models/message';
import User from '../models/user';
import ExchangeMatch from '../models/exchange_match';

import { contact } from './push_notification';

const debug = require('debug')('linx:chat');
const rooms = new Map();

// Implement redis
function addUserToRoom(user, room) {
  if (!user || !room) {
    return false;
  }
  const { id: userId } = user;
  const users = rooms.get(room) || [];
  const index = users.indexOf(userId);
  if (index === -1) {
    users.push(userId);
    rooms.set(room, users);
  }
  return true;
}

// Implement redis
function deleteUserToRoom(user, room) {
  if (!user || !room) {
    return false;
  }
  const { id: userId } = user;
  const users = rooms.get(room) || [];
  const index = users.indexOf(userId);
  if (index !== -1) {
    users.splice(index, 1);
    rooms.set(room, users);
    return true;
  }
  return false;
}

function getMessage(message) {
  const { value, type, id, createdAt } = message;
  return {
    value,
    type,
    id,
    createdAt,
  };
}

function getUser(user) {
  const { id, firstName, lastName, pictureUrl, socialNetworks } = user;
  return {
    id,
    firstName,
    lastName,
    pictureUrl,
    socialNetworks,
  };
}

function setup(app, config) {
  const { port } = config;
  const server = http.createServer(app);
  const io = socketio(server);
  server.listen(port, () => {
    console.log(` websocket listening on port ${port}`);
  });
  return io;
}

function sendError(socket, msg) {
  const error = msg;
  debug(`[error] ${error}`);
  socket.emit('chat/error', error);
}

async function sendPushNotification(exchange, message, chatId, usersOnline) {
  const { user, haveCurrencies } = exchange;
  const { createdBy } = message;
  const isOnline = usersOnline.indexOf(user.id);
  if (isOnline === -1 && user.id !== createdBy.id) {
    const { id: userId, deviceToken, deviceType } = user;
    const msg = `Has a new message of ${createdBy.firstName} ${createdBy.lastName}`;
    const pushData = {
      exchangeMatch: {
        id: chatId,
      },
      haveCurrencies,
      user: getUser(createdBy),
      message: getMessage(message),
    };
    const pushed = await contact(pushData, deviceToken, deviceType, msg, 'chat');
    if (pushed.sent) {
      debug(`Send push notification to "${userId}" user with devicetoken "${deviceToken}"`);
    } else {
      debug(`[error] Not sent push notification`);
    }
    return;
  }
  return;
}

async function pushNotificationsToUnconnectedUsers(chatId, message) {
  const usersOnline = rooms.get(chatId);
  debug(`[${usersOnline}], users in the room ${chatId}`);
  const { requester: requesterExchange, requested: requestedExchange } = await ExchangeMatch.findOne({
    _id: chatId,
  }).populate({
    path: 'requester',
    select: 'user',
    populate: {
      path: 'user',
    },
  })
    .populate({
      path: 'requested',
      select: 'user',
      populate: {
        path: 'user',
      },
    });

  sendPushNotification(requesterExchange, message, chatId, usersOnline);
  sendPushNotification(requestedExchange, message, chatId, usersOnline);
}

function chatService(app, config) {
  const io = setup(app, config);
  io.on('connection', (socket) => {
    debug(`Connected ${socket.id}`);
    socket.on('join/chat', async req => {
      const { room, token } = req;
      if (!room || !token) {
        return sendError(socket, 'token and room fields are require');
      }
      try {
        const { id: userId } = await verifyJwt(token);
        const user = await User.findOne({ _id: userId });
        await validatioUserParticipationChat(room, userId);
        debug(`User ${userId} joined to ${room}`);
        socket.leave(socket.room);
        addUserToRoom(user, room);
        socket.room = room;
        socket.user = user;
        socket.join(room);
        socket.emit('join/chat:done');
      } catch (err) {
        return sendError(socket, err.message);
      }
    });

    socket.on('leave/chat', () => {
      const { room, user } = socket;
      if (room) {
        debug(`User ${user.id} leave to ${room}`);
        socket.leave(room, () => {
          deleteUserToRoom(user, room);
          socket.room = undefined;
          console.log('test--->', Object.keys(socket.rooms));
          socket.emit('leave/chat:done');
        });
      }
    });

    socket.on('message/chat', async message => {
      const { room: chatId } = socket;
      if (!chatId) {
        return sendError(socket, 'should join a chat');
      }
      debug(`Send message to ${chatId}`);
      const { value, type } = message;
      try {
        const persistentMessage = new Message({ value, type, chat: chatId, createdBy: socket.user });
        await persistentMessage.save();
        pushNotificationsToUnconnectedUsers(chatId, persistentMessage);
        return socket.broadcast.to(chatId).emit('message', {
          user: getUser(socket.user),
          message: getMessage(persistentMessage),
        });
      } catch (err) {
        return sendError(socket, err.message);
      }
    });

    socket.on('disconnect', async () => {
      const { user, room } = socket;
      socket.leave(room);
      deleteUserToRoom(user, room);
      debug(`disconnect ${user.id}`);
    });
  });
}

export default chatService;
