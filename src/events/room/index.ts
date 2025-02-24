import { RoomCustomEventHandlerMap } from '@/constants/events/custom/room';

import { ServerEventManager } from '../utils/ServerEventManager';

class RoomEventManager extends ServerEventManager<RoomCustomEventHandlerMap> {}

const RoomEventManagerInstance = new RoomEventManager();

export default RoomEventManagerInstance;
