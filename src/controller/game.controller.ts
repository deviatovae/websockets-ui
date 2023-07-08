import { EventEmitter } from '../events/event-emitter';
import { GameRepository } from '../repository/game.repository';
import { AddShips } from '../types/data';
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
    game.ships[id] = ships;
    this.emitter.emit(Events.ShipPlaced, game);
  }
}
