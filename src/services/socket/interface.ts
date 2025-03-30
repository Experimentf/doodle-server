import { IoType, ServerToClientEvents } from '@/types/socket';

export interface SocketServiceInterface {
  start: (io: IoType) => void;
  emitEventToClientRoom: <K extends keyof ServerToClientEvents>(
    roomId: string,
    ev: K,
    payload: Parameters<ServerToClientEvents[K]>
  ) => void;
}
