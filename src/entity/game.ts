import { Ship, ShipType } from './ship';
import { AttackResult, AttackStatus } from '../types/data';

export class Game {
  readonly id: number;
  private ships: { [key: number]: Ship[] } = {};
  private playerIdTurn: number;
  private battlefields: { [key: number]: (boolean | null)[] } = {};
  private readonly battleshipSize = 10;

  constructor(id: number) {
    this.id = id;
  }

  attack(x: number, y: number): AttackResult {
    const targetPlayerId = this.getNextPlayerId();
    const currentPlayerId = this.getPlayerIdTurn();

    const targetCell = this.convertCoordinatesToIndex(x, y);
    if (this.battlefields[targetPlayerId][targetCell] !== null) {
      throw new Error('This position has been already attacked before');
    }

    const ship = this.ships[targetPlayerId].find(
      ({ position: { x: posX, y: posY } }) => posX === x && posY === y,
    );
    const hit = !!ship;
    this.battlefields[targetPlayerId][targetCell] = hit;

    if (!hit) {
      this.changeTurn();
      return this.createAttackRes(x, y, currentPlayerId, AttackStatus.Miss);
    }

    if (ship) {
      ship.length--;
    }

    const isKilled = !ship.length;
    if (isKilled) {
      // this.markCellsAroundShip(targetPlayerId, ship);
      return this.createAttackRes(x, y, currentPlayerId, AttackStatus.Killed);
    }

    return this.createAttackRes(x, y, currentPlayerId, AttackStatus.Shot);
  }

  private markCellsAroundShip(playerId: number, ship: Ship) {
    if (ship.length) {
      return;
    }

    this.getShipCells(ship).forEach((cell) => {
      const [row, col] = this.convertIndexToCoordinates(cell);

      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          const index = this.convertCoordinatesToIndex(i, j);

          if (index < 0 || index >= 99 || row === i || col === j) {
            continue;
          }

          this.battlefields[playerId][index] = false;
        }
      }
    });
  }

  private getShipCells(ship: Ship): number[] {
    const shipCells = [];
    const isVertical = !ship.direction;
    const sizes = {
      [ShipType.Small]: 1,
      [ShipType.Medium]: 2,
      [ShipType.Large]: 3,
      [ShipType.Huge]: 4,
    };
    const shipSize = sizes[ship.type];
    const { x, y } = ship.position;

    if (isVertical) {
      for (let i = 0; i < shipSize; i++) {
        const cell = this.convertCoordinatesToIndex(x + i, y);
        shipCells.push(cell);
      }
    } else {
      for (let i = 0; i < shipSize; i++) {
        const cell = this.convertCoordinatesToIndex(x, y + i);
        shipCells.push(cell);
      }
    }
    return shipCells;
  }

  addPlayer(playerId: number, ships: Ship[]) {
    this.ships[playerId] = ships;
    this.battlefields[playerId] = new Array(99).fill(null, 0, 99);
  }

  getShips(playerId: number) {
    this.validatePlayer(playerId);
    return this.ships[playerId];
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

  private changeTurn() {
    this.playerIdTurn = this.getNextPlayerId();
  }

  private getNextPlayerId(): number {
    const playerIds = this.getPlayerIds();

    if (playerIds.length !== 2) {
      throw new Error('Not enough players');
    }

    return this.getPlayerIds().find(
      (playerId) => this.playerIdTurn !== playerId,
    );
  }

  private validatePlayer(playerId: number): void {
    if (!this.ships[playerId]) {
      throw new Error("This player doesn't have any ships");
    }
  }

  private convertCoordinatesToIndex(x: number, y: number) {
    return y * this.battleshipSize + x;
  }

  private convertIndexToCoordinates(index: number) {
    const row = Math.floor(index / this.battleshipSize);
    const col = index % this.battleshipSize;
    return [row, col];
  }

  private createAttackRes(
    x: number,
    y: number,
    currentPlayerId: number,
    status: AttackStatus,
  ): AttackResult {
    return {
      position: { x, y },
      currentPlayer: currentPlayerId,
      status,
    };
  }
}
