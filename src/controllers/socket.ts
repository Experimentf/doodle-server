import DoodlerServiceInstance from '@/services/doodler';
import GameService from '@/services/game';
import RoomServiceInstance from '@/services/room';
import { ClientToServerEvents, SocketType } from '@/types/socket';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/types/socket/events';
import { ErrorFromServer } from '@/utils/error';

interface SocketControllerInterface {
  setSocket: (socket: SocketType) => void;

  handleSocketOnDisconnecting: () => void;
  handleSocketOnDisconnect: () => void;

  handleDoodlerOnGet: ClientToServerEvents[DoodlerEvents.ON_GET];
  handleDoodlerOnSet: ClientToServerEvents[DoodlerEvents.ON_SET];

  handleGameOnPlayPublicGame: ClientToServerEvents[GameEvents.ON_PLAY_PUBLIC_GAME];
}

class SocketController implements SocketControllerInterface {
  private socket?: SocketType;

  /**
   * Set the socket variable
   * @param socket
   */
  public setSocket(socket: SocketType) {
    this.socket = socket;
  }

  /**
   * Handle the socket disconnecting event
   * @param socket
   */
  public handleSocketOnDisconnecting() {
    if (!this.socket) return;
    const socket = this.socket;
    socket.rooms.forEach((roomId) => {
      const doodlerId = socket.id;
      RoomServiceInstance.removeDoodlerFromRoom(roomId, doodlerId); // TODO: Handle Error
      socket.to(roomId).emit(RoomEvents.EMIT_USER_LEAVE, {
        id: doodlerId,
        name: socket.data.name
      });
      const { data: isValidGame } = GameService.isValidGame(roomId); // TODO: Handle Error
      if (!isValidGame) {
        socket.to(roomId).emit(GameEvents.EMIT_GAME_LOBBY);
      }
    });
  }

  /**
   * Handle the socket disconnect event
   * @param socket
   */
  public handleSocketOnDisconnect() {
    if (!this.socket) return;
    const socket = this.socket;
    console.log('User disconnected :', socket.id);
  }

  /**
   * Handle when the user request their info
   * @param respond - Respond to the client
   * @returns
   */
  public handleDoodlerOnGet: ClientToServerEvents[DoodlerEvents.ON_GET] = (
    respond
  ) => {
    if (!this.socket) return;
    const socket = this.socket;
    const name = socket.data.name;
    const avatar = socket.data.avatar;
    if (!name || !avatar) {
      const error = new ErrorFromServer('User does not exist');
      respond(null, error);
      return;
    }
    respond({ name });
  };

  /**
   * Handle when the client wants to set their info
   * @param doodler - Doodler information provided by the client
   * @returns
   */
  public handleDoodlerOnSet: ClientToServerEvents[DoodlerEvents.ON_SET] = (
    doodler
  ) => {
    const { name, avatar } = doodler;
    if (!this.socket) return;
    const socket = this.socket;
    socket.data.name = name;
    socket.data.avatar = avatar;
  };

  /**
   * Handle when the client wants to play a public game
   * @param respond - Respond to the client
   */
  public handleGameOnPlayPublicGame: ClientToServerEvents[GameEvents.ON_PLAY_PUBLIC_GAME] =
    (respond) => {
      if (!this.socket) return;
      const socket = this.socket;
      const { data: doodlerData, error: findDoodlerError } =
        DoodlerServiceInstance.findDooder(socket.id);
      if (findDoodlerError || doodlerData === undefined) {
        respond(null, findDoodlerError);
        return;
      }
      const { doodler } = doodlerData;
      const { data: roomAssignmentData, error: roomAssignmentError } =
        RoomServiceInstance.assignDoodlerToPublicRoom(doodler);
      if (roomAssignmentError || roomAssignmentData === undefined) {
        respond(null, roomAssignmentError);
        return;
      }
      const { roomId } = roomAssignmentData;

      // Join the new room
      socket.join(roomId);

      // Let other users in the room know
      socket.to(roomId).emit(RoomEvents.EMIT_NEW_USER, doodler);

      respond({ roomId });
    };

  /**
   * Handle when the client requests the game details
   * @param roomId
   * @param respond
   */
  public handleGameOnGetGameDetails: ClientToServerEvents[GameEvents.ON_GET_GAME_DETAILS] =
    () => {
      // const room = rooms.get(roomId);
      // if (!room) {
      //   callback(null, new ErrorFromServer('Room not found'));
      // }
      // // Start the game if room is public and more than 1 doodler in the room
      // if (
      //   room &&
      //   room.type === RoomMode.PUBLIC &&
      //   room.getNumberOfDoodlers() > 1
      // ) {
      //   room.startGame();
      // }
      // callback(room?.getJSON());
    };
}

export default SocketController;
