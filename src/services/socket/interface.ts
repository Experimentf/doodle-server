import { IoType } from '@/types/socket';

export interface SocketServiceInterface {
  start: (io: IoType) => void;
}
