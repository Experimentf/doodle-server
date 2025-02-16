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

import SocketServiceInstance from './services/SocketService';

config();

const app: Application = express();

const httpServer = createServer(app);

// Socket
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, { cors: { origin: '*' } });

// Start the socket service
SocketServiceInstance.start(io);

// Listen to port
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
