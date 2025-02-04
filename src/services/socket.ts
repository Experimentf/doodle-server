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
    socket.on(SocketEvents.ON_DISCONNECTING, () =>
      this.controller.handleSocketOnDisconnecting(socket)
    );
    socket.on(SocketEvents.ON_DISCONNECT, () =>
      this.controller.handleSocketOnDisconnect(socket)
    );
  }

  /**
   * Register Incoming Member Specific Events
   * @param socket
   */
  private registerDoodlerEvents(socket: SocketType) {
    socket.on(DoodlerEvents.ON_GET_DOODLER, (...args) =>
      this.controller.handleDoodlerOnGet(socket, ...args)
    );
    socket.on(DoodlerEvents.ON_SET_DOODLER, (...args) =>
      this.controller.handleDoodlerOnSet(socket, ...args)
    );
  }

  /**
   * Register Incoming Room Specific Events
   * @param socket
   */
  private registerRoomEvents(socket: SocketType) {
    socket.on(RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM, (...args) =>
      this.controller.handleRoomOnAddDoodlerToPublicRoom(socket, ...args)
    );
    socket.on(RoomEvents.ON_ADD_DOODLER_TO_PRIVATE_ROOM, (...args) =>
      this.controller.handleRoomOnAddDoodlerToPublicRoom(socket, ...args)
    );
    socket.on(RoomEvents.ON_CREATE_PRIVATE_ROOM, (...args) =>
      this.controller.handleRoomOnCreatePrivateRoom(socket, ...args)
    );
    socket.on(RoomEvents.ON_GET_ROOM, (...args) =>
      this.controller.handleRoomOnGetRoom(socket, ...args)
    );
  }

  /**
   * Register Incoming Game Specific Events
   * @param socket
   */
  private registerGameEvents(socket: SocketType) {
    socket.on(GameEvents.ON_GET_GAME, (...args) =>
      this.controller.handleGameOnGetGame(socket, ...args)
    );
  }
}

// Export a singleton
const SocketServiceInstance = new SocketService();
export default SocketServiceInstance;
