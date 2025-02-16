import { MINIMUM_VALID_SIZE } from '@/constants/game';
import { RoomModel } from '@/models/RoomModel';
import { RoomInfoMapType } from '@/types/game';
import { DoodlerInterface } from '@/types/socket/doodler';
import { GameInterface } from '@/types/socket/game';
import { RoomInterface } from '@/types/socket/room';
import { DoodleServerError } from '@/utils/error';

interface RoomServiceInterface {
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

class RoomService implements RoomServiceInterface {
  private _rooms: RoomInfoMapType = new Map<string, RoomModel>(); // ROOM ID -> ROOM DETAILS

  /**
   *
   * @param roomId RoomID to check validity for game
   * @returns true if valid, false if invalid
   */
  public async isValidGameRoom(roomId: string) {
    try {
      const { room } = await this.findRoom(roomId);
      return room.doodlers.length >= MINIMUM_VALID_SIZE;
    } catch (e) {
      return false;
    }
  }

  /**
   * Create a new public room
   * @returns Room ID of the newly created room
   */
  public async createPublicRoom() {
    const room = new RoomModel();
    this._rooms.set(room.id, room);
    return { roomId: room.id };
  }

  /**
   * Create a new private room
   * @param ownerId - Doodler ID who is the owner of this new room
   * @returns Room ID of the newly created room
   */
  public async createPrivateRoom(ownerId: string) {
    const room = new RoomModel(ownerId);
    this._rooms.set(room.id, room);
    return { roomId: room.id };
  }

  /**
   * Find a room by room id
   * @param roomId - Room ID of the room to be found
   * @returns Room details
   */
  public async findRoom(roomId: string) {
    const room = this._rooms.get(roomId);
    if (!room) throw new DoodleServerError('Room not found');
    return { room: room.json };
  }

  /**
   * Find a room by room id and doodler
   * @param roomId - Room ID of the room to be found
   * @param doodlerId - Doodler ID
   * @returns Room details
   */
  public async findRoomWithDoodler(roomId: string, doodlerId: string) {
    const data = await this.findRoom(roomId);
    const { room } = data;
    const doodler = room.doodlers.find((id) => id === doodlerId);
    if (!doodler) throw new DoodleServerError('Invalid Room ID!');
    return { room };
  }

  /**
   * Assigms a doodler to a public room
   * @param doodler
   * @returns
   */
  public async assignDoodlerToPublicRoom(doodlerId: string) {
    let roomInterface: RoomInterface | undefined = undefined;
    // Assign doodler to the first available room
    for (const room of this._rooms.values()) {
      if (room.isPrivate) continue;
      const isDoodlerAdded = room.addDoodler(doodlerId);
      if (isDoodlerAdded) {
        roomInterface = room.json;
        break;
      }
    }
    if (roomInterface !== undefined) return roomInterface;

    // Create a new public room if doodler could not be assigned
    const { roomId: newRoomId } = await this.createPublicRoom();
    const { room: newRoomInterface } = await this.findRoom(newRoomId);

    // Assign doodler to the newly created room
    await this._addDoodlerToRoom(newRoomId, doodlerId);
    return newRoomInterface;
  }

  /**
   * Remove a doodler from a room
   * 1. Delete the room if the room is empty
   * 2. Select a new owner if the removed doodler was the owner of the room
   * @param roomId Room ID of the room from which a doodler is to be removed
   * @param doodlerId Doodler ID to be removed to the room
   * @returns true if success, false if failure
   */
  public async removeDoodlerFromRoom(roomId: string, doodlerId: string) {
    const { room } = await this._findRoomModel(roomId);
    room.removeDoodler(doodlerId);
    if (room.isEmpty()) {
      await this._deleteRoom(roomId);
    }
    if (room.isOwner(doodlerId)) {
      await this._selectNewOwner(roomId);
    }
  }

  /**
   *
   * @param roomId
   * @param gameId
   * returns - void
   */
  public async assignGameToRoom(roomId: string, gameId: string) {
    const { room } = await this._findRoomModel(roomId);
    room.setGame(gameId);
  }

  public async changeDrawerTurn(roomId: string) {
    const { room } = await this._findRoomModel(roomId);
    return room.nextTurn();
  }

  // PRIVATE METHODS
  /**
   * Find a room by room id
   * @param roomId - Room ID of the room to be found
   * @returns Room details
   */
  private async _findRoomModel(roomId: string) {
    const room = this._rooms.get(roomId);
    if (!room) throw new DoodleServerError('Room not found');
    return { room: room };
  }

  /**
   * Add a doodler to a room
   * @param roomId Room ID of the room in which a doodler is to be added
   * @param doodler Doodler to be added to the room
   * @returns true if success, false if failure
   */
  private async _addDoodlerToRoom(roomId: string, doodlerId: string) {
    const { room } = await this._findRoomModel(roomId);
    const isAdded = room.addDoodler(doodlerId);
    return isAdded;
  }

  /**
   * Delete a room by room id
   * @param roomId Room ID of the room to be deleted
   * @returns true if success, false if failure
   */
  private async _deleteRoom(roomId: string) {
    const data = await this.findRoom(roomId);
    const isDeleted = this._rooms.delete(data.room.id);
    return isDeleted;
  }

  /**
   * Select a new owner for a room randomly from its doodlers
   * @param roomId - The room id of the room for which a new owner is to be chosen
   * @returns true for success, false for failure
   */
  private async _selectNewOwner(roomId: string) {
    const { room } = await this._findRoomModel(roomId);
    const isOwnerSet = room.setOwner(room.randomDoodlerId);
    return isOwnerSet;
  }

  /**
   * Gets a random room
   * @returns Room Id of the room
   */
  private async _getRandomRoom() {
    const nRooms = this._rooms.size;
    const roomIdsArray = [];
    for (const [roomId] of this._rooms.entries()) {
      roomIdsArray.push(roomId);
    }
    const randomRoomIndex = Math.round(Math.random() * (nRooms - 1));
    const id = roomIdsArray[randomRoomIndex];
    const findRoomData = await this.findRoom(id);
    return { roomId: findRoomData.room.id };
  }
}

// Export a singleton
const RoomServiceInstance = new RoomService();
export default RoomServiceInstance;
