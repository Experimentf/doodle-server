import { DoodlerCustomEventHandlerMap } from '@/constants/events/custom/doodler';

import { ServerEventManager } from '../utils/ServerEventManager';

class DoodlerEventManager extends ServerEventManager<DoodlerCustomEventHandlerMap> {}

const DoodlerEventManagerInstance = new DoodlerEventManager();

export default DoodlerEventManagerInstance;
