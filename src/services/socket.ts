import Controller, { ControllerInterface } from '@/controllers';
import { IoType, SocketType } from '@/types/socket';

import {
  DoodlerEvents,
  GameEvents,
  RoomEvents,
  SocketEvents
} from '../constants/events';

interface SocketServiceInterface {
  start: (io: IoType) => void;
}

class SocketService implements SocketServiceInterface {
  private io?: IoType;
  private controller = new Controller() as unknown as ControllerInterface;

  /**
   * Register Incoming Connections on IO
   */
  public start(io: IoType) {
    this.io = io;
    io.on('connection', (socket) => {
      console.log('User connected :', socket.id);
      this.controller.setControllerSocket(socket);
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
      this.controller.handleSocketOnDisconnecting
    );
    socket.on(
      SocketEvents.ON_DISCONNECT,
      this.controller.handleSocketOnDisconnect
    );
  }

  /**
   * Register Incoming Member Specific Events
   * @param socket
   */
  private registerDoodlerEvents(socket: SocketType) {
    socket.on(DoodlerEvents.ON_GET_DOODLER, this.controller.handleDoodlerOnGet);
    socket.on(DoodlerEvents.ON_SET_DOODLER, this.controller.handleDoodlerOnSet);
  }

  /**
   * Register Incoming Room Specific Events
   * @param socket
   */
  private registerRoomEvents(socket: SocketType) {
    socket.on(
      RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM,
      this.controller.handleRoomOnAddDoodlerToPublicRoom
    );
  }

  /**
   * Register Incoming Game Specific Events
   * @param socket
   */
  private registerGameEvents(socket: SocketType) {
    socket.on(
      GameEvents.ON_GET_GAME_DETAILS,
      this.controller.handleGameOnGetGameDetails
    );
  }
}

// Export a singleton
const SocketServiceInstance = new SocketService();
export default SocketServiceInstance;
