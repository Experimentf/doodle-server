import { DoodlerModel } from '@/models/Doodler';
import { RoomModel } from '@/models/Room';
import { RoomInfoMapType } from '@/types/game';
import { RoomInterface } from '@/types/socket/room';
import { ErrorFromServer } from '@/utils/error';

interface RoomServiceInterface {
  createPublicRoom: () => Promise<{ roomId: string }>;
  createPrivateRoom: (ownerId: string) => Promise<{ roomId: string }>;
  findRoom: (roomId: string) => Promise<{ room: RoomInterface }>;
  findRoomWithDoodler: (
    roomId: string,
    doodlerId: string
  ) => Promise<{ room: RoomInterface }>;
  assignDoodlerToPublicRoom: (doodlerId: DoodlerModel['id']) => Promise<{
    roomId: string;
  }>;
  removeDoodlerFromRoom: (roomId: string, doodlerId: string) => Promise<void>;
}

class RoomService implements RoomServiceInterface {
  private rooms: RoomInfoMapType = new Map<string, RoomModel>(); // ROOM ID -> ROOM DETAILS

  /**
   * Create a new public room
   * @returns Room ID of the newly created room
   */
  public async createPublicRoom() {
    const room = new RoomModel();
    this.rooms.set(room.id, room);
    return { roomId: room.id };
  }

  /**
   * Create a new private room
   * @param ownerId - Doodler ID who is the owner of this new room
   * @returns Room ID of the newly created room
   */
  public async createPrivateRoom(ownerId: string) {
    const room = new RoomModel(ownerId);
    this.rooms.set(room.id, room);
    return { roomId: room.id };
  }

  /**
   * Find a room by room id
   * @param roomId - Room ID of the room to be found
   * @returns Room details
   */
  public async findRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) throw new ErrorFromServer('Room not found');
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
    if (!doodler) throw new ErrorFromServer('Invalid Room ID!');
    return { room };
  }

  /**
   * Assigms a doodler to a public room
   * @param doodler
   * @returns
   */
  public async assignDoodlerToPublicRoom(doodlerId: string) {
    let roomId: string | undefined = undefined;
    // Assign doodler to the first available room
    for (const room of this.rooms.values()) {
      if (room.isPrivate) continue;
      const isDoodlerAdded = room.addDoodler(doodlerId);
      if (isDoodlerAdded) {
        roomId = room.id;
        break;
      }
    }
    if (roomId !== undefined) return { roomId };

    // Create a new public room if doodler could not be assigned
    const { roomId: newRoomId } = await this.createPublicRoom();

    // Assign doodler to the newly created room
    await this.addDoodlerToRoom(newRoomId, doodlerId);
    return { roomId: newRoomId };
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
    const { room } = await this.findRoomModel(roomId);
    room.removeDoodler(doodlerId);
    if (room.isEmpty()) {
      await this.deleteRoom(roomId);
    }
    if (room.isOwner(doodlerId)) {
      await this.selectNewOwner(roomId);
    }
  }

  // PRIVATE METHODS
  /**
   * Find a room by room id
   * @param roomId - Room ID of the room to be found
   * @returns Room details
   */
  private async findRoomModel(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) throw new ErrorFromServer('Room not found');
    return { room: room };
  }

  /**
   * Add a doodler to a room
   * @param roomId Room ID of the room in which a doodler is to be added
   * @param doodler Doodler to be added to the room
   * @returns true if success, false if failure
   */
  private async addDoodlerToRoom(roomId: string, doodlerId: string) {
    const { room } = await this.findRoomModel(roomId);
    const isAdded = room.addDoodler(doodlerId);
    return isAdded;
  }

  /**
   * Delete a room by room id
   * @param roomId Room ID of the room to be deleted
   * @returns true if success, false if failure
   */
  private async deleteRoom(roomId: string) {
    const data = await this.findRoom(roomId);
    const isDeleted = this.rooms.delete(data.room.id);
    return isDeleted;
  }

  /**
   * Select a new owner for a room randomly from its doodlers
   * @param roomId - The room id of the room for which a new owner is to be chosen
   * @returns true for success, false for failure
   */
  private async selectNewOwner(roomId: string) {
    const { room } = await this.findRoomModel(roomId);
    const isOwnerSet = room.setOwner(room.randomDoodlerId);
    return isOwnerSet;
  }

  /**
   * Gets a random room
   * @returns Room Id of the room
   */
  private async getRandomRoom() {
    const nRooms = this.rooms.size;
    const roomIdsArray = [];
    for (const [roomId] of this.rooms.entries()) {
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
