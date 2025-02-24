import { GameSocketEvents } from '@/constants/events/socket';
import GameModel from '@/models/GameModel';

import { DoodlerInterface } from './doodler';
import { ClientToServerEventsArgument } from './helper';

export type GameInterface = GameModel['json'];

export interface GameClientToServerEventsArgumentMap {
  [GameSocketEvents.ON_GET_GAME]: ClientToServerEventsArgument<
    string,
    { game: GameInterface }
  >;
}

export interface GameServerToClientEvents {
  [GameSocketEvents.EMIT_GAME_START]: (args: {
    drawerId: DoodlerInterface['id'];
  }) => void;
  [GameSocketEvents.EMIT_GAME_LOBBY]: () => void;
  [GameSocketEvents.EMIT_GAME_END]: (args: {
    drawerId: DoodlerInterface['id'] | undefined;
  }) => void;
}
