import { DEFAULT_CAPACITY } from '@/constants/game';
import { generateId } from '@/utils/unique';

import { DoodlerModel } from './Doodler';

/**
 * FOR USE INSIDE ROOM SERVICE ONLY
 * TO SEND DATA TO CLIENT OR ANOTHER SERVICE, USE ROOM INTERFACE INSTEAD
 */
export class RoomModel {
  // Public Variables
  public readonly id: string;
  public readonly doodlers = new Array<DoodlerModel['id']>();
  public readonly isPrivate: boolean;
  public readonly capacity = DEFAULT_CAPACITY;

  // Private Variables
  private ownerId?: string;
  private gameId?: string;

  constructor(ownerId?: string) {
    this.id = generateId(); // TODO: handle collision
    this.isPrivate = ownerId !== undefined;
    this.setOwner(ownerId);
  }

  public get json() {
    return {
      id: this.id,
      capacity: this.capacity,
      isPrivate: this.isPrivate,
      doodlers: this.doodlers,
      ownerId: this.ownerId,
      gameId: this.gameId
    };
  }

  // Returns the current owner of the room
  public getOwnerId() {
    return this.ownerId;
  }

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

  // Set an onwer
  public setOwner(doodlerId?: string) {
    this.ownerId = doodlerId;
    return true;
  }

  // Check if the doodler is an owner of this room
  public isOwner(doodlerId: string) {
    return this.ownerId === doodlerId;
  }

  // Returns if the room has no doodlers
  public isEmpty() {
    return this.doodlers.length === 0;
  }
}
