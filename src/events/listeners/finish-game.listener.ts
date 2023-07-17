import { WsUserService } from '../../service/ws-user.service';
import { Game } from '../../entity/game';
import { createResultMessage } from '../../types/message';
import {
  AttackResult,
  AttackStatus,
  Finish,
  StartGameResult,
} from '../../types/data';
import { MessageType } from '../../types';
import { Events } from '../events';

export class FinishGameListener {
  constructor(private readonly userService: WsUserService) {}

  finishOnAttack(game: Game, attack: AttackResult) {
    if (attack.status !== AttackStatus.Killed) {
      return;
    }

    const winnerId = game.getWinnerId();
    if (!winnerId) {
      return;
    }

    this.userService.sendMessageForPlayer<Finish>(game, MessageType.Finish, {
      winPlayer: winnerId,
    });
  }

  finishOnDisconnect(game: Game, playerId: number) {
    const winnerId = game.getOpponentId(playerId);
    this.userService.sendMessageForPlayer<Finish>(game, MessageType.Finish, {
      winPlayer: winnerId,
    });
  }
}
