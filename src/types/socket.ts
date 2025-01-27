import { Server, Socket } from 'socket.io';

import { DoodlerModel } from '@/models/Doodler';
import GameModel from '@/models/Game';
import { ErrorFromServer } from '@/utils/error';

import { DoodlerEvents, GameEvents, RoomEvents } from '../constants/events';

type RespondFunction<T> = (data?: T | null, error?: ErrorFromServer) => void;

interface ClientToServerEventsArgumentMap {
  [DoodlerEvents.ON_GET_DOODLER]: [RespondFunction<Partial<DoodlerModel>>];
  [DoodlerEvents.ON_SET_DOODLER]: [
    { name: string; avatar: object },
    RespondFunction<DoodlerModel>
  ];
  [RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM]: [
    RespondFunction<{ roomId: string }>
  ];
  [GameEvents.ON_GET_GAME_DETAILS]: [string, RespondFunction<GameModel>];
}

export interface ServerToClientEvents {
  [RoomEvents.EMIT_DOODLER_JOIN]: (doodler: DoodlerModel) => void;
  [RoomEvents.EMIT_DOODLER_LEAVE]: (doodler: Partial<DoodlerModel>) => void;
  [GameEvents.EMIT_GAME_START]: () => void;
  [GameEvents.EMIT_GAME_LOBBY]: () => void;
  [GameEvents.EMIT_GAME_END]: () => void;
}

export type ClientToServerEvents = {
  [Key in keyof ClientToServerEventsArgumentMap]: (
    ...args: ClientToServerEventsArgumentMap[Key]
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
