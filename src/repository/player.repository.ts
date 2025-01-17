import { Player } from '../entity/player';
import { Game } from '../entity/game';

export class PlayerRepository {
  private static lastId = 1;
  private readonly players: Player[] = [];

  create({ name, password }: Pick<Player, 'name' | 'password'>): Player {
    const newPlayer: Player = {
      id: PlayerRepository.lastId++,
      name,
      password,
      wins: 0,
    };

    this.players.push(newPlayer);

    return newPlayer;
  }

  getPlayer(name: string): Player | null {
    const player = this.players.find(
      ({ name: playerName }) => name === playerName,
    );

    return player ? { ...player } : null;
  }

  find(playerId: number): Player | null {
    return this.players.find(({ id }) => id === playerId);
  }
}
