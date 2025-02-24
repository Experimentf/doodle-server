import { DEFAULT_CAPACITY } from '@/constants/game';
import { DoodlerInterface } from '@/types/socket/doodler';
import { generateId } from '@/utils/unique';

/**
 * FOR USE INSIDE ROOM SERVICE ONLY
 * TO SEND DATA TO CLIENT OR ANOTHER SERVICE, USE ROOM INTERFACE INSTEAD
 */
export class RoomModel {
  // Public Variables
  public readonly id: string;
  public readonly doodlers = new Array<DoodlerInterface['id']>();
  public readonly isPrivate: boolean;
  public readonly capacity = DEFAULT_CAPACITY;

  // Private Variables
  private _ownerId?: string;
  private _gameId?: string;
  private _drawerId?: string;

  constructor(ownerId?: string) {
    this.id = generateId(); // TODO: handle collision
    this.isPrivate = ownerId !== undefined;
    this.setOwnerId(ownerId);
  }

  // Owner Id
  public get ownerId() {
    return this._ownerId;
  }

  public setOwnerId(doodlerId?: string) {
    this._ownerId = doodlerId;
  }

  // Game Id
  public get gameId() {
    return this._gameId;
  }

  public setGameId(gameId?: string) {
    this._gameId = gameId;
  }

  // Drawer Id
  public get drawerId() {
    return this._drawerId;
  }

  public setDrawerId = (drawerId?: string) => {
    this._drawerId = drawerId;
  };

  // Add a new doodler to the room
  public addDoodler(doodlerId: string) {
    if (this.doodlers.length === this.capacity) return false;
    this.doodlers.push(doodlerId);
    return true;
  }

  // Remove a doodler from the room
  public removeDoodler(doodlerId: string) {
    const index = this.doodlers.findIndex((id) => id === doodlerId);
    if (index === -1) return false;
    this.doodlers.splice(index, 1);
    return true;
  }

  // Find a doodler in the room
  public findDoodler(doodlerId: string) {
    return this.doodlers.find((id) => id === doodlerId);
  }

  // Get a random doodler
  public get randomDoodlerId() {
    const index = Math.round(Math.random() * (this.doodlers.length - 1));
    return this.doodlers[index];
  }

  // Check if the doodler is an owner of this room
  public isOwner(doodlerId: string) {
    return this._ownerId === doodlerId;
  }

  // Returns if the room has no doodlers
  public isEmpty() {
    return this.doodlers.length === 0;
  }

  // Move the drawer to the next doodler
  public get nextDrawerId() {
    const index = this.doodlers.findIndex((id) => id === this._drawerId);
    let newIndex = index + 1;
    if (index === -1 || index === this.doodlers.length - 1) newIndex = 0;
    return this.doodlers[newIndex];
  }

  public get json() {
    return {
      id: this.id,
      capacity: this.capacity,
      isPrivate: this.isPrivate,
      doodlers: this.doodlers,
      ownerId: this._ownerId,
      gameId: this._gameId,
      drawerId: this._drawerId
    };
  }
}
