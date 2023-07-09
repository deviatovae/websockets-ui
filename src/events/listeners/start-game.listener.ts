import { WsUserService } from '../../service/ws-user.service';
import { Game } from '../../entity/game';
import { createResultMessage } from '../../types/message';
import { StartGameResult } from '../../types/data';
import { MessageType } from '../../types';

export class StartGameListener {
  constructor(private readonly userService: WsUserService) {}

  startGame(game: Game) {
    const playerIds = Object.keys(game.ships);
    if (playerIds.length !== 2) {
      return;
    }

    playerIds.forEach((playerId) => {
      const ws = this.userService.getPlayerSocket(+playerId);
      const result = createResultMessage<StartGameResult>({
        id: 0,
        type: MessageType.StartGame,
        data: {
          ships: game.ships[playerId],
          currentPlayerIndex: +playerId,
        },
      });
      ws.send(JSON.stringify(result));
    });
  }
}
