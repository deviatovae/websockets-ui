import { Game } from '../entity/game';

export class GameRepository {
  private games: Game[] = [];
  private lastId = 1;

  create(): Game {
    const newGame: Game = {
      id: this.lastId++,
      ships: [],
    };

    this.games.push({ ...newGame });

    return newGame;
  }

  find(gameId: number): Game | null {
    const game = this.games.find(({ id }) => id === gameId);
    return game ? this.clone(game) : null;
  }

  update(game: Game): boolean {
    const gameIdx = this.games.findIndex(({ id }) => id === game.id);
    if (gameIdx < 0) {
      return false;
    }
    this.games[gameIdx] = this.clone(game);
    return true;
  }

  private clone(game: Game): Game {
    return JSON.parse(JSON.stringify(game));
  }
}
