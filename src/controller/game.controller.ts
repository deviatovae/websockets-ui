import { EventEmitter } from '../events/event-emitter';
import { GameRepository } from '../repository/game.repository';
import { AddShips, Attack } from '../types/data';
import { WsUserService } from '../service/ws-user.service';
import { WebSocket } from 'ws';
import { Events } from '../events/events';

export class GameController {
  constructor(
    private readonly emitter: EventEmitter,
    private readonly userService: WsUserService,
    private readonly gameRepository: GameRepository,
  ) {}

  addShips(ws: WebSocket, { gameId, ships }: AddShips): void {
    const { id } = this.userService.getCurrentUser(ws);
    const game = this.gameRepository.find(gameId);
    if (!game) {
      throw new Error('Game is not found');
    }

    game.addPlayer(id, ships);
    this.gameRepository.update(game);

    this.emitter.emit(Events.ShipPlaced, game);
  }

  attack(ws: WebSocket, { gameId, x, y }: Attack): void {
    const game = this.gameRepository.find(gameId);
    if (!game) {
      throw new Error('Game is not found');
    }

    const { id } = this.userService.getCurrentUser(ws);
    if (id !== game.getPlayerIdTurn()) {
      throw new Error('Other players turn');
    }

    const result = game.attack(x, y);
    this.gameRepository.update(game);

    this.emitter.emit(Events.Attacked, game, result);
  }
}
