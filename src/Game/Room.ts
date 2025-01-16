import { IoType } from '../types/socket';
import { ErrorFromServer } from '../utils/error';
import { generateId } from '../utils/unique';

type GameStatus = 'game' | 'lobby' | 'end';

type RoomType = 'public' | 'private';

export class Member {
  id: string;
  name: string;
  avatar: object;

  constructor(id: string, name: string, avatar: object) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }
}

export class Room {
  capacity = 2;
  id: string;
  members = new Array<Member>();
  type: RoomType;
  status: GameStatus;
  ownerId?: string;
  io: IoType;

  constructor(
    io: IoType,
    type: 'public' | 'private',
    status: 'game' | 'lobby',
    ownerId?: string
  ) {
    this.io = io;
    this.id = generateId();
    this.type = type;
    this.status = status;
    this.ownerId = ownerId;
  }

  // Does the room have capacity ?
  hasCapacity() {
    return this.members.length < this.capacity;
  }

  // Add a new member to the room
  addMember(member: Member) {
    if (this.members.length === this.capacity)
      throw new ErrorFromServer('Room capacity reached!');
    this.members.push(member);
  }

  // Remove a member from the room
  removeMember(id: string) {
    const newMembers = this.members.filter((member) => member.id !== id);
    const memberToBeRemoved = this.members.find((member) => member.id === id);
    this.members = newMembers;
    return memberToBeRemoved;
  }

  // Members in the room
  getMembers() {
    return this.members;
  }

  // Get the number of members in the room
  getNumberOfMembers() {
    return this.members.length;
  }

  // Check if the member is an owner of this room
  isOwner(id: string) {
    return this.ownerId === id;
  }

  // Get room details in json
  getJSON() {
    return {
      capacity: this.capacity,
      status: this.status,
      type: this.type,
      members: this.members.map((member) => ({
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        isOwner: this.ownerId === member.id
      }))
    };
  }

  // Start the game
  start() {
    this.status = 'game';
    this.io.to(this.id).emit('game-start');
  }

  // End the game
  end() {
    this.status = 'end';
    this.io.to(this.id).emit('game-end');
  }

  // Lobby the game
  lobby() {
    this.status = 'lobby';
    this.io.to(this.id).emit('game-lobby');
  }
}
