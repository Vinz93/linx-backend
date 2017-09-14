import socketio from 'socket.io';
import http from 'http';
import { verifyJwt } from './jwt';

import { validatioUserParticipation as validatioUserParticipationChat } from './exchange_match';

import Message from '../models/message';
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
        const { id: userId } = await verifyJwt(token);
        const user = await User.findOne({ _id: userId });
        const { firstName, lastName, pictureUrl } = user;
        await validatioUserParticipationChat(room, userId);

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

    socket.on('message', async message => {
      if (!socket.room) {
        return sendError(socket, 'should join a chat');
      }
      debug(`Send message to ${socket.room}`);
      const { value, type } = message;
      try {
        const persistentMessage = new Message({ value, type, chat: socket.room, createdBy: socket.user.id });
        await persistentMessage.save();
        const { id, createdAt } = persistentMessage;
        socket.broadcast.to(socket.room).emit('message', {
          user: socket.user,
          message: {
            value,
            type,
            id,
            createdAt,
          },
        });
      } catch (err) {
        return sendError(socket, err.message);
      }
    });

    socket.on('disconnect', () => {
      debug(`disconnect ${socket.id}`);
    });
  });
}

export default chatService;
