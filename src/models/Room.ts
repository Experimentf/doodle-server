import { DEFAULT_CAPACITY } from '@/constants/game';
import { generateId } from '@/utils/unique';

import { DoodlerModel } from './Doodler';

export class RoomModel {
  // Public Variables
  public readonly id: string;
  public readonly doodlers = new Array<DoodlerModel>();
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

  // Returns the current number of members
  public get currentSize() {
    return this.doodlers.length;
  }

  // Returns the current owner of the room
  public getOwnerId() {
    return this.ownerId;
  }

  // Add a new doodler to the room
  public addDoodler(doodler: DoodlerModel) {
    if (this.doodlers.length === this.capacity) return false;
    this.doodlers.push(doodler);
    return true;
  }

  // Remove a doodler from the room
  public removeDoodler(doodlerId: string) {
    const index = this.doodlers.findIndex(({ id }) => id === doodlerId);
    if (index === -1) return false;
    this.doodlers.splice(index, 1);
    return true;
  }

  // Find a doodler in the room
  public findDoodler(doodlerId: string) {
    return this.doodlers.find(({ id }) => id === doodlerId);
  }

  // Get a random doodler
  public get randomDoodler() {
    const index = Math.round(Math.random() * (this.currentSize - 1));
    return this.doodlers[index];
  }

  // Set an onwer
  public setOwner(doodlerId?: string) {
    this.ownerId = doodlerId;
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
