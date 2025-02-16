import { DoodlerInterface } from '@/types/socket/doodler';
import { GameInterface } from '@/types/socket/game';
import { RoomInterface } from '@/types/socket/room';

export interface RoomServiceInterface {
  // FUNDAMENTALS
  isValidGameRoom: (roomId: string) => Promise<boolean>;
  createPublicRoom: () => Promise<{ roomId: string }>;
  createPrivateRoom: (ownerId: string) => Promise<{ roomId: string }>;
  findRoom: (roomId: string) => Promise<{ room: RoomInterface }>;

  // ROOM WITH DOODLER
  findRoomWithDoodler: (
    roomId: string,
    doodlerId: string
  ) => Promise<{ room: RoomInterface }>;
  assignDoodlerToPublicRoom: (
    doodlerId: DoodlerInterface['id']
  ) => Promise<RoomInterface>;
  removeDoodlerFromRoom: (roomId: string, doodlerId: string) => Promise<void>;

  // ROOM WITH GAME
  assignGameToRoom: (
    roomId: string,
    gameId: GameInterface['id']
  ) => Promise<void>;
  changeDrawerTurn: (roomId: string) => Promise<DoodlerInterface['id']>;
}
