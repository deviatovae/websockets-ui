import { WsUserService } from '../../service/ws-user.service';
import { Game } from '../../entity/game';
import { createResultMessage } from '../../types/message';
import { StartGameResult } from '../../types/data';
import { MessageType } from '../../types';
import { EventEmitter } from '../event-emitter';
import { Events } from '../events';

export class StartGameListener {
  constructor(
    private readonly userService: WsUserService,
    private readonly emitter: EventEmitter,
  ) {}

  startGame(game: Game) {
    const playerIds = game.getPlayerIds();
    if (playerIds.length !== 2) {
      return;
    }

    playerIds.forEach((playerId) => {
      const ws = this.userService.getPlayerSocket(playerId);
      const result = createResultMessage<StartGameResult>({
        id: 0,
        type: MessageType.StartGame,
        data: {
          ships: game.ships[playerId],
          currentPlayerIndex: playerId,
        },
      });
      ws.send(JSON.stringify(result));
    });

    this.emitter.emit(Events.GameStarted, game);
  }
}
