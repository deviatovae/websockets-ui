import { WsUserService } from '../../service/ws-user.service';
import { Game } from '../../entity/game';
import { createResultMessage } from '../../types/message';
import { AttackResult, StartGameResult } from '../../types/data';
import { MessageType } from '../../types';
import { EventEmitter } from '../event-emitter';
import { Events } from '../events';

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
  }
}
