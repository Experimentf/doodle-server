import { Server, Socket } from 'socket.io';

import { DoodlerModel } from '@/models/Doodler';
import { RoomModel } from '@/models/Room';
import { ErrorFromServer } from '@/utils/error';

import { DoodlerEvents, GameEvents, RoomEvents } from './events';

type RespondFunction<T> = (data?: T | null, error?: ErrorFromServer) => void;

interface ClientToServerEventsArguments {
  [DoodlerEvents.ON_GET]: [RespondFunction<Partial<DoodlerModel>>];
  [DoodlerEvents.ON_SET]: [{ name: string; avatar: object }];
  [GameEvents.ON_PLAY_PUBLIC_GAME]: [RespondFunction<{ roomId: string }>];
  [GameEvents.ON_GET_GAME_DETAILS]: [string, RespondFunction<RoomModel>];
}

export interface ServerToClientEvents {
  [RoomEvents.EMIT_NEW_USER]: (doodler: DoodlerModel) => void;
  [RoomEvents.EMIT_USER_LEAVE]: (doodler: Partial<DoodlerModel>) => void;
  [GameEvents.EMIT_GAME_START]: () => void;
  [GameEvents.EMIT_GAME_LOBBY]: () => void;
  [GameEvents.EMIT_GAME_END]: () => void;
}

export interface ClientToServerEvents {
  [DoodlerEvents.ON_GET]: (
    ...args: ClientToServerEventsArguments[DoodlerEvents.ON_GET]
  ) => void;
  [DoodlerEvents.ON_SET]: (
    ...args: ClientToServerEventsArguments[DoodlerEvents.ON_SET]
  ) => void;
  [GameEvents.ON_PLAY_PUBLIC_GAME]: (
    ...args: ClientToServerEventsArguments[GameEvents.ON_PLAY_PUBLIC_GAME]
  ) => void;
  [GameEvents.ON_GET_GAME_DETAILS]: (
    ...args: ClientToServerEventsArguments[GameEvents.ON_GET_GAME_DETAILS]
  ) => void;
}

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
