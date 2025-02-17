import {
  GameCustomEvent,
  GameCustomEventHandlerMap
} from '@/constants/events/custom/game';

import { ServerEventManager } from '../utils/ServerEventManager';

class GameEventManager extends ServerEventManager<GameCustomEventHandlerMap> {}

const GameEventManagerInstance = new GameEventManager();
GameEventManagerInstance.subscribe(GameCustomEvent.START_IF_VALID, (gameId) => {
  console.log(gameId);
});

export default GameEventManagerInstance;
