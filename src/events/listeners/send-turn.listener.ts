import { WsUserService } from '../../service/ws-user.service';
import { createResultMessage } from '../../types/message';
import { TurnResult } from '../../types/data';
import { MessageType } from '../../types';
import { Game } from '../../entity/game';

export class SendTurnListener {
  constructor(private readonly userService: WsUserService) {}

  sendTurn(game: Game) {
    const playerIds = game.getPlayerIds();

    playerIds.forEach((playerId) => {
      const ws = this.userService.getPlayerSocket(playerId);
      const result = createResultMessage<TurnResult>({
        id: 0,
        type: MessageType.TakeTurn,
        data: {
          currentPlayer: game.getPlayerIdTurn(),
        },
      });
      ws.send(JSON.stringify(result));
    });
  }
}
