import { GameEvents } from '@/constants/events';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface GameControllerInterface {
  handleGameOnGetGame: (
    socket: SocketType,
    ...args: Parameters<ClientToServerEvents[GameEvents.ON_GET_GAME]>
  ) => void;
}
