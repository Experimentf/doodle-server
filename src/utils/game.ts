import { HunchInterface, HunchStatus } from '@/types/socket/game';

export const createHunch = (
  message: string,
  status: HunchStatus,
  senderId?: string
): HunchInterface => ({
  message,
  status,
  senderId,
  isSystemMessage: senderId === undefined
});
