import { GameSocketEvents } from '@/constants/events/socket';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface GameControllerInterface {
  handleGameOnGetGame: (
    socket: SocketType
  ) => (
    ...args: Parameters<ClientToServerEvents[GameSocketEvents.ON_GET_GAME]>
  ) => void;
}
