import { Server, Socket } from 'socket.io';

import {
  DoodlerClientToServerEventsArgumentMap,
  DoodlerServerToClientEvents
} from './doodler';
import {
  GameClientToServerEventsArgumentMap,
  GameServerToClientEvents
} from './game';
import {
  RoomClientToServerEventsArgumentMap,
  RoomServerToClientEvents
} from './room';

type ClientToServerEventsArgumentMap = DoodlerClientToServerEventsArgumentMap &
  GameClientToServerEventsArgumentMap &
  RoomClientToServerEventsArgumentMap;

export type ServerToClientEvents = DoodlerServerToClientEvents &
  GameServerToClientEvents &
  RoomServerToClientEvents;

export type ClientToServerEvents = {
  [Key in keyof ClientToServerEventsArgumentMap]: (
    payload: ClientToServerEventsArgumentMap[Key]['payload'],
    respond: (
      response: ClientToServerEventsArgumentMap[Key]['response']
    ) => void
  ) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export interface SocketData {
  name: string;
  avatar: object;
}

export type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type IoType = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
