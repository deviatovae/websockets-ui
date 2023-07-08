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
}
