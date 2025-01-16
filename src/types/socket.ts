import { Server } from 'socket.io';
import { ErrorFromServer } from '../utils/error';
import { Member, Room } from '../Game/Room';

type CallbackFunction = (data: unknown, error?: ErrorFromServer) => void;

export type RoomInfoMapType = Map<string, Room>;

export interface ServerToClientEvents {
  'new-user': (member: Member) => void;
  'user-leave': (member: Member) => void;
  'game-start': () => void;
  'game-end': () => void;
  'game-lobby': () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  'get-user': (callback: CallbackFunction) => void;
  'set-user': ({ name, avatar }: { name: string; avatar: object }) => void;
  'play-public-game': (callback: CallbackFunction) => void;
  'get-game-details': (roomId: string, callback: CallbackFunction) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterServerEvents {}

export interface SocketData {
  name: string;
  avatar: object;
}

export type IoType = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
