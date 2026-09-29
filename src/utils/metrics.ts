import { RequestHandler } from 'express';
import { collectDefaultMetrics, Counter, Gauge, Registry } from 'prom-client';

import {
  DoodlerSocketEvents,
  GameSocketEvents,
  RoomSocketEvents
} from '@/constants/events/socket';
import DoodlerServiceInstance from '@/services/doodler/DoodlerService';
import GameServiceInstance from '@/services/game/GameService';
import RoomServiceInstance from '@/services/room/RoomService';
import { IoType } from '@/types/socket';

const registry = new Registry();
collectDefaultMetrics({ register: registry });

// Whitelist so arbitrary client-sent event names can't blow up label cardinality.
const knownEvents = new Set<string>([
  ...Object.values(DoodlerSocketEvents),
  ...Object.values(GameSocketEvents),
  ...Object.values(RoomSocketEvents)
]);

export const registerMetrics = (io: IoType) => {
  new Gauge({
    name: 'doodle_socket_connections',
    help: 'Open Socket.IO connections',
    registers: [registry],
    collect() {
      this.set(io.engine.clientsCount);
    }
  });
  new Gauge({
    name: 'doodle_rooms',
    help: 'Rooms held in memory',
    registers: [registry],
    collect() {
      this.set(RoomServiceInstance.count);
    }
  });
  new Gauge({
    name: 'doodle_games',
    help: 'Games held in memory',
    registers: [registry],
    collect() {
      this.set(GameServiceInstance.count);
    }
  });
  new Gauge({
    name: 'doodle_doodlers',
    help: 'Doodlers held in memory',
    registers: [registry],
    collect() {
      this.set(DoodlerServiceInstance.count);
    }
  });

  const events = new Counter({
    name: 'doodle_socket_events_total',
    help: 'Socket events received from clients',
    labelNames: ['event'],
    registers: [registry]
  });
  io.on('connection', (socket) => {
    socket.onAny((event: string) => {
      if (knownEvents.has(event)) events.inc({ event });
    });
  });
};

export const metricsHandler: RequestHandler = async (req, res) => {
  const token = process.env.METRICS_TOKEN;
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    res.status(401).end();
    return;
  }
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
};
