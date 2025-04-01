import { GameSocketEvents } from '@/constants/events/socket';
import { ClientToServerEvents, SocketType } from '@/types/socket';

export interface GameControllerInterface {
  handleGameOnGetGame: (
    socket: SocketType
  ) => (
    ...args: Parameters<ClientToServerEvents[GameSocketEvents.ON_GET_GAME]>
  ) => void;
  handleGameOnGameCanvasOperation: (
    socket: SocketType
  ) => (
    ...args: Parameters<
      ClientToServerEvents[GameSocketEvents.ON_GAME_CANVAS_OPERATION]
    >
  ) => void;
  handleGameOnChooseWord: (
    socket: SocketType
  ) => (
    ...args: Parameters<
      ClientToServerEvents[GameSocketEvents.ON_GAME_CHOOSE_WORD]
    >
  ) => void;
}
