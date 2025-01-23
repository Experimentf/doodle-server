import { ClientToServerEvents, SocketType } from '@/types/socket';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/types/socket/events';

export interface SetSocketInterface {
  setSocket: (socket: SocketType) => void;
}

export interface DoodlerControllerInterface extends SetSocketInterface {
  handleDoodlerOnGet: ClientToServerEvents[DoodlerEvents.ON_GET_DOODLER];
  handleDoodlerOnSet: ClientToServerEvents[DoodlerEvents.ON_SET_DOODLER];
}

export interface GameControllerInterface extends SetSocketInterface {
  handleGameOnGetGameDetails: ClientToServerEvents[GameEvents.ON_GET_GAME_DETAILS];
}

export interface RoomControllerInterface extends SetSocketInterface {
  handleRoomOnAddDoodlerToPublicRoom: ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM];
}

export interface SocketControllerInterface extends SetSocketInterface {
  handleSocketOnDisconnecting: () => void;
  handleSocketOnDisconnect: () => void;
}
