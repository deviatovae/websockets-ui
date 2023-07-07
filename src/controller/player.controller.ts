import { RegData, RegDataResult } from '../types';
import { UserService } from '../service/user.service';

export class PlayerController {
  constructor(private readonly userService: UserService) {}

  login({ name, password }: RegData): RegDataResult {
    try {
      const { id, name: playerName } = this.userService.login(name, password);
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
