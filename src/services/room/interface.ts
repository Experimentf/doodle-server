import { DoodlerInterface } from '@/types/socket/doodler';
import { GameInterface } from '@/types/socket/game';
import { RoomInterface } from '@/types/socket/room';

export interface RoomServiceInterface {
  // FUNDAMENTALS
  isValidGameRoom: (roomId: string) => Promise<boolean>;
  findRoom: (roomId: string) => Promise<RoomInterface>;

  // ROOM WITH DOODLER
  findRoomWithDoodler: (
    roomId: string,
    doodlerId: string
  ) => Promise<RoomInterface>;
  assignDoodlerToPublicRoom: (
    doodlerId: DoodlerInterface['id']
  ) => Promise<RoomInterface>;
  removeDoodlerFromRoom: (
    roomId: string,
    doodlerId: string
  ) => Promise<RoomInterface | undefined>;

  // ROOM WITH GAME
  assignGameToRoom: (
    roomId: string,
    gameId: GameInterface['id']
  ) => Promise<RoomInterface>;
  changeDrawerTurn: (roomId: string) => Promise<RoomInterface>;
}
