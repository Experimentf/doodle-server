import { IoType, ServerToClientEvents } from '@/types/socket';

export interface SocketServiceInterface {
  start: (io: IoType) => void;
  emitEvent: <K extends keyof ServerToClientEvents>(
    socketId: string,
    ev: K,
    payload: Parameters<ServerToClientEvents[K]>
  ) => void;
  emitEventInRoomExceptOne: <K extends keyof ServerToClientEvents>(
    roomId: string,
    socketId: string,
    ev: K,
    payload: Parameters<ServerToClientEvents[K]>
  ) => void;
}
