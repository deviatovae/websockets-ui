import { Game } from '../entity/game';

export class GameRepository {
  private games: Game[] = [];
  private lastId = 1;

  create(): Game {
    const newGame: Game = new Game(this.lastId++);

    this.games.push(newGame.clone());

    return newGame;
  }

  find(gameId: number): Game | null {
    const game = this.games.find(({ id }) => id === gameId);
    return game ? game.clone() : null;
  }

  update(game: Game): boolean {
    const gameIdx = this.games.findIndex(({ id }) => id === game.id);
    if (gameIdx < 0) {
      return false;
    }
    this.games[gameIdx] = game.clone();
    return true;
  }

  findByPlayerId(playerId: number): Game[] {
    return this.games.filter((game) => game.getPlayerIds().includes(playerId));
  }
}
