import { config } from 'dotenv';
import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from '@/types/socket';

import SocketServiceInstance from './services/socket/SocketService';

config();

const app: Application = express();

const httpServer = createServer(app);

// Socket
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: { origin: 'http://dclient:3000', methods: ['GET', 'post'] }
});

// Start the socket service
SocketServiceInstance.start(io);

// Listen to port
const PORT = Number(process.env.PORT) || 5000;
httpServer.listen(PORT, '0.0.0.0', undefined, () => {
  console.log(`Server is listening on port ${PORT}`);
});
