import { DoodlerModel } from '@/models/Doodler';
import { RoomModel } from '@/models/Room';
import { RoomInfoMapType } from '@/types/game';
import { ServiceResponse } from '@/types/service';
import { ErrorFromServer } from '@/utils/error';
import { ErrorResponse, SuccessResponse } from '@/utils/service';

interface RoomServiceInterface {
  createPublicRoom: () => ServiceResponse<{ roomId: string }>;
  createPrivateRoom: (ownerId: string) => ServiceResponse<{ roomId: string }>;
  findRoom: (roomId: string) => ServiceResponse<{ room: RoomModel }>;
  findRoomWithDoodler: (
    roomId: string,
    doodlerId: string
  ) => ServiceResponse<{ room: RoomModel }>;
  removeDoodlerFromRoom: (
    roomId: string,
    doodlerId: string
  ) => ServiceResponse<boolean>;
  assignDoodlerToPublicRoom: (
    doodlerId: DoodlerModel['id']
  ) => ServiceResponse<{ roomId: string }>;
}

class RoomService implements RoomServiceInterface {
  private rooms: RoomInfoMapType = new Map<string, RoomModel>();

  /**
   * Create a new public room
   * @returns Room ID of the newly created room
   */
  public createPublicRoom() {
    const room = new RoomModel();
    this.rooms.set(room.id, room);
    return SuccessResponse({ roomId: room.id });
  }

  /**
   * Create a new private room
   * @param ownerId - Doodler ID who is the owner of this new room
   * @returns Room ID of the newly created room
   */
  public createPrivateRoom(ownerId: string) {
    const room = new RoomModel(ownerId);
    this.rooms.set(room.id, room);
    return SuccessResponse({ roomId: room.id });
  }

  /**
   * Find a room by room id
   * @param roomId - Room ID of the room to be found
   * @returns Room details
   */
  public findRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return ErrorResponse(new ErrorFromServer('Room not found'));
    return SuccessResponse({ room });
  }

  /**
   * Find a room by room id and doodler
   * @param roomId - Room ID of the room to be found
   * @param doodlerId - Doodler ID
   * @returns Room details
   */
  public findRoomWithDoodler(roomId: string, doodlerId: string) {
    const { data, error } = this.findRoom(roomId);
    if (error || !data) return ErrorResponse(error);
    const { room } = data;
    const doodler = room.doodlers.find((id) => id === doodlerId);
    if (!doodler) return ErrorResponse(new ErrorFromServer('Invalid Room ID!'));
    return SuccessResponse({ room });
  }

  /**
   * Assigms a doodler to a public room
   * @param doodler
   * @returns
   */
  public assignDoodlerToPublicRoom(doodlerId: string) {
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
    if (roomId !== undefined) return SuccessResponse({ roomId });

    // Create a new public room if doodler could not be assigned
    const { data: createPublicRoomData, error: createPublicRoomError } =
      this.createPublicRoom();
    if (createPublicRoomError || createPublicRoomData === undefined)
      return ErrorResponse(createPublicRoomError);
    const { roomId: newRoomId } = createPublicRoomData;

    // Assign doodler to the newly created room
    const { data: isDoodlerAdded, error: addDoodlerToRoomError } =
      this.addDoodlerToRoom(newRoomId, doodlerId);
    if (addDoodlerToRoomError || !isDoodlerAdded)
      return ErrorResponse(addDoodlerToRoomError);
    return SuccessResponse({ roomId: newRoomId });
  }

  /**
   * Remove a doodler from a room
   * 1. Delete the room if the room is empty
   * 2. Select a new owner if the removed doodler was the owner of the room
   * @param roomId Room ID of the room from which a doodler is to be removed
   * @param doodlerId Doodler ID to be removed to the room
   * @returns true if success, false if failure
   */
  public removeDoodlerFromRoom(roomId: string, doodlerId: string) {
    const { data, error } = this.findRoom(roomId);
    if (error || !data) {
      return ErrorResponse(error);
    }
    const { room } = data;
    room.removeDoodler(doodlerId);
    if (room.isEmpty()) {
      const { data: isDeleted, error: deleteError } = this.deleteRoom(roomId);
      if (deleteError || isDeleted === undefined)
        return ErrorResponse(deleteError);
    }
    if (room.isOwner(doodlerId)) {
      const { data: isSelected, error: selectError } =
        this.selectNewOwner(roomId);
      if (selectError || isSelected === undefined)
        return ErrorResponse(selectError);
    }
    return SuccessResponse(true);
  }

  // PRIVATE METHODS
  /**
   * Add a doodler to a room
   * @param roomId Room ID of the room in which a doodler is to be added
   * @param doodler Doodler to be added to the room
   * @returns true if success, false if failure
   */
  private addDoodlerToRoom(roomId: string, doodlerId: string) {
    const { data, error } = this.findRoom(roomId);
    if (error || !data) {
      return ErrorResponse(error);
    }
    const { room } = data;
    const isAdded = room.addDoodler(doodlerId);
    return SuccessResponse(isAdded);
  }

  /**
   * Delete a room by room id
   * @param roomId Room ID of the room to be deleted
   * @returns true if success, false if failure
   */
  private deleteRoom(roomId: string) {
    const { data, error } = this.findRoom(roomId);
    if (error || !data) {
      return ErrorResponse(error);
    }
    const isDeleted = this.rooms.delete(roomId);
    return SuccessResponse(isDeleted);
  }

  /**
   * Select a new owner for a room randomly from its doodlers
   * @param roomId - The room id of the room for which a new owner is to be chosen
   * @returns true for success, false for failure
   */
  private selectNewOwner(roomId: string) {
    const { data, error } = this.findRoom(roomId);
    if (error || !data) {
      return ErrorResponse(error);
    }
    const { room } = data;
    const isOwnerSet = room.setOwner(room.randomDoodlerId);
    return SuccessResponse(isOwnerSet);
  }

  /**
   * Gets a random room
   * @returns Room Id of the room
   */
  private getRandomRoom() {
    const nRooms = this.rooms.size;
    const roomIdsArray = [];
    for (const [roomId] of this.rooms.entries()) {
      roomIdsArray.push(roomId);
    }
    const randomRoomIndex = Math.round(Math.random() * (nRooms - 1));
    const id = roomIdsArray[randomRoomIndex];
    const { data: findRoomData, error: findRoomError } = this.findRoom(id);
    if (findRoomError || findRoomData === undefined)
      return ErrorResponse(findRoomError);
    return SuccessResponse({ roomId: findRoomData.room.id });
  }
}

// Export a singleton
const RoomServiceInstance = new RoomService();
export default RoomServiceInstance;
