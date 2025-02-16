import { GameCustomEvent } from '@/constants/events/custom';

import { ServerEventManager } from '../utils/ServerEventManager';

class GameEmitter extends ServerEventManager<GameCustomEvent> {}

const GameEmitterInstance = new GameEmitter();

GameEmitterInstance.subscribe('START_IF_VALID', (gameId) => {
  console.log(gameId);
});

export default GameEmitterInstance;
