import { GameEvents } from '@/constants/events';
import GameModel from '@/models/GameModel';

import { ClientToServerEventsArgument } from './helper';

export type GameInterface = GameModel['json'];

export interface GameClientToServerEventsArgumentMap {
  [GameEvents.ON_GET_GAME]: ClientToServerEventsArgument<
    string,
    { game: GameInterface }
  >;
}

export interface GameServerToClientEvents {
  [GameEvents.EMIT_GAME_START]: () => void;
  [GameEvents.EMIT_GAME_LOBBY]: () => void;
  [GameEvents.EMIT_GAME_END]: () => void;
}
