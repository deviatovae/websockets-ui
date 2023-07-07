import { PlayerRepository } from '../repository/player.repository';
import { RegData, RegDataResult } from '../types';

export class PlayerController {
  constructor(private readonly playerRepository: PlayerRepository) {}

  login({ name, password }: RegData): RegDataResult {
    const player = this.playerRepository.getPlayer(name);

    if (!player) {
      const { id } = this.playerRepository.create({ name, password });
      return {
        name,
        index: id,
        error: false,
        errorText: '',
      };
    }

    if (password === player.password) {
      return {
        name,
        index: player.id,
        error: false,
        errorText: '',
      };
    }

    return {
      name: '',
      index: 0,
      error: true,
      errorText: "Invalid player's credentials",
    };
  }
}
