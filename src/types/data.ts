import { Ship } from '../entity/ship';

export type RegData = {
  name: string;
  password: string;
};

export type RegDataResult = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type UpdateRoomResult = {
  roomId: number;
  roomUsers: RoomUser[];
};

export type RoomUser = {
  name: string;
  index: number;
};

export type AddToRoom = {
  indexRoom: number;
};

export type CreateGameResult = {
  idGame: number;
  idPlayer: number;
};

export type AddShips = {
  gameId: number;
  ships: Ship[];
};

export type StartGameResult = {
  ships: Ship[];
  currentPlayerIndex: number;
};

export type TurnResult = {
  currentPlayer: number;
};

export type Attack = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type AttackResult = {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: AttackStatus;
};

export enum AttackStatus {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
}

export type RandomAttack = Pick<Attack, 'gameId' | 'indexPlayer'>;
