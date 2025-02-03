import { DoodlerEvents } from '@/constants/events';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface DoodlerControllerInterface {
  handleDoodlerOnGet: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[DoodlerEvents.ON_GET_DOODLER]>
  ) => void;
  handleDoodlerOnSet: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[DoodlerEvents.ON_SET_DOODLER]>
  ) => void;
}
