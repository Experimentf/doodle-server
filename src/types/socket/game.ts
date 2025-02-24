import { GameSocketEvents } from '@/constants/events/socket';
import GameModel from '@/models/GameModel';

import { ClientToServerEventsArgument } from './helper';
import { RoomInterface } from './room';

export type GameInterface = GameModel['json'];

export interface GameClientToServerEventsArgumentMap {
  [GameSocketEvents.ON_GET_GAME]: ClientToServerEventsArgument<
    string,
    { game: GameInterface }
  >;
}

export interface GameServerToClientEvents {
  [GameSocketEvents.EMIT_GAME_STATUS_UPDATED]: (args: {
    room: RoomInterface;
    game?: GameInterface;
  }) => void;
}
