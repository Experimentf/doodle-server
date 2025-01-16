import { Socket } from 'socket.io';
import { IoType, RoomInfoMapType } from '../../types/socket';

export const onSocketConnectHandler = (io: IoType, socket: Socket) => {
  console.log('User connected :', socket.id);
};

export const onSocketDisconnectHandler = (
  io: IoType,
  socket: Socket,
  rooms: RoomInfoMapType
) => {
  socket.rooms.forEach((roomId) => {
    // Let other people in the room know you are leaving
    socket.to(roomId).emit('user-leave', {
      id: socket.id,
      name: socket.data.name
    });
    const room = rooms.get(roomId);
    const memberDetail = room?.removeMember(socket.id);
    const nMembersLeft = room?.getNumberOfMembers();

    // End a game if there is only one member left
    if (nMembersLeft && nMembersLeft < 2) {
      room?.lobby();
    }

    // Delete the room if you are its owner or if you were the only member
    if (
      (memberDetail && room?.isOwner(memberDetail?.id)) ||
      nMembersLeft === 0
    ) {
      rooms.delete(roomId);
      console.log('Delete Room :', roomId);
    }
  });
};
