import { GameStatus, RoomMode } from '@/types/game';

import {
  DEFAULT_CAPACITY,
  DEFAULT_MAX_ROUNDS,
  DEFAULT_MAX_TIME
} from '@/constants/game';
import { IoType } from '@/types/socket';
import { ErrorFromServer } from '@/utils/error';
import { generateId } from '@/utils/unique';
import { Member } from './Member';

export class Room {
  // Defaults
  currentRound = 0;
  capacity = DEFAULT_CAPACITY;
  maxRounds = DEFAULT_MAX_ROUNDS;
  maxTime = DEFAULT_MAX_TIME;
  members = new Array<Member>();
  status: GameStatus = GameStatus.LOBBY;

  // Customs
  id: string;
  type: RoomMode;
  ownerId?: string;
  io: IoType;

  constructor(io: IoType, type: RoomMode, ownerId?: string) {
    this.io = io;
    this.id = generateId(); // TODO: handle collision
    this.type = type;
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

  // Start a round
  startNextRound() {
    if (this.currentRound === this.maxRounds) return;
    this.currentRound += 1;
  }

  // Start the game
  startGame() {
    this.status = GameStatus.GAME;
    this.io.to(this.id).emit('game-start');
    this.startNextRound();
  }

  // End the game
  endGame() {
    this.status = GameStatus.END;
    this.io.to(this.id).emit('game-end');
  }

  // Lobby the game
  lobbyGame() {
    this.status = GameStatus.LOBBY;
    this.io.to(this.id).emit('game-lobby');
  }
}
