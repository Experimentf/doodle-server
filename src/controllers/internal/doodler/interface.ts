import { DoodlerSocketEvents } from '@/constants/events/socket';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface DoodlerControllerInterface {
  handleDoodlerOnGet: (
    socket: SocketType
  ) => (
    ...args: Parameters<
      ClientToServerEvents[DoodlerSocketEvents.ON_GET_DOODLER]
    >
  ) => void;
  handleDoodlerOnSet: (
    socket: SocketType
  ) => (
    ...args: Parameters<
      ClientToServerEvents[DoodlerSocketEvents.ON_SET_DOODLER]
    >
  ) => void;
}
