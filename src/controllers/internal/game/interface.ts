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
  handleGameOnGameHunch: (
    socket: SocketType
  ) => (
    ...args: Parameters<ClientToServerEvents[GameSocketEvents.ON_GAME_HUNCH]>
  ) => void;
  handleGameOnStartPrivateGame: (
    socket: SocketType
  ) => (
    ...args: Parameters<
      ClientToServerEvents[GameSocketEvents.ON_GAME_START_PRIVATE_GAME]
    >
  ) => void;
  handleGameOnUpdatePrivateSetting: (
    socket: SocketType
  ) => (
    ...args: Parameters<
      ClientToServerEvents[GameSocketEvents.ON_GAME_UPDATE_PRIVATE_SETTING]
    >
  ) => void;
}
