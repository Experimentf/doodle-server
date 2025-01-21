import DoodlerServiceInstance from '@/services/doodler';
import GameServiceInstance, { GameService } from '@/services/game';
import RoomServiceInstance from '@/services/room';
import { ClientToServerEvents, SocketType } from '@/types/socket';
import { DoodlerEvents, GameEvents, RoomEvents } from '@/types/socket/events';

interface SocketControllerInterface {
  setSocket: (socket: SocketType) => void;

  handleSocketOnDisconnecting: () => void;
  handleSocketOnDisconnect: () => void;

  handleDoodlerOnGet: ClientToServerEvents[DoodlerEvents.ON_GET_DOODLER];
  handleDoodlerOnSet: ClientToServerEvents[DoodlerEvents.ON_SET_DOODLER];

  handleRoomOnAddDoodlerToPublicRoom: ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM];
  handleGameOnGetGameDetails: ClientToServerEvents[GameEvents.ON_GET_GAME_DETAILS];
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
      socket.to(roomId).emit(RoomEvents.EMIT_DOODLER_LEAVE, {
        id: doodlerId,
        name: socket.data.name
      });
      const { data: isValidGame } = GameService.isValidGame(roomId); // TODO: Handle Error
      if (!isValidGame) {
        socket.to(roomId).emit(GameEvents.EMIT_GAME_LOBBY);
      }
      DoodlerServiceInstance.removeDoodler(socket.id); // TODO: Handle Error
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
  public handleDoodlerOnGet: ClientToServerEvents[DoodlerEvents.ON_GET_DOODLER] =
    (respond) => {
      if (!this.socket) return;
      const socket = this.socket;
      const { data, error } = DoodlerServiceInstance.findDooder(socket.id);
      if (error || !data) {
        respond(null, error);
        return;
      }
      const {
        doodler: { name }
      } = data;
      respond({ name });
    };

  /**
   * Handle when the client wants to set their info
   * @param doodler - Doodler information provided by the client
   * @returns
   */
  public handleDoodlerOnSet: ClientToServerEvents[DoodlerEvents.ON_SET_DOODLER] =
    (doodler) => {
      if (!this.socket) return;
      const socket = this.socket;
      DoodlerServiceInstance.addDoodler({ id: socket.id, ...doodler }); // TODO: Handle Error
    };

  /**
   * Handle when the client wants to play a public game
   * @param respond - Respond to the client
   */
  public handleRoomOnAddDoodlerToPublicRoom: ClientToServerEvents[RoomEvents.ON_ADD_DOODLER_TO_PUBLIC_ROOM] =
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
      socket.to(roomId).emit(RoomEvents.EMIT_DOODLER_JOIN, doodler);

      respond({ roomId });
    };

  /**
   * Handle when the client requests the game details
   * @param roomId
   * @param respond
   */
  public handleGameOnGetGameDetails: ClientToServerEvents[GameEvents.ON_GET_GAME_DETAILS] =
    (roomId, respond) => {
      const { data: gameDetailsData, error: gameDetailsError } =
        GameServiceInstance.getGameDetails(roomId);
      if (gameDetailsError || gameDetailsData === undefined) {
        respond(null, gameDetailsError);
        return;
      }
      const { game } = gameDetailsData;
      const { data: isValidGameData } = GameService.isValidGame(roomId);
      // TODO: Check for room is public
      if (isValidGameData) {
        GameServiceInstance.startGame(roomId);
      }
      respond(game);
    };
}

export default SocketController;
