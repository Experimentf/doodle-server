import { GameSocketEvents, RoomSocketEvents } from '@/constants/events/socket';
import DoodlerServiceInstance from '@/services/doodler/DoodlerService';
import GameServiceInstance from '@/services/game/GameService';
import RoomServiceInstance from '@/services/room/RoomService';
import { GameStatus } from '@/types/game';

import { SocketControllerInterface } from './interface';

class SocketController implements SocketControllerInterface {
  /**
   * Handle the socket disconnecting event
   * 1. Remove Doodler from room
   * 2. Check room validitiy for a game
   * 3. End game if invalid game
   */
  public handleSocketOnDisconnecting: SocketControllerInterface['handleSocketOnDisconnecting'] =
    (socket) => async () => {
      const roomIds: string[] = [];
      socket.rooms.forEach((id) => id !== socket.id && roomIds.push(id));
      Promise.all(
        roomIds.map(async (roomId) => {
          const doodlerId = socket.id;
          const room = await RoomServiceInstance.removeDoodlerFromRoom(
            roomId,
            doodlerId
          );
          socket.to(roomId).emit(RoomSocketEvents.EMIT_DOODLER_LEAVE, {
            doodlerId
          });
          const isValidGameRoom =
            await RoomServiceInstance.isValidGameRoom(roomId);
          if (!isValidGameRoom && room) {
            const { gameId } = await RoomServiceInstance.findRoom(roomId);
            if (gameId)
              await GameServiceInstance.updateStatus(gameId, GameStatus.LOBBY);
            socket
              .to(roomId)
              .emit(GameSocketEvents.EMIT_GAME_LOBBY, { drawerId: undefined });
          }
        })
      ).finally(async () => {
        DoodlerServiceInstance.removeDoodler(socket.id);
      });
    };

  /**
   * Handle the socket disconnect event
   */
  public handleSocketOnDisconnect: SocketControllerInterface['handleSocketOnDisconnect'] =
    (socket) => async () => {
      console.log('User disconnected :', socket.id);
    };
}

export default SocketController;
