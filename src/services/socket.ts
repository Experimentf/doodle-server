import SocketController from '@/controllers/socket';
import { IoType, SocketType } from '@/types/socket';

import {
  DoodlerEvents,
  GameEvents,
  RoomEvents,
  SocketEvents
} from '../types/socket/events';

interface SocketServiceInterface {
  start: (io: IoType) => void;
}

class SocketService implements SocketServiceInterface {
  private io?: IoType;
  private socketController = new SocketController();

  /**
   * Register Incoming Connections on IO
   */
  public start(io: IoType) {
    this.io = io;
    io.on('connection', (socket) => {
      console.log('User connected :', socket.id);
      this.socketController.setSocket(socket);
      this.registerSocketEvents(socket);
      this.registerDoodlerEvents(socket);
      this.registerRoomEvents(socket);
      this.registerGameEvents(socket);
    });
  }

  // PRIVATE METHODS
  /**
   * Register Incoming Socket Specific Events
   * @param socket
   */
  private registerSocketEvents(socket: SocketType) {
    socket.on(
      SocketEvents.ON_DISCONNECTING,
      this.socketController.handleSocketOnDisconnecting
    );
    socket.on(
      SocketEvents.ON_DISCONNECT,
      this.socketController.handleSocketOnDisconnect
    );
  }

  /**
   * Register Incoming Member Specific Events
   * @param socket
   */
  private registerDoodlerEvents(socket: SocketType) {
    socket.on(
      DoodlerEvents.ON_GET_DOODLER,
      this.socketController.handleDoodlerOnGet
    );
    socket.on(
      DoodlerEvents.ON_SET_DOODLER,
      this.socketController.handleDoodlerOnSet
    );
  }

  /**
   * Register Incoming Room Specific Events
   * @param socket
   */
  private registerRoomEvents(socket: SocketType) {
    socket.on(
      RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM,
      this.socketController.handleRoomOnAddDoodlerToPublicRoom
    );
  }

  /**
   * Register Incoming Game Specific Events
   * @param socket
   */
  private registerGameEvents(socket: SocketType) {
    socket.on(
      GameEvents.ON_GET_GAME_DETAILS,
      this.socketController.handleGameOnGetGameDetails
    );
  }
}

// Export a singleton
const SocketServiceInstance = new SocketService();
export default SocketServiceInstance;
