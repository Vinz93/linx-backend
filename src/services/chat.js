import socketio from 'socket.io';
import http from 'http';

import ExchangeMatch from '../models/exchange_match';

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
  socket.emit('error', error);
}
function chatService(app, config) {
  const io = setup(app, config);
  io.on('connection', (socket) => {
    debug(`Connected ${socket.id}`);

    socket.on('join', async req => {
      const { room, userId } = req;
      if (!room || !userId) {
        return sendError(io.sockets, 'userId and room fields are require');
      }
      const chatId = room.split('-')[1];
      if (!chatId) {
        return sendError(io.sockets, 'invalid chat id');
      }
      const exchangeMatch = await ExchangeMatch.findOne({
        _id: chatId,
        $or: [
          { requested: userId },
          { requester: userId },
        ],
      });
      if (!exchangeMatch) {
        return sendError(io.sockets, 'invalid chat id');
      }

      debug(`User ${userId} joined to ${room}`);
      socket.room = room;
      socket.user = {
        id: userId,
        nick: userId,
      };
      socket.join(room);
      io.sockets.emit('join:done');
    });

    socket.on('message', message => {
      if (!socket.room) {
        return sendError(io.sockets, 'should join a chat');
      }
      debug(`Send message to ${socket.room}`);
      socket.broadcast.to(socket.room).emit('message', {
        user: socket.user,
        message,
      });
    });

    socket.on('disconnect', () => {
      debug(`disconnect ${socket.id}`);
    });
  });
}

export default chatService;
