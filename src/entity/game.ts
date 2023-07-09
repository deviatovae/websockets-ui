import { Ship } from './ship';

export class Game {
  readonly id: number;
  ships: { [key: number]: Ship[] } = {};
  private playerIdTurn: number;

  constructor(id: number) {
    this.id = id;
  }

  getPlayerIds() {
    return Object.keys(this.ships).map((playerId) => +playerId);
  }

  getPlayerIdTurn() {
    if (!this.playerIdTurn) {
      const playerIds = this.getPlayerIds();
      const randomIdx = Math.floor(Math.random() * playerIds.length);
      this.playerIdTurn = playerIds[randomIdx];
    }
    return this.playerIdTurn;
  }

  clone() {
    return Object.create(this);
  }
}
