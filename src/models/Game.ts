import { GameStatus } from '@/types/game';

class GameModel {
  private status: GameStatus;

  constructor() {
    this.status = GameStatus.LOBBY; // Always initiates with lobby
  }
}

export default GameModel;
