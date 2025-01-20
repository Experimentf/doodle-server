import { RoomModel } from '@/models/Room';

export enum GameStatus {
  GAME = 'game',
  LOBBY = 'lobby',
  END = 'end'
}

export enum RoomMode {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export type RoomInfoMapType = Map<string, RoomModel>;
