import GameModel from '@/models/GameModel';
import { RoomModel } from '@/models/RoomModel';

export enum GameStatus {
  GAME = 'in_game', // A GAME IS GOING ON
  LOBBY = 'in_lobby', //  ROOM IS IN LOBBY
  RESULT = 'in_result' // ROOM IS SEEING THE GAME'S FINAL RESULT
}

export enum InGamePhase {
  DRAWING = 'drawing',
  SELECT_WORD = 'select_word',
  TURN_END = 'turn_end',
  ROUND_END = 'round_end'
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
