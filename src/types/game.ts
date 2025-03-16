import GameModel from '@/models/GameModel';
import { RoomModel } from '@/models/RoomModel';

export interface Coordinate {
  x: number;
  y: number;
}

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

export enum CanvasAction {
  LINE = 'line',
  FILL = 'fill',
  ERASE = 'erase',
  CLEAR = 'clear',
  UNDO = 'undo',
  REDO = 'redo'
}

export interface CanvasOperation {
  actionType?: CanvasAction;
  points?: Array<Coordinate>;
  color?: string;
  size?: number;
}

export type RoomInfoMapType = Map<string, RoomModel>;
export type GameInfoMapType = Map<string, GameModel>;
