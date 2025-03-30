import { CanvasOperation, GameOptions, GameStatus } from '@/types/game';
import { GameInterface } from '@/types/socket/game';

export interface GameServiceInterface {
  // FUNDAMENTALS
  findGame: (gameId: string) => Promise<GameInterface>;
  startGame: (gameId: string) => Promise<void>;
  createGame: (
    roomId: string,
    options?: Partial<GameOptions>
  ) => Promise<GameInterface>;

  // GAME
  updateStatus: (gameId: string, status: GameStatus) => Promise<GameInterface>;
  updateCanvasOperations: (
    gameId: string,
    canvasOperation: CanvasOperation
  ) => Promise<GameInterface>;
}
