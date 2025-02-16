import Controller, { ControllerInterface } from '@/controllers';
import { ClientToServerEvents, IoType, SocketType } from '@/types/socket';
import { ErrorFromServer } from '@/utils/error';

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
      this.registerSocketReservedEvents(socket);
      this.registerDoodlerEvents(socket);
      this.registerRoomEvents(socket);
      this.registerGameEvents(socket);
    });
  }

  // PRIVATE METHODS
  /**
   * Register Socket RESERVED Events
   * @param socket
   */
  private registerSocketReservedEvents(socket: SocketType) {
    this.registerReservedEvent(
      socket,
      SocketEvents.ON_DISCONNECTING,
      this.controller.handleSocketOnDisconnecting(socket)
    );
    this.registerReservedEvent(
      socket,
      SocketEvents.ON_DISCONNECT,
      this.controller.handleSocketOnDisconnect(socket)
    );
  }

  /**
   * Register Incoming Doodler Specific Events
   * @param socket
   */
  private registerDoodlerEvents(socket: SocketType) {
    this.registerCustomEvent(
      socket,
      DoodlerEvents.ON_GET_DOODLER,
      this.controller.handleDoodlerOnGet(socket)
    );
    this.registerCustomEvent(
      socket,
      DoodlerEvents.ON_SET_DOODLER,
      this.controller.handleDoodlerOnSet(socket)
    );
  }

  /**
   * Register Incoming Room Specific Events
   * @param socket
   */
  private registerRoomEvents(socket: SocketType) {
    this.registerCustomEvent(
      socket,
      RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM,
      this.controller.handleRoomOnAddDoodlerToPublicRoom(socket)
    );
    this.registerCustomEvent(
      socket,
      RoomEvents.ON_ADD_DOODLER_TO_PRIVATE_ROOM,
      this.controller.handleRoomOnAddDoodlerToPublicRoom(socket)
    );
    this.registerCustomEvent(
      socket,
      RoomEvents.ON_CREATE_PRIVATE_ROOM,
      this.controller.handleRoomOnCreatePrivateRoom(socket)
    );
    this.registerCustomEvent(
      socket,
      RoomEvents.ON_GET_ROOM,
      this.controller.handleRoomOnGetRoom(socket)
    );
  }

  /**
   * Register Incoming Game Specific Events
   * @param socket
   */
  private registerGameEvents(socket: SocketType) {
    this.registerCustomEvent(
      socket,
      GameEvents.ON_GET_GAME,
      this.controller.handleGameOnGetGame(socket)
    );
  }

  /**
   * USE THIS CAREFULLY
   * INTENDED ONLY FOR CUSTOM EVENTS AND NOT FOR RESERVED EVENTS
   * @param socket Socket
   * @param event Custom Event Name
   * @param handler Event Handler
   */
  private registerCustomEvent(
    socket: SocketType,
    event: keyof ClientToServerEvents,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: any
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on(event, async (...args: any) => {
      const respond = args[1];
      try {
        await handler(...args);
      } catch (e) {
        if (e instanceof ErrorFromServer) {
          respond({ error: e });
        } else {
          console.error(e);
        }
      }
    });
  }

  /**
   * USE THIS CAREFULLY
   * INTENDED ONLY FOR RESERVED EVENTS AND NOT FOR CUSTOM EVENTS
   * @param socket Socket
   * @param event Reserved Event Name
   * @param handler Event Handler
   */
  private registerReservedEvent(
    socket: SocketType,
    event: SocketEvents,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: any
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on(event, async (...args: any) => {
      try {
        await handler(...args);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

// Export a singleton
const SocketServiceInstance = new SocketService();
export default SocketServiceInstance;
