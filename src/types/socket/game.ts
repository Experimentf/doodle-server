import { GameSocketEvents } from '@/constants/events/socket';
import GameModel from '@/models/GameModel';

import { CanvasOperation } from '../game';
import { ClientToServerEventsArgument } from './helper';
import { RoomInterface } from './room';

export type GameInterface = GameModel['json'];

export interface GameClientToServerEventsArgumentMap {
  [GameSocketEvents.ON_GET_GAME]: ClientToServerEventsArgument<
    string,
    { game: GameInterface }
  >;
  [GameSocketEvents.ON_GAME_CANVAS_OPERATION]: ClientToServerEventsArgument<
    { roomId: string; canvasOperation: CanvasOperation },
    { game: GameInterface }
  >;
  [GameSocketEvents.ON_GAME_CHOOSE_WORD]: ClientToServerEventsArgument<
    { roomId: string; word: string },
    { game: GameInterface }
  >;
}

export interface GameServerToClientEvents {
  [GameSocketEvents.EMIT_GAME_STATUS_UPDATED]: (args: {
    room: RoomInterface;
    game?: GameInterface;
  }) => void;
  [GameSocketEvents.EMIT_GAME_CANVAS_OPERATION]: (args: {
    canvasOperation: CanvasOperation;
  }) => void;
}
