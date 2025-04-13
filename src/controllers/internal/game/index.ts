import { GameSocketEvents } from '@/constants/events/socket';
import DoodlerServiceInstance from '@/services/doodler/DoodlerService';
import GameServiceInstance from '@/services/game/GameService';
import RoomServiceInstance from '@/services/room/RoomService';
import { GameStatus } from '@/types/game';
import { HunchStatus } from '@/types/socket/game';
import { DoodleServerError } from '@/utils/error';
import { createHunch } from '@/utils/game';

import { GameControllerInterface } from './interface';

class GameController implements GameControllerInterface {
  /**
   * Handle when the client requests the game details
   * @param roomId
   * @param respond
   */
  public handleGameOnGetGame: GameControllerInterface['handleGameOnGetGame'] =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_socket) => async (payload, respond) => {
      const gameId = payload;
      const game = await GameServiceInstance.findGame(gameId);
      // const { data: isValidGameData } = GameService.isValidGame(roomId);
      // // TODO: Check for room is public
      // if (isValidGameData) {
      //   GameServiceInstance.startGame(roomId);
      // }

      respond({ data: { game } });
    };

  /**
   * Handle when the clients sends a canvas based operation
   * @param socket
   * @returns
   */
  public handleGameOnGameCanvasOperation: GameControllerInterface['handleGameOnGameCanvasOperation'] =
    (socket) => async (payload, respond) => {
      const { roomId, canvasOperation } = payload;
      const { gameId } = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      if (!gameId) throw new DoodleServerError('Game not found!');
      const game = await GameServiceInstance.updateCanvasOperations(
        gameId,
        canvasOperation
      );
      socket
        .to(roomId)
        .emit(GameSocketEvents.EMIT_GAME_CANVAS_OPERATION, { canvasOperation });
      respond({ data: { game } });
    };

  public handleGameOnChooseWord: GameControllerInterface['handleGameOnChooseWord'] =
    (socket) => async (payload, respond) => {
      const { roomId, word } = payload;
      const { gameId } = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      if (!gameId) throw new DoodleServerError('Game not found!');
      const game = await GameServiceInstance.updateStatus(
        gameId,
        GameStatus.GAME,
        true,
        { word }
      );
      respond({ data: { game } });
    };

  public handleGameOnGameHunch: GameControllerInterface['handleGameOnGameHunch'] =
    (socket) => async (payload, respond) => {
      const { roomId, message } = payload;
      const room = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );
      if (!room.gameId) throw new DoodleServerError('Game not found!');
      const game = await GameServiceInstance.findGame(room.gameId);

      // If the socket is not drawer and status is game
      if (room.drawerId !== socket.id && game.status === GameStatus.GAME) {
        const hunchStatus = await GameServiceInstance.getHunchStatus(
          room.gameId,
          message
        );
        // If the hunch is correct, send a system message to all clients
        if (hunchStatus === HunchStatus.CORRECT) {
          const doodler = await DoodlerServiceInstance.findDooder(socket.id);
          const hunch = createHunch(
            `${doodler.name} hunched the word!`,
            hunchStatus
          );
          await GameServiceInstance.addHunchTime(game.id, doodler.id);
          socket.to(roomId).emit(GameSocketEvents.EMIT_GAME_HUNCH, { hunch });
          respond({ data: { hunch } });
          return;
        }
        // If the hunch is nearby, send a system message to socket and normal message to all other clients
        if (hunchStatus === HunchStatus.NEARBY) {
          const senderHunch = createHunch(
            `"${message}" is close!`,
            hunchStatus
          );
          const receiverHunch = createHunch(message, hunchStatus, socket.id);
          socket.to(roomId).emit(GameSocketEvents.EMIT_GAME_HUNCH, {
            hunch: { ...receiverHunch, status: HunchStatus.WRONG }
          });
          respond({ data: { hunch: senderHunch } });
          return;
        }
      }
      // If none of the above condition is correct, send a normal message to all
      const hunch = createHunch(message, HunchStatus.WRONG, socket.id);
      socket.to(roomId).emit(GameSocketEvents.EMIT_GAME_HUNCH, { hunch });
      respond({ data: { hunch } });
      return;
    };

  /**
   * Handle when a private room owner starts the game
   */
  public handleGameOnStartPrivateGame: GameControllerInterface['handleGameOnStartPrivateGame'] =
    (socket) => async (payload, respond) => {
      const { roomId, options } = payload;
      const room = await RoomServiceInstance.findRoomWithDoodler(
        roomId,
        socket.id
      );

      // If socket is not the owner of the room, socket cannot start the game
      if (room.ownerId !== socket.id) {
        throw new DoodleServerError('Invalid action!');
      }

      // If room has less than 2 players, game can not be started
      if (room.doodlers.length < 2) {
        socket.emit(GameSocketEvents.EMIT_GAME_HUNCH, {
          hunch: {
            isSystemMessage: true,
            message: 'Atleast 2 players are required to start a game!'
          }
        });
        throw new DoodleServerError('Insufficient players!');
      }

      if (!room.gameId) {
        throw new DoodleServerError('Invalid game!');
      }
      await GameServiceInstance.setDefaultOptions(room.gameId, options);
      await RoomServiceInstance.changeDrawerTurn(roomId);
      const game = await GameServiceInstance.updateStatus(
        room.gameId,
        GameStatus.CHOOSE_WORD,
        true
      );
      respond({ data: { game } });
    };
}

export default GameController;
