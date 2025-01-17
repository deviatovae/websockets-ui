import { PlayerRepository } from '../repository/player.repository';
import { Player } from '../entity/player';
import { WebSocket } from 'ws';
import { Game } from '../entity/game';
import { createResultMessage } from '../types/message';
import { StartGameResult } from '../types/data';
import { MessageType } from '../types';

export class WsUserService {
  private users: Map<WebSocket, Player> = new Map<WebSocket, Player>();

  constructor(private readonly playerRepository: PlayerRepository) {}

  login(ws: WebSocket, name: string, password: string): Player {
    const player = this.playerRepository.getPlayer(name);

    if (!player) {
      const newPlayer = this.playerRepository.create({ name, password });
      this.users.set(ws, newPlayer);
      return newPlayer;
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

  getPlayerSocket(playerId: number): WebSocket {
    const entry = Array.from(this.users.entries()).find(
      ([, { id }]) => playerId === id,
    );

    if (!entry) {
      throw new Error('Connection for player is not found');
    }

    return entry[0];
  }

  sendMessageForPlayerInGame<T>(game: Game, type: MessageType, data: T) {
    game.getPlayerIds().forEach((playerId) => {
      this.sendMessageForPlayer<T>(playerId, type, data);
    });
  }

  sendMessageForPlayer<T>(playerId: number, type: MessageType, data: T) {
    const ws = this.getPlayerSocket(playerId);
    const result = createResultMessage<T>({
      id: 0,
      type,
      data,
    });
    ws.send(JSON.stringify(result));
  }

  getPlayerSockets(): WebSocket[] {
    return Array.from(this.users.keys());
  }

  getPlayers() {
    return Array.from(this.users.values());
  }
}
