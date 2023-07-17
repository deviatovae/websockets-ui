import { WsUserService } from '../../service/ws-user.service';
import { Game } from '../../entity/game';
import { createResultMessage } from '../../types/message';
import { AttackResult, AttackStatus } from '../../types/data';
import { MessageType } from '../../types';

export class AttackListener {
  constructor(private readonly userService: WsUserService) {}

  sendAttackResult(game: Game, attackResult: AttackResult) {
    const playerIds = game.getPlayerIds();
    if (playerIds.length !== 2) {
      return;
    }

    playerIds.forEach((playerId) => {
      const ws = this.userService.getPlayerSocket(playerId);
      const result = createResultMessage<AttackResult>({
        id: 0,
        type: MessageType.Attack,
        data: attackResult,
      });
      ws.send(JSON.stringify(result));
    });

    if (attackResult.status !== AttackStatus.Killed) {
      return;
    }

    const { x, y } = attackResult.position;
    const currentPlayerId = attackResult.currentPlayer;
    const targetPlayerId = game.getOpponentId(currentPlayerId);
    const positions = game.getCellsAroundShipByPosition(targetPlayerId, x, y);

    const currentPlayerWs = this.userService.getPlayerSocket(currentPlayerId);
    positions.forEach(([x, y]) => {
      const result = createResultMessage<AttackResult>({
        id: 0,
        type: MessageType.Attack,
        data: {
          position: { x, y },
          currentPlayer: currentPlayerId,
          status: AttackStatus.Miss,
        },
      });
      currentPlayerWs.send(JSON.stringify(result));
    });
  }
}
