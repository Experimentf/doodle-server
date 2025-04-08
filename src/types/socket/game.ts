import { GameSocketEvents } from '@/constants/events/socket';
import GameModel from '@/models/GameModel';

import { CanvasOperation, GameStatus } from '../game';
import { DoodlerInterface } from './doodler';
import { ClientToServerEventsArgument } from './helper';
import { RoomInterface } from './room';

export type GameInterface = GameModel['json'];

export enum HunchStatus {
  CORRECT = 'correct',
  NEARBY = 'nearby',
  WRONG = 'wrong'
}

export interface HunchInterface {
  senderId?: DoodlerInterface['id'];
  message: string;
  status?: HunchStatus;
  isSystemMessage: boolean;
}

export interface GameStatusChangeData {
  [GameStatus.CHOOSE_WORD]?: {
    wordOptions: Array<string>;
  };
  [GameStatus.TURN_END]?: {
    scores: Record<string, number>;
  };
}

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
  [GameSocketEvents.ON_GAME_HUNCH]: ClientToServerEventsArgument<
    {
      roomId: string;
      message: string;
    },
    {
      hunch: HunchInterface;
    }
  >;
}

export interface GameServerToClientEvents {
  [GameSocketEvents.EMIT_GAME_STATUS_UPDATED]: (args: {
    room: RoomInterface;
    game?: GameInterface;
    statusChangeData?: GameStatusChangeData;
  }) => void;
  [GameSocketEvents.EMIT_GAME_CANVAS_OPERATION]: (args: {
    canvasOperation: CanvasOperation;
  }) => void;
  [GameSocketEvents.ON_GAME_HUNCH]: (args: { hunch: HunchInterface }) => void;
}
