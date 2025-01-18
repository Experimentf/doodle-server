import { config } from 'dotenv';
import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  onSocketConnectHandler,
  onSocketDisconnectHandler
} from '@/handlers/socket/connection';
import { onPlayPublicGameHandler } from '@/handlers/socket/rooms';
import { RoomInfoMapType, RoomMode } from '@/types/game';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from '@/types/socket';
import { ErrorFromServer } from '@/utils/error';

config();

const app: Application = express();

const httpServer = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, { cors: { origin: '*' } });

// Rooms information is saved temporarily on server
const rooms: RoomInfoMapType = new Map();

// Socket
io.on('connection', (socket) => {
  onSocketConnectHandler(io, socket);

  // Get username
  socket.on('get-user', (callback) => {
    const name = socket.data.name;
    const avatar = socket.data.avatar;
    if (!name || !avatar) {
      const error = new ErrorFromServer('User does not exist');
      callback(null, error);
      return;
    }
    callback({ name });
  });

  // Set username
  socket.on('set-user', ({ name, avatar }) => {
    socket.data.name = name;
    socket.data.avatar = avatar;
  });

  // Play Public Game
  socket.on('play-public-game', (callback) => {
    try {
      const roomId = onPlayPublicGameHandler(io, socket, rooms);
      callback(roomId);
    } catch (e) {
      callback(null, e as ErrorFromServer);
    }
  });

  // Get the game details
  socket.on('get-game-details', (roomId, callback) => {
    const room = rooms.get(roomId);
    if (!room) {
      callback(null, new ErrorFromServer('Room not found'));
    }
    // Start the game if room is public and more than 1 member in the room
    if (
      room &&
      room.type === RoomMode.PUBLIC &&
      room.getNumberOfMembers() > 1
    ) {
      room.startGame();
    }
    callback(room?.getJSON());
  });

  // Before disconnecting
  socket.on('disconnecting', () => {
    onSocketDisconnectHandler(io, socket, rooms);
  });

  // User leaves
  socket.on('disconnect', () => {
    console.log('User disconnected :', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
