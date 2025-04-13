import { MINIMUM_VALID_SIZE } from '@/constants/game';
import { RoomModel } from '@/models/RoomModel';
import { RoomInfoMapType } from '@/types/game';
import { RoomInterface } from '@/types/socket/room';
import { DoodleServerError } from '@/utils/error';

import DoodlerServiceInstance from '../doodler/DoodlerService';
import { RoomServiceInterface } from './interface';

class RoomService implements RoomServiceInterface {
  private _rooms: RoomInfoMapType = new Map<string, RoomModel>(); // ROOM ID -> ROOM DETAILS

  /**
   * Create a new room
   * @param ownerId - Doodler ID who is the owner of this new room. If undefined, the room will be public.
   * @returns Room Interface of the newly created room
   */
  public async createRoom(ownerId?: string) {
    const room = new RoomModel(ownerId);
    this._rooms.set(room.id, room);
    if (ownerId) room.addDoodler(ownerId);
    return room.json;
  }

  /**
   *
   * @param roomId RoomID to check validity for game
   * @returns true if valid, false if invalid
   */
  public async isValidGameRoom(roomId: string) {
    try {
      const room = await this.findRoom(roomId);
      return room.doodlers.length >= MINIMUM_VALID_SIZE;
    } catch (e) {
      return false;
    }
  }

  /**
   * Find a room by room id
   * @param roomId - Room ID of the room to be found
   * @returns Room details
   */
  public async findRoom(roomId: string) {
    const room = this._rooms.get(roomId);
    if (!room) throw new DoodleServerError('Room not found');
    return room.json;
  }

  /**
   * Find a room by room id and doodler
   * @param roomId - Room ID of the room to be found
   * @param doodlerId - Doodler ID
   * @returns Room details
   */
  public async findRoomWithDoodler(roomId: string, doodlerId: string) {
    const room = await this.findRoom(roomId);
    const doodler = room.doodlers.find((id) => id === doodlerId);
    if (!doodler) throw new DoodleServerError('Invalid Room ID!');
    return room;
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
    const roomModel = await this._createRoomModel();

    // Assign doodler to the newly created room
    const isAdded = roomModel.addDoodler(doodlerId);
    if (!isAdded) throw new DoodleServerError('Could not add!');
    return roomModel.json;
  }

  /**
   * Assigms a doodler to a public room
   * @param doodler
   * @returns
   */
  public async assignDoodlerToPrivateRoom(roomId: string, doodlerId: string) {
    const room = await this._findRoomModel(roomId);
    if (!room.isPrivate) throw new DoodleServerError('Invalid room!');
    const isDoodlerAdded = room.addDoodler(doodlerId);
    if (isDoodlerAdded) return room.json;
    else throw new DoodleServerError('Invalid room!');
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
    const roomModel = await this._findRoomModel(roomId);
    roomModel.removeDoodler(doodlerId);
    if (roomModel.isEmpty()) {
      await this._deleteRoom(roomId);
      return undefined;
    }
    if (roomModel.isOwner(doodlerId)) {
      await this._selectNewOwner(roomId);
    }
    return roomModel.json;
  }

  /**
   *
   * @param roomId
   * @param gameId
   * returns - void
   */
  public async assignGameToRoom(roomId: string, gameId: string) {
    const roomModel = await this._findRoomModel(roomId);
    roomModel.setGameId(gameId);
    return roomModel.json;
  }

  /**
   *
   * @param roomId
   * @returns
   */
  public async changeDrawerTurn(roomId: string, remove = false) {
    const roomModel = await this._findRoomModel(roomId);
    const nextDrawerId = remove ? undefined : roomModel.nextDrawerId;
    roomModel.setDrawerId(nextDrawerId);
    return roomModel.json;
  }

  /**
   * Resets all the doodler scores to 0
   * @param roomId Room ID
   */
  public async resetScoreboard(roomId: string) {
    const room = await this.findRoom(roomId);
    await Promise.all(
      room.doodlers.map(
        async (doodlerId) => await DoodlerServiceInstance.clearScore(doodlerId)
      )
    );
  }

  // PRIVATE METHODS
  /**
   * Create a new room
   * @param ownerId - Doodler ID who is the owner of this new room. If undefined, the room will be public.
   * @returns Room model of the newly created room
   */
  private async _createRoomModel(ownerId?: string) {
    const room = new RoomModel(ownerId);
    this._rooms.set(room.id, room);
    return room;
  }

  /**
   * Find a room by room id
   * @param roomId - Room ID of the room to be found
   * @returns Room details
   */
  private async _findRoomModel(roomId: string) {
    const roomModel = this._rooms.get(roomId);
    if (!roomModel) throw new DoodleServerError('Room not found');
    return roomModel;
  }

  /**
   * Delete a room by room id
   * @param roomId Room ID of the room to be deleted
   * @returns true if success, false if failure
   */
  private async _deleteRoom(roomId: string) {
    const room = await this.findRoom(roomId);
    const isDeleted = this._rooms.delete(room.id);
    return isDeleted;
  }

  /**
   * Select a new owner for a room randomly from its doodlers
   * @param roomId - The room id of the room for which a new owner is to be chosen
   * @returns true for success, false for failure
   */
  private async _selectNewOwner(roomId: string) {
    const roomModel = await this._findRoomModel(roomId);
    const newOwnerId = roomModel.randomDoodlerId;
    roomModel.setOwnerId(newOwnerId);
    return newOwnerId;
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
    const room = await this.findRoom(id);
    return { roomId: room.id };
  }
}

// Export a singleton
const RoomServiceInstance = new RoomService();
export default RoomServiceInstance;
