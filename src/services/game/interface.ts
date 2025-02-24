import { GameInterface } from '@/types/socket/game';

export interface GameServiceInterface {
  // FUNDAMENTALS
  findGame: (gameId: string) => Promise<{ game: GameInterface }>;
  startGame: (gameId: string) => Promise<void>;
  createGame: () => Promise<{ game: GameInterface }>;

  // GAME
  moveToLobby: (gameId: string) => Promise<void>;
  moveToGame: (gameId: string) => Promise<void>;
  moveToEnd: (gameId: string) => Promise<void>;
}
