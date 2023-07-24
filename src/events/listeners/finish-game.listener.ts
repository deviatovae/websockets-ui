import { WsUserService } from '../../service/ws-user.service';
import { Game } from '../../entity/game';
import { AttackResult, AttackStatus, Finish } from '../../types/data';
import { MessageType } from '../../types';
import { EventEmitter } from '../event-emitter';
import { PlayerRepository } from '../../repository/player.repository';
import { Events } from '../events';

export class FinishGameListener {
  constructor(
    private readonly userService: WsUserService,
    private readonly emitter: EventEmitter,
    private readonly playerRepository: PlayerRepository,
  ) {}

  finishOnAttack(game: Game, attack: AttackResult) {
    if (attack.status !== AttackStatus.Killed) {
      return;
    }

    const winnerId = game.getWinnerId();
    if (!winnerId) {
      return;
    }

    this.userService.sendMessageForPlayerInGame<Finish>(
      game,
      MessageType.Finish,
      {
        winPlayer: winnerId,
      },
    );

    this.addPlayerWin(winnerId);
    this.emitter.emit(Events.GameFinished);
  }

  finishOnDisconnect(game: Game, playerId: number) {
    const winnerId = game.getOpponentId(playerId);
    this.userService.sendMessageForPlayerInGame<Finish>(
      game,
      MessageType.Finish,
      {
        winPlayer: winnerId,
      },
    );

    this.addPlayerWin(winnerId);
    this.emitter.emit(Events.GameFinished);
  }

  private addPlayerWin(playerId: number) {
    const player = this.playerRepository.find(playerId);
    if (!player) {
      throw new Error('Player is not found');
    }
    player.wins++;
  }
}
