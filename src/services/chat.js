import socketio from 'socket.io';
import http from 'http';
import { verifyJwt } from './jwt';

import ExchangeMatch from '../models/exchange_match';
import User from '../models/user';

const debug = require('debug')('linx:chat');
function setup(app, config) {
  const { port } = config;
  const server = http.createServer(app);
  const io = socketio(server);
  server.listen(port, () => {
    console.log(` websocket listening on port ${port}`);
  });
  return io;
}

async function validateChat(chatId, userId) {
  const exchangeMatch = await ExchangeMatch.findOne({
    _id: chatId,
  }).populate({
    path: 'requester',
    select: 'user',
    populate: {
      path: 'user',
      select: 'id',
    },
  })
    .populate({
      path: 'requested',
      select: 'user',
      populate: {
        path: 'user',
        select: 'id',
      },
    });
  if (!exchangeMatch) {
    throw new Error('Invalid chat id');
  }
  const { requester, requested } = exchangeMatch;

  if (!requester.user._id.equals(userId) && !requested.user._id.equals(userId)) {
    throw new Error('Not authorized');
  }
  return;
}

function sendError(socket, msg) {
  const error = msg;
  debug(`[error] ${error}`);
  socket.emit('chat/error', error);
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
        const user = await verifyJwt(token);
        const { id: userId, firstName, lastName, pictureUrl } = await User.findOne({ _id: user.id });
        await validateChat(room, userId);

        debug(`User ${userId} joined to ${room}`);
        socket.room = room;
        socket.user = {
          id: userId,
          firstName,
          lastName,
          pictureUrl,
        };
        socket.join(room);
        socket.emit('join:done');
      } catch (err) {
        return sendError(socket, err.message);
      }
    });

    socket.on('message', message => {
      if (!socket.room) {
        return sendError(socket, 'should join a chat');
      }
      debug(`Send message to ${socket.room}`);
      const { text, type } = message;
      socket.broadcast.to(socket.room).emit('message', {
        user: socket.user,
        message: {
          text,
          createdAt: new Date(),
          type: 'text',
        },
      });
    });

    socket.on('disconnect', () => {
      debug(`disconnect ${socket.id}`);
    });
  });
}

export default chatService;
