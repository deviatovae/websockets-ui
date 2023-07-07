import { PlayerRepository } from '../repository/player.repository';
import { Player } from '../entity/player';

export class UserService {
  private currentUser: Player | null = null;

  constructor(private readonly playerRepository: PlayerRepository) {}

  login(name: string, password: string): Player {
    const player = this.playerRepository.getPlayer(name);

    if (!player) {
      this.currentUser = this.playerRepository.create({ name, password });
      return this.currentUser;
    }

    if (password === player.password) {
      this.currentUser = player;
      return this.currentUser;
    }

    throw new Error("Invalid user's credentials");
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
