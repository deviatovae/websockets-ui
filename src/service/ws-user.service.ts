import { PlayerRepository } from '../repository/player.repository';
import { Player } from '../entity/player';
import { WebSocket } from 'ws';

export class WsUserService {
  private users: Map<WebSocket, Player> = new Map<WebSocket, Player>();

  constructor(private readonly playerRepository: PlayerRepository) {}

  login(ws: WebSocket, name: string, password: string): Player {
    const player = this.playerRepository.getPlayer(name);

    if (!player) {
      this.users.set(ws, this.playerRepository.create({ name, password }));
      return player;
    }

    if (password === player.password) {
      this.users.set(ws, player);
      return player;
    }

    throw new Error("Invalid user's credentials");
  }

  getCurrentUser(ws: WebSocket): Player {
    if (!this.users.has(ws)) {
      throw new Error('User is not authorized');
    }
    return this.users.get(ws);
  }
}
