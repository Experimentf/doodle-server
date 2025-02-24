import {
  DoodlerSocketEvents,
  GameSocketEvents,
  RoomSocketEvents,
  SocketEvents
} from '@/constants/events/socket';
import Controller, { ControllerInterface } from '@/controllers';
import { ClientToServerEvents, IoType, SocketType } from '@/types/socket';
import { DoodleServerError } from '@/utils/error';

import { SocketServiceInterface } from './interface';

class SocketService implements SocketServiceInterface {
  private _io?: IoType;
  private _controller = new Controller() as unknown as ControllerInterface;

  /**
   * Register Incoming Connections on IO
   */
  public start(io: IoType) {
    this._io = io;
    io.on('connection', (socket) => {
      console.log('User connected :', socket.id);
      this._registerSocketReservedEvents(socket);
      this._registerDoodlerSocketEvents(socket);
      this._registerRoomSocketEvents(socket);
      this._registerGameSocketEvents(socket);
    });
  }

  // PRIVATE METHODS
  /**
   * Register Socket RESERVED Events
   * @param socket
   */
  private _registerSocketReservedEvents(socket: SocketType) {
    this._registerReservedEvent(
      socket,
      SocketEvents.ON_DISCONNECTING,
      this._controller.handleSocketOnDisconnecting(socket)
    );
    this._registerReservedEvent(
      socket,
      SocketEvents.ON_DISCONNECT,
      this._controller.handleSocketOnDisconnect(socket)
    );
  }

  /**
   * Register Incoming Doodler Specific Events
   * @param socket
   */
  private _registerDoodlerSocketEvents(socket: SocketType) {
    this._registerCustomSocketEvent(
      socket,
      DoodlerSocketEvents.ON_GET_DOODLER,
      this._controller.handleDoodlerOnGet(socket)
    );
    this._registerCustomSocketEvent(
      socket,
      DoodlerSocketEvents.ON_SET_DOODLER,
      this._controller.handleDoodlerOnSet(socket)
    );
  }

  /**
   * Register Incoming Room Specific Events
   * @param socket
   */
  private _registerRoomSocketEvents(socket: SocketType) {
    this._registerCustomSocketEvent(
      socket,
      RoomSocketEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM,
      this._controller.handleRoomOnAddDoodlerToPublicRoom(socket)
    );
    this._registerCustomSocketEvent(
      socket,
      RoomSocketEvents.ON_ADD_DOODLER_TO_PRIVATE_ROOM,
      this._controller.handleRoomOnAddDoodlerToPublicRoom(socket)
    );
    this._registerCustomSocketEvent(
      socket,
      RoomSocketEvents.ON_CREATE_PRIVATE_ROOM,
      this._controller.handleRoomOnCreatePrivateRoom(socket)
    );
    this._registerCustomSocketEvent(
      socket,
      RoomSocketEvents.ON_GET_ROOM,
      this._controller.handleRoomOnGetRoom(socket)
    );
  }

  /**
   * Register Incoming Game Specific Events
   * @param socket
   */
  private _registerGameSocketEvents(socket: SocketType) {
    this._registerCustomSocketEvent(
      socket,
      GameSocketEvents.ON_GET_GAME,
      this._controller.handleGameOnGetGame(socket)
    );
  }

  /**
   * USE THIS CAREFULLY
   * INTENDED ONLY FOR CUSTOM EVENTS AND NOT FOR RESERVED EVENTS
   * @param socket Socket
   * @param event Custom Event Name
   * @param handler Event Handler
   */
  private _registerCustomSocketEvent(
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
        if (e instanceof DoodleServerError) {
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
  private _registerReservedEvent(
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
