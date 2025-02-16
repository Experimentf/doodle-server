import GameModel from '@/models/GameModel';
import { RoomModel } from '@/models/RoomModel';

export enum GameStatus {
  GAME = 'in_game',
  LOBBY = 'in_lobby',
  END = 'in_end',
  RESULT = 'in_result'
}

export interface GameOptions {
  time: {
    current: number;
    max: number;
  };
  round: {
    current: number;
    max: number;
  };
  word: string;
}

export type RoomInfoMapType = Map<string, RoomModel>;
export type GameInfoMapType = Map<string, GameModel>;
