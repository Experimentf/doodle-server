import { CanvasOperation, GameOptions, GameStatus } from '@/types/game';
import {
  GameInterface,
  HunchStatus,
  PrivateGameOptions
} from '@/types/socket/game';

export interface GameServiceInterface {
  // FUNDAMENTALS
  findGame: (gameId: string) => Promise<GameInterface>;
  startGame: (gameId: string) => Promise<void>;
  createGame: (
    roomId: string,
    options?: Partial<GameOptions>
  ) => Promise<GameInterface>;
  deleteGame: (gameId: string) => Promise<boolean>;

  // GAME
  updateStatus: (gameId: string, status: GameStatus) => Promise<GameInterface>;
  updateCanvasOperations: (
    gameId: string,
    canvasOperation: CanvasOperation
  ) => Promise<GameInterface>;
  setDefaultOptions: (
    gameId: string,
    options: PrivateGameOptions
  ) => Promise<GameInterface>;

  // SCORE
  getHunchStatus: (gameId: string, message: string) => Promise<HunchStatus>;
  addHunchTime: (gameId: string, doodlerId: string) => Promise<void>;
}
