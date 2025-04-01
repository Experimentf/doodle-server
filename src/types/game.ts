import GameModel from '@/models/GameModel';
import { RoomModel } from '@/models/RoomModel';

export interface Coordinate {
  x: number;
  y: number;
}

export enum GameStatus {
  GAME = 'in_game', // A GAME IS GOING ON
  LOBBY = 'in_lobby', //  ROOM IS IN LOBBY
  CHOOSE_WORD = 'in_choose_word', // ROOM IS WAITING FOR DRAWER TO CHOOSE WORD
  TURN_END = 'in_turn_end', // ROOM IS SEEING A TURN END
  ROUND_END = 'in_round_end', // ROOM IS SEEING A ROUND END
  RESULT = 'in_result' // ROOM IS SEEING THE GAME'S FINAL RESULT
}

export enum InGamePhase {
  DRAWING = 'drawing',
  SELECT_WORD = 'select_word',
  TURN_END = 'turn_end',
  ROUND_END = 'round_end'
}

export interface GameOptions {
  timers: {
    drawing: {
      current: number;
      max: number;
    };
    turnEndCooldownTime: {
      current: number;
      max: number;
    };
    chooseWordTime: {
      current: number;
      max: number;
    };
  };
  round: {
    current: number;
    max: number;
  };
  word: string;
}

export enum CanvasAction {
  LINE = 'line',
  FILL = 'fill',
  ERASE = 'erase',
  CLEAR = 'clear'
}

export interface CanvasOperation {
  actionType: CanvasAction;
  points: Array<Coordinate>;
  color?: string;
  size?: number;
}

export type RoomInfoMapType = Map<string, RoomModel>;
export type GameInfoMapType = Map<string, GameModel>;
