import { Socket } from 'socket.io';
import { IoType, RoomInfoMapType } from '../../types/socket';
import { Member, Room } from '../../Game/Room';

const getRandomRoom = (roomsInfoMap: RoomInfoMapType) => {
  const nRooms = roomsInfoMap.size;
  const roomIdsArray = [];
  for (const [roomId] of roomsInfoMap.entries()) {
    roomIdsArray.push(roomId);
  }
  const randomRoomIndex = Math.round(Math.random() * (nRooms - 1));
  const id = roomIdsArray[randomRoomIndex];
  return roomsInfoMap.get(id);
};

export const onPlayPublicGameHandler = (
  io: IoType,
  socket: Socket,
  rooms: RoomInfoMapType
) => {
  // Store public rooms that have capacity
  const validRooms = new Map<string, Room>();

  // Find public rooms that have capacity
  for (const [roomId, roomInfo] of rooms.entries()) {
    if (roomInfo.type === 'private') continue;
    if (roomInfo.hasCapacity()) validRooms.set(roomId, roomInfo);
  }

  // Room to be joined
  let room = null;

  // If there are rooms with capacity, return one of them
  if (validRooms.size > 0) {
    room = getRandomRoom(validRooms) as Room;
  } else {
    // Otherwise, create a new public room
    room = new Room(io, 'public', 'lobby');
    rooms.set(room.id, room);
  }

  // Join the new room
  socket.join(room.id);
  room.addMember(new Member(socket.id, socket.data.name, socket.data.avatar));

  // Let other users in the room know
  socket.to(room.id).emit('new-user', {
    id: socket.id,
    name: socket.data.name,
    avatar: socket.data.avatar
  });

  // Return the room id
  return room.id;
};
