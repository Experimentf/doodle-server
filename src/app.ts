import cors from 'cors';
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
import { metricsHandler, registerMetrics } from './utils/metrics';

config();

const app: Application = express();

const httpServer = createServer(app);

// Registered before CORS: uptime checkers and scrapers send no Origin header
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
app.get('/metrics', metricsHandler);

const allowedOrigins = [
  ...(process.env.DOODLE_CLIENT_URL?.split(',').map((url) => url.trim()) ?? [])
];

const isOriginAllowed = (origin?: string) =>
  origin && allowedOrigins.includes(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// Socket
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'post']
  }
});

// Start the socket service
SocketServiceInstance.start(io);
registerMetrics(io);

// Listen to port
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
