import { RegData, RegDataResult } from '../types';
import { WsUserService } from '../service/ws-user.service';
import { WebSocket } from 'ws';
import { EventEmitter } from '../events/event-emitter';
import { Events } from '../events/events';

export class PlayerController {
  constructor(
    private readonly emitter: EventEmitter,
    private readonly userService: WsUserService,
  ) {}

  login(ws: WebSocket, { name, password }: RegData): RegDataResult {
    try {
      const { id, name: playerName } = this.userService.login(
        ws,
        name,
        password,
      );
      this.emitter.emit(Events.Login, ws);
      return {
        name: playerName,
        index: id,
        error: false,
        errorText: '',
      };
    } catch (e) {
      return {
        name: '',
        index: 0,
        error: true,
        errorText: e.message,
      };
    }
  }
}
