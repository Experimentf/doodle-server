import { GameStatus } from '@/types/game';
import { GameInterface } from '@/types/socket/game';

export interface GameServiceInterface {
  // FUNDAMENTALS
  findGame: (gameId: string) => Promise<GameInterface>;
  startGame: (gameId: string) => Promise<void>;
  createGame: () => Promise<GameInterface>;

  // GAME
  updateStatus: (gameId: string, status: GameStatus) => Promise<GameInterface>;
}
